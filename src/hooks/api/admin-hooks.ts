// hooks/api/admin-hooks.ts
import { useQueryClient } from '@tanstack/react-query';

// Admin management hooks
import {
    useGetAllAdmins,
    useGetAdminById,
    useSearchAdmins,
    usePromoteAdmin,
    useGrantPermissions,
    useRevokePermissions,
    useResetPermissions,
    useGetPermissions,
    getGetAllAdminsQueryKey,
    getGetAdminByIdQueryKey,
    getSearchAdminsQueryKey,
    getGetPermissionsQueryKey
} from '@/gen/api/hooks/user_management/admin-management';

// Admin account creation from auth service
import {
    useCreateAdminAccount
} from '@/gen/api/hooks/auth_service/account';
import { GetAllAdminsParams, SearchAdminsParams } from '@/gen/api/types';

/**
 * Admin management hooks with optimized caching and error handling
 * Provides a consistent interface for all admin-related operations
 */
export const useAdminHooks = () => {
    const queryClient = useQueryClient();
    
    // Create const objects for each hook with predefined caching and invalidation
    const adminHooks = {
        // Query hooks with predefined cache times
        getAll: (params?: GetAllAdminsParams) => {
            return useGetAllAdmins(
                params,
                {
                    query: {
                        staleTime: 5 * 60 * 1000,        // 5 minutes
                        gcTime: 10 * 60 * 1000,          // 10 minutes
                        refetchOnWindowFocus: false
                    }
                }
            );
        },
        
        getById: (adminId: string) => {
            return useGetAdminById(
                { adminId },
                {
                    query: {
                        staleTime: 2 * 60 * 1000,        // 2 minutes
                        gcTime: 5 * 60 * 1000,           // 5 minutes
                        enabled: !!adminId,
                        refetchOnWindowFocus: false
                    }
                }
            );
        },
        
        search: (params?: SearchAdminsParams) => {
            return useSearchAdmins(
                params,
                {
                    query: {
                        staleTime: 2 * 60 * 1000,        // 2 minutes (search results)
                        gcTime: 5 * 60 * 1000,           // 5 minutes
                        refetchOnWindowFocus: false,
                        enabled: !!params
                    }
                }
            );
        },
        
        getPermissions: (adminId: string) => {
            return useGetPermissions(
                { adminId },
                {
                    query: {
                        staleTime: 5 * 60 * 1000,        // 5 minutes
                        gcTime: 10 * 60 * 1000,          // 10 minutes
                        enabled: !!adminId,
                        refetchOnWindowFocus: false
                    }
                }
            );
        },
        
        // Mutation hooks with cache invalidation
        createAdminAccount: () => {
            return useCreateAdminAccount({
                mutation: {
                    onSuccess: () => {
                        // Invalidate admin list cache after creation
                        queryClient.invalidateQueries({ 
                            queryKey: getGetAllAdminsQueryKey() 
                        });
                    },
                    onError: (error) => {
                        console.error('Admin account creation failed:', error);
                    }
                }
            });
        },
        
        promoteAdmin: () => {
            return usePromoteAdmin({
                mutation: {
                    onSuccess: (data, variables) => {
                        // Invalidate specific admin and list caches
                        queryClient.invalidateQueries({ 
                            queryKey: getGetAdminByIdQueryKey({ adminId: variables.pathParams.adminId }) 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetAllAdminsQueryKey() 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetPermissionsQueryKey({ adminId: variables.pathParams.adminId }) 
                        });
                    },
                    onError: (error) => {
                        console.error('Admin promotion failed:', error);
                    }
                }
            });
        },
        
        grantPermissions: () => {
            return useGrantPermissions({
                mutation: {
                    onSuccess: (data, variables) => {
                        // Invalidate specific admin and permissions caches
                        queryClient.invalidateQueries({ 
                            queryKey: getGetAdminByIdQueryKey({ adminId: variables.pathParams.adminId }) 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetPermissionsQueryKey({ adminId: variables.pathParams.adminId }) 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetAllAdminsQueryKey() 
                        });
                    },
                    onError: (error) => {
                        console.error('Grant permissions failed:', error);
                    }
                }
            });
        },
        
        revokePermissions: () => {
            return useRevokePermissions({
                mutation: {
                    onSuccess: (data, variables) => {
                        // Invalidate specific admin and permissions caches
                        queryClient.invalidateQueries({ 
                            queryKey: getGetAdminByIdQueryKey({ adminId: variables.pathParams.adminId }) 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetPermissionsQueryKey({ adminId: variables.pathParams.adminId }) 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetAllAdminsQueryKey() 
                        });
                    },
                    onError: (error) => {
                        console.error('Revoke permissions failed:', error);
                    }
                }
            });
        },
        
        resetPermissions: () => {
            return useResetPermissions({
                mutation: {
                    onSuccess: (data, variables) => {
                        // Invalidate specific admin and permissions caches
                        queryClient.invalidateQueries({ 
                            queryKey: getGetAdminByIdQueryKey({ adminId: variables.pathParams.adminId }) 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetPermissionsQueryKey({ adminId: variables.pathParams.adminId }) 
                        });
                        queryClient.invalidateQueries({ 
                            queryKey: getGetAllAdminsQueryKey() 
                        });
                    },
                    onError: (error) => {
                        console.error('Reset permissions failed:', error);
                    }
                }
            });
        },
        
        // Cache invalidation utilities
        invalidateCache: {
            all: () => {
                queryClient.invalidateQueries({ 
                    queryKey: ['user-management', 'api', 'v1', 'admin-management'] 
                });
            },
            admin: (adminId: string) => {
                queryClient.invalidateQueries({ 
                    queryKey: getGetAdminByIdQueryKey({ adminId }) 
                });
                queryClient.invalidateQueries({ 
                    queryKey: getGetPermissionsQueryKey({ adminId }) 
                });
            },
            list: () => {
                queryClient.invalidateQueries({ 
                    queryKey: getGetAllAdminsQueryKey() 
                });
            },
            search: () => {
                queryClient.invalidateQueries({ 
                    queryKey: getSearchAdminsQueryKey() 
                });
            }
        },
        
        // Cache management utilities
        prefetchAdmin: async (adminId: string) => {
            return queryClient.prefetchQuery({
                queryKey: getGetAdminByIdQueryKey({ adminId }),
                queryFn: () => useGetAdminById({ adminId }),
                staleTime: 5 * 60 * 1000
            });
        }
    };
    
    return adminHooks;
};