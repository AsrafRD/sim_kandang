import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from '../db';
import { Role } from '@prisma/client';

const secretKey = process.env.SESSION_SECRET || 'super-secret-kandang-key-please-change-in-prod';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(input: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function verifySession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const payload = await decrypt(sessionCookie);
    return payload;
  } catch (_) {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function verifyTenantAccess(farmId: string, allowedRoles: Role[]) {
  const session = await verifySession();
  if (!session || !session.userId) {
    return null;
  }

  const member = await db.tenantMember.findUnique({
    where: {
      userId_farmId: {
        userId: session.userId as string,
        farmId,
      },
    },
  });

  if (!member) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(member.role as Role)) {
    return null;
  }

  return member;
}
