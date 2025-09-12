// hooks/api/product-hooks.ts
import { useQueryClient } from '@tanstack/react-query';
import {
    useCreateProduct,
    useDeleteProduct,
    useDeleteProductImage,
    useGetProduct,
    useGetProducts,
    useGetProductsByBrand,
    useGetProductsByCategory,
    useSearchProducts,
    useUpdateProduct,
    useUploadProductImage,
    getGetProductsQueryKey,
    getGetProductQueryKey,
    getGetProductsByBrandQueryKey,
    getGetProductsByCategoryQueryKey,
    getSearchProductsQueryKey,
} from '@/gen/api/hooks/product_catalog/products';

/**
 * Product hooks with optimized caching and error handling
 * Provides a consistent interface for all product-related operations
 */
export const useProductHooks = () => {
    const queryClient = useQueryClient();
    
    return {
        // Query hooks with optimized caching for product lists
        getAll: (params?: any) => {
            return useGetProducts(
                params,
                {
                    query: {
                        staleTime: 5 * 60 * 1000,         // 5 minutes (products change frequently)
                        gcTime: 15 * 60 * 1000,           // 15 minutes
                        refetchOnWindowFocus: false,
                        retry: 2
                    }
                }
            );
        },
        
        getByBrand: (brandId: string, params?: any) => {
            return useGetProductsByBrand(
                { brandId },
                params,
                {
                    query: {
                        staleTime: 8 * 60 * 1000,         // 8 minutes (brand products change moderately)
                        gcTime: 20 * 60 * 1000,           // 20 minutes
                        refetchOnWindowFocus: false,
                        retry: 2
                    }
                }
            );
        },
        
        getByCategory: (categoryId: string, params?: any) => {
            return useGetProductsByCategory(
                { categoryId },
                params,
                {
                    query: {
                        staleTime: 8 * 60 * 1000,         // 8 minutes
                        gcTime: 20 * 60 * 1000,           // 20 minutes
                        refetchOnWindowFocus: false,
                        retry: 2
                    }
                }
            );
        },
        
        getById: useGetProduct,
        
        // Search hooks with shorter cache times
        search: (params?: any) => {
            return useSearchProducts(
                params,
                {
                    query: {
                        staleTime: 2 * 60 * 1000,         // 2 minutes (search results change frequently)
                        gcTime: 5 * 60 * 1000,            // 5 minutes
                        refetchOnWindowFocus: false,
                        retry: 1
                    }
                }
            );
        },
        
        // Mutation hooks with cache invalidation
        create: () => {
            return useCreateProduct({
                mutation: {
                    onSuccess: () => {
                        // Invalidate product caches when new product created
                        queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
                        queryClient.invalidateQueries({ queryKey: getGetProductsByBrandQueryKey({ brandId: '' }, {}) });
                        queryClient.invalidateQueries({ queryKey: getGetProductsByCategoryQueryKey({ categoryId: '' }, {}) });
                    },
                    onError: (error) => {
                        console.error('Product creation failed:', error);
                    }
                }
            });
        },
        
        update: () => {
            return useUpdateProduct({
                mutation: {
                    onSuccess: () => {
                        // Invalidate product caches after update
                        queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
                        queryClient.invalidateQueries({ queryKey: getGetProductsByBrandQueryKey({ brandId: '' }, {}) });
                        queryClient.invalidateQueries({ queryKey: getGetProductsByCategoryQueryKey({ categoryId: '' }, {}) });
                    },
                    onError: (error) => {
                        console.error('Product update failed:', error);
                    }
                }
            });
        },
        
        delete: () => {
            return useDeleteProduct({
                mutation: {
                    onSuccess: () => {
                        // Invalidate product caches after deletion
                        queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
                        queryClient.invalidateQueries({ queryKey: getGetProductsByBrandQueryKey({ brandId: '' }, {}) });
                        queryClient.invalidateQueries({ queryKey: getGetProductsByCategoryQueryKey({ categoryId: '' }, {}) });
                    },
                    onError: (error) => {
                        console.error('Product deletion failed:', error);
                    }
                }
            });
        },

        // Image management hooks
        uploadImage: () => {
            return useUploadProductImage({
                mutation: {
                    onSuccess: () => {
                        // Invalidate relevant product caches after image upload
                        queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
                    },
                    onError: (error) => {
                        console.error('Product image upload failed:', error);
                    }
                }
            });
        },
        
        deleteImage: () => {
            return useDeleteProductImage({
                mutation: {
                    onSuccess: () => {
                        // Invalidate relevant product caches after image deletion
                        queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
                    },
                    onError: (error) => {
                        console.error('Product image deletion failed:', error);
                    }
                }
            });
        },
        
        // Cache management utilities
        invalidateCache: {
            all: () => {
                queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
                queryClient.invalidateQueries({ queryKey: getGetProductsByBrandQueryKey({ brandId: '' }, {}) });
                queryClient.invalidateQueries({ queryKey: getGetProductsByCategoryQueryKey({ categoryId: '' }, {}) });
                queryClient.removeQueries({ queryKey: getSearchProductsQueryKey() });
            },
            search: () => {
                queryClient.removeQueries({ queryKey: getSearchProductsQueryKey() });
            }
        }
    };
};