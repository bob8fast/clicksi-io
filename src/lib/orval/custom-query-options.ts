/**
 * Custom query options for React Query v5
 * This file provides custom query options based on cache strategies
 */

export const customQueryOptions = (
    options: any
) => {
    // Extract the passed options and merge with our defaults
    const { queryKey, queryFn, ...queryOptions } = options;
    
    return {
        // Preserve the essential query options passed by orval
        queryKey,
        queryFn,
        
        // Apply our custom defaults, allowing passed options to override
        staleTime: 5 * 60 * 1000,     // 5 minutes
        gcTime: 15 * 60 * 1000,       // 15 minutes
        
        // Enhanced retry logic
        retry: 3,
        
        // Network and error handling
        networkMode: 'online' as const,
        throwOnError: false,
        
        // Performance optimizations
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        
        // Optimize re-renders - only notify on data/error changes
        notifyOnChangeProps: ['data', 'error', 'isLoading', 'isPending'] as const,
        
        // Enable structural sharing for better performance
        structuralSharing: true,
        
        // Better loading states with placeholder data
        //placeholderData: 'keepPreviousData' as const,
        
        // Allow any passed options to override our defaults
        ...queryOptions,
    };
};

export default customQueryOptions;