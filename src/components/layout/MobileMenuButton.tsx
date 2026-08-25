'use client';
import { Menu } from 'lucide-react';
import { useSidebar } from './SidebarContext';

export function MobileMenuButton() {
  const { setIsOpen, isOpen, isDesktopClosed, setIsDesktopClosed } = useSidebar();
  
  const handleToggle = () => {
    // For mobile
    setIsOpen(!isOpen);
    // For desktop
    setIsDesktopClosed(!isDesktopClosed);
  };
  
  return (
    <button 
      className="p-2 mr-2 text-foreground hover:bg-muted rounded-md transition-colors"
      onClick={handleToggle}
      aria-label="Toggle Menu"
    >
      <Menu size={24} />
    </button>
  );
}
