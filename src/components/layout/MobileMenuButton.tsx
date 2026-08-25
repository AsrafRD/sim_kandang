'use client';
import { Menu } from 'lucide-react';
import { useSidebar } from './SidebarContext';

export function MobileMenuButton() {
  const { setIsOpen, isOpen } = useSidebar();
  return (
    <button 
      className="p-2 mr-2 md:hidden text-foreground hover:bg-muted rounded-md transition-colors"
      onClick={() => setIsOpen(!isOpen)}
      aria-label="Toggle Menu"
    >
      <Menu size={24} />
    </button>
  );
}
