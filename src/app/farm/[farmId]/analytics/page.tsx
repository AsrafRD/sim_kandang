import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PerformanceChart } from '@/components/analytics/PerformanceChart';

export default async function AnalyticsPage({
  params
}: {
  params: Promise<{ farmId: string }>;
}) {
  const { farmId } = await params;
  
  // Get active flock
  const activeFlock = await db.flock.findFirst({
    where: { farmId, isActive: true },
  });

  let chartData: any[] = [];
  let totalMortality = 0;
  let totalFeed = 0;
  let currentPopulation = 0;
  let fcr = 0;

  if (activeFlock) {
    const records = await db.dailyRecord.findMany({
      where: { flockId: activeFlock.id },
      orderBy: { date: 'asc' },
    });

    chartData = records.map(r => {
      totalMortality += r.mortality + r.culling;
      totalFeed += r.feedConsumedKg;
      return {
        dateStr: r.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        mortality: r.mortality + r.culling,
        feedConsumedKg: r.feedConsumedKg,
        temperature: r.temperature,
      };
    });

    currentPopulation = activeFlock.initialCount - totalMortality;

    // FCR Calculation (Total feed consumed / Total weight gained)
    // Assume average weight is 1.5kg for demonstration
    const totalWeightGain = currentPopulation * 1.5; 
    if (totalWeightGain > 0) {
      fcr = totalFeed / totalWeightGain;
    }
  }

  return (
    // Wrap with .dark class to force dark mode (Forest theme)
    <div className="dark min-h-[calc(100vh-4rem)] bg-background text-foreground -m-6 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Batch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground truncate">{activeFlock?.batchName || 'No Active Batch'}</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Population</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{currentPopulation.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">From {activeFlock?.initialCount.toLocaleString()} DOC</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{totalFeed.toLocaleString()} <span className="text-xl">Kg</span></div>
              <p className="text-xs text-muted-foreground mt-1">Cumulative consumption</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="text-6xl font-bold text-accent">%</span>
            </div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Est. FCR</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-foreground">{fcr.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Feed Conversion Ratio</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-accent/30 shadow-lg shadow-accent/5">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Performance Trend</CardTitle>
            <CardDescription className="text-muted-foreground">Correlation between feed consumption and mortality rate over time.</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <PerformanceChart data={chartData} />
            ) : (
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                No daily records available yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
