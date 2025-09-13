// src/components/features/messaging/ConversationInfo.tsx

'use client';

import React from 'react';
import { X, Users, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Conversation } from '@/types/app/messaging-types';

interface ConversationInfoProps {
  conversation: Conversation | null;
  onClose?: () => void;
  isMobile?: boolean;
}

export const ConversationInfo: React.FC<ConversationInfoProps> = ({
  conversation,
  onClose,
  isMobile = false
}) => {
  if (!conversation) {
    return (
      <div className="conversation-info h-full flex items-center justify-center p-6 bg-white dark:bg-gray-900">
        <div className="text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No conversation selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Select a conversation to view details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="conversation-info h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Conversation Info
          </h3>
          {isMobile && onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Conversation Details */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Details
          </h4>
          <div className="space-y-3">
            <div>
              <dt className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Type
              </dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">
                {conversation.is_support_conversation ? 'Support' : 'Team Conversation'}
              </dd>
            </div>
            
            {conversation.subject && (
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Subject
                </dt>
                <dd className="text-sm text-gray-900 dark:text-gray-100">
                  {conversation.subject}
                </dd>
              </div>
            )}
            
            <div>
              <dt className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Status
              </dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                {conversation.status}
              </dd>
            </div>
            
            <div>
              <dt className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Created
              </dt>
              <dd className="text-sm text-gray-900 dark:text-gray-100">
                {new Date(conversation.created_at).toLocaleDateString()}
              </dd>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Participants ({conversation.participants.length})
          </h4>
          <div className="space-y-3">
            {conversation.participants.map((participant) => (
              <div key={participant.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                  {participant.team?.avatar_url ? (
                    <img
                      src={participant.team.avatar_url}
                      alt={participant.team.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
                      {participant.team?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {participant.team?.name || 'Unknown Team'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {participant.team?.type || 'Unknown'} • {participant.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            Actions
          </h4>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              View History
            </Button>
            
            {conversation.status === 'active' && (
              <Button variant="outline" size="sm" className="w-full justify-start">
                Archive Conversation
              </Button>
            )}
            
            {conversation.is_support_conversation && (
              <Button variant="outline" size="sm" className="w-full justify-start">
                Close Support Request
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};