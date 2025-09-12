// src/components/features/messaging/MessageReactions.tsx

'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import EmojiPicker, { EmojiClickData, Theme, Categories } from 'emoji-picker-react';
import { useTheme } from 'next-themes';
import type { MessageReaction } from '@/types/app/messaging-types';

interface MessageReactionsProps {
  reactions: MessageReaction[];
  onReaction: (emoji: string) => void;
  currentUserId: string;
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  reactions,
  onReaction,
  currentUserId
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { theme } = useTheme();

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onReaction(emojiData.emoji);
    setShowEmojiPicker(false);
  };
  // Group reactions by emoji
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = {
        emoji: reaction.emoji,
        count: 0,
        users: [],
        hasCurrentUser: false
      };
    }
    
    acc[reaction.emoji].count++;
    acc[reaction.emoji].users.push(reaction.user?.name || 'Unknown');
    
    if (reaction.user_id === currentUserId) {
      acc[reaction.emoji].hasCurrentUser = true;
    }
    
    return acc;
  }, {} as Record<string, { emoji: string; count: number; users: string[]; hasCurrentUser: boolean }>);

  if (Object.keys(groupedReactions).length === 0) {
    return null;
  }

  return (
    <div className="message-reactions flex flex-wrap items-center gap-1">
      {Object.values(groupedReactions).map(({ emoji, count, users, hasCurrentUser }) => (
        <button
          key={emoji}
          className={`
            inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs
            transition-colors cursor-pointer
            ${hasCurrentUser 
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
          `}
          onClick={() => onReaction(emoji)}
          title={`${users.join(', ')} reacted with ${emoji}`}
        >
          <span>{emoji}</span>
          <span className="font-medium">{count}</span>
        </button>
      ))}
      
      {/* Add reaction button */}
      <div className="relative">
        <button
          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs
                     bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400
                     border border-gray-200 dark:border-gray-700
                     hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300
                     transition-colors cursor-pointer"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          title="Add reaction"
        >
          <Plus className="w-3 h-3" />
        </button>
        
        {/* Quick emoji picker for reactions */}
        {showEmojiPicker && (
          <>
            {/* Backdrop for mobile */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowEmojiPicker(false)}
            />
            
            <div className="absolute bottom-full left-0 z-50 mb-2">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme={theme === 'dark' ? Theme.DARK : theme === 'light' ? Theme.LIGHT : Theme.AUTO}
                height={300}
                width={300}
                searchDisabled={true} // Disable search for quick reactions
                skinTonePickerLocation="PREVIEW"
                previewConfig={{
                  showPreview: false // No preview needed for quick reactions
                }}
                // Show only most used categories for reactions
                categories={[
                  { category: Categories.SMILEYS_PEOPLE, name: 'Smileys' },
                  { category: Categories.SYMBOLS, name: 'Symbols' }
                ]}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};