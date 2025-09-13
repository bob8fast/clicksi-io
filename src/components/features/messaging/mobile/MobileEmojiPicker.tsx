// src/components/features/messaging/mobile/MobileEmojiPicker.tsx

'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmojiPicker, { EmojiClickData, Theme, SkinTonePickerLocation, Categories } from 'emoji-picker-react';
import { useTheme } from 'next-themes';

interface MobileEmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  position?: 'bottom' | 'top';
}

export const MobileEmojiPicker: React.FC<MobileEmojiPickerProps> = ({
  onSelect,
  onClose,
  position = 'bottom'
}) => {
  const { theme } = useTheme();

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onSelect(emojiData.emoji);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Emoji picker modal */}
      <div 
        className={`fixed left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-xl max-h-[70vh] overflow-hidden ${
          position === 'bottom' ? 'bottom-0' : 'top-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Add Emoji
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Emoji picker */}
        <div className="p-2">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme={theme === 'dark' ? Theme.DARK : theme === 'light' ? Theme.LIGHT : Theme.AUTO}
            width="100%"
            height={400}
            searchDisabled={false}
            skinTonePickerLocation={SkinTonePickerLocation.SEARCH}
            searchPlaceHolder="Search emojis..."
            previewConfig={{
              showPreview: false // Disable preview on mobile for more space
            }}
            // Optimize for mobile: show most used categories first
            categories={[
              { category: Categories.SMILEYS_PEOPLE, name: 'Smileys & People' },
              { category: Categories.ANIMALS_NATURE, name: 'Animals & Nature' }, 
              { category: Categories.FOOD_DRINK, name: 'Food & Drink' },
              { category: Categories.ACTIVITIES, name: 'Activities' },
              { category: Categories.TRAVEL_PLACES, name: 'Travel & Places' },
              { category: Categories.OBJECTS, name: 'Objects' },
              { category: Categories.SYMBOLS, name: 'Symbols' },
              { category: Categories.FLAGS, name: 'Flags' }
            ]}
            style={{
              '--epr-emoji-size': '28px', // Larger emoji size for touch
              '--epr-category-navigation-button-size': '36px', // Larger category buttons
            } as React.CSSProperties}
          />
        </div>
        
        {/* iOS safe area bottom padding */}
        <div className="pb-safe-area-inset-bottom" />
      </div>
    </>
  );
};