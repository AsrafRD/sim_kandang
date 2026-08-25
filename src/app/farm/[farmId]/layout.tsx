import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { SidebarProvider } from '@/components/layout/SidebarContext';
import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

export default async function FarmLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ farmId: string }>;
}) {
  const { farmId } = await params;

  const session = await verifySession();
  if (!session?.userId) redirect('/login');

  const memberships = await db.tenantMember.findMany({
    where: { userId: session.userId as string },
    include: { farm: true },
  });
  const currentMember = memberships.find(m => m.farmId === farmId);
  const role = currentMember?.role || 'OPERATOR';

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background overflow-hidden relative">
        <Sidebar farmId={farmId} role={role} memberships={memberships} />
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
          <Topbar farmId={farmId} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
