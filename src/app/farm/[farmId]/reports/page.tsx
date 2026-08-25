import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Receipt, TrendingUp, Skull, Droplet, Wheat } from 'lucide-react';

export default async function ReportsPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  const session = await verifySession();
  if (!session?.userId) redirect('/login');

  const members = await db.tenantMember.findMany({ where: { farmId } });
  const currentUserMembership = members.find(m => m.userId === session.userId);
  if (!currentUserMembership || (currentUserMembership.role !== 'SUPERADMIN' && currentUserMembership.role !== 'OWNER')) {
    redirect(`/farm/${farmId}/overview`);
  }

  const flocks = await db.flock.findMany({
    where: { farmId },
    include: {
      dailyRecords: true
    },
    orderBy: { chickInDate: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="hidden">
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {flocks.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
            No flocks available to generate reports.
          </div>
        )}
        
        {flocks.map(flock => {
          const totalMortality = flock.dailyRecords.reduce((acc, curr) => acc + curr.mortality + curr.culling, 0);
          const totalFeed = flock.dailyRecords.reduce((acc, curr) => acc + curr.feedConsumedKg, 0);
          const totalWater = flock.dailyRecords.reduce((acc, curr) => acc + curr.waterConsumedL, 0);
          
          const survivalRate = flock.initialCount > 0 
            ? ((flock.initialCount - totalMortality) / flock.initialCount * 100).toFixed(2) 
            : 0;

          return (
            <Card key={flock.id} className="border-border shadow-sm">
              <CardHeader className="bg-muted/30 pb-4 border-b border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{flock.batchName}</CardTitle>
                    <CardDescription>
                      Started: {flock.chickInDate.toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {flock.isActive ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium border border-green-200">Active</span>
                      ) : (
                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium border border-gray-300">Harvested</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Survival Rate</span>
                  </div>
                  <span className="text-2xl font-bold font-heading">{survivalRate}%</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-destructive/5 rounded-lg p-3 border border-destructive/10">
                    <div className="flex items-center gap-2 text-destructive mb-1">
                      <Skull className="w-4 h-4" />
                      <span className="text-xs font-semibold">Total Death</span>
                    </div>
                    <span className="text-xl font-bold">{totalMortality} <span className="text-xs text-muted-foreground font-normal">birds</span></span>
                  </div>
                  
                  <div className="bg-amber-500/5 rounded-lg p-3 border border-amber-500/10">
                    <div className="flex items-center gap-2 text-amber-600 mb-1">
                      <Wheat className="w-4 h-4" />
                      <span className="text-xs font-semibold">Total Feed</span>
                    </div>
                    <span className="text-xl font-bold">{totalFeed} <span className="text-xs text-muted-foreground font-normal">kg</span></span>
                  </div>

                  <div className="bg-blue-500/5 rounded-lg p-3 border border-blue-500/10 col-span-2">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <Droplet className="w-4 h-4" />
                      <span className="text-xs font-semibold">Total Water</span>
                    </div>
                    <span className="text-xl font-bold">{totalWater} <span className="text-xs text-muted-foreground font-normal">Liters</span></span>
                  </div>
                </div>

              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
