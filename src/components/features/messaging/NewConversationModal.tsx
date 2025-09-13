// src/components/features/messaging/NewConversationModal.tsx

'use client';

import React, { useState } from 'react';
import { X, Search, Users, Building, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMessagingHooks } from '@/hooks/api/messaging-hooks';
import type { CreateConversationRequest, TeamType } from '@/types/app/messaging-types';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationCreated?: (conversationId: string) => void;
}

interface TeamOption {
  id: string;
  name: string;
  type: TeamType;
  avatar_url?: string;
  description?: string;
}

// Mock teams for demonstration
const MOCK_TEAMS: TeamOption[] = [
  {
    id: 'team-brand-1',
    name: 'Ukrainian Cosmetics Brand',
    type: 'brand',
    description: 'Premium beauty products from Ukraine'
  },
  {
    id: 'team-brand-2',
    name: 'Kyiv Beauty Co.',
    type: 'brand',
    description: 'Sustainable skincare solutions'
  },
  {
    id: 'team-retailer-1',
    name: 'Beauty Store Network',
    type: 'retailer',
    description: 'Multi-location beauty retailer'
  },
  {
    id: 'team-creator-1',
    name: 'Beauty Influencer Studio',
    type: 'creator',
    description: 'Content creation team specializing in beauty'
  },
  {
    id: 'team-creator-2',
    name: 'Makeup Artistry Collective',
    type: 'creator',
    description: 'Professional makeup artists and educators'
  }
];

export const NewConversationModal: React.FC<NewConversationModalProps> = ({
  isOpen,
  onClose,
  onConversationCreated
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<TeamOption | null>(null);
  const [subject, setSubject] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const messagingHooks = useMessagingHooks();
  const { mutate: createConversation } = messagingHooks.createConversation();

  // Filter teams based on search query
  const filteredTeams = MOCK_TEAMS.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTeamIcon = (type: TeamType) => {
    switch (type) {
      case 'brand':
        return Building;
      case 'retailer':
        return Store;
      case 'creator':
        return Users;
      default:
        return Users;
    }
  };

  const getTeamColor = (type: TeamType) => {
    switch (type) {
      case 'brand':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'retailer':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'creator':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const handleCreateConversation = async () => {
    if (!selectedTeam || !initialMessage.trim()) return;

    setIsCreating(true);
    
    try {
      const request: CreateConversationRequest = {
        target_team_id: selectedTeam.id,
        subject: subject.trim() || undefined,
        initial_message: initialMessage.trim()
      };

      createConversation(request);
      
      // Mock success - in real implementation, this would come from the mutation's onSuccess
      setTimeout(() => {
        const mockConversationId = `conv-${Date.now()}`;
        onConversationCreated?.(mockConversationId);
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedTeam(null);
    setSubject('');
    setInitialMessage('');
    setIsCreating(false);
    onClose();
  };

  const canCreate = selectedTeam && initialMessage.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Team Selection */}
          {!selectedTeam ? (
            <>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Team List */}
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-2">
                  {filteredTeams.map((team) => {
                    const IconComponent = getTeamIcon(team.type);
                    const colorClasses = getTeamColor(team.type);
                    
                    return (
                      <button
                        key={team.id}
                        onClick={() => setSelectedTeam(team)}
                        className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                              {team.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {team.description}
                            </p>
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded mt-1 capitalize">
                              {team.type}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {filteredTeams.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No teams found matching your search.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Selected Team Display */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTeamColor(selectedTeam.type)}`}>
                      {React.createElement(getTeamIcon(selectedTeam.type), { className: "w-5 h-5" })}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedTeam.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedTeam.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTeam(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject (optional)
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What's this conversation about?"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Initial Message */}
              <div className="flex-1 flex flex-col">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={4}
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {initialMessage.length}/1000 characters
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={handleClose} disabled={isCreating}>
            Cancel
          </Button>
          {selectedTeam && (
            <Button 
              onClick={handleCreateConversation}
              disabled={!canCreate || isCreating}
              className="min-w-[100px]"
            >
              {isCreating ? 'Creating...' : 'Start Chat'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};