// components/layout/management/sidebar/SidebarFooter.tsx - Collapse Controls

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useManagementLayout } from '../ManagementLayoutProvider';

export function SidebarFooter() {
  const { sidebarCollapsed, setSidebarCollapsed } = useManagementLayout();

  return (
    <div className="p-4 border-t border-[#202020]">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="w-full text-[#575757] hover:text-[#EDECF8] hover:bg-[#202020]"
        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? 
          <ChevronRight className="w-4 h-4" /> : 
          <ChevronLeft className="w-4 h-4" />
        }
      </Button>
    </div>
  );
}