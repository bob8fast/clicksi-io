// hooks/use-brand-product.ts
import { useQueryClient } from '@tanstack/react-query';
import {
    useGetBrandProducts,
    useUpdateRetailerRequestStatus,
    getGetBrandProductsQueryKey,
} from '@/gen/api/hooks/product_catalog/brand-products';

/**
 * Brand product hooks with optimized caching and error handling
 * Provides a consistent interface for brand product operations
 */

// Hook for fetching brand products
export const useBrandProducts = (brandId: string, params?: any) => {
    return useGetBrandProducts(
        { brandId },
        params,
        {
            query: {
                staleTime: 5 * 60 * 1000,         // 5 minutes
                gcTime: 15 * 60 * 1000,           // 15 minutes
                refetchOnWindowFocus: false,
                retry: 2
            }
        }
    );
};

// Hook for a single brand product
export const useBrandProduct = (brandId: string, productId: string, params?: any) => {
    return useBrandProducts(brandId, { ...params, productId });
};

// Hook for deleting a brand product (using the update status functionality)
export const useDeleteBrandProduct = () => {
    const queryClient = useQueryClient();
    
    return useUpdateRetailerRequestStatus({
        mutation: {
            onSuccess: () => {
                // Invalidate brand products cache after deletion
                queryClient.invalidateQueries({ queryKey: getGetBrandProductsQueryKey({ brandId: '' }, {}) });
            },
            onError: (error) => {
                console.error('Brand product deletion failed:', error);
            }
        }
    });
};