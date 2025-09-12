// src/components/features/messaging/MessageListSkeleton.tsx

'use client';

import React from 'react';

const MessageBubbleSkeleton: React.FC<{ isOwn?: boolean }> = ({ isOwn = false }) => (
  <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
    {/* Avatar skeleton */}
    {!isOwn && (
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
    )}
    
    {/* Message content skeleton */}
    <div className={`flex-1 max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
      {/* Sender name skeleton */}
      <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
      </div>
      
      {/* Message bubble skeleton */}
      <div className={`
        ${isOwn 
          ? 'bg-gray-200 dark:bg-gray-700' 
          : 'bg-gray-100 dark:bg-gray-800'
        }
        rounded-lg px-4 py-2 animate-pulse
        ${Math.random() > 0.5 ? 'w-48' : 'w-64'}
        h-12
      `} />
    </div>
  </div>
);

export const MessageListSkeleton: React.FC = () => {
  return (
    <div className="message-list-skeleton space-y-4">
      <MessageBubbleSkeleton />
      <MessageBubbleSkeleton isOwn />
      <MessageBubbleSkeleton />
      <MessageBubbleSkeleton />
      <MessageBubbleSkeleton isOwn />
      <MessageBubbleSkeleton />
    </div>
  );
};