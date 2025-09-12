// hooks/api/permission-hooks.ts
import { useQueryClient } from '@tanstack/react-query';
import {
    useGetUserPermissions,
    getGetUserPermissionsQueryKey,
    getUserPermissions
} from '@/gen/api/hooks/user_management/permissions';

/**
 * Permission management hooks with optimized caching and error handling
 * Provides a consistent interface for all permission-related operations
 */
export const usePermissionHooks = () => {
    const queryClient = useQueryClient();
    
    // Create const objects for each hook with predefined caching and invalidation
    const permissionHooks = {
        // Query hooks with predefined cache times
        getUserPermissions: (userId: string) => {
            return useGetUserPermissions(
                { userId },
                {
                    query: {
                        staleTime: 3 * 60 * 1000,        // 3 minutes
                        gcTime: 8 * 60 * 1000,           // 8 minutes
                        enabled: !!userId,
                        refetchOnWindowFocus: false
                    }
                }
            );
        },
        
        // Cache invalidation utilities
        invalidateCache: {
            all: () => {
                queryClient.invalidateQueries({ 
                    queryKey: ['user-management', 'api', 'v1', 'permissions'] 
                });
            },
            userPermissions: (userId: string) => {
                queryClient.invalidateQueries({ 
                    queryKey: getGetUserPermissionsQueryKey({ userId }) 
                });
            }
        },
        
        // Cache management utilities
        prefetchUserPermissions: async (userId: string) => {
            return queryClient.prefetchQuery({
                queryKey: getGetUserPermissionsQueryKey({ userId }),
                queryFn: () => getUserPermissions({ userId }),
                staleTime: 3 * 60 * 1000
            });
        }
    };
    
    return permissionHooks;
};