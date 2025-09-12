// components/layout/management/sidebar/Sidebar.tsx - Desktop Sidebar

'use client';

import { cn } from '@/lib/utils';
import { useManagementLayout } from '../ManagementLayoutProvider';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarUserSection } from './SidebarUserSection';
import { SidebarFooter } from './SidebarFooter';

export function Sidebar() {
  const { sidebarCollapsed } = useManagementLayout();

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-full bg-[#090909] border-r border-[#202020] transition-all duration-300 flex flex-col",
      sidebarCollapsed ? "w-20" : "w-64"
    )}>
      {/* Sidebar Header with Logo and Entity Branding */}
      <SidebarHeader />
      
      {/* Navigation Items */}
      <SidebarNavigation />
      
      {/* User Section */}
      <SidebarUserSection />
      
      {/* Footer with Collapse Controls */}
      <SidebarFooter />
    </aside>
  );
}