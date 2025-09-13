// src/components/features/messaging/EmptyConversationState.tsx

'use client';

import React from 'react';
import { MessageCircle, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyConversationStateProps {
  canCreate: boolean;
  searchQuery: string;
  filterType: 'all' | 'team' | 'support';
  onCreateConversation?: () => void;
}

export const EmptyConversationState: React.FC<EmptyConversationStateProps> = ({
  canCreate,
  searchQuery,
  filterType,
  onCreateConversation
}) => {
  const isSearching = searchQuery.length > 0;
  const isFiltering = filterType !== 'all';

  const getTitle = () => {
    if (isSearching) {
      return 'No conversations found';
    }
    
    if (isFiltering) {
      return filterType === 'support' 
        ? 'No support conversations' 
        : 'No team conversations';
    }
    
    return 'No conversations yet';
  };

  const getDescription = () => {
    if (isSearching) {
      return `No conversations match "${searchQuery}". Try adjusting your search terms.`;
    }
    
    if (isFiltering) {
      return filterType === 'support'
        ? 'You haven\'t created any support requests yet.'
        : 'You don\'t have any team conversations yet.';
    }
    
    return 'Start a conversation with another team or create a support request.';
  };

  const getIcon = () => {
    if (isSearching) {
      return <Search className="w-12 h-12 text-gray-400" />;
    }
    
    return <MessageCircle className="w-12 h-12 text-gray-400" />;
  };

  const showCreateButton = canCreate && !isSearching;

  return (
    <div className="empty-conversation-state flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="mb-4">
        {getIcon()}
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {getTitle()}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
        {getDescription()}
      </p>
      
      {showCreateButton && (
        <div className="space-y-3">
          <Button onClick={onCreateConversation} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Start Conversation
          </Button>
          
          <div className="text-xs text-gray-400 dark:text-gray-500">
            You can also create support requests for help
          </div>
        </div>
      )}
      
      {isSearching && (
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-4">
          <p>Try searching for:</p>
          <ul className="mt-2 space-y-1">
            <li>• Team names</li>
            <li>• Conversation subjects</li>
            <li>• Keywords from messages</li>
          </ul>
        </div>
      )}
    </div>
  );
};