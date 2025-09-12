// hooks/retailer-hooks.ts
export {
    useCreateBrandSelfDistributedRetailer,
    useDeleteRetailer,
    useGetRetailer as useRetailer,
    useGetRetailerByTeam,
    useGetRetailers,
    useGetVerifiedRetailers,
    useUpdateRetailer,
} from '@/gen/api/hooks/user_management/retailers';

// Re-export the comprehensive retailer hooks for advanced usage
export { useRetailerHooks } from '@/hooks/api/retailer-hooks';