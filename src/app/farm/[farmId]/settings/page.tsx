import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { SettingsForm } from './SettingsForm';

export default async function FarmSettingsPage({ params }: { params: Promise<{ farmId: string }> }) {
  const { farmId } = await params;
  const session = await verifySession();
  if (!session?.userId) redirect('/login');

  const member = await db.tenantMember.findUnique({
    where: { userId_farmId: { userId: session.userId as string, farmId } }
  });

  if (!member || (member.role !== 'SUPERADMIN' && member.role !== 'OWNER')) {
    redirect(`/farm/${farmId}/overview`);
  }

  const farm = await db.farm.findUnique({
    where: { id: farmId }
  });

  if (!farm) redirect('/farm/router');

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="hidden">
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-xl">Profil Umum</CardTitle>
          <CardDescription>Informasi dasar terkait kandang ini.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm farm={farm} />
        </CardContent>
      </Card>
    </div>
  );
}
