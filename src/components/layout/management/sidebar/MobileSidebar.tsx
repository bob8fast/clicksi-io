// components/layout/management/sidebar/MobileSidebar.tsx - Mobile Overlay Sidebar

'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useManagementLayout } from '../ManagementLayoutProvider';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarUserSection } from './SidebarUserSection';

export function MobileSidebar() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useManagementLayout();

  return (
    <>
      {/* Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 bg-[#090909] border-r border-[#202020] transform transition-transform duration-300 lg:hidden flex flex-col",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Close Button */}
        <div className="absolute top-4 right-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileSidebarOpen(false)}
            className="text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Sidebar Content */}
        <SidebarHeader />
        <SidebarNavigation />
        <SidebarUserSection />
      </aside>
    </>
  );
}