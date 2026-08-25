import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth/session';
import { MobileMenuButton } from './MobileMenuButton';
import { PageHeader } from './PageHeader';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/app/(auth)/logout/actions';

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
      <div className="flex items-center flex-1 min-w-0">
        <MobileMenuButton />
        <div className="block ml-2 md:ml-0 overflow-hidden text-ellipsis whitespace-nowrap">
          <PageHeader />
        </div>
      </div>
      
      {/* Desktop Profile Menu */}
      <div className="hidden md:flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 pl-4 border-l border-border outline-none cursor-pointer">
            <div className="text-sm text-right">
              <div className="font-medium text-foreground">{user?.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{memberInfo?.role?.toLowerCase() || 'Member'}</div>
            </div>
            <Avatar className="h-9 w-9 border border-border">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <form action={logoutAction}>
                <button type="submit" className="w-full text-left">
                  <DropdownMenuItem className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </button>
              </form>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
