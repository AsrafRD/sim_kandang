import { verifySession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function FarmRouterPage() {
  const session = await verifySession();
  if (!session?.userId) redirect('/login');

  const memberships = await db.tenantMember.findMany({
    where: { userId: session.userId as string },
    orderBy: { createdAt: 'asc' },
  });

  if (memberships.length === 0) {
    // Force create a farm if they don't have any
    redirect('/farm/create');
  } else if (memberships.length === 1) {
    // If only one, go straight to it
    redirect(`/farm/${memberships[0].farmId}/overview`);
  } else {
    // If multiple, show farm selector
    redirect('/farm/select');
  }

  return null;
}
