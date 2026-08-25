import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, ArrowDown, ArrowUp, Syringe, Pill } from 'lucide-react';
import { logHealthTransactionAction } from './actions';
import { AddHealthModal } from './HealthModals';

export default async function HealthPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  const session = await verifySession();
  if (!session?.userId) redirect('/login');

  const healthItems = await db.inventory.findMany({
    where: { 
      farmId, 
      category: { in: ['OBAT', 'VAKSIN'] }
    },
    orderBy: { itemName: 'asc' }
  });

  const members = await db.tenantMember.findMany({ where: { farmId } });
  const currentUserMembership = members.find(m => m.userId === session.userId);
  if (!currentUserMembership) redirect(`/unauthorized`);
  const role = currentUserMembership.role;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground flex items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            Health & Vaccines
          </h1>
          <p className="text-muted-foreground mt-1">Manage medicines, vitamins, and vaccines inventory.</p>
        </div>
        {role !== 'SUPPLIER' && <AddHealthModal farmId={farmId} />}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold font-heading mb-4">Medical Warehouse</h2>
        
        {healthItems.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl opacity-50 mb-2">💊</div>
              <p className="text-muted-foreground">No medical items recorded yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {healthItems.map(item => (
              <Card key={item.id} className={`border-border shadow-sm ${item.currentStock <= item.minStock ? 'border-destructive/50 bg-destructive/5' : ''}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {item.category === 'VAKSIN' ? <Syringe className="w-4 h-4 text-blue-500" /> : <Pill className="w-4 h-4 text-primary" />}
                      {item.itemName}
                    </div>
                    {item.currentStock <= item.minStock && (
                      <span className="text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full font-medium">Low Stock</span>
                    )}
                  </CardTitle>
                  <CardDescription>Stock: <strong className="text-foreground text-xl">{item.currentStock}</strong> {item.unit}</CardDescription>
                </CardHeader>
                {role !== 'SUPPLIER' && (
                  <CardContent>
                    <div className="flex items-center gap-2 border-t border-border pt-4 mt-2">
                      <form action={logHealthTransactionAction.bind(null, farmId, item.id)} className="flex-1 flex gap-2">
                        <input type="hidden" name="type" value="IN" />
                        <input 
                          type="number" 
                          name="amount" 
                          required min="0.1" step="0.1" 
                          placeholder="+Qty" 
                          className="w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm"
                        />
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded-md transition-colors flex justify-center items-center" title="Restock (IN)">
                          <ArrowDown size={18} />
                        </button>
                      </form>
                      <form action={logHealthTransactionAction.bind(null, farmId, item.id)} className="flex-1 flex gap-2">
                        <input type="hidden" name="type" value="OUT" />
                        <input 
                          type="number" 
                          name="amount" 
                          required min="0.1" step="0.1" 
                          max={item.currentStock}
                          placeholder="-Qty" 
                          className="w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm"
                        />
                        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white p-1.5 rounded-md transition-colors flex justify-center items-center" title="Use (OUT)">
                          <ArrowUp size={18} />
                        </button>
                      </form>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
