// src/components/features/messaging/ConversationHeader.tsx

'use client';

import React from 'react';
import { ArrowLeft, Info, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Conversation } from '@/types/app/messaging-types';

interface ConversationHeaderProps {
  conversation: Conversation;
  onToggleInfo?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
  isMobile?: boolean;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
  onToggleInfo,
  showBackButton = false,
  onBack,
  isMobile = false
}) => {
  const getConversationTitle = () => {
    if (conversation.subject) {
      return conversation.subject;
    }
    
    // Generate title from participants (excluding current user's team)
    const otherParticipants = conversation.participants.filter(p => 
      p.team?.name !== 'Current Team Name'
    );
    
    if (otherParticipants.length === 1) {
      return otherParticipants[0].team?.name || 'Unknown Team';
    }
    
    return `${otherParticipants.length} teams`;
  };

  const getConversationSubtitle = () => {
    if (conversation.is_support_conversation) {
      return 'Support conversation';
    }
    
    return `${conversation.participants.length} participants`;
  };

  return (
    <div className="conversation-header p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {showBackButton && onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {getConversationTitle()}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getConversationSubtitle()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onToggleInfo && (
            <Button variant="ghost" size="sm" onClick={onToggleInfo}>
              <Info className="w-5 h-5" />
            </Button>
          )}
          
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};