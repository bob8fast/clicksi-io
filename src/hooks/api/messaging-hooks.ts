// src/hooks/api/messaging-hooks.ts

import { useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import type {
  Conversation,
  Message,
  ConversationFilters,
  MessageFilters,
  CreateConversationRequest,
  SendMessageRequest,
  CreateSupportRequest,
  UpdateMessageRequest,
  AddReactionRequest,
  TeamType
} from '@/types/app/messaging-types';

/**
 * Messaging hooks with mock implementations
 * Following the pattern from category-hooks.ts
 * TODO: Replace with orval-generated hooks when available
 */
export const useMessagingHooks = () => {
  const queryClient = useQueryClient();
  
  const messagingHooks = {
    // Query hooks for conversations
    getConversations: (filters?: ConversationFilters) => {
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<Error | null>(null);
      
      // Mock implementation with cache configuration
      return {
        data: mockConversations.filter(conv => {
          if (filters?.type && conv.type !== filters.type) return false;
          if (filters?.status && conv.status !== filters.status) return false;
          if (filters?.search) {
            const searchLower = filters.search.toLowerCase();
            return conv.subject?.toLowerCase().includes(searchLower) ||
                   conv.participants.some(p => 
                     p.team?.name.toLowerCase().includes(searchLower)
                   );
          }
          return true;
        }),
        isLoading: loading,
        error,
        refetch: () => {
          console.log('Refetching conversations...');
          return Promise.resolve({ data: mockConversations });
        },
        query: {
          staleTime: 30 * 1000, // 30 seconds
          gcTime: 5 * 60 * 1000, // 5 minutes
          refetchOnWindowFocus: false
        }
      };
    },
    
    // Get specific conversation
    getConversation: (conversationId: string) => {
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<Error | null>(null);
      
      return {
        data: mockConversations.find(c => c.id === conversationId) || null,
        isLoading: loading,
        error,
        query: {
          staleTime: 30 * 1000,
          gcTime: 5 * 60 * 1000,
          enabled: !!conversationId
        }
      };
    },
    
    // Get conversation messages with pagination
    getMessages: (conversationId: string, filters?: MessageFilters) => {
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<Error | null>(null);
      
      let filteredMessages = mockMessages.filter(m => m.conversation_id === conversationId);
      
      // Apply filters
      if (filters?.since) {
        filteredMessages = filteredMessages.filter(m => m.sent_at >= filters.since!);
      }
      if (filters?.until) {
        filteredMessages = filteredMessages.filter(m => m.sent_at <= filters.until!);
      }
      if (filters?.limit) {
        filteredMessages = filteredMessages.slice(0, filters.limit);
      }
      
      return {
        data: filteredMessages,
        isLoading: loading,
        error,
        hasNextPage: false, // Mock pagination
        fetchNextPage: () => {
          console.log('Fetching next page of messages...');
          return Promise.resolve({ data: [] });
        },
        query: {
          staleTime: 10 * 1000, // 10 seconds
          gcTime: 2 * 60 * 1000, // 2 minutes
          enabled: !!conversationId
        }
      };
    },
    
    // Mutation hooks
    createConversation: () => {
      return {
        mutate: useCallback((data: CreateConversationRequest) => {
          console.log('Creating conversation:', data);
          // Mock API call
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
          }, 1000);
        }, [queryClient]),
        isLoading: false,
        error: null,
        mutation: {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
          },
          onError: (error: Error) => {
            console.error('Failed to create conversation:', error);
          }
        }
      };
    },
    
    sendMessage: () => {
      return {
        mutate: useCallback((data: { conversationId: string } & SendMessageRequest) => {
          console.log('Sending message:', data);
          
          // Create optimistic message
          const optimisticMessage: Message = {
            id: `temp-${Date.now()}`,
            conversation_id: data.conversationId,
            sender_user_id: 'current-user-id',
            content: data.content,
            parent_message_id: data.parent_message_id,
            status: 'sent',
            sent_at: new Date().toISOString(),
            reactions: [],
            reaction_count: 0,
            sender: {
              id: 'current-user-id',
              name: 'Current User',
              avatar_url: '/avatars/current-user.jpg',
              team_id: 'current-team-id',
              team_name: 'Current Team'
            }
          };
          
          // Add to mock data for immediate UI update
          mockMessages.push(optimisticMessage);
          
          // Mock API success
          setTimeout(() => {
            queryClient.invalidateQueries({ 
              queryKey: ['messages', data.conversationId] 
            });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
          }, 500);
        }, [queryClient]),
        isLoading: false,
        error: null,
        mutation: {
          onSuccess: () => {
            // Cache invalidation handled in mutate function
          },
          onError: (error: Error) => {
            console.error('Failed to send message:', error);
          }
        }
      };
    },
    
    createSupportConversation: () => {
      return {
        mutate: useCallback((data: CreateSupportRequest) => {
          console.log('Creating support request:', data);
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
          }, 1000);
        }, [queryClient]),
        isLoading: false,
        error: null,
        mutation: {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
          }
        }
      };
    },
    
    addReaction: () => {
      return {
        mutate: useCallback((data: { messageId: string; emoji: string }) => {
          console.log('Adding reaction:', data);
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
          }, 200);
        }, [queryClient]),
        isLoading: false,
        error: null,
        mutation: {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
          }
        }
      };
    },
    
    editMessage: () => {
      return {
        mutate: useCallback((data: { messageId: string; content: string }) => {
          console.log('Editing message:', data);
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
          }, 500);
        }, [queryClient]),
        isLoading: false,
        error: null,
        mutation: {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
          }
        }
      };
    },
    
    deleteMessage: () => {
      return {
        mutate: useCallback((messageId: string) => {
          console.log('Deleting message:', messageId);
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
          }, 500);
        }, [queryClient]),
        isLoading: false,
        error: null,
        mutation: {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
          }
        }
      };
    },
    
    // Cache management utilities
    invalidateCache: {
      conversations: () => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      },
      messages: (conversationId?: string) => {
        if (conversationId) {
          queryClient.invalidateQueries({ 
            queryKey: ['messages', conversationId] 
          });
        } else {
          queryClient.invalidateQueries({ queryKey: ['messages'] });
        }
      },
      all: () => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        queryClient.invalidateQueries({ queryKey: ['messages'] });
      }
    },
    
    // Cache prefetching utilities
    prefetchConversations: async (filters?: ConversationFilters) => {
      return queryClient.prefetchQuery({
        queryKey: ['conversations', filters],
        queryFn: () => Promise.resolve(mockConversations),
        staleTime: 30 * 1000
      });
    },
    
    prefetchMessages: async (conversationId: string) => {
      return queryClient.prefetchQuery({
        queryKey: ['messages', conversationId],
        queryFn: () => Promise.resolve(
          mockMessages.filter(m => m.conversation_id === conversationId)
        ),
        staleTime: 10 * 1000
      });
    }
  };
  
  return messagingHooks;
};

// Mock data for development
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'team_to_team',
    status: 'active',
    subject: 'Partnership Discussion',
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-02-02T15:30:00Z',
    last_message_at: '2025-02-02T15:30:00Z',
    created_by_user_id: 'user-1',
    created_by_team_id: 'team-creator-1',
    unread_count: 2,
    is_support_conversation: false,
    participants: [
      {
        id: 'part-1',
        conversation_id: 'conv-1',
        team_id: 'team-creator-1',
        role: 'participant',
        joined_at: '2025-02-01T10:00:00Z',
        team: {
          id: 'team-creator-1',
          name: 'Beauty Influencer Co.',
          type: 'creator',
          avatar_url: '/avatars/creator-1.jpg'
        }
      },
      {
        id: 'part-2',
        conversation_id: 'conv-1',
        team_id: 'team-brand-1',
        role: 'participant',
        joined_at: '2025-02-01T10:00:00Z',
        team: {
          id: 'team-brand-1',
          name: 'Ukrainian Cosmetics Brand',
          type: 'brand',
          avatar_url: '/avatars/brand-1.jpg'
        }
      }
    ]
  },
  {
    id: 'conv-2',
    type: 'support',
    status: 'active',
    subject: 'Payment Issue',
    created_at: '2025-02-02T09:00:00Z',
    updated_at: '2025-02-02T14:00:00Z',
    last_message_at: '2025-02-02T14:00:00Z',
    created_by_user_id: 'user-2',
    created_by_team_id: 'team-retailer-1',
    unread_count: 1,
    is_support_conversation: true,
    participants: [
      {
        id: 'part-3',
        conversation_id: 'conv-2',
        team_id: 'team-retailer-1',
        role: 'participant',
        joined_at: '2025-02-02T09:00:00Z',
        team: {
          id: 'team-retailer-1',
          name: 'Makeup Retailer Ltd.',
          type: 'retailer',
          avatar_url: '/avatars/retailer-1.jpg'
        }
      },
      {
        id: 'part-4',
        conversation_id: 'conv-2',
        team_id: 'team-admin',
        role: 'support',
        joined_at: '2025-02-02T10:00:00Z',
        team: {
          id: 'team-admin',
          name: 'Clicksi Support',
          type: 'admin',
          avatar_url: '/avatars/admin.jpg'
        }
      }
    ]
  },
  {
    id: 'conv-3',
    type: 'team_to_team',
    status: 'active',
    subject: 'Product Collaboration',
    created_at: '2025-02-01T14:00:00Z',
    updated_at: '2025-02-02T11:20:00Z',
    last_message_at: '2025-02-02T11:20:00Z',
    created_by_user_id: 'user-3',
    created_by_team_id: 'team-brand-2',
    unread_count: 0,
    is_support_conversation: false,
    participants: [
      {
        id: 'part-5',
        conversation_id: 'conv-3',
        team_id: 'team-brand-2',
        role: 'participant',
        joined_at: '2025-02-01T14:00:00Z',
        team: {
          id: 'team-brand-2',
          name: 'Organic Beauty Co.',
          type: 'brand',
          avatar_url: '/avatars/brand-2.jpg'
        }
      },
      {
        id: 'part-6',
        conversation_id: 'conv-3',
        team_id: 'team-retailer-2',
        role: 'participant',
        joined_at: '2025-02-01T14:00:00Z',
        team: {
          id: 'team-retailer-2',
          name: 'Premium Beauty Store',
          type: 'retailer',
          avatar_url: '/avatars/retailer-2.jpg'
        }
      }
    ]
  }
];

let mockMessages: Message[] = [
  {
    id: 'msg-1',
    conversation_id: 'conv-1',
    sender_user_id: 'user-1',
    content: 'Hi! We\'d love to discuss a potential partnership with your brand. Our audience would be perfect for your new skincare line.',
    status: 'sent',
    sent_at: '2025-02-01T10:00:00Z',
    reactions: [],
    reaction_count: 0,
    sender: {
      id: 'user-1',
      name: 'Anna Kovalenko',
      avatar_url: '/avatars/user-1.jpg',
      team_id: 'team-creator-1',
      team_name: 'Beauty Influencer Co.'
    }
  },
  {
    id: 'msg-2',
    conversation_id: 'conv-1',
    sender_user_id: 'user-2',
    content: 'That sounds great! We\'re always looking for talented creators to collaborate with. What\'s your typical reach?',
    status: 'sent',
    sent_at: '2025-02-01T14:30:00Z',
    reactions: [
      {
        id: 'react-1',
        message_id: 'msg-2',
        user_id: 'user-1',
        emoji: '👍',
        created_at: '2025-02-01T14:31:00Z',
        user: {
          id: 'user-1',
          name: 'Anna Kovalenko',
          avatar_url: '/avatars/user-1.jpg'
        }
      }
    ],
    reaction_count: 1,
    sender: {
      id: 'user-2',
      name: 'Oksana Petrenko',
      avatar_url: '/avatars/user-2.jpg',
      team_id: 'team-brand-1',
      team_name: 'Ukrainian Cosmetics Brand'
    }
  },
  {
    id: 'msg-3',
    conversation_id: 'conv-1',
    sender_user_id: 'user-1',
    content: 'We reach about 150K followers on Instagram and 80K on TikTok. Our engagement rate is around 4.5%.',
    status: 'sent',
    sent_at: '2025-02-02T15:30:00Z',
    reactions: [],
    reaction_count: 0,
    sender: {
      id: 'user-1',
      name: 'Anna Kovalenko',
      avatar_url: '/avatars/user-1.jpg',
      team_id: 'team-creator-1',
      team_name: 'Beauty Influencer Co.'
    }
  },
  {
    id: 'msg-4',
    conversation_id: 'conv-2',
    sender_user_id: 'user-3',
    content: 'We\'re experiencing issues with commission payouts for the last month. The payments seem to be delayed.',
    status: 'sent',
    sent_at: '2025-02-02T09:00:00Z',
    reactions: [],
    reaction_count: 0,
    sender: {
      id: 'user-3',
      name: 'Mikhail Volkov',
      avatar_url: '/avatars/user-3.jpg',
      team_id: 'team-retailer-1',
      team_name: 'Makeup Retailer Ltd.'
    }
  },
  {
    id: 'msg-5',
    conversation_id: 'conv-2',
    sender_user_id: 'admin-1',
    content: 'Thank you for reaching out. I\'ve looked into your account and I can see the delay. We had a system update that affected some payments. I\'ll process your payout manually today.',
    status: 'sent',
    sent_at: '2025-02-02T14:00:00Z',
    reactions: [
      {
        id: 'react-2',
        message_id: 'msg-5',
        user_id: 'user-3',
        emoji: '🙏',
        created_at: '2025-02-02T14:01:00Z',
        user: {
          id: 'user-3',
          name: 'Mikhail Volkov',
          avatar_url: '/avatars/user-3.jpg'
        }
      }
    ],
    reaction_count: 1,
    sender: {
      id: 'admin-1',
      name: 'Support Team',
      avatar_url: '/avatars/admin.jpg',
      team_id: 'team-admin',
      team_name: 'Clicksi Support'
    }
  }
];