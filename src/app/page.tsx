import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifySession } from '@/lib/auth/session';
import { db } from '@/lib/db';


export default async function Home() {
  const session = await verifySession();

  if (session && session.userId) {
    // Check if user belongs to any farm
    const memberships = await db.tenantMember.findMany({
      where: { userId: session.userId as string },
      include: { farm: true },
      orderBy: { createdAt: 'asc' },
    });

    if (memberships.length > 0) {
      // Redirect to the first farm
      redirect(`/farm/${memberships[0].farmId}/overview`);
    }
  }

  // If not logged in, or has no farms, show the placeholder immersive homepage
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decorator (Placeholder for 3D/Canvas) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      </div>

      <div className="z-10 text-center space-y-6 max-w-2xl px-6">
        <h1 className="text-4xl md:text-6xl font-bold font-heading text-foreground tracking-tight">
          SMART <span className="text-primary">FARM</span>
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 font-light tracking-wide">
          LIVESTOCK MANAGEMENT
        </p>
        <p className="text-muted-foreground max-w-md mx-auto">
          Manage your livestock ecosystem from one place.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {session ? (
            <Link href="/farm/create" className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 h-auto text-lg rounded-xl shadow-xl shadow-primary/20 transition-colors">
              Create a Farm
            </Link>
          ) : (
            <>
              <Link href="/login" className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 h-auto text-lg rounded-xl shadow-xl shadow-primary/20 transition-colors">
                Explore Dashboard
              </Link>
              <Link href="/register" className="inline-flex items-center justify-center border border-border text-foreground hover:bg-muted px-8 py-6 h-auto text-lg rounded-xl transition-colors">
                Register
              </Link>
            </>
          )}
        </div>

        {/* 3D Barn Placeholder UI */}
        <div className="mt-16 bg-card border border-border/50 rounded-3xl p-8 shadow-2xl max-w-sm mx-auto relative group transition-transform hover:-translate-y-2 duration-500">
          <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            3D BARN
          </div>
          <div className="text-4xl text-center py-6">🐄 🐄</div>
          <div className="text-2xl text-center pb-4">🌱 🌱</div>
        </div>

        <div className="flex justify-center gap-8 text-sm font-medium text-muted-foreground mt-8">
          <div>386 Animals</div>
          <div>24 Barns</div>
          <div>97% Healthy</div>
        </div>
      </div>
    </div>
  );
}
