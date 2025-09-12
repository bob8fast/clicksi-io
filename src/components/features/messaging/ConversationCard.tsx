// src/components/features/messaging/ConversationCard.tsx

'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Users, Headphones } from 'lucide-react';
import type { Conversation } from '@/types/app/messaging-types';

interface ConversationCardProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  isMobile?: boolean;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  isActive,
  onClick,
  isMobile = false
}) => {
  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  const getConversationTitle = () => {
    if (conversation.subject) {
      return conversation.subject;
    }
    
    // Generate title from participants (excluding current user's team)
    const otherParticipants = conversation.participants.filter(p => 
      // In a real app, we'd filter out current user's team
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
    
    const teamTypes = conversation.participants
      .map(p => p.team?.type)
      .filter(Boolean)
      .join(' • ');
    
    return teamTypes || 'Team conversation';
  };

  const getConversationIcon = () => {
    if (conversation.is_support_conversation) {
      return <Headphones className="w-4 h-4" />;
    }
    
    if (conversation.participants.length > 2) {
      return <Users className="w-4 h-4" />;
    }
    
    return <MessageCircle className="w-4 h-4" />;
  };

  const getAvatarDisplay = () => {
    const otherParticipants = conversation.participants.filter(p => 
      // In a real app, we'd filter out current user's team
      p.team?.name !== 'Current Team Name'
    );

    if (otherParticipants.length === 1) {
      const participant = otherParticipants[0];
      return (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
          {participant.team?.avatar_url ? (
            <img
              src={participant.team.avatar_url}
              alt={participant.team.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              {participant.team?.name?.[0]?.toUpperCase() || '?'}
            </div>
          )}
        </div>
      );
    }

    // Multiple participants - show stacked avatars
    return (
      <div className="relative w-10 h-10 flex-shrink-0">
        {otherParticipants.slice(0, 2).map((participant, index) => (
          <div
            key={participant.id}
            className={`absolute w-7 h-7 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 ${
              index === 0 ? 'top-0 left-0' : 'bottom-0 right-0'
            }`}
          >
            {participant.team?.avatar_url ? (
              <img
                src={participant.team.avatar_url}
                alt={participant.team.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                {participant.team?.name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`
        conversation-card p-3 rounded-lg cursor-pointer transition-all duration-200
        ${isActive 
          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
          : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
        }
        ${isMobile ? 'active:bg-gray-100 dark:active:bg-gray-700' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {getAvatarDisplay()}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`
                text-gray-400 dark:text-gray-500 flex-shrink-0
                ${conversation.is_support_conversation ? 'text-amber-500' : ''}
              `}>
                {getConversationIcon()}
              </div>
              <h3 className={`
                text-sm font-medium truncate
                ${isActive 
                  ? 'text-blue-900 dark:text-blue-100' 
                  : 'text-gray-900 dark:text-gray-100'
                }
              `}>
                {getConversationTitle()}
              </h3>
            </div>
            
            {/* Timestamp and unread badge */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {conversation.last_message_at 
                  ? formatTimeAgo(conversation.last_message_at)
                  : formatTimeAgo(conversation.updated_at)
                }
              </span>
              {conversation.unread_count && conversation.unread_count > 0 && (
                <div className="w-5 h-5 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                </div>
              )}
            </div>
          </div>
          
          {/* Subtitle */}
          <p className={`
            text-xs truncate
            ${isActive 
              ? 'text-blue-700 dark:text-blue-300' 
              : 'text-gray-500 dark:text-gray-400'
            }
          `}>
            {getConversationSubtitle()}
          </p>
          
          {/* Status indicator */}
          {conversation.status !== 'active' && (
            <div className="mt-1">
              <span className={`
                inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                ${conversation.status === 'archived' 
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }
              `}>
                {conversation.status}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};