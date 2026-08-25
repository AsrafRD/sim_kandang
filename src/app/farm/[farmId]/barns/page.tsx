import { db } from '@/lib/db';
import { BarnScene } from '@/components/3d/BarnScene';
import { Card, CardContent } from '@/components/ui/card';

export default async function BarnsMapPage({
  params,
}: {
  params: Promise<{ farmId: string }>;
}) {
  const { farmId } = await params;
  
  const farm = await db.farm.findUnique({
    where: { id: farmId },
    include: {
      flocks: {
        where: { isActive: true },
        include: { dailyRecords: { orderBy: { date: 'desc' }, take: 1 } }
      }
    }
  });

  if (!farm) return <div>Farm not found</div>;

  // Transform db data to 3D scene data
  // For this MVP, we map active flocks to "Barns" visually
  const barnsData = farm.flocks.map(flock => {
    const latestRecord = flock.dailyRecords[0];
    const mortality = latestRecord?.mortality || 0;
    const culling = latestRecord?.culling || 0;
    const mortalityRate = ((mortality / flock.initialCount) * 100).toFixed(1);
    
    // Determine health status based on mortality rate
    let healthStatus = 'normal';
    if (parseFloat(mortalityRate) > 5) healthStatus = 'danger';
    else if (parseFloat(mortalityRate) > 2) healthStatus = 'warning';

    return {
      id: flock.id,
      name: flock.batchName,
      livestockCount: flock.initialCount - mortality - culling,
      mortalityRate,
      temperature: latestRecord?.temperature || 28.5,
      healthStatus
    };
  });

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-heading text-foreground">Interactive 3D Barns</h1>
        <p className="text-muted-foreground mt-1">Spatial monitoring of your active flocks.</p>
      </div>

      <div className="flex-1 relative">
        <BarnScene barnsData={barnsData} />
        
        {/* Floating Legend */}
        <Card className="absolute bottom-6 right-6 w-52 shadow-xl bg-background/90 backdrop-blur-sm border-border z-10">
          <CardContent className="p-4 space-y-3">
            <h4 className="font-semibold text-sm border-b border-border pb-2">Health Indicator</h4>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-[#58763A]" /> Normal
              </div>
              <span className="font-mono text-[10px] opacity-60">Safe</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-[#D59A3A]" /> Warning
              </div>
              <span className="font-mono text-[10px] opacity-60">&gt;2% Mort</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-[#C65A4A]" /> Critical
              </div>
              <span className="font-mono text-[10px] opacity-60">&gt;5% Mort</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
