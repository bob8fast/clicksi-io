// components/layout/management/ManagementLayoutProvider.tsx - Context Provider

'use client';

import { createContext, useContext, ReactNode } from 'react';
import { EntityConfig } from '@/types/management';
import { useManagementStore } from '@/stores/management-store';
import { useDeviceDetection } from '@/hooks/system/use-device-detection';

interface ManagementLayoutContext {
  config: EntityConfig;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
  activeNavItem: string;
  setActiveNavItem: (item: string) => void;
}

const ManagementLayoutContext = createContext<ManagementLayoutContext | null>(null);

interface ManagementLayoutProviderProps {
  config: EntityConfig;
  children: ReactNode;
}

export function ManagementLayoutProvider({ config, children }: ManagementLayoutProviderProps) {
  const { isMobile } = useDeviceDetection();
  
  // Get state and actions from Zustand store
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    activeNavItem,
    setActiveNavItem,
  } = useManagementStore();

  const contextValue: ManagementLayoutContext = {
    config,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    isMobile,
    activeNavItem,
    setActiveNavItem,
  };

  return (
    <ManagementLayoutContext.Provider value={contextValue}>
      {children}
    </ManagementLayoutContext.Provider>
  );
}

/**
 * Hook to access management layout context
 */
export function useManagementLayout() {
  const context = useContext(ManagementLayoutContext);
  if (!context) {
    throw new Error('useManagementLayout must be used within ManagementLayoutProvider');
  }
  return context;
}