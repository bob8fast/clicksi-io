// hooks/api/subscription-hooks.ts
import { useQueryClient } from '@tanstack/react-query';
import {
    useActivateSubscription,
    useCancelSubscription,
    useCreateSubscription,
    useGetSubscription,
    useGetTeamActiveSubscription,
    useGetTeamSubscriptions,
    useSuspendSubscription,
    useUpdateSubscription,
    getGetSubscriptionQueryKey,
    getGetTeamActiveSubscriptionQueryKey,
    getGetTeamSubscriptionsQueryKey
} from '@/gen/api/hooks/user_management/subscriptions';

import {
    useGetPlans as useGetAllSubscriptionPlans,
    useGetPlan as useGetSubscriptionPlan,
    useCreatePlan as useCreateSubscriptionPlan,
    useUpdatePlan as useUpdateSubscriptionPlan,
    useDeletePlan as useDeleteSubscriptionPlan,
    getGetPlansQueryKey as getGetAllSubscriptionPlansQueryKey,
    getGetPlanQueryKey as getGetSubscriptionPlanQueryKey
} from '@/gen/api/hooks/user_management/subscription-plans';

import {
    useGetTrialRequests,
    useCreateTrialRequest,
    useReviewTrialRequest as useUpdateTrialRequestStatus,
    getGetTrialRequestsQueryKey
} from '@/gen/api/hooks/user_management/trial-requests';

// Export individual hooks for backward compatibility
export {
    useActivateSubscription,
    useCancelSubscription,
    useCreateSubscription,
    useGetSubscription as useUserSubscription,
    useGetTeamActiveSubscription as useUserActiveSubscription,
    useGetTeamSubscriptions,
    useSuspendSubscription,
    useUpdateSubscription,
    getGetSubscriptionQueryKey,
    getGetTeamActiveSubscriptionQueryKey,
    getGetTeamSubscriptionsQueryKey
} from '@/gen/api/hooks/user_management/subscriptions';

export {
    useGetPlans as useSubscriptionPlans,
    useGetPlan as useGetSubscriptionPlan,
    useCreatePlan as useCreateSubscriptionPlan,
    useUpdatePlan as useUpdateSubscriptionPlan,
    useDeletePlan as useDeleteSubscriptionPlan,
    getGetPlansQueryKey as getGetAllSubscriptionPlansQueryKey,
    getGetPlanQueryKey as getGetSubscriptionPlanQueryKey
} from '@/gen/api/hooks/user_management/subscription-plans';

export {
    useGetTrialRequests,
    useCreateTrialRequest,
    useReviewTrialRequest as useUpdateTrialRequestStatus,
    getGetTrialRequestsQueryKey
} from '@/gen/api/hooks/user_management/trial-requests';

// Mock hooks for missing functionality (since auth is removed)
export const useCurrentUsage = () => ({
    data: null,
    isLoading: false,
    error: null
});

export const useSubscriptionPermissions = () => ({
    data: { canAccess: true },
    isLoading: false,
    error: null
});

export const usePaymentHistory = () => ({
    data: null,
    isLoading: false,
    error: null
});

/**
 * Subscription management hooks with proper caching and error handling
 * Provides organized interface for subscription operations
 */
export const useSubscriptionHooks = () => {
    const queryClient = useQueryClient();
    
    return {
        // Query hooks
        get: useGetSubscription,
        getTeamSubscriptions: useGetTeamSubscriptions,
        getTeamActive: useGetTeamActiveSubscription,
        getAllPlans: useGetAllSubscriptionPlans,
        getPlan: useGetSubscriptionPlan,
        getTrialRequests: useGetTrialRequests,
        
        // Mutation hooks (return the hook functions, not called)
        create: useCreateSubscription,
        update: useUpdateSubscription,
        activate: useActivateSubscription,
        cancel: useCancelSubscription,
        suspend: useSuspendSubscription,
        
        // Subscription plan mutations
        createPlan: useCreateSubscriptionPlan,
        updatePlan: useUpdateSubscriptionPlan,
        deletePlan: useDeleteSubscriptionPlan,
        
        // Trial request mutations
        createTrialRequest: useCreateTrialRequest,
        updateTrialRequestStatus: useUpdateTrialRequestStatus,
        deleteTrialRequest: useDeleteTrialRequest,
        
        // Cache invalidation utilities
        invalidateCache: {
            all: () => {
                queryClient.invalidateQueries({ 
                    queryKey: ['user-management', 'api', 'v1', 'subscriptions'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['user-management', 'api', 'v1', 'subscription-plans'] 
                });
                queryClient.invalidateQueries({ 
                    queryKey: ['user-management', 'api', 'v1', 'trial-requests'] 
                });
            },
            subscriptions: (teamId?: string) => {
                if (teamId) {
                    queryClient.invalidateQueries({ 
                        queryKey: getGetTeamSubscriptionsQueryKey({ teamId }) 
                    });
                    queryClient.invalidateQueries({ 
                        queryKey: getGetTeamActiveSubscriptionQueryKey({ teamId }) 
                    });
                }
            },
            subscriptionPlans: () => {
                queryClient.invalidateQueries({ 
                    queryKey: getGetAllSubscriptionPlansQueryKey() 
                });
            },
            trialRequests: () => {
                queryClient.invalidateQueries({ 
                    queryKey: getGetTrialRequestsQueryKey() 
                });
            }
        }
    };
};