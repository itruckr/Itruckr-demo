import {
  BarChart3,
  House,
  Mail,
  MapPinned,
  MessageCircle,
  Truck,
  Users,
  FileSignatureIcon,
  MessagesSquare
} from 'lucide-react';
import React, { createContext, useContext, useState } from 'react';

type Page =
  | 'dashboard'
  | 'iTruckr'
  | 'loadboard'
  | 'chat'
  | 'email'
  | 'loads'
  | 'payments'
  | 'registration'
  | 'call-form'
  | 'whatsapp';

interface NavigationContextType {
  activePage: Page;
  setActivePage: (page: Page) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'iTruckr', label: 'iTruckr', icon: House },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'chat', label: 'Chat', icon: MessageCircle },
  { id: 'loads', label: 'Loads', icon: Truck },
  { id: 'loadboard', label: 'Loadboard', icon: MapPinned },
  { id: 'registration', label: 'Registration', icon: Users },
  { id: 'call-form', label: 'Call Form', icon:  FileSignatureIcon},
  { id: 'whatsapp', label: 'whatsapp', icon:  MessagesSquare},
] as const;

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <NavigationContext.Provider
      value={{
        activePage,
        setActivePage,
        sidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
