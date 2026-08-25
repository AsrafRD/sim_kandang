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
  Users
} from 'lucide-react';

import { logoutAction } from '@/app/(auth)/logout/actions';
import { useSidebar } from './SidebarContext';
import { TenantSwitcher } from './TenantSwitcher';

const sidebarGroups = [
  {
    label: 'DASHBOARD',
    allowedRoles: ['SUPERADMIN', 'OWNER', 'OPERATOR', 'SUPPLIER'],
    items: [
      { name: 'Overview', href: '/overview', icon: LayoutDashboard },
    ]
  },
  {
    label: 'OPERATIONS',
    allowedRoles: ['SUPERADMIN', 'OWNER', 'OPERATOR'],
    items: [
      { name: 'Livestock', href: '/livestock', icon: Cat },
      { name: 'Feeding', href: '/feeding', icon: Wheat },
      { name: 'Health & Vaccine', href: '/health', icon: Activity },
      { name: 'Barns', href: '/barns', icon: Map },
      { name: 'Daily Entry', href: '/daily-input', icon: PenTool },
    ]
  },
  {
    label: 'INSIGHTS',
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

export function Sidebar({ farmId, role, memberships }: { farmId: string, role: string, memberships: any[] }) {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold font-heading text-sidebar-primary tracking-tight flex items-center gap-2">
            🐄 FARMOS
          </h2>
          <button className="md:hidden text-sidebar-foreground p-1 rounded-md hover:bg-sidebar-accent" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        {/* Mobile Tenant Switcher */}
        <div className="md:hidden px-4 mb-4">
          {memberships && memberships.length > 0 && (
            <TenantSwitcher farms={memberships} currentFarmId={farmId} />
          )}
        </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        {sidebarGroups.map((group) => {
          if (group.allowedRoles && !group.allowedRoles.includes(role)) {
            return null;
          }
          return (
          <div key={group.label}>
            <div className="text-xs font-semibold text-sidebar-foreground/50 mb-2 tracking-wider">
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
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
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
      <div className="p-4 border-t border-sidebar-border mt-auto mb-2">
        <form action={logoutAction}>
          <button type="submit" className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
            <LogOut size={18} />
            Logout
          </button>
        </form>
      </div>
      </div>
    </>
  );
}
