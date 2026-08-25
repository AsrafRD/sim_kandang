'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Map, 
  Cat, 
  Wheat, 
  Activity, 
  PenTool, 
  BarChart3, 
  Receipt,
  LogOut,
  X,
  Users,
  MapPin
} from 'lucide-react';

import { logoutAction } from '@/app/(auth)/logout/actions';
import { useSidebar } from './SidebarContext';
import { TenantSwitcher } from './TenantSwitcher';
import { APP_VERSION } from '@/lib/constants';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from '@/components/ui/dropdown-menu';

const sidebarGroups = [
  {
    label: 'DASHBOARD',
    allowedRoles: ['SUPERADMIN', 'OWNER', 'OPERATOR', 'SUPPLIER'],
    items: [
      { name: 'Ringkasan', href: '/overview', icon: LayoutDashboard },
    ]
  },
  {
    label: 'OPERASIONAL',
    allowedRoles: ['SUPERADMIN', 'OWNER', 'OPERATOR'],
    items: [
      { name: 'Ternak (Broiler)', href: '/livestock', icon: Cat },
      { name: 'Manajemen Pakan', href: '/feeding', icon: Wheat },
      { name: 'Kesehatan & Vaksin', href: '/health', icon: Activity },
      { name: 'Data Kandang', href: '/barns', icon: Map },
      { name: 'Laporan Harian', href: '/daily-input', icon: PenTool },
    ]
  },
  {
    label: 'PENGATURAN',
    allowedRoles: ['SUPERADMIN', 'OWNER'],
    items: [
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Reports', href: '/reports', icon: Receipt },
    ]
  },
  {
    label: 'SETTINGS',
    allowedRoles: ['SUPERADMIN', 'OWNER'],
    items: [
      { name: 'Team Management', href: '/settings/team', icon: Users },
    ]
  }
];

export function Sidebar({ farmId, role, memberships, userName = 'User' }: { farmId: string, role: string, memberships: any[], userName?: string }) {
  const pathname = usePathname();
  const { isOpen, setIsOpen, isDesktopClosed } = useSidebar();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={`fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border flex flex-col h-full transform transition-all duration-300 ease-in-out
        w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative 
        ${isDesktopClosed ? 'md:-translate-x-full md:w-0 md:border-r-0 md:opacity-0 md:overflow-hidden' : 'md:translate-x-0 md:w-64 md:opacity-100'}
      `}>
        <div className="px-4 py-2 flex items-center shrink-0 min-w-[16rem]">
          {/* <img src="/logo.png" alt="Logo" className="w-12 h-12" /> */}
          <h2 className="flex flex-col text-2xl font-bold font-heading text-sidebar-primary tracking-tight">
          FARMOS
            <div className="text-center text-xs font-medium text-sidebar-foreground/30 uppercase tracking-widest">
          {/* {APP_VERSION} */}
        </div>
          </h2>
          <button className="md:hidden text-sidebar-foreground p-1 rounded-md hover:bg-sidebar-accent ml-auto" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        {/* Farm Switcher */}
        <div className="px-4 mb-4">
          {memberships && memberships.length > 0 && (
            <TenantSwitcher farms={memberships} currentFarmId={farmId} />
          )}
        </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        {sidebarGroups.map((group) => {
          if (group.allowedRoles && !group.allowedRoles.includes(role)) {
            return null;
          }
          return (
          <div key={group.label}>
            <div className="text-xs font-semibold text-sidebar-foreground/50 mb-1 tracking-wider">
              {group.label}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const href = `/farm/${farmId}${item.href}`;
                const isActive = pathname.startsWith(href);
                const Icon = item.icon;
                
                return (
                  <Link 
                    key={item.name} 
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md' 
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1'
                    }`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          );
        })}
      </div>
      <div className="px-4 py-3 border-t border-sidebar-border mt-auto flex flex-col gap-4">
        
        {/* Mobile Profile Block (Dropdown) */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 px-2 outline-none w-full text-left">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {userName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                <div className="font-medium text-sidebar-foreground truncate">{userName}</div>
                <div className="text-xs text-sidebar-foreground/50 capitalize truncate">{role.toLowerCase()}</div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 mb-2">
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

        {/* Desktop Standalone Logout */}
        <form action={logoutAction} className="hidden md:block">
          <button type="submit" className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
            <LogOut size={18} />
            Keluar
          </button>
        </form>
      </div>
      </div>
    </>
  );
}
