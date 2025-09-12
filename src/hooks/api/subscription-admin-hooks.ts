// hooks/api/subscription-admin-hooks.ts
import { useQueryClient } from '@tanstack/react-query';

// Subscription management hooks
import {
    useCreateSubscription,
    useUpdateSubscription,
    useActivateSubscription,
    useSuspendSubscription,
    useCancelSubscription,
    useGetSubscription,
    useGetTeamSubscriptions,
    useGetTeamActiveSubscription,
    useGetUserTeamSubscriptions,
    getGetSubscriptionQueryKey,
    getGetTeamSubscriptionsQueryKey,
    getGetTeamActiveSubscriptionQueryKey,
    getGetUserTeamSubscriptionsQueryKey
} from '@/gen/api/hooks/user_management/subscriptions';

// Subscription plan hooks
import {
    useGetPlans,
    useGetPlan,
    useCreatePlan,
    useUpdatePlan,
    useDeletePlan,
    getGetPlansQueryKey,
    getGetPlanQueryKey
} from '@/gen/api/hooks/user_management/subscription-plans';

/**
 * Subscription administration hooks with optimized caching and error handling
 * Provides a consistent interface for all subscription admin operations
 */
export const useSubscriptionAdminHooks = () => {
    const queryClient = useQueryClient();
    
    // Create const objects for each hook with predefined caching and invalidation
    const subscriptionAdminHooks = {
        // Subscription query hooks
        getAllSubscriptions: (params?: any) => {
            return useGetUserTeamSubscriptions(
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
        
        getSubscription: (subscriptionId: string) => {
            return useGetSubscription(
                { subscriptionId },
                {
                    query: {
                        staleTime: 2 * 60 * 1000,        // 2 minutes
                        gcTime: 5 * 60 * 1000,           // 5 minutes
                        enabled: !!subscriptionId,
                        refetchOnWindowFocus: false
                    }
                }
            );
        },
        
        getTeamSubscriptions: (teamId: string, params?: any) => {
            return useGetTeamSubscriptions(
                { teamId },
                params,
                {
                    query: {
                        staleTime: 3 * 60 * 1000,        // 3 minutes
                        gcTime: 8 * 60 * 1000,           // 8 minutes
                        enabled: !!teamId,
                        refetchOnWindowFocus: false
                    }
                }
            );
        },
        
        getTeamActiveSubscription: (teamId: string) => {
            return useGetTeamActiveSubscription(
                { teamId },
                {
                    query: {
                        staleTime: 2 * 60 * 1000,        // 2 minutes
                        gcTime: 5 * 60 * 1000,           // 5 minutes
                        enabled: !!teamId,
                        refetchOnWindowFocus: false
                    }
                }
            );
        },
        
        // Subscription plan query hooks
        getPlans: (params?: any) => {
            return useGetPlans(
                params,
                {
                    query: {
                        staleTime: 10 * 60 * 1000,       // 10 minutes (plans change rarely)
                        gcTime: 30 * 60 * 1000,          // 30 minutes
                        refetchOnWindowFocus: false
                    }
                }
            );
        },
        
        getPlan: (planId: string) => {
            return useGetPlan(
                { planId },
                {
                    query: {
                        staleTime: 10 * 60 * 1000,       // 10 minutes
                        gcTime: 30 * 60 * 1000,          // 30 minutes
                        enabled: !!planId,
                        refetchOnWindowFocus: false
                    }
                }
            );
        },
        
        // Subscription mutation hooks
        createSubscription: () => {
            return useCreateSubscription({
                mutation: {
                    onSuccess: () => {
                        // Invalidate subscription lists after creation
                        queryClient.invalidateQueries({ 
                            queryKey: getGetUserTeamSubscriptionsQueryKey() 
                        });
                    },
                    onError: (error) => {
                        console.error('Subscription creation failed:', error);
                    }
                }
            });
        },
        
        updateSubscription: () => {
            return useUpdateSubscription({
                mutation: {
                    onSuccess: (data, variables) => {
                        // Invalidate specific subscription and lists
                        queryClient.invalidateQueries({ 
                            queryKey: getGetSubscriptionQueryKey({ subscriptionId: variables.subscriptionId || '' }) 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetUserTeamSubscriptionsQueryKey() 
                        });
                    },
                    onError: (error) => {
                        console.error('Subscription update failed:', error);
                    }
                }
            });
        },
        
        activateSubscription: () => {
            return useActivateSubscription({
                mutation: {
                    onSuccess: (data, variables) => {
                        // Invalidate specific subscription and related caches
                        queryClient.invalidateQueries({ 
                            queryKey: getGetSubscriptionQueryKey({ subscriptionId: variables.subscriptionId || '' }) 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetUserTeamSubscriptionsQueryKey() 
                        });
                        // Also invalidate team active subscription if team data is available
                        queryClient.invalidateQueries({ 
                            queryKey: ['user-management', 'api', 'v1', 'subscriptions', 'teams']
                        });
                    },
                    onError: (error) => {
                        console.error('Subscription activation failed:', error);
                    }
                }
            });
        },
        
        suspendSubscription: () => {
            return useSuspendSubscription({
                mutation: {
                    onSuccess: (data, variables) => {
                        // Invalidate specific subscription and related caches
                        queryClient.invalidateQueries({ 
                            queryKey: getGetSubscriptionQueryKey({ subscriptionId: variables.subscriptionId || '' }) 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetUserTeamSubscriptionsQueryKey() 
                        });
                    },
                    onError: (error) => {
                        console.error('Subscription suspension failed:', error);
                    }
                }
            });
        },
        
        cancelSubscription: () => {
            return useCancelSubscription({
                mutation: {
                    onSuccess: (data, variables) => {
                        // Invalidate specific subscription and related caches
                        queryClient.invalidateQueries({ 
                            queryKey: getGetSubscriptionQueryKey({ subscriptionId: variables.subscriptionId || '' }) 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetUserTeamSubscriptionsQueryKey() 
                        });
                    },
                    onError: (error) => {
                        console.error('Subscription cancellation failed:', error);
                    }
                }
            });
        },
        
        // Plan mutation hooks
        createPlan: () => {
            return useCreatePlan({
                mutation: {
                    onSuccess: () => {
                        // Invalidate plans list after creation
                        queryClient.invalidateQueries({ 
                            queryKey: getGetPlansQueryKey() 
                        });
                    },
                    onError: (error) => {
                        console.error('Plan creation failed:', error);
                    }
                }
            });
        },
        
        updatePlan: () => {
            return useUpdatePlan({
                mutation: {
                    onSuccess: (data, variables) => {
                        // Invalidate specific plan and plans list
                        queryClient.invalidateQueries({ 
                            queryKey: getGetPlanQueryKey({ planId: variables.pathParams.planId }) 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetPlansQueryKey() 
                        });
                    },
                    onError: (error) => {
                        console.error('Plan update failed:', error);
                    }
                }
            });
        },
        
        deletePlan: () => {
            return useDeletePlan({
                mutation: {
                    onSuccess: (data, variables) => {
                        // Invalidate specific plan and plans list
                        queryClient.invalidateQueries({ 
                            queryKey: getGetPlanQueryKey({ planId: variables.pathParams.planId }) 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetPlansQueryKey() 
                        });
                    },
                    onError: (error) => {
                        console.error('Plan deletion failed:', error);
                    }
                }
            });
        },
        
        // Cache invalidation utilities
        invalidateCache: {
            all: () => {
                queryClient.invalidateQueries({ 
                    queryKey: ['user-management', 'api', 'v1', 'subscriptions'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['user-management', 'api', 'v1', 'subscription-plans'] 
                });
            },
            subscriptions: () => {
                queryClient.invalidateQueries({ 
                    queryKey: getGetUserTeamSubscriptionsQueryKey() 
                });
            },
            subscription: (subscriptionId: string) => {
                queryClient.invalidateQueries({ 
                    queryKey: getGetSubscriptionQueryKey({ subscriptionId }) 
                });
            },
            plans: () => {
                queryClient.invalidateQueries({ 
                    queryKey: getGetPlansQueryKey() 
                });
            },
            plan: (planId: string) => {
                queryClient.invalidateQueries({ 
                    queryKey: getGetPlanQueryKey({ planId }) 
                });
            },
            teamSubscriptions: (teamId: string) => {
                queryClient.invalidateQueries({ 
                    queryKey: getGetTeamSubscriptionsQueryKey({ teamId }) 
                });
                queryClient.invalidateQueries({ 
                    queryKey: getGetTeamActiveSubscriptionQueryKey({ teamId }) 
                });
            }
        },
        
        // Cache management utilities
        prefetchSubscription: async (subscriptionId: string) => {
            return queryClient.prefetchQuery({
                queryKey: getGetSubscriptionQueryKey({ subscriptionId }),
                queryFn: () => useGetSubscription({ subscriptionId }),
                staleTime: 2 * 60 * 1000
            });
        },
        
        prefetchPlan: async (planId: string) => {
            return queryClient.prefetchQuery({
                queryKey: getGetPlanQueryKey({ planId }),
                queryFn: () => useGetPlan({ planId }),
                staleTime: 10 * 60 * 1000
            });
        }
    };
    
    return subscriptionAdminHooks;
};