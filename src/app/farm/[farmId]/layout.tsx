import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';

export default async function FarmLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ farmId: string }>;
}) {
  const { farmId } = await params;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar farmId={farmId} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar farmId={farmId} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
