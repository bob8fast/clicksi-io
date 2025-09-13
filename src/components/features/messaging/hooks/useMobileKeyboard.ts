// src/components/features/messaging/hooks/useMobileKeyboard.ts

'use client';

import { useState, useEffect } from 'react';

interface MobileKeyboardState {
  keyboardHeight: number;
  isKeyboardVisible: boolean;
}

export const useMobileKeyboard = (): MobileKeyboardState => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    // Only run on mobile devices
    if (typeof window === 'undefined' || !window.visualViewport) {
      return;
    }

    const handleResize = () => {
      if (!window.visualViewport) return;
      
      const viewportHeight = window.visualViewport.height;
      const screenHeight = window.screen.height;
      const keyboardHeight = screenHeight - viewportHeight;
      
      setKeyboardHeight(keyboardHeight);
      setIsKeyboardVisible(keyboardHeight > 150); // Consider keyboard visible if height difference > 150px
    };

    // Initial check
    handleResize();

    // Listen for viewport changes
    window.visualViewport.addEventListener('resize', handleResize);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return {
    keyboardHeight,
    isKeyboardVisible
  };
};