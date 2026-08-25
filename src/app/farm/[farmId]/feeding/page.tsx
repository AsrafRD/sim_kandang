import { Card, CardContent } from '@/components/ui/card';

export default async function FeedingPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-heading text-foreground">Feeding & Nutrition</h1>
        <p className="text-muted-foreground mt-1">Manage feed inventory, formulations, and schedules.</p>
      </div>
      <Card className="border-border bg-card/50 backdrop-blur-sm border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-24 text-center space-y-4">
          <div className="text-5xl opacity-50 mb-2">🌾</div>
          <h2 className="text-2xl font-semibold text-foreground">Coming Soon</h2>
          <p className="text-muted-foreground max-w-md">
            The automated feeding and nutrition management module will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
