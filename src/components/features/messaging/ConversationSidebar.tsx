// src/components/features/messaging/ConversationSidebar.tsx

'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversationCard } from './ConversationCard';
import { EmptyConversationState } from './EmptyConversationState';
import { ConversationListSkeleton } from './ConversationListSkeleton';
import type { ConversationSidebarProps } from '@/types/app/messaging-types';

const FilterTab: React.FC<{
  active: boolean;
  onClick: () => void;
  label: string;
}> = ({ active, onClick, label }) => (
  <button
    className={`
      flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors
      ${active 
        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' 
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
      }
    `}
    onClick={onClick}
  >
    {label}
  </button>
);

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  activeConversationId,
  onConversationSelect,
  canCreateConversations,
  loading = false,
  onClose,
  isMobile = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'team' | 'support'>('all');
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      const matchesSearch = !searchQuery || 
        conv.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.participants.some(p => 
          p.team?.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      const matchesFilter = filterType === 'all' || 
        (filterType === 'support' && conv.is_support_conversation) ||
        (filterType === 'team' && !conv.is_support_conversation);
      
      return matchesSearch && matchesFilter;
    });
  }, [conversations, searchQuery, filterType]);

  return (
    <div className="conversation-sidebar h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header with mobile close button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isMobile && onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Messages
            </h2>
          </div>
          {canCreateConversations && (
            <Button 
              size="sm" 
              onClick={() => setShowNewConversationModal(true)}
              className="flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
        
        {/* Filter tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <FilterTab 
            active={filterType === 'all'} 
            onClick={() => setFilterType('all')}
            label="All"
          />
          <FilterTab 
            active={filterType === 'team'} 
            onClick={() => setFilterType('team')}
            label="Teams"
          />
          <FilterTab 
            active={filterType === 'support'} 
            onClick={() => setFilterType('support')}
            label="Support"
          />
        </div>
      </div>
      
      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <ConversationListSkeleton />
        ) : filteredConversations.length > 0 ? (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onClick={() => onConversationSelect(conversation.id)}
                isMobile={isMobile}
              />
            ))}
          </div>
        ) : (
          <EmptyConversationState 
            canCreate={canCreateConversations}
            searchQuery={searchQuery}
            filterType={filterType}
            onCreateConversation={() => setShowNewConversationModal(true)}
          />
        )}
      </div>
      
      {/* New Conversation Modal - Placeholder */}
      {showNewConversationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                New Conversation
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowNewConversationModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              New conversation modal will be implemented in a future update.
            </p>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowNewConversationModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setShowNewConversationModal(false)}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};