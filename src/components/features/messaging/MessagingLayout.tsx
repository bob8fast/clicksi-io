// src/components/features/messaging/MessagingLayout.tsx

'use client';

import React from 'react';
import { useDeviceDetection } from '@/hooks/system/use-device-detection';

interface MessagingLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  rightPanel?: React.ReactNode;
  showRightPanel?: boolean;
  className?: string;
}

export const MessagingLayout: React.FC<MessagingLayoutProps> = ({
  children,
  sidebar,
  rightPanel,
  showRightPanel = false,
  className = ''
}) => {
  const { isMobile, isTablet } = useDeviceDetection();

  return (
    <div className={`messaging-layout flex h-full bg-white dark:bg-gray-900 relative ${className}`}>
      {/* Left sidebar - conversation list */}
      {sidebar && (
        <div className={`
          ${isMobile 
            ? 'fixed left-0 top-0 bottom-0 z-50 w-80 transform transition-transform duration-300'
            : 'w-80 flex-shrink-0'
          }
          ${isTablet && showRightPanel ? 'hidden lg:block' : 'block'}
          border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900
        `}>
          {sidebar}
        </div>
      )}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
      
      {/* Right panel - conversation info */}
      {showRightPanel && rightPanel && (
        <div className={`
          ${isMobile 
            ? 'fixed right-0 top-0 bottom-0 z-50 w-80 transform transition-transform duration-300'
            : 'w-80 flex-shrink-0'
          }
          ${isTablet ? 'hidden xl:block' : 'block'}
          border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900
        `}>
          {rightPanel}
        </div>
      )}
    </div>
  );
};