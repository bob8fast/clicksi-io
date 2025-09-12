// components/layout/management/ResponsiveWrapper.tsx - Responsive Layout Logic

'use client';

import { ReactNode, useEffect } from 'react';
import { useManagementLayout } from './ManagementLayoutProvider';
import { Sidebar } from './sidebar/Sidebar';
import { MobileSidebar } from './sidebar/MobileSidebar';
import { MobileHeader } from './MobileHeader';

interface ResponsiveWrapperProps {
  children: ReactNode;
}

export function ResponsiveWrapper({ children }: ResponsiveWrapperProps) {
  const { 
    isMobile, 
    mobileSidebarOpen, 
    setMobileSidebarOpen,
    sidebarCollapsed,
    config 
  } = useManagementLayout();

  // Close mobile sidebar on route change (will be enhanced with router)
  useEffect(() => {
    if (isMobile && mobileSidebarOpen) {
      // Auto-close mobile sidebar after navigation
      const timer = setTimeout(() => {
        setMobileSidebarOpen(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMobile, mobileSidebarOpen, setMobileSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-[#090909]" style={{
      '--primary-color': config.branding?.primaryColor || '#D78E59',
      '--accent-color': config.branding?.accentColor || '#FFAA6C',
    } as React.CSSProperties}>
      
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <MobileSidebar />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 relative transition-all duration-300 ${
        isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        {/* Mobile Header */}
        <MobileHeader />
        
        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}