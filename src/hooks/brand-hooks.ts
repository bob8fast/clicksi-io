// hooks/brand-hooks.ts
export {
    useDeleteBrand,
    useGetBrand as useBrand,
    useGetBrandByTeam,
    useGetBrands,
    useGetSelfDistributedBrands,
    useUpdateBrand,
} from '@/gen/api/hooks/user_management/brands';

export {
    useCreateBrandSelfDistributedRetailer,
} from '@/gen/api/hooks/user_management/retailers';

// Re-export the comprehensive brand hooks for advanced usage
export { useBrandHooks } from '@/hooks/api/brand-hooks';