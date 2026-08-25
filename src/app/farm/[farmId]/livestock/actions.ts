'use server';

import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

export async function addFlockAction(farmId: string, formData: FormData) {
  const session = await verifySession();
  if (!session?.userId) throw new Error('Unauthorized');

  const batchName = formData.get('batchName') as string;
  const initialCountStr = formData.get('initialCount') as string;
  const chickInDateStr = formData.get('chickInDate') as string;

  if (!batchName || !initialCountStr || !chickInDateStr) {
    throw new Error('Missing required fields');
  }

  const initialCount = parseInt(initialCountStr, 10);
  if (isNaN(initialCount) || initialCount <= 0) {
    throw new Error('Invalid initial count');
  }

  const chickInDate = new Date(chickInDateStr);

  await db.flock.create({
    data: {
      farmId,
      batchName,
      initialCount,
      chickInDate,
      isActive: true,
    }
  });

  revalidatePath(`/farm/${farmId}/livestock`);
}

export async function closeFlockAction(farmId: string, flockId: string) {
  const session = await verifySession();
  if (!session?.userId) throw new Error('Unauthorized');

  await db.flock.update({
    where: { id: flockId },
    data: {
      isActive: false,
      harvestDate: new Date(),
    }
  });

  revalidatePath(`/farm/${farmId}/livestock`);
}

export async function harvestFlockAction(farmId: string, formData: FormData) {
  const session = await verifySession();
  if (!session?.userId) throw new Error('Unauthorized');

  const flockId = formData.get('flockId') as string;
  const totalWeight = parseFloat(formData.get('totalWeight') as string);
  const totalCount = parseInt(formData.get('totalCount') as string, 10);
  const leftOverAction = formData.get('leftOverAction') as 'CARRY_OVER' | 'RETURN';

  if (!flockId || !totalWeight || !totalCount) throw new Error('Missing fields');

  const flock = await db.flock.findUnique({
    where: { id: flockId },
    include: { dailyRecords: true }
  });

  if (!flock) throw new Error('Flock not found');

  const totalFeed = flock.dailyRecords.reduce((acc, curr) => acc + curr.feedConsumedKg, 0);
  
  const fcr = totalWeight > 0 ? totalFeed / totalWeight : 0;
  const survivalRate = (totalCount / flock.initialCount) * 100;
  const avgWeight = totalWeight / totalCount;
  
  const harvestDate = new Date();
  const diffTime = Math.abs(harvestDate.getTime() - flock.chickInDate.getTime());
  const ageDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  let ip = 0;
  if (fcr > 0 && ageDays > 0) {
    ip = (survivalRate * avgWeight) / (fcr * ageDays) * 100;
  }

  await db.$transaction(async (tx) => {
    await tx.flock.update({
      where: { id: flockId },
      data: {
        isActive: false,
        harvestDate,
        totalHarvestWeightKg: totalWeight,
        totalHarvestedCount: totalCount,
        finalFCR: fcr,
        ip: ip
      }
    });

    if (leftOverAction === 'RETURN') {
      const feeds = await tx.inventory.findMany({
        where: { farmId, category: 'PAKAN', currentStock: { gt: 0 } }
      });
      for (const feed of feeds) {
        await tx.inventoryLog.create({
          data: {
            inventoryId: feed.id,
            type: 'RETURN_TO_PT',
            amount: feed.currentStock,
            notes: `Auto-return from batch harvest: ${flock.batchName}`
          }
        });
        await tx.inventory.update({
          where: { id: feed.id },
          data: { currentStock: 0 }
        });
      }
    }
  });

  revalidatePath(`/farm/${farmId}/livestock`);
}
