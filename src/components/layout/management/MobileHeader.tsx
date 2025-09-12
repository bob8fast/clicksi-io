// components/layout/management/MobileHeader.tsx - Mobile Header with Menu Button

'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useManagementLayout } from './ManagementLayoutProvider';

export function MobileHeader() {
  const { 
    isMobile, 
    mobileSidebarOpen, 
    setMobileSidebarOpen,
    config 
  } = useManagementLayout();

  if (!isMobile) return null;

  return (
    <header className="lg:hidden bg-[#090909] border-b border-[#202020] px-4 py-3 flex items-center justify-between relative z-30">
      {/* Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6" />
      </Button>

      {/* Portal Name */}
      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold text-[#EDECF8]">
          {config.portalName || 'Management'}
        </h1>
      </div>

      {/* Spacer for balance */}
      <div className="w-10" />
    </header>
  );
}