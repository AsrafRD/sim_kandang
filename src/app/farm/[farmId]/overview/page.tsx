import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function OverviewPage({
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
        include: {
          dailyRecords: {
            orderBy: { date: 'asc' },
            take: 14,
          }
        }
      }
    }
  });

  if (!farm) {
    return <div>Kandang tidak ditemukan</div>;
  }

  const activeFlocks = farm.flocks;
  const totalLivestock = activeFlocks.reduce((sum, flock) => sum + flock.initialCount, 0);
  const activeBarns = activeFlocks.length;
  
  const totalMortality = activeFlocks.reduce((sum, flock) => {
    return sum + flock.dailyRecords.reduce((mSum, r) => mSum + r.mortality, 0);
  }, 0);
  
  const healthPercent = totalLivestock > 0 
    ? ((totalLivestock - totalMortality) / totalLivestock * 100).toFixed(1) 
    : '0.0';

  // Format chart data (aggregate by date)
  const chartDataMap = new Map<string, { date: string, feedConsumedKg: number }>();
  activeFlocks.forEach(flock => {
    flock.dailyRecords.forEach(record => {
      const dateStr = record.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      if (!chartDataMap.has(dateStr)) {
        chartDataMap.set(dateStr, { date: dateStr, feedConsumedKg: 0 });
      }
      chartDataMap.get(dateStr)!.feedConsumedKg += record.feedConsumedKg;
    });
  });
  const chartData = Array.from(chartDataMap.values());

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Populasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{totalLivestock.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground mt-1">Ekor aktif di dalam kandang</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Kandang Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{activeBarns}</div>
            <p className="text-xs text-muted-foreground mt-1">Siklus / Batch yang sedang berjalan</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Kesehatan Keseluruhan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-success">{healthPercent}%</div>
            <p className="text-xs text-muted-foreground mt-1">Berdasarkan tingkat mortalitas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Laporan Operasional</CardTitle>
            <CardDescription>Akses cepat laporan bulan ini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border">
              <span className="text-sm font-medium">Laporan Konsumsi Pakan</span>
              <Button variant="outline" size="sm">Unduh PDF</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border">
              <span className="text-sm font-medium">Laporan Kesehatan Ternak</span>
              <Button variant="outline" size="sm">Unduh PDF</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border">
              <span className="text-sm font-medium">Rekapitulasi Panen</span>
              <Button variant="outline" size="sm">Unduh PDF</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
