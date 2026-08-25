import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { removeMemberAction } from './actions';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Users, Trash2 } from 'lucide-react';
import { AddMemberModal, EditMemberModal } from './TeamModals';

export default async function TeamManagementPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  const session = await verifySession();
  if (!session?.userId) redirect('/login');

  const members = await db.tenantMember.findMany({
    where: { farmId },
    include: { user: true },
    orderBy: { createdAt: 'asc' }
  });

  const currentUserMembership = members.find(m => m.userId === session.userId);
  if (!currentUserMembership || (currentUserMembership.role !== 'SUPERADMIN' && currentUserMembership.role !== 'OWNER')) {
    redirect(`/farm/${farmId}/overview`);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Team Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage who has access to your farm data and operations.</p>
        </div>
        <AddMemberModal farmId={farmId} />
      </div>

      {/* Members List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Current Members</CardTitle>
          <CardDescription>All users with access to this farm.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Name</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Role</th>
                  <th className="h-10 px-4 text-right font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium">{member.user.name}</div>
                      <div className="text-muted-foreground text-xs">{member.user.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${member.role === 'SUPERADMIN' ? 'bg-destructive/10 text-destructive' : 
                          member.role === 'OWNER' ? 'bg-primary/10 text-primary' :
                          member.role === 'SUPPLIER' ? 'bg-orange-500/10 text-orange-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-1">
                      {member.role !== 'SUPERADMIN' && (
                        <EditMemberModal farmId={farmId} member={member} />
                      )}
                      
                      {member.userId !== session.userId && member.role !== 'SUPERADMIN' && (
                        <form action={removeMemberAction.bind(null, farmId, member.id)}>
                          <button 
                            type="submit"
                            className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-md hover:bg-destructive/10"
                            title="Remove Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-muted-foreground">
                      No members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
