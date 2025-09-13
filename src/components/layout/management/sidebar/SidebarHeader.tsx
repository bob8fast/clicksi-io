// components/layout/management/sidebar/SidebarHeader.tsx - Sidebar Header with Branding

'use client';

import Link from 'next/link';
import { ClicksiLogo } from '@/components/icons/ClicksiIcons';
import { useManagementLayout } from '../ManagementLayoutProvider';

export function SidebarHeader() {
  const { sidebarCollapsed, config } = useManagementLayout();

  return (
    <div className="p-6 border-b border-[#202020]">
      <Link href="/" className="flex items-center">
        {/* Logo */}
        <ClicksiLogo className="h-8 w-auto text-[#EDECF8] flex-shrink-0" />
        
        {/* Portal Name - Hidden when collapsed */}
        {!sidebarCollapsed && (
          <div className="ml-3 flex flex-col">
            <span className="text-sm font-medium text-[#EDECF8]">
              {config.portalName}
            </span>
            {config.entityLabel && (
              <span className="text-xs text-[#828288]">
                {config.entityLabel} Management
              </span>
            )}
          </div>
        )}
      </Link>
    </div>
  );
}