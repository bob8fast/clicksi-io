// hooks/api/verification-hooks.ts
import {
    useAddVerificationDocument,
    useCreateVerificationApplication,
    useDeleteVerificationDocument,
    useDownloadVerificationDocument,
    useGetMyVerificationApplication,
    useGetPendingVerificationCount,
    useGetVerificationApplication,
    useGetVerificationApplications,
    useGetVerificationDocument,
    useSubmitVerificationApplication,
    useUpdateVerificationApplication,
    useUpdateVerificationStatus,
} from '@/gen/api/hooks/user_management/verification';

/**
 * Verification management hooks
 * Provides organized interface for verification operations
 */
export const useVerificationHooks = () => ({
    getApplications: useGetVerificationApplications,
    getApplication: useGetVerificationApplication,
    getMyApplication: useGetMyVerificationApplication,
    getDocument: useGetVerificationDocument,
    downloadDocument: useDownloadVerificationDocument,
    getPendingCount: useGetPendingVerificationCount,
    createApplication: useCreateVerificationApplication(),
    updateApplication: useUpdateVerificationApplication(),
    updateStatus: useUpdateVerificationStatus(),
    addDocument: useAddVerificationDocument(),
    deleteDocument: useDeleteVerificationDocument(),
    submitApplication: useSubmitVerificationApplication(),
});