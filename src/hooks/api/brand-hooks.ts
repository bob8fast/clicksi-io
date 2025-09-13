// hooks/api/brand-hooks.ts
import { useQueryClient } from '@tanstack/react-query';
import {
    useDeleteBrand,
    useGetBrand,
    useGetBrandByTeam,
    useGetBrands,
    useGetSelfDistributedBrands,
    useUpdateBrand,
} from '@/gen/api/hooks/user_management/brands';

import {
    useCreateBrandSelfDistributedRetailer,
} from '@/gen/api/hooks/user_management/retailers';

/**
 * Brand management hooks with optimized caching and error handling
 */
export const useBrandHooks = () => {
    const queryClient = useQueryClient();
    
    return {
        // Query hooks with optimized caching for filter options
        getAll: (params?: any) => {
            return useGetBrands(
                params,
                {
                    query: {
                        staleTime: 15 * 60 * 1000,        // 15 minutes (brands change infrequently)
                        gcTime: 30 * 60 * 1000,           // 30 minutes
                        refetchOnWindowFocus: false,       // Brands don't change that often
                        retry: 2                           // Retry failed requests
                    }
                }
            );
        },
        
        getById: useGetBrand,
        getByTeam: useGetBrandByTeam,
        getSelfDistributed: useGetSelfDistributedBrands,
        
        // Mutation hooks with cache invalidation
        create: () => {
            return useCreateBrandSelfDistributedRetailer({
                mutation: {
                    onSuccess: () => {
                        // Invalidate brands list cache when new brand created
                        queryClient.invalidateQueries({ 
                            queryKey: ['brands'] // Adjust based on actual query key pattern
                        });
                    },
                    onError: (error) => {
                        console.error('Brand creation failed:', error);
                    }
                }
            });
        },
        
        update: () => {
            return useUpdateBrand({
                mutation: {
                    onSuccess: () => {
                        // Invalidate brands cache after update
                        queryClient.invalidateQueries({ 
                            queryKey: ['brands']
                        });
                    },
                    onError: (error) => {
                        console.error('Brand update failed:', error);
                    }
                }
            });
        },
        
        delete: () => {
            return useDeleteBrand({
                mutation: {
                    onSuccess: () => {
                        // Invalidate brands cache after deletion
                        queryClient.invalidateQueries({ 
                            queryKey: ['brands']
                        });
                    },
                    onError: (error) => {
                        console.error('Brand deletion failed:', error);
                    }
                }
            });
        },
        
        // Cache management utilities
        invalidateCache: {
            all: () => {
                queryClient.invalidateQueries({ queryKey: ['brands'] });
            }
        },
        
        prefetchBrands: async (params?: any) => {
            return queryClient.prefetchQuery({
                queryKey: ['brands', params],
                queryFn: () => {
                    // Note: This would need the actual query function
                    console.warn('Direct brand query function not available for prefetch');
                    return Promise.resolve([]);
                },
                staleTime: 15 * 60 * 1000
            });
        }
    };
};