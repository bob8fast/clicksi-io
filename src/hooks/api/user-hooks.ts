// hooks/api/user-hooks.ts
import
{
    useGetUserById,
    useGetUserByUsername,
    useSearchUsers,
    useUpdateUserProfile,
    useUpdateUserStatus,
} from '@/gen/api/hooks/user_management/users';
import
{
    useGetUserBasicInfo,
    useGetUserNotificationPreferences,
    useUpdateUserNotificationPreferences,
} from '@/gen/api/hooks/user_management/notification-preferences';

import
{
    useGetUserPermissions,
} from '@/gen/api/hooks/user_management/permissions';

import
{
    useCheckFeatureAccess,
    useGetUsageLimits,
    useResetUsage,
    useUpdateUsage
} from '@/gen/api/hooks/user_management/usage';

import
{
    useGetProfilePicture,
    useMoveToPermanent,
    useUploadImage,
} from '@/gen/api/hooks/user_management/user-images';
import { SearchUsersParams } from '@/gen/api/types';

import
{
    useChangePassword,
    useCreateAdminAccount,
    useForgotPassword,
    useRegisterAccount,
    useResetPassword,
} from '@/gen/api/hooks/auth_service/account';

import { useQueryClient } from '@tanstack/react-query';

import
{
    useExternalLogin,
    useGetExternalLogins,
    useGetExternalProviders,
    useHandleExternalLoginCallback,
    useLinkExternalLogin,
    useRemoveExternalLogin,
} from '@/gen/api/hooks/auth_service/external-auth';

import {
    useCompleteMfaSetup,
    useDisableMfa,
    useDisableMfaProvider,
    useGenerateMfaChallenge,
    useGenerateRecoveryCodes,
    useGetMfaStatus,
    useGetRecoveryCodesCount,
    useSendEmailCode,
    useSendSmsCode,
    useSetPreferredMfaProvider,
    useSetupMfaProvider,
} from '@/gen/api/hooks/auth_service/mfa';

/**
 * Multi-Factor Authentication hooks
 * Provides organized interface for MFA operations
 */
export const useMfaHooks = () => ({
    status: useGetMfaStatus,
    recoveryCodesCount: useGetRecoveryCodesCount,
    setup: useSetupMfaProvider(),
    completeSetup: useCompleteMfaSetup(),
    generateChallenge: useGenerateMfaChallenge(),
    setPreferred: useSetPreferredMfaProvider(),
    disableProvider: useDisableMfaProvider(),
    disableAll: useDisableMfa(),
    generateRecoveryCodes: useGenerateRecoveryCodes(),
    sendEmailCode: useSendEmailCode(),
    sendSmsCode: useSendSmsCode(),
});

/**
 * Authentication hooks with optimized caching and error handling
 * Provides a consistent interface for all auth-related operations
 */
export const useAuthHooks = () => ({
    // Account management
    register: useRegisterAccount(),
    changePassword: useChangePassword(),
    forgotPassword: useForgotPassword(),
    resetPassword: useResetPassword(),

    // Email verification (placeholder functions - need to be implemented)
    verifyEmail: () => ({
        mutateAsync: async ({ userId, token }: { userId: string; token: string }) =>
        {
            // TODO: Implement email verification API call
            console.warn('Email verification not yet implemented in the API');
            throw new Error('Email verification endpoint not available');
        },
        isPending: false,
    }),
    resendEmailVerification: () => ({
        mutateAsync: async (email: string) =>
        {
            // TODO: Implement resend email verification API call
            console.warn('Resend email verification not yet implemented in the API');
            throw new Error('Resend email verification endpoint not available');
        },
        isPending: false,
    }),

    // External auth
    getExternalProviders: useGetExternalProviders,
    externalLogin: useExternalLogin,
    externalLoginCallback: useHandleExternalLoginCallback,
    getExternalLogins: useGetExternalLogins,
    linkExternalLogin: useLinkExternalLogin(),
    removeExternalLogin: useRemoveExternalLogin(),
});

export const useAdminHooks = () => ({
    createAdminAccount: useCreateAdminAccount(),
});

/**
 * User management hooks with optimized caching and error handling
 */
export const useUserHooks = () =>
{
    const queryClient = useQueryClient();

    return {
        getById: useGetUserById,
        getByUsername: useGetUserByUsername,
        getBasicInfo: useGetUserBasicInfo,

        // Search hooks with optimized caching
        search: (params?: SearchUsersParams) =>
        {
            return useSearchUsers(
                params,
                {
                    query: {
                        staleTime: 2 * 60 * 1000,         // 2 minutes (search results change frequently)
                        gcTime: 5 * 60 * 1000,            // 5 minutes
                        refetchOnWindowFocus: false,
                        retry: 1,
                        enabled: !!params // Only search when params are provided
                    }
                }
            );
        },

        // Mutation hooks with cache invalidation
        updateProfile: () =>
        {
            return useUpdateUserProfile({
                mutation: {
                    onSuccess: () =>
                    {
                        // Invalidate user caches after profile update
                        queryClient.invalidateQueries({ queryKey: ['users'] });
                        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
                    },
                    onError: (error) =>
                    {
                        console.error('Profile update failed:', error);
                    }
                }
            });
        },

        updateStatus: () =>
        {
            return useUpdateUserStatus({
                mutation: {
                    onSuccess: () =>
                    {
                        // Invalidate user caches after status update
                        queryClient.invalidateQueries({ queryKey: ['users'] });
                    },
                    onError: (error) =>
                    {
                        console.error('Status update failed:', error);
                    }
                }
            });
        },

        // Permissions
        getPermissions: useGetUserPermissions,

        // Usage & limits
        getUsageLimits: useGetUsageLimits,
        checkFeature: useCheckFeatureAccess,
        updateUsage: useUpdateUsage(),
        resetUsage: useResetUsage(),

        // Images
        getProfilePicture: useGetProfilePicture,
        uploadImage: () =>
        {
            return useUploadImage({
                mutation: {
                    onSuccess: () =>
                    {
                        // Invalidate user profile cache after image upload
                        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
                        queryClient.invalidateQueries({ queryKey: ['users'] });
                    },
                    onError: (error) =>
                    {
                        console.error('Image upload failed:', error);
                    }
                }
            });
        },
        moveToPermanent: useMoveToPermanent(),

        // Notifications
        getNotificationPreferences: useGetUserNotificationPreferences,
        updateNotificationPreferences: () =>
        {
            return useUpdateUserNotificationPreferences({
                mutation: {
                    onSuccess: () =>
                    {
                        // Invalidate notification preferences cache after update
                        queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
                    },
                    onError: (error) =>
                    {
                        console.error('Notification preferences update failed:', error);
                    }
                }
            });
        },

        // Cache management utilities
        invalidateCache: {
            all: () =>
            {
                queryClient.invalidateQueries({ queryKey: ['users'] });
                queryClient.invalidateQueries({ queryKey: ['user-profile'] });
                queryClient.removeQueries({ queryKey: ['user-search'] });
            },
            search: () =>
            {
                queryClient.removeQueries({ queryKey: ['user-search'] });
            }
        }
    };
};