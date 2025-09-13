// hooks/api/retailer-hooks.ts
import {
    useCreateBrandSelfDistributedRetailer,
    useDeleteRetailer,
    useGetRetailer,
    useGetRetailerByTeam,
    useGetRetailers,
    useGetVerifiedRetailers,
    useUpdateRetailer,
} from '@/gen/api/hooks/user_management/retailers';

/**
 * Retailer management hooks
 * Provides organized interface for retailer operations
 */
export const useRetailerHooks = () => ({
    getAll: useGetRetailers,
    getById: useGetRetailer,
    getByTeam: useGetRetailerByTeam,
    getVerified: useGetVerifiedRetailers,
    create: useCreateBrandSelfDistributedRetailer(),
    update: useUpdateRetailer(),
    delete: useDeleteRetailer(),
});