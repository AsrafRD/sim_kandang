import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cat, CheckCircle2 } from 'lucide-react';
import { AddFlockModal, HarvestFlockModal } from './LivestockModals';

export default async function LivestockPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  const session = await verifySession();
  if (!session?.userId) redirect('/login');

  const flocks = await db.flock.findMany({
    where: { farmId },
    include: { dailyRecords: true },
    orderBy: { chickInDate: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-6">
        <AddFlockModal farmId={farmId} />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold font-heading mb-4">Riwayat Batch</h2>
        
        {flocks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl opacity-50 mb-2">🐥</div>
              <p className="text-muted-foreground">Belum ada batch ternak yang dicatat. Mulai batch baru sekarang!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {flocks.map(flock => (
              <Card key={flock.id} className={`border-border ${flock.isActive ? 'border-primary/50 shadow-sm' : 'opacity-70 bg-muted/30'}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{flock.batchName}</CardTitle>
                    {flock.isActive ? (
                      <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">Aktif</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full font-medium">Panen</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Populasi Awal</p>
                      <p className="font-medium">{flock.initialCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Tanggal Chick-In</p>
                      <p className="font-medium">{flock.chickInDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                  {flock.isActive && (
                    <HarvestFlockModal farmId={farmId} flock={flock} />
                  )}
                  {!flock.isActive && (
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border">
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-center">
                        <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider">FCR</p>
                        <p className="text-lg font-black text-orange-800 dark:text-orange-300">{flock.finalFCR?.toFixed(3) || '-'}</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-center">
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Index Prestasi</p>
                        <p className="text-lg font-black text-blue-800 dark:text-blue-300">{flock.ip ? Math.round(flock.ip) : '-'}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
