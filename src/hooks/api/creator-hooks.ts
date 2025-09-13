// hooks/api/creator-hooks.ts
import { useQueryClient } from '@tanstack/react-query';
import {
    useDeleteCreator,
    useGetCreator,
    useGetCreatorByTeam,
    useGetCreators,
    useGetVerifiedCreators,
    useUpdateCreator,
} from '@/gen/api/hooks/user_management/creators';

import {
    useGetCreatorSuggestions,
} from '@/gen/api/hooks/user_management/consumer-creator-follows';

/**
 * Creator management hooks with optimized caching and error handling
 */
export const useCreatorHooks = () => {
    const queryClient = useQueryClient();
    
    return {
        // Query hooks with optimized caching for search/filter
        getAll: (params?: any) => {
            return useGetCreators(
                params,
                {
                    query: {
                        staleTime: 10 * 60 * 1000,        // 10 minutes (creators more dynamic than brands)
                        gcTime: 20 * 60 * 1000,           // 20 minutes
                        refetchOnWindowFocus: false,
                        retry: 2
                    }
                }
            );
        },
        
        getVerified: (params?: any) => {
            return useGetVerifiedCreators(
                params,
                {
                    query: {
                        staleTime: 15 * 60 * 1000,        // 15 minutes (verified status changes less frequently)
                        gcTime: 30 * 60 * 1000,           // 30 minutes
                        refetchOnWindowFocus: false,
                        retry: 2
                    }
                }
            );
        },
        
        getSuggestions: (params?: any) => {
            return useGetCreatorSuggestions(
                params,
                {
                    query: {
                        staleTime: 5 * 60 * 1000,         // 5 minutes (suggestions should be fairly fresh)
                        gcTime: 10 * 60 * 1000,           // 10 minutes
                        refetchOnWindowFocus: false,
                        retry: 1
                    }
                }
            );
        },
        
        getById: useGetCreator,
        getByTeam: useGetCreatorByTeam,
        
        // Mutation hooks with cache invalidation
        update: () => {
            return useUpdateCreator({
                mutation: {
                    onSuccess: () => {
                        // Invalidate creators cache after update
                        queryClient.invalidateQueries({ queryKey: ['creators'] });
                        queryClient.invalidateQueries({ queryKey: ['verified-creators'] });
                    },
                    onError: (error) => {
                        console.error('Creator update failed:', error);
                    }
                }
            });
        },
        
        delete: () => {
            return useDeleteCreator({
                mutation: {
                    onSuccess: () => {
                        // Invalidate creators cache after deletion
                        queryClient.invalidateQueries({ queryKey: ['creators'] });
                        queryClient.invalidateQueries({ queryKey: ['verified-creators'] });
                    },
                    onError: (error) => {
                        console.error('Creator deletion failed:', error);
                    }
                }
            });
        },
        
        // Cache management utilities
        invalidateCache: {
            all: () => {
                queryClient.invalidateQueries({ queryKey: ['creators'] });
                queryClient.invalidateQueries({ queryKey: ['verified-creators'] });
                queryClient.invalidateQueries({ queryKey: ['creator-suggestions'] });
            },
            suggestions: () => {
                queryClient.invalidateQueries({ queryKey: ['creator-suggestions'] });
            }
        }
    };
};