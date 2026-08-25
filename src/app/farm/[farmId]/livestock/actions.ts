'use server';

import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

export async function createFlockAction(farmId: string, formData: FormData) {
  const session = await verifySession();
  if (!session?.userId) throw new Error('Unauthorized');

  const batchName = formData.get('batchName') as string;
  const initialCount = parseInt(formData.get('initialCount') as string, 10);
  const chickInDateStr = formData.get('chickInDate') as string;

  if (!batchName || isNaN(initialCount) || !chickInDateStr) {
    throw new Error('Invalid input');
  }

  await db.flock.create({
    data: {
      farmId,
      batchName,
      initialCount,
      chickInDate: new Date(chickInDateStr),
      isActive: true,
    }
  });

  revalidatePath(`/farm/${farmId}/livestock`);
}

export async function closeFlockAction(farmId: string, flockId: string) {
  const session = await verifySession();
  if (!session?.userId) throw new Error('Unauthorized');

  await db.flock.update({
    where: { id: flockId, farmId }, // ensure the flock belongs to this farm
    data: {
      isActive: false,
      harvestDate: new Date(),
    }
  });

  revalidatePath(`/farm/${farmId}/livestock`);
}
