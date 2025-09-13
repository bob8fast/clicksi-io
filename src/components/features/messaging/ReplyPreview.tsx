// src/components/features/messaging/ReplyPreview.tsx

'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Message } from '@/types/app/messaging-types';

interface ReplyPreviewProps {
  message: Message;
  onCancel: () => void;
}

export const ReplyPreview: React.FC<ReplyPreviewProps> = ({
  message,
  onCancel
}) => {
  const truncateContent = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="reply-preview mb-3 p-3 bg-gray-50 dark:bg-gray-800 border-l-4 border-blue-500 rounded">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
            Replying to {message.sender?.name || 'Unknown'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {truncateContent(message.content)}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="p-1 h-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};