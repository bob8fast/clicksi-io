// src/components/features/messaging/mobile/BottomSafeArea.tsx

'use client';

import React, { ReactNode } from 'react';

interface BottomSafeAreaProps {
  children: ReactNode;
  className?: string;
}

export const BottomSafeArea: React.FC<BottomSafeAreaProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`pb-safe-area-inset-bottom ${className}`}>
      {children}
    </div>
  );
};