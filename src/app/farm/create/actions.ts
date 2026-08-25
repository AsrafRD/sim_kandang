'use server';

import { verifySession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { FarmType, Role } from '@prisma/client';

export async function createFarmAction(prevState: any, formData: FormData) {
  const session = await verifySession();
  if (!session?.userId) redirect('/login');

  const name = formData.get('name') as string;
  const address = formData.get('address') as string;
  const typeStr = formData.get('type') as string;
  const type = typeStr === 'LAYER' ? FarmType.LAYER : FarmType.BROILER;

  const latitudeStr = formData.get('latitude') as string;
  const longitudeStr = formData.get('longitude') as string;
  const latitude = latitudeStr ? parseFloat(latitudeStr) : null;
  const longitude = longitudeStr ? parseFloat(longitudeStr) : null;

  if (!name) {
    return { error: 'Nama kandang wajib diisi' };
  }

  const farm = await db.farm.create({
    data: {
      name,
      address,
      type,
      latitude,
      longitude,
      members: {
        create: {
          userId: session.userId as string,
          role: Role.SUPERADMIN,
        }
      }
    }
  });

  redirect(`/farm/${farm.id}/overview`);
}
