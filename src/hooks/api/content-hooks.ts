// hooks/api/content-hooks.ts
import
{
    useCreateContent,
    useDeleteContent,
    useGetComments,
    useGetContentById,
    useGetContents,
    useRemoveProductTag,
    useScheduleContent,
    useSearchContents,
    useTagProduct,
    useUpdateContent,
} from '@/gen/api/hooks/content_management/content';

import
{
    useAddComment,
    useDeleteComment,
    useUpdateComment,
} from '@/gen/api/hooks/content_management/engagement';

import
{
    useUploadMedia,
} from '@/gen/api/hooks/content_management/media';

import
{
    useConnectSocialAccount,
    useDisconnectSocialAccount,
    useGetAvailableSocialContent,
    useGetConnectedAccounts,
    useImportSocialContent,
} from '@/gen/api/hooks/content_management/social-account';

/**
 * Social account hooks
 */
export const useSocialAccountHooks = () => ({
    getConnected: useGetConnectedAccounts,
    getAvailableContent: useGetAvailableSocialContent,
    connect: useConnectSocialAccount(),
    disconnect: useDisconnectSocialAccount(),
    importContent: useImportSocialContent(),
});

/**
 * Content management hooks
 * Provides organized interface for content operations
 */
export const useContentHooks = () => ({
    getAll: useGetContents,
    getById: useGetContentById,
    getComments: useGetComments,
    search: useSearchContents,
    create: useCreateContent(),
    update: useUpdateContent(),
    delete: useDeleteContent(),
    schedule: useScheduleContent(),

    // Product tagging
    tagProduct: useTagProduct(),
    removeProductTag: useRemoveProductTag(),

    // Comments
    addComment: useAddComment(),
    updateComment: useUpdateComment(),
    deleteComment: useDeleteComment(),

    // Media
    uploadMedia: useUploadMedia(),
});

import
{
    useAddContentToCollection,
    useCreateCollection as useCreateContentCollection,
    useDeleteCollection as useDeleteContentCollection,
    useGetCollectionById as useGetContentCollectionById,
    useGetCollections as useGetContentCollections,
    useRemoveContentFromCollection,
    useReorderCollectionContents,
    useUpdateCollection as useUpdateContentCollection,
} from '@/gen/api/hooks/content_management/collection';

/**
 * Content collection management hooks
 * Provides organized interface for content collection operations
 */
export const useContentCollectionHooks = () => ({
    getAll: useGetContentCollections,
    getById: useGetContentCollectionById,
    create: useCreateContentCollection(),
    update: useUpdateContentCollection(),
    delete: useDeleteContentCollection(),
    addContent: useAddContentToCollection(),
    removeContent: useRemoveContentFromCollection(),
    reorderContents: useReorderCollectionContents(),
});