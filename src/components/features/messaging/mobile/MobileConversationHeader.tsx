// src/components/features/messaging/mobile/MobileConversationHeader.tsx

'use client';

import React from 'react';
import { ArrowLeft, MoreVertical, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Conversation } from '@/types/app/messaging-types';

interface MobileConversationHeaderProps {
  conversation: Conversation;
  onBack: () => void;
  onToggleInfo: () => void;
  onMenu?: () => void;
}

export const MobileConversationHeader: React.FC<MobileConversationHeaderProps> = ({
  conversation,
  onBack,
  onToggleInfo,
  onMenu
}) => {
  const getConversationTitle = () => {
    if (conversation.subject) {
      return conversation.subject;
    }
    
    // For team-to-team conversations, show the other team's name
    const otherParticipants = conversation.participants.filter(p => p.team?.type !== 'admin');
    if (otherParticipants.length > 0) {
      return otherParticipants.map(p => p.team?.name).join(', ');
    }
    
    return 'Conversation';
  };

  const getConversationSubtitle = () => {
    if (conversation.is_support_conversation) {
      return 'Support Request';
    }
    
    const participantTypes = conversation.participants
      .map(p => p.team?.type)
      .filter((type, index, arr) => arr.indexOf(type) === index)
      .join(' • ');
    
    return participantTypes;
  };

  return (
    <div className="mobile-conversation-header bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left section - Back button and conversation info */}
        <div className="flex items-center flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-3 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center flex-1 min-w-0">
            {/* Conversation avatar/icon */}
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              {conversation.is_support_conversation ? (
                <span className="text-sm font-semibold text-orange-600">S</span>
              ) : (
                <span className="text-sm font-semibold text-blue-600">
                  {getConversationTitle().charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            {/* Conversation details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                {getConversationTitle()}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {getConversationSubtitle()}
              </p>
            </div>
          </div>
        </div>
        
        {/* Right section - Action buttons */}
        <div className="flex items-center space-x-2 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleInfo}
            className="p-2"
          >
            <Info className="w-5 h-5" />
          </Button>
          
          {onMenu && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenu}
              className="p-2"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Online status indicators for participants */}
      <div className="flex items-center mt-2 space-x-2">
        {conversation.participants.slice(0, 3).map((participant) => (
          <div
            key={participant.id}
            className="flex items-center space-x-1"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {participant.team?.name}
            </span>
          </div>
        ))}
        {conversation.participants.length > 3 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            +{conversation.participants.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
};