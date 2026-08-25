'use server';

import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

export async function addHealthItemAction(farmId: string, formData: FormData) {
  const session = await verifySession();
  if (!session?.userId) throw new Error('Unauthorized');

  const itemName = formData.get('itemName') as string;
  const category = formData.get('category') as 'OBAT' | 'VAKSIN';
  const unit = formData.get('unit') as string;
  const initialStock = parseFloat(formData.get('initialStock') as string) || 0;
  
  if (!itemName || !category || !unit) throw new Error('Missing fields');

  await db.inventory.create({
    data: { 
      farmId, 
      itemName, 
      category, 
      unit, 
      currentStock: initialStock, 
      minStock: 10
    }
  });

  revalidatePath(`/farm/${farmId}/health`);
}

export async function logHealthTransactionAction(farmId: string, inventoryId: string, formData: FormData) {
  const session = await verifySession();
  if (!session?.userId) throw new Error('Unauthorized');

  const type = formData.get('type') as 'IN' | 'OUT';
  const amount = parseFloat(formData.get('amount') as string);
  
  if (!amount || amount <= 0) throw new Error('Invalid amount');

  await db.$transaction(async (tx) => {
    const item = await tx.inventory.findUnique({ where: { id: inventoryId } });
    if (!item) throw new Error('Not found');

    const newStock = type === 'IN' ? item.currentStock + amount : item.currentStock - amount;
    if (newStock < 0) throw new Error('Insufficient stock');

    await tx.inventory.update({
      where: { id: inventoryId },
      data: { currentStock: newStock }
    });

    await tx.inventoryLog.create({
      data: { inventoryId, type, amount, notes: 'Medical entry' }
    });
  });

  revalidatePath(`/farm/${farmId}/health`);
}
