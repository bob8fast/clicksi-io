// src/components/features/messaging/MessageBubble.tsx

'use client';

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Reply, Edit3, Trash2, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageReactions } from './MessageReactions';
import type { MessageBubbleProps } from '@/types/app/messaging-types';

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar,
  onReaction,
  onReply,
  onEdit,
  onDelete,
  isMobile = false
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const quickReactions = ['👍', '❤️', '😊', '😮', '😢', '😡'];

  return (
    <div className={`message-bubble flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
          {message.sender?.avatar_url ? (
            <img
              src={message.sender.avatar_url}
              alt={message.sender.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
              {message.sender?.name?.[0]?.toUpperCase() || '?'}
            </div>
          )}
        </div>
      )}
      
      {/* Spacer for alignment when no avatar */}
      {!showAvatar && !isOwn && (
        <div className="w-8 flex-shrink-0" />
      )}

      {/* Message content */}
      <div className={`flex-1 max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Sender name and timestamp */}
        {showAvatar && (
          <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {isOwn ? 'You' : message.sender?.name || 'Unknown'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTimeAgo(message.sent_at)}
            </span>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`
            relative group
            ${isOwn 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
            }
            ${isMobile ? 'max-w-[280px]' : 'max-w-md'}
            rounded-lg px-4 py-2 break-words
            ${message.status === 'edited' ? 'border-l-2 border-amber-400' : ''}
          `}
          onMouseEnter={() => !isMobile && setShowActions(true)}
          onMouseLeave={() => !isMobile && setShowActions(false)}
        >
          {/* Reply indicator */}
          {message.parent_message_id && (
            <div className={`text-xs mb-2 opacity-75 ${isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
              Replying to a message
            </div>
          )}

          {/* Message content */}
          <div className="whitespace-pre-wrap">{message.content}</div>

          {/* Edited indicator */}
          {message.status === 'edited' && (
            <div className={`text-xs mt-1 opacity-75 ${isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
              (edited)
            </div>
          )}

          {/* Message actions */}
          {(showActions || isMobile) && (
            <div className={`
              absolute top-0 flex items-center gap-1
              ${isOwn ? 'right-full mr-2' : 'left-full ml-2'}
              ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
              transition-opacity
            `}>
              {/* Reaction button */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white dark:bg-gray-800 shadow-sm border"
                onClick={() => setShowReactionPicker(!showReactionPicker)}
              >
                <Smile className="w-4 h-4" />
              </Button>

              {/* Reply button */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white dark:bg-gray-800 shadow-sm border"
                onClick={onReply}
              >
                <Reply className="w-4 h-4" />
              </Button>

              {/* Edit/Delete buttons for own messages */}
              {isOwn && (
                <>
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white dark:bg-gray-800 shadow-sm border"
                      onClick={onEdit}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white dark:bg-gray-800 shadow-sm border text-red-500 hover:text-red-600"
                      onClick={onDelete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </>
              )}

              {/* More actions */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white dark:bg-gray-800 shadow-sm border"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Quick reaction picker */}
          {showReactionPicker && (
            <div className={`
              absolute z-10 flex items-center gap-1 p-2 bg-white dark:bg-gray-800 border rounded-lg shadow-lg
              ${isOwn ? 'right-0 top-full mt-1' : 'left-0 top-full mt-1'}
            `}>
              {quickReactions.map((emoji) => (
                <button
                  key={emoji}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  onClick={() => {
                    onReaction(emoji);
                    setShowReactionPicker(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message reactions */}
        {message.reactions.length > 0 && (
          <div className={`mt-1 ${isOwn ? 'self-end' : 'self-start'}`}>
            <MessageReactions
              reactions={message.reactions}
              onReaction={onReaction}
              currentUserId="current-user-id" // In real app, get from session
            />
          </div>
        )}
      </div>

      {/* Backdrop for reaction picker */}
      {showReactionPicker && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowReactionPicker(false)}
        />
      )}
    </div>
  );
};