import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cat, CheckCircle2 } from 'lucide-react';
import { closeFlockAction } from './actions';
import { AddFlockModal } from './LivestockModals';

export default async function LivestockPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  const session = await verifySession();
  if (!session?.userId) redirect('/login');

  const flocks = await db.flock.findMany({
    where: { farmId },
    orderBy: { chickInDate: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground flex items-center gap-2">
            <Cat className="w-8 h-8 text-primary" />
            Livestock Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage flocks, animal batches, and lifecycle.</p>
        </div>
        <AddFlockModal farmId={farmId} />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold font-heading mb-4">Batch History</h2>
        
        {flocks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl opacity-50 mb-2">🐥</div>
              <p className="text-muted-foreground">No flocks recorded yet. Start a new batch!</p>
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
                      <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">Active</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full font-medium">Harvested</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Initial Count</p>
                      <p className="font-medium">{flock.initialCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Chick-In Date</p>
                      <p className="font-medium">{flock.chickInDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                  {flock.isActive && (
                    <form action={closeFlockAction.bind(null, farmId, flock.id)}>
                      <button 
                        type="submit" 
                        className="w-full flex justify-center items-center gap-2 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-sm font-medium transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Mark as Harvested
                      </button>
                    </form>
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
