// hooks/api/category-hooks.ts
import { useQueryClient } from '@tanstack/react-query';
import {
    useBulkUpdateCategories,
    useDeleteCategoryImage,
    useGetCategories,
    useGetCategoryHistory,
    useGetCategoryHistoryDetails,
    useGetCategoryImageUrls,
    useRecoverToHistoricalState,
    useSearchCategories,
    useUploadCategoryImage,
    getGetCategoriesQueryKey,
    getGetCategoryHistoryDetailsQueryKey,
    getCategories
} from '@/gen/api/hooks/product_catalog/categories';
import { CategoryType } from '@/types';
import { clearCategoryLocalizationCache } from '@/types/app/category-types';

/**
 * Category hooks with optimized caching and error handling
 * Provides a consistent interface for all category-related operations
 */
export const useCategoryHooks = () => {
    const queryClient = useQueryClient();
    
    // Create const objects for each hook with predefined caching and invalidation
    const categoryHooks = {
        // Query hooks with predefined cache times
        getAll: (categoryType?: CategoryType) => {
            return useGetCategories(
                categoryType ? { type: categoryType } : undefined,
                {
                    query: {
                        staleTime: 5 * 60 * 1000,        // 5 minutes
                        gcTime: 10 * 60 * 1000,          // 10 minutes (React Query v5)
                        refetchOnWindowFocus: false
                    }
                }
            );
        },
        
        getHistoryDetails: (historyId: string) => {
            return useGetCategoryHistoryDetails(
                { historyId },
                {
                    query: {
                        staleTime: 2 * 60 * 1000,        // 2 minutes
                        gcTime: 5 * 60 * 1000,           // 5 minutes (React Query v5)
                        enabled: !!historyId,
                        refetchOnWindowFocus: false
                    }
                }
            );
        },
        
        // Mutation hooks with cache invalidation
        getHistory: () => {
            return useGetCategoryHistory({
                mutation: {
                    onSuccess: () => {
                        // This is a mutation that fetches history data
                        // Clear localization cache when categories change
                        clearCategoryLocalizationCache();
                    }
                }
            });
        },
        
        getImageUrls: () => {
            return useGetCategoryImageUrls({
                mutation: {
                    onSuccess: () => {
                        // This is a mutation that fetches image URLs
                    }
                }
            });
        },
        
        search: () => {
            return useSearchCategories({
                mutation: {
                    onSuccess: () => {
                        // Don't invalidate cache for search as it's temporary
                    }
                }
            });
        },
        
        bulkUpdate: () => {
            return useBulkUpdateCategories({
                mutation: {
                    onSuccess: () => {
                        // Invalidate all category-related caches after bulk update
                        queryClient.invalidateQueries({ 
                            queryKey: getGetCategoriesQueryKey() 
                        });
                        // Clear localization cache when categories change
                        clearCategoryLocalizationCache();
                    },
                    onError: (error) => {
                        console.error('Bulk update failed:', error);
                    }
                }
            });
        },
        
        recoverToHistoricalState: () => {
            return useRecoverToHistoricalState({
                mutation: {
                    onSuccess: () => {
                        // Invalidate all caches after recovery
                        queryClient.invalidateQueries({ 
                            queryKey: getGetCategoriesQueryKey() 
                        });
                        // Clear localization cache when categories change
                        clearCategoryLocalizationCache();
                    },
                    onError: (error) => {
                        console.error('Recovery failed:', error);
                    }
                }
            });
        },
        
        // Image management hooks
        uploadImage: () => {
            return useUploadCategoryImage({
                mutation: {
                    onSuccess: () => {
                        // Invalidate categories cache to reflect updated images
                        queryClient.invalidateQueries({ 
                            queryKey: getGetCategoriesQueryKey() 
                        });
                    },
                    onError: (error) => {
                        console.error('Image upload failed:', error);
                    }
                }
            });
        },
        
        deleteImage: () => {
            return useDeleteCategoryImage({
                mutation: {
                    onSuccess: () => {
                        // Invalidate categories cache to reflect removed images
                        queryClient.invalidateQueries({ 
                            queryKey: getGetCategoriesQueryKey() 
                        });
                    },
                    onError: (error) => {
                        console.error('Image deletion failed:', error);
                    }
                }
            });
        },
        
        // Cache invalidation utilities
        invalidateCache: {
            all: () => {
                queryClient.invalidateQueries({ 
                    queryKey: getGetCategoriesQueryKey() 
                });
                clearCategoryLocalizationCache();
            },
            categories: (categoryType?: CategoryType) => {
                queryClient.invalidateQueries({ 
                    queryKey: getGetCategoriesQueryKey(categoryType ? { type: categoryType } : undefined) 
                });
                clearCategoryLocalizationCache();
            },
            historyDetails: (historyId: string) => {
                queryClient.invalidateQueries({ 
                    queryKey: getGetCategoryHistoryDetailsQueryKey({ historyId }) 
                });
            }
        },
        
        // Cache management utilities
        prefetchCategories: async (categoryType?: CategoryType) => {
            return queryClient.prefetchQuery({
                queryKey: getGetCategoriesQueryKey(categoryType ? { type: categoryType } : undefined),
                queryFn: () => getCategories(categoryType ? { type: categoryType } : undefined),
                staleTime: 5 * 60 * 1000
            });
        }
    };
    
    return categoryHooks;
};