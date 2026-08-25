'use server';

import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function addMemberAction(farmId: string, formData: FormData) {
  const session = await verifySession();
  if (!session?.userId) throw new Error('Unauthorized');
  
  const currentUserMembership = await db.tenantMember.findFirst({
    where: { userId: session.userId as string, farmId }
  });
  
  if (!currentUserMembership || (currentUserMembership.role !== 'SUPERADMIN' && currentUserMembership.role !== 'OWNER')) {
    throw new Error('Forbidden: You do not have permission to add members.');
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as any;

  if (!email || !name || !role) throw new Error('Missing fields');

  let targetUser = await db.user.findUnique({ where: { email } });

  if (!targetUser) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    targetUser = await db.user.create({
      data: { name, email, password: hashedPassword }
    });
  }

  const existingMember = await db.tenantMember.findFirst({
    where: { userId: targetUser.id, farmId }
  });

  if (!existingMember) {
    await db.tenantMember.create({
      data: { userId: targetUser.id, farmId, role }
    });
  } else {
    await db.tenantMember.update({
      where: { id: existingMember.id },
      data: { role }
    });
  }

  revalidatePath(`/farm/${farmId}/settings/team`);
}

export async function updateMemberRoleAction(farmId: string, formData: FormData) {
  const session = await verifySession();
  if (!session?.userId) throw new Error('Unauthorized');
  
  const currentUserMembership = await db.tenantMember.findFirst({
    where: { userId: session.userId as string, farmId }
  });
  
  if (!currentUserMembership || (currentUserMembership.role !== 'SUPERADMIN' && currentUserMembership.role !== 'OWNER')) {
    throw new Error('Forbidden');
  }

  const memberId = formData.get('memberId') as string;
  const role = formData.get('role') as any;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!memberId || !role || !name || !email) throw new Error('Missing fields');

  const member = await db.tenantMember.findUnique({ where: { id: memberId } });
  if (!member) throw new Error('Member not found');

  await db.tenantMember.update({
    where: { id: memberId },
    data: { role }
  });

  const userData: any = { name, email };
  if (newPassword && newPassword.trim() !== '') {
    userData.password = await bcrypt.hash(newPassword, 10);
  }

  await db.user.update({
    where: { id: member.userId },
    data: userData
  });

  revalidatePath(`/farm/${farmId}/settings/team`);
}

export async function removeMemberAction(farmId: string, memberId: string) {
  const session = await verifySession();
  if (!session?.userId) throw new Error('Unauthorized');
  
  const currentUserMembership = await db.tenantMember.findFirst({
    where: { userId: session.userId as string, farmId }
  });
  
  if (!currentUserMembership || (currentUserMembership.role !== 'SUPERADMIN' && currentUserMembership.role !== 'OWNER')) {
    throw new Error('Forbidden');
  }

  await db.tenantMember.delete({
    where: { id: memberId }
  });

  revalidatePath(`/farm/${farmId}/settings/team`);
}
