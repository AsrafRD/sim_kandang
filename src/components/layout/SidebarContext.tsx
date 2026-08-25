'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type SidebarContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isDesktopClosed: boolean;
  setIsDesktopClosed: (closed: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false); // for mobile
  const [isDesktopClosed, setIsDesktopClosed] = useState(false); // for desktop

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, isDesktopClosed, setIsDesktopClosed } as any}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
