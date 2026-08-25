'use server';

import { db } from '@/lib/db';
import { verifyTenantAccess } from '@/lib/auth/session';
import { Role } from '@prisma/client';
import { dailyRecordSchema } from '@/lib/validations/dailyRecord';
import { revalidatePath } from 'next/cache';

export async function submitDailyRecordAction(farmId: string, formData: FormData) {
  // Verifikasi otorisasi (hanya Operator atau Superadmin yang boleh input)
  const member = await verifyTenantAccess(farmId, [Role.OPERATOR, Role.SUPERADMIN]);
  if (!member) {
    return { error: 'Unauthorized to submit daily record for this farm.' };
  }

  // Parse data
  const rawData = {
    date: formData.get('date'),
    mortality: formData.get('mortality'),
    culling: formData.get('culling'),
    feedConsumedKg: formData.get('feedConsumedKg'),
    waterConsumedL: formData.get('waterConsumedL'),
    temperature: formData.get('temperature') || undefined,
    notes: formData.get('notes') || undefined,
  };

  // Validasi dengan Zod
  const parsed = dailyRecordSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: 'Invalid input data', details: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  // Cari Flock aktif di farm ini
  const activeFlock = await db.flock.findFirst({
    where: {
      farmId,
      isActive: true,
    },
  });

  if (!activeFlock) {
    return { error: 'No active flock found in this farm. Please create a flock first.' };
  }

  const recordDate = new Date(data.date);

  // Periksa jika sudah ada catatan untuk tanggal ini
  const existingRecord = await db.dailyRecord.findFirst({
    where: {
      flockId: activeFlock.id,
      date: {
        gte: new Date(recordDate.setHours(0, 0, 0, 0)),
        lte: new Date(recordDate.setHours(23, 59, 59, 999)),
      }
    }
  });

  if (existingRecord) {
    return { error: 'A daily record for this date already exists.' };
  }

  // Simpan data
  try {
    await db.dailyRecord.create({
      data: {
        flockId: activeFlock.id,
        date: new Date(data.date),
        mortality: data.mortality,
        culling: data.culling,
        feedConsumedKg: data.feedConsumedKg,
        waterConsumedL: data.waterConsumedL,
        temperature: data.temperature,
        notes: data.notes,
      },
    });

    revalidatePath(`/farm/${farmId}/daily-input`);
    return { success: true };
  } catch (error) {
    return { error: 'Database error occurred while saving the record.' };
  }
}
