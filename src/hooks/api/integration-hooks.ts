// hooks/api/integration-hooks.ts - Integration API hooks with mocks

import { useQueryClient } from '@tanstack/react-query';
import { 
  SocialConnection, 
  SocialPlatform, 
  OAuthInitiateRequest,
  OAuthInitiateResponse, 
  OAuthCompleteRequest,
  OAuthCompleteResponse,
  PlatformCapabilities,
  ConnectionValidationResult,
  RemoveConnectionRequest,
  RemoveConnectionResponse,
  TeamConnectionsResponse
} from '@/types/app/integration-types';
import { EntityType } from '@/types/management';

// Mock data for development
const mockConnections: SocialConnection[] = [
  {
    id: 'conn-1',
    platform: SocialPlatform.X,
    external_username: '@clicksi_brand',
    display_name: 'Clicksi Brand',
    connected_at: '2025-08-01T10:00:00Z',
    last_used_at: '2025-08-03T15:30:00Z',
    is_active: true,
    avatar_url: 'https://via.placeholder.com/40/1DA1F2/ffffff?text=X'
  },
  {
    id: 'conn-2',
    platform: SocialPlatform.Instagram,
    external_username: '@clicksi.official',
    display_name: 'Clicksi Official',
    connected_at: '2025-07-28T14:20:00Z',
    is_active: true,
    avatar_url: 'https://via.placeholder.com/40/E4405F/ffffff?text=IG'
  }
];

const mockPlatformCapabilities: Record<SocialPlatform, PlatformCapabilities> = {
  [SocialPlatform.X]: {
    platform: SocialPlatform.X,
    supports_posting: true,
    supports_scheduling: false,
    max_file_size_mb: 5,
    supported_formats: ['jpg', 'png', 'gif', 'mp4']
  },
  [SocialPlatform.Instagram]: {
    platform: SocialPlatform.Instagram,
    supports_posting: true,
    supports_scheduling: true,
    max_file_size_mb: 100,
    supported_formats: ['jpg', 'png', 'mp4', 'mov']
  },
  [SocialPlatform.TikTok]: {
    platform: SocialPlatform.TikTok,
    supports_posting: true,
    supports_scheduling: true,
    max_file_size_mb: 500,
    supported_formats: ['mp4', 'mov', 'avi']
  },
  [SocialPlatform.Facebook]: {
    platform: SocialPlatform.Facebook,
    supports_posting: true,
    supports_scheduling: true,
    max_file_size_mb: 200,
    supported_formats: ['jpg', 'png', 'gif', 'mp4', 'mov']
  }
};

/**
 * Integration hooks with optimized caching and error handling
 * Provides mock implementation for development without backend dependency
 */
export const useIntegrationHooks = () => {
  const queryClient = useQueryClient();
  
  const integrationHooks = {
    // Get team social connections with caching
    getTeamConnections: (teamId?: string) => {
      const queryKey = ['team-social-connections', teamId];
      
      return {
        data: teamId ? mockConnections : [],
        isLoading: false,
        error: null,
        refetch: async () => {
          // Mock refetch behavior
          await new Promise(resolve => setTimeout(resolve, 500));
          return { data: mockConnections };
        },
        queryKey
      };
    },
    
    // Initiate OAuth connection flow
    initiateConnection: () => ({
      mutateAsync: async (data: OAuthInitiateRequest): Promise<OAuthInitiateResponse> => {
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockResponse: OAuthInitiateResponse = {
          authorization_url: `https://mock-oauth.com/authorize?platform=${data.platform}&state=mock-state-${Date.now()}`,
          state: `mock-state-${Date.now()}`
        };
        
        return mockResponse;
      },
      isPending: false,
      error: null
    }),
    
    // Complete OAuth flow (callback handler)
    completeOAuthFlow: () => ({
      mutateAsync: async (data: OAuthCompleteRequest): Promise<OAuthCompleteResponse> => {
        // Mock OAuth completion - backend uses state parameter to validate and complete flow
        // No callback_url needed - backend already knows from the state parameter
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock successful connection
        const newConnection: SocialConnection = {
          id: 'new-conn-' + Date.now(),
          platform: SocialPlatform.X, // In real implementation, would be determined by state
          external_username: '@new_connected_account',
          display_name: 'New Connected Account',
          connected_at: new Date().toISOString(),
          is_active: true,
          avatar_url: 'https://via.placeholder.com/40/1DA1F2/ffffff?text=X'
        };
        
        // Add to mock connections
        mockConnections.push(newConnection);
        
        return {
          success: true,
          platform: SocialPlatform.X,
          entityType: 'brand' as EntityType, // In real implementation, would come from session/context
          connection: newConnection
        };
      },
      isPending: false,
      error: null
    }),
    
    // Remove social media connection
    removeConnection: () => ({
      mutateAsync: async (data: RemoveConnectionRequest): Promise<RemoveConnectionResponse> => {
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Remove from mock data
        const index = mockConnections.findIndex(conn => conn.id === data.connectionId);
        if (index > -1) {
          mockConnections.splice(index, 1);
        }
        
        // Invalidate cache
        queryClient.invalidateQueries({ 
          queryKey: ['team-social-connections', data.teamId] 
        });
        
        return { success: true };
      },
      isPending: false,
      error: null
    }),
    
    // Validate connection status
    validateConnection: () => ({
      mutateAsync: async (connectionId: string): Promise<ConnectionValidationResult> => {
        // Mock validation delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock validation result
        return {
          is_valid: true,
          last_checked: new Date().toISOString()
        };
      },
      isPending: false,
      error: null
    }),
    
    // Get platform capabilities
    getPlatformCapabilities: (platform: SocialPlatform) => ({
      data: mockPlatformCapabilities[platform],
      isLoading: false,
      error: null
    }),
    
    // Cache invalidation utilities
    invalidateCache: {
      connections: (teamId: string) => {
        queryClient.invalidateQueries({ 
          queryKey: ['team-social-connections', teamId] 
        });
      },
      allConnections: () => {
        queryClient.invalidateQueries({ 
          queryKey: ['team-social-connections'] 
        });
      }
    },
    
    // Cache management utilities  
    prefetchConnections: async (teamId: string) => {
      return queryClient.prefetchQuery({
        queryKey: ['team-social-connections', teamId],
        queryFn: () => Promise.resolve(mockConnections),
        staleTime: 5 * 60 * 1000 // 5 minutes
      });
    }
  };
  
  return integrationHooks;
};