import { verifySession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function FarmSelectPage() {
  const session = await verifySession();
  if (!session?.userId) redirect('/login');

  const memberships = await db.tenantMember.findMany({
    where: { userId: session.userId as string },
    include: { farm: true },
    orderBy: { createdAt: 'asc' },
  });

  if (memberships.length === 0) {
    redirect('/farm/create');
  }

  return (
    <div className="min-h-screen bg-[#F5F2E8] flex flex-col items-center justify-center p-6 text-[#17221C]">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-bold font-heading mb-2 text-center">Pilih Kandang Aktif</h1>
        <p className="text-center text-muted-foreground mb-8">Pilih bisnis kandang yang ingin Anda kelola saat ini.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberships.map((membership) => (
            <Link key={membership.farmId} href={`/farm/${membership.farmId}/overview`} className="block group">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border group-hover:border-primary/50 group-hover:shadow-md transition-all h-full flex flex-col">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 text-xl">
                  {membership.farm.type === 'BROILER' ? '🐔' : '🥚'}
                </div>
                <h3 className="font-bold text-lg">{membership.farm.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4 flex-1">{membership.farm.address || 'Alamat belum diatur'}</p>
                <div className="text-xs font-semibold px-2 py-1 bg-muted rounded w-fit uppercase tracking-wider">
                  Role: {membership.role}
                </div>
              </div>
            </Link>
          ))}
          
          <Link href="/farm/create" className="block group">
            <div className="bg-transparent border-2 border-dashed border-border rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center hover:bg-primary/5 transition-all cursor-pointer">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <span className="text-2xl">+</span>
              </div>
              <h3 className="font-bold text-lg">Buat Kandang Baru</h3>
              <p className="text-sm text-muted-foreground mt-1">Tambahkan cabang atau unit bisnis kandang baru.</p>
            </div>
          </Link>
        </div>
        
        <div className="mt-10 text-center">
          <form action={async () => { 'use server'; import('@/lib/auth/session').then(m => m.deleteSession()); redirect('/login'); }}>
            <button type="submit" className="text-muted-foreground hover:text-destructive underline text-sm transition-colors">
              Bukan akun Anda? Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
