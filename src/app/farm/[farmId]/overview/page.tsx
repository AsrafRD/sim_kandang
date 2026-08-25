import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ farmId: string }>;
}) {
  const { farmId } = await params;
  
  const farm = await db.farm.findUnique({
    where: { id: farmId },
  });

  if (!farm) {
    return <div>Farm not found</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome to {farm.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Livestock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">--</div>
            <p className="text-xs text-muted-foreground mt-1">Active animals in barns</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Barns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">--</div>
            <p className="text-xs text-muted-foreground mt-1">Currently operating</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Overall Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-success">--%</div>
            <p className="text-xs text-muted-foreground mt-1">Based on mortality rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] shadow-sm relative group overflow-hidden">
        {/* Placeholder for 3D/Interactive background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background pointer-events-none" />
        
        <div className="z-10 flex flex-col items-center transition-transform duration-500 group-hover:-translate-y-2">
          <div className="text-6xl mb-6 shadow-2xl rounded-full bg-background p-4 border border-border">🐄</div>
          <h3 className="text-xl font-bold font-heading mb-2">3D Barn Interactive Map</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Interactive visualization module will be deployed here. Monitor barn temperatures, livestock health, and feed levels in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
