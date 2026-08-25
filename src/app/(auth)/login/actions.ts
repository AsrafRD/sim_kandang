'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth/session';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: 'Invalid email or password' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: 'Invalid email or password' };
  }

  await createSession(user.id);

  redirect('/');
}
