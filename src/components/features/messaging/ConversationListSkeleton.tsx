// src/components/features/messaging/ConversationListSkeleton.tsx

'use client';

import React from 'react';

const ConversationCardSkeleton: React.FC = () => (
  <div className="p-3 rounded-lg border border-transparent">
    <div className="flex items-start gap-3">
      {/* Avatar skeleton */}
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
      
      {/* Content skeleton */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Icon skeleton */}
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-shrink-0" />
            {/* Title skeleton */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-1 max-w-32" />
          </div>
          
          {/* Timestamp skeleton */}
          <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-shrink-0" />
        </div>
        
        {/* Subtitle skeleton */}
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse max-w-24" />
      </div>
    </div>
  </div>
);

export const ConversationListSkeleton: React.FC = () => {
  return (
    <div className="conversation-list-skeleton space-y-1 p-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <ConversationCardSkeleton key={index} />
      ))}
    </div>
  );
};