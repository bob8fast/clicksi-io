// src/components/features/messaging/MessagingDashboard.tsx

'use client';

import React, { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react'; // Removed auth
import { useDeviceDetection } from '@/hooks/system/use-device-detection';
import { useMessagingHooks } from '@/hooks/api/messaging-hooks';
import { MessagingLayout } from './MessagingLayout';
import { ConversationSidebar } from './ConversationSidebar';
import { ConversationView } from './ConversationView';
import { ConversationInfo } from './ConversationInfo';
import type { 
  MessagingDashboardProps, 
  Conversation, 
  Message,
  ViewMode 
} from '@/types/app/messaging-types';

export const MessagingDashboard: React.FC<MessagingDashboardProps> = ({
  userRole,
  teamId,
  teamType,
  initialConversationId,
  supportMode = false
}) => {
  const { data: session } = useSession();
  const { isMobile, isTablet } = useDeviceDetection();
  const messagingHooks = useMessagingHooks();
  
  // State management
  const [activeConversationId, setActiveConversationId] = useState<string>(initialConversationId);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  // Data fetching
  const { data: conversations = [], isLoading: conversationsLoading } = 
    messagingHooks.getConversations();
  
  const { data: activeConversation } = 
    messagingHooks.getConversation(activeConversationId || '');
    
  const { data: messages = [], isLoading: messagesLoading } = 
    messagingHooks.getMessages(activeConversationId || '');
  
  // Mutation hooks
  const { mutate: sendMessage } = messagingHooks.sendMessage();
  const { mutate: addReaction } = messagingHooks.addReaction();
  const { mutate: editMessage } = messagingHooks.editMessage();
  const { mutate: deleteMessage } = messagingHooks.deleteMessage();
  
  // Permission checks
  const hasMessagingAccess = () => {
    return session?.user_info?.permissions?.includes('GeneralTeamPermissions.ViewDashboard');
  };
  
  const canCreateConversations = () => {
    return hasMessagingAccess() && teamId;
  };
  
  // Layout mode calculation
  const getViewMode = (): ViewMode => {
    if (isMobile) {
      if (!activeConversationId) return 'conversations-only';
      if (showInfo) return 'info-only';
      return 'conversation-only';
    }
    
    if (isTablet) {
      if (showInfo) return 'conversation-info';
      return 'conversations-conversation';
    }
    
    return 'full-layout';
  };
  
  const currentViewMode = getViewMode();
  
  // Event handlers
  const handleConversationSelect = (id: string) => {
    setActiveConversationId(id);
    if (isMobile) {
      setShowSidebar(false);
    }
  };
  
  const handleBack = () => {
    if (isMobile) {
      setActiveConversationId(undefined);
    } else {
      setShowSidebar(true);
    }
  };
  
  const handleSendMessage = (content: string, parentId?: string) => {
    if (!activeConversationId) return;
    
    sendMessage({
      conversationId: activeConversationId,
      content,
      parent_message_id: parentId
    });
  };
  
  const handleReaction = (messageId: string, emoji: string) => {
    addReaction({ messageId, emoji });
  };
  
  const handleEditMessage = (messageId: string, content: string) => {
    editMessage({ messageId, content });
  };
  
  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
  };
  
  // Auto-hide sidebar on mobile when conversation is selected
  useEffect(() => {
    if (isMobile && activeConversationId) {
      setShowSidebar(false);
    }
  }, [isMobile, activeConversationId]);
  
  // Check permissions
  if (!hasMessagingAccess()) {
    return (
      <div className="messaging-dashboard flex items-center justify-center h-full">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m4-9V6a3 3 0 00-3-3H5a3 3 0 00-3 3v6a3 3 0 003 3h4m4-9V6a3 3 0 013-3h4a3 3 0 013 3v6a3 3 0 01-3 3h-4m-4-9v9" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            You need messaging permissions to access this feature. Please contact your team administrator.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="messaging-dashboard h-full relative">
      {/* Mobile overlay backdrops */}
      {isMobile && showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      
      {isMobile && showInfo && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowInfo(false)}
        />
      )}
      
      <MessagingLayout
        showRightPanel={showInfo && !!activeConversation}
        sidebar={
          <div className={`
            ${isMobile 
              ? `transform transition-transform duration-300 ${
                  showSidebar ? 'translate-x-0' : '-translate-x-full'
                }`
              : ''
            }
            ${currentViewMode === 'info-only' || 
              (isTablet && currentViewMode === 'conversation-info') ? 'hidden' : 'block'
            }
            h-full
          `}>
            <ConversationSidebar
              conversations={conversations}
              activeConversationId={activeConversationId}
              onConversationSelect={handleConversationSelect}
              canCreateConversations={canCreateConversations()}
              loading={conversationsLoading}
              onClose={isMobile ? () => setShowSidebar(false) : undefined}
              isMobile={isMobile}
            />
          </div>
        }
        rightPanel={
          <div className={`
            ${isMobile 
              ? `transform transition-transform duration-300 ${
                  showInfo ? 'translate-x-0' : 'translate-x-full'
                }`
              : ''
            }
            h-full
          `}>
            <ConversationInfo
              conversation={activeConversation || null}
              onClose={isMobile ? () => setShowInfo(false) : undefined}
              isMobile={isMobile}
            />
          </div>
        }
      >
        {/* Main conversation view */}
        <div className={`
          h-full
          ${currentViewMode === 'conversations-only' ? 'hidden' : 'block'}
        `}>
          <ConversationView
            conversation={activeConversation || null}
            messages={messages}
            onSendMessage={handleSendMessage}
            onReaction={handleReaction}
            onEdit={handleEditMessage}
            onDelete={handleDeleteMessage}
            loading={messagesLoading}
            showBackButton={isMobile}
            onBack={handleBack}
            showMenuButton={isMobile && !activeConversationId}
            onMenu={() => setShowSidebar(true)}
            onToggleInfo={() => setShowInfo(!showInfo)}
            isMobile={isMobile}
          />
        </div>
      </MessagingLayout>
    </div>
  );
};