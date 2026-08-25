import { TenantSwitcher } from './TenantSwitcher';
import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth/session';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell } from 'lucide-react';
import { MobileMenuButton } from './MobileMenuButton';

export async function Topbar({ farmId }: { farmId: string }) {
  const session = await verifySession();
  
  if (!session?.userId) return null;

  const memberships = await db.tenantMember.findMany({
    where: { userId: session.userId as string },
    include: { farm: true },
  });

  const user = await db.user.findUnique({
    where: { id: session.userId as string },
  });

  const memberInfo = memberships.find(m => m.farmId === farmId);

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center w-auto md:w-64">
        <MobileMenuButton />
        <div className="hidden md:block w-full">
          {memberships.length > 0 && (
            <TenantSwitcher farms={memberships} currentFarmId={farmId} />
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-sm text-right hidden sm:block">
            <div className="font-medium text-foreground">{user?.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{memberInfo?.role?.toLowerCase() || 'Member'}</div>
          </div>
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
