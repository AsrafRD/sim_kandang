'use server';

import { verifySession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function updateFarmAction(farmId: string, prevState: any, formData: FormData) {
  const session = await verifySession();
  if (!session?.userId) redirect('/login');

  // Verify access (must be SUPERADMIN or OWNER)
  const member = await db.tenantMember.findUnique({
    where: { userId_farmId: { userId: session.userId as string, farmId } }
  });

  if (!member || (member.role !== 'SUPERADMIN' && member.role !== 'OWNER')) {
    return { error: 'Anda tidak memiliki akses untuk mengubah profil kandang' };
  }

  const name = formData.get('name') as string;
  const address = formData.get('address') as string;
  const latitudeStr = formData.get('latitude') as string;
  const longitudeStr = formData.get('longitude') as string;
  const latitude = latitudeStr ? parseFloat(latitudeStr) : null;
  const longitude = longitudeStr ? parseFloat(longitudeStr) : null;

  if (!name) {
    return { error: 'Nama kandang wajib diisi' };
  }

  await db.farm.update({
    where: { id: farmId },
    data: {
      name,
      address,
      latitude,
      longitude,
    }
  });

  revalidatePath(`/farm/${farmId}`);
  
  return { success: true, message: 'Data kandang berhasil diperbarui' };
}
