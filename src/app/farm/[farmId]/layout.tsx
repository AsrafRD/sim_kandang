import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { SidebarProvider } from '@/components/layout/SidebarContext';

export default async function FarmLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ farmId: string }>;
}) {
  const { farmId } = await params;

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background overflow-hidden relative">
        <Sidebar farmId={farmId} />
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
