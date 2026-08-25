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
  Receipt 
} from 'lucide-react';

const sidebarGroups = [
  {
    label: 'FARM',
    items: [
      { name: 'Overview', href: '/overview', icon: LayoutDashboard },
      { name: 'Barns', href: '/barns', icon: Map },
      { name: 'Livestock', href: '/livestock', icon: Cat },
    ]
  },
  {
    label: 'OPERATIONS',
    items: [
      { name: 'Feeding', href: '/feeding', icon: Wheat },
      { name: 'Health & Vaccines', href: '/health', icon: Activity },
      { name: 'Daily Entry', href: '/daily-input', icon: PenTool },
    ]
  },
  {
    label: 'INSIGHTS',
    items: [
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Reports', href: '/reports', icon: Receipt },
    ]
  }
];

export function Sidebar({ farmId }: { farmId: string }) {
  const pathname = usePathname();

  return (
    <div className="w-64 flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold font-heading text-sidebar-primary tracking-tight flex items-center gap-2">
          🐄 FARMOS
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        {sidebarGroups.map((group) => (
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
        ))}
      </div>
    </div>
  );
}
