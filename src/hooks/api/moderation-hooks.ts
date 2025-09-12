// hooks/api/moderation-hooks.ts
import { useQueryClient } from '@tanstack/react-query';

// Moderation hooks
import {
    useGetModerationQueue,
    useGetModerationActions,
    useGetReports,
    useGetReport,
    useModerateContent,
    useResolveReport,
    getGetModerationQueueQueryKey,
    getGetModerationActionsQueryKey,
    getGetReportsQueryKey,
    getGetReportQueryKey
} from '@/gen/api/hooks/content_management/moderation';

/**
 * Content moderation hooks with optimized caching and error handling
 * Provides a consistent interface for all moderation-related operations
 */
export const useModerationHooks = () => {
    const queryClient = useQueryClient();
    
    // Create const objects for each hook with predefined caching and invalidation
    const moderationHooks = {
        // Query hooks with predefined cache times
        getModerationQueue: (params?: any) => {
            return useGetModerationQueue(
                params,
                {
                    query: {
                        staleTime: 2 * 60 * 1000,        // 2 minutes (needs frequent updates)
                        gcTime: 5 * 60 * 1000,           // 5 minutes
                        refetchOnWindowFocus: true,      // Refetch when focus returns
                        refetchInterval: 30 * 1000       // Refetch every 30 seconds
                    }
                }
            );
        },
        
        getModerationActions: (params?: any) => {
            return useGetModerationActions(
                params,
                {
                    query: {
                        staleTime: 5 * 60 * 1000,        // 5 minutes
                        gcTime: 10 * 60 * 1000,          // 10 minutes
                        refetchOnWindowFocus: false
                    }
                }
            );
        },
        
        getReports: (params?: any) => {
            return useGetReports(
                params,
                {
                    query: {
                        staleTime: 3 * 60 * 1000,        // 3 minutes
                        gcTime: 8 * 60 * 1000,           // 8 minutes
                        refetchOnWindowFocus: false
                    }
                }
            );
        },
        
        getReport: (reportId: string) => {
            return useGetReport(
                { reportId },
                {
                    query: {
                        staleTime: 2 * 60 * 1000,        // 2 minutes
                        gcTime: 5 * 60 * 1000,           // 5 minutes
                        enabled: !!reportId,
                        refetchOnWindowFocus: false
                    }
                }
            );
        },
        
        // Mutation hooks with cache invalidation
        moderateContent: () => {
            return useModerateContent({
                mutation: {
                    onSuccess: () => {
                        // Invalidate moderation queue and actions after content moderation
                        queryClient.invalidateQueries({ 
                            queryKey: getGetModerationQueueQueryKey() 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetModerationActionsQueryKey() 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetReportsQueryKey() 
                        });
                    },
                    onError: (error) => {
                        console.error('Content moderation failed:', error);
                    }
                }
            });
        },
        
        resolveReport: () => {
            return useResolveReport({
                mutation: {
                    onSuccess: (data, variables) => {
                        // Invalidate specific report and lists after resolution
                        queryClient.invalidateQueries({ 
                            queryKey: getGetReportQueryKey({ reportId: variables.pathParams.reportId }) 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetReportsQueryKey() 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetModerationQueueQueryKey() 
                        });
                    },
                    onError: (error) => {
                        console.error('Report resolution failed:', error);
                    }
                }
            });
        },
        
        // Cache invalidation utilities
        invalidateCache: {
            all: () => {
                queryClient.invalidateQueries({ 
                    queryKey: ['content-management', 'api', 'v1', 'moderation'] 
                });
            },
            queue: () => {
                queryClient.invalidateQueries({ 
                    queryKey: getGetModerationQueueQueryKey() 
                });
            },
            reports: () => {
                queryClient.invalidateQueries({ 
                    queryKey: getGetReportsQueryKey() 
                });
            },
            report: (reportId: string) => {
                queryClient.invalidateQueries({ 
                    queryKey: getGetReportQueryKey({ reportId }) 
                });
            },
            actions: () => {
                queryClient.invalidateQueries({ 
                    queryKey: getGetModerationActionsQueryKey() 
                });
            }
        },
        
        // Cache management utilities
        prefetchReport: async (reportId: string) => {
            return queryClient.prefetchQuery({
                queryKey: getGetReportQueryKey({ reportId }),
                queryFn: () => useGetReport({ reportId }),
                staleTime: 2 * 60 * 1000
            });
        }
    };
    
    return moderationHooks;
};