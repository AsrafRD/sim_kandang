import { db } from '@/lib/db';
import { BarnInteriorScene } from '@/components/3d/BarnScene';
import { verifySession } from '@/lib/auth/session';
import FarmMapDynamic from '@/components/maps/FarmMapDynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { SettingsForm } from '../settings/SettingsForm';

export default async function BarnsMapPage({
  params,
}: {
  params: Promise<{ farmId: string }>;
}) {
  const { farmId } = await params;
  const session = await verifySession();
  
  const farm = await db.farm.findUnique({
    where: { id: farmId },
    include: {
      flocks: {
        where: { isActive: true },
        include: { dailyRecords: { orderBy: { date: 'desc' }, take: 1 } }
      }
    }
  });

  if (!farm || !session?.userId) return <div>Farm not found or unauthorized</div>;

  // Get all farms user has access to for the Map
  const userMemberships = await db.tenantMember.findMany({
    where: { userId: session.userId },
    include: { farm: true }
  });

  const farmsForMap = userMemberships.map(m => ({
    id: m.farm.id,
    name: m.farm.name,
    address: m.farm.address,
    latitude: m.farm.latitude,
    longitude: m.farm.longitude,
    isActive: m.farm.id === farmId,
  }));

  if (!farm) return <div>Farm not found</div>;

  // Transform db data to 3D scene data
  // For this MVP, we map active flocks to "Barns" visually
  const barnsData = farm.flocks.map(flock => {
    const latestRecord = flock.dailyRecords[0];
    const mortality = latestRecord?.mortality || 0;
    const culling = latestRecord?.culling || 0;
    const mortalityRate = ((mortality / flock.initialCount) * 100).toFixed(1);
    
    // Determine health status based on mortality rate
    let healthStatus: 'healthy' | 'warning' | 'danger' = 'healthy';
    if (parseFloat(mortalityRate) > 5) healthStatus = 'danger';
    else if (parseFloat(mortalityRate) > 2) healthStatus = 'warning';

    return {
      id: flock.id,
      name: flock.batchName,
      livestockCount: flock.initialCount - mortality - culling,
      temperature: latestRecord?.temperature || 28.5,
      humidity: 65, // Dummy value
      feedLevel: 80, // Dummy value
      healthStatus
    };
  });

  // If no active flocks, just show a placeholder interior or hide it
  const activeInteriorData = barnsData.length > 0 ? barnsData[0] : {
    name: 'Kandang Kosong',
    livestockCount: 0,
    temperature: 0,
    humidity: 0,
    feedLevel: 0,
    healthStatus: 'healthy' as const
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="mb-6 flex items-center justify-end">
        {/* Farm Settings Modal */}
        <Dialog>
          <DialogTrigger render={<Button variant="outline" className="flex items-center gap-2" />}>
            <Settings className="w-4 h-4" />
            Pengaturan Kandang
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Pengaturan Kandang</DialogTitle>
              <DialogDescription>
                Ubah profil bisnis, alamat, dan titik koordinat kandang Anda.
              </DialogDescription>
            </DialogHeader>
            <SettingsForm farm={farm} />
          </DialogContent>
        </Dialog>
      </div>

      <FarmMapDynamic farms={farmsForMap} />

      <div className="flex-1 relative h-[500px]">
        <BarnInteriorScene data={activeInteriorData} />
        
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
