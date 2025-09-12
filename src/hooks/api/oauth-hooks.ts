// hooks/api/oauth-hooks.ts
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * OAuth integration hooks for social platforms
 * Currently supports Instagram OAuth integration as per Story 2.2 requirements
 */

interface InstagramProfile {
    platformId: string;
    username: string;
    displayName: string;
    profileImageUrl?: string;
    followerCount: number;
    isVerified: boolean;
}

interface InstagramConnectionStatus {
    isConnected: boolean;
    username?: string;
    followerCount?: number;
    lastSync?: string;
    status: 'active' | 'expired' | 'error';
    errorMessage?: string;
}

interface OAuthConnection {
    platform: 'instagram';
    authUrl: string;
    state: string;
    expiresAt: string;
}

export const useInstagramOAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const initiateConnection = useCallback(async (redirectUrl: string): Promise<OAuthConnection> => {
        setIsLoading(true);
        setError(null);

        try {
            // This will call the actual Instagram OAuth API when implemented
            // POST /api/oauth/connect/instagram
            const response = await fetch('/api/oauth/connect/instagram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({ redirectUrl }),
            });

            if (!response.ok) {
                throw new Error('Failed to initiate Instagram connection');
            }

            const data = await response.json();
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Instagram';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const completeConnection = useCallback(async (code: string, state: string): Promise<InstagramProfile> => {
        setIsLoading(true);
        setError(null);

        try {
            // This will call the actual Instagram OAuth callback API when implemented
            // POST /api/oauth/callback/instagram
            const response = await fetch('/api/oauth/callback/instagram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({ code, state }),
            });

            if (!response.ok) {
                throw new Error('Failed to complete Instagram connection');
            }

            const data = await response.json();
            
            // Invalidate any existing OAuth status cache
            queryClient.invalidateQueries({ queryKey: ['oauth', 'instagram', 'status'] });
            
            return data.profile;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to complete Instagram connection';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [queryClient]);

    const getConnectionStatus = useCallback(async (): Promise<InstagramConnectionStatus> => {
        setIsLoading(true);
        setError(null);

        try {
            // This will call the actual Instagram status API when implemented
            // GET /api/oauth/instagram/status
            const response = await fetch('/api/oauth/instagram/status', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get Instagram connection status');
            }

            const data = await response.json();
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to get connection status';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const disconnect = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            // This will call the actual Instagram disconnect API when implemented
            // DELETE /api/oauth/instagram
            const response = await fetch('/api/oauth/instagram', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to disconnect Instagram');
            }

            // Invalidate OAuth status cache
            queryClient.invalidateQueries({ queryKey: ['oauth', 'instagram', 'status'] });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect Instagram';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [queryClient]);

    const refreshData = useCallback(async (): Promise<InstagramProfile> => {
        setIsLoading(true);
        setError(null);

        try {
            // This will call the actual Instagram refresh API when implemented
            // POST /api/oauth/instagram/refresh
            const response = await fetch('/api/oauth/instagram/refresh', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to refresh Instagram data');
            }

            const data = await response.json();
            
            // Invalidate OAuth status cache to trigger re-fetch
            queryClient.invalidateQueries({ queryKey: ['oauth', 'instagram', 'status'] });
            
            return data.profile;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to refresh Instagram data';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [queryClient]);

    return {
        isLoading,
        error,
        initiateConnection,
        completeConnection,
        getConnectionStatus,
        disconnect,
        refreshData,
    };
};

/**
 * Main OAuth hooks interface
 * Currently supports Instagram only, designed for extensibility
 */
export const useOAuthHooks = () => ({
    instagram: useInstagramOAuth(),
});