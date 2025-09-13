// stores/management-store.ts - Unified Management State with Zustand

import { EntityConfig, ManagementState, BreadcrumbItem } from '@/types/management';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useManagementStore = create<ManagementState>()(
  persist(
    (set, _get) => ({
      // Initial state
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      currentEntityType: 'brand',
      lastActiveNavItem: {
        brand: 'dashboard',
        creator: 'dashboard', 
        retailer: 'dashboard',
        admin: 'dashboard'
      },
      entityConfig: null,
      activeNavItem: 'dashboard',
      breadcrumbs: [],
      
      // Actions
      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },
      
      setMobileSidebarOpen: (open: boolean) => {
        set({ mobileSidebarOpen: open });
      },
      
      setEntityConfig: (config: EntityConfig) => {
        set({ 
          entityConfig: config,
          currentEntityType: config.entityType 
        });
      },
      
      setActiveNavItem: (item: string) => {
        set((state) => ({ 
          activeNavItem: item,
          lastActiveNavItem: {
            ...state.lastActiveNavItem,
            [state.currentEntityType]: item
          }
        }));
      },
      
      updateBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => {
        set({ breadcrumbs });
      },
    }),
    {
      name: 'management-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        currentEntityType: state.currentEntityType,
        lastActiveNavItem: state.lastActiveNavItem,
        // UI preferences persist, runtime state does not
      }),
    }
  )
);