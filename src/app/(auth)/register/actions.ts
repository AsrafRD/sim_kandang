'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth/session';
import { Role, FarmType } from '@prisma/client';

export async function registerAction(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const farmName = formData.get('farmName') as string;

  if (!name || !email || !password || !farmName) {
    return { error: 'All fields are required' };
  }

  // Check if user exists
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: 'User with this email already exists' };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Use a transaction to ensure all or nothing
  const user = await db.$transaction(async (tx) => {
    // Create user
    const newUser = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create Farm
    const newFarm = await tx.farm.create({
      data: {
        name: farmName,
        type: FarmType.BROILER,
      },
    });

    // Create TenantMember (SUPERADMIN)
    await tx.tenantMember.create({
      data: {
        userId: newUser.id,
        farmId: newFarm.id,
        role: Role.SUPERADMIN,
      },
    });

    return newUser;
  });

  // Create session
  await createSession(user.id);

  redirect('/');
}
