// src/components/features/messaging/ConversationView.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversationHeader } from './ConversationHeader';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';
import { ReplyPreview } from './ReplyPreview';
import { MessageListSkeleton } from './MessageListSkeleton';
import type { ConversationViewProps, Message } from '@/types/app/messaging-types';

export const ConversationView: React.FC<ConversationViewProps> = ({
  conversation,
  messages,
  onSendMessage,
  onReaction,
  onEdit,
  onDelete,
  loading = false,
  showBackButton = false,
  onBack,
  showMenuButton = false,
  onMenu,
  onToggleInfo,
  isMobile = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const currentUserId = 'current-user-id'; // In real app, get from session
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message permissions
  const hasEditPermission = (message: Message) => {
    return message.sender_user_id === currentUserId;
  };

  const hasDeletePermission = (message: Message) => {
    return message.sender_user_id === currentUserId;
  };

  const hasMessagePermission = (conversation: any) => {
    return conversation && conversation.status === 'active';
  };

  const getComposerPlaceholder = (conversation: any) => {
    if (!conversation) return '';
    
    if (conversation.is_support_conversation) {
      return 'Describe your issue or ask for help...';
    }
    
    return 'Type your message...';
  };

  // Event handlers
  const handleSendMessage = (content: string) => {
    onSendMessage(content, replyingTo?.id);
    setReplyingTo(null);
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
    setEditingMessage(null);
  };

  const handleEdit = (message: Message) => {
    setEditingMessage(message);
    setReplyingTo(null);
  };

  const handleEditSubmit = (content: string) => {
    if (editingMessage) {
      onEdit(editingMessage.id, content);
      setEditingMessage(null);
    }
  };

  const handleEditCancel = () => {
    setEditingMessage(null);
  };

  if (!conversation) {
    return (
      <div className="conversation-view-empty flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          {isMobile && showMenuButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onMenu}
              className="absolute top-4 left-4"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {isMobile ? 'No conversation selected' : 'Select a conversation'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {isMobile 
              ? 'Tap the menu to view your conversations'
              : 'Choose a conversation from the sidebar to start messaging'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="conversation-view flex-1 flex flex-col h-full">
      {/* Mobile-responsive conversation header */}
      <ConversationHeader 
        conversation={conversation}
        onToggleInfo={onToggleInfo}
        showBackButton={showBackButton}
        onBack={onBack}
        isMobile={isMobile}
      />
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <MessageListSkeleton />
        ) : (
          <>
            {messages.map((message, index) => {
              const showAvatar = index === 0 || 
                messages[index - 1].sender_user_id !== message.sender_user_id;
              
              const isOwn = message.sender_user_id === currentUserId;
              
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  showAvatar={showAvatar}
                  isOwn={isOwn}
                  onReaction={(emoji) => onReaction(message.id, emoji)}
                  onReply={() => handleReply(message)}
                  onEdit={hasEditPermission(message) ? 
                    () => handleEdit(message) : undefined
                  }
                  onDelete={hasDeletePermission(message) ? 
                    () => onDelete(message.id) : undefined
                  }
                  isMobile={isMobile}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Message composer area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        {replyingTo && (
          <ReplyPreview 
            message={replyingTo}
            onCancel={() => setReplyingTo(null)}
          />
        )}
        
        {editingMessage ? (
          <MessageComposer
            onSend={handleEditSubmit}
            placeholder="Edit your message..."
            disabled={!hasMessagePermission(conversation)}
            isMobile={isMobile}
            initialValue={editingMessage.content}
            isEditing={true}
            onCancel={handleEditCancel}
          />
        ) : (
          <MessageComposer
            onSend={handleSendMessage}
            placeholder={getComposerPlaceholder(conversation)}
            replyToMessage={replyingTo}
            disabled={!hasMessagePermission(conversation)}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
};