
import
{
    useBatchCreateLinks,
    useCreateLink,
    useDeleteLink,
    useGetLink,
    useGetLinks,
    useGetLinkStatistics,
    useUpdateLink,
} from '@/gen/api/hooks/link_management/link';

import
{
    useAddLinkToCollection,
    useCreateCollection as useCreateLinkCollection,
    useDeleteCollection as useDeleteLinkCollection,
    useGetCollection as useGetLinkCollection,
    useGetCollections as useGetLinkCollections,
    useRemoveLinkFromCollection,
    useUpdateCollection as useUpdateLinkCollection,
} from '@/gen/api/hooks/link_management/collections';

import
{
    useDeleteQrCode,
    useGenerateQrCode,
    useGetQrCode,
    useGetQrCodeByLinkId,
    useUpdateQrCode,
} from '@/gen/api/hooks/link_management/qr-code';

/**
 * Link management hooks
 */
export const useLinkHooks = () => ({
    getAll: useGetLinks,
    getById: useGetLink,
    getStatistics: useGetLinkStatistics,
    create: useCreateLink(),
    update: useUpdateLink(),
    delete: useDeleteLink(),
    batchCreate: useBatchCreateLinks(),
});

/**
 * Link collection hooks
 */
export const useLinkCollectionHooks = () => ({
    getAll: useGetLinkCollections,
    getById: useGetLinkCollection,
    create: useCreateLinkCollection(),
    update: useUpdateLinkCollection(),
    delete: useDeleteLinkCollection(),
    addLink: useAddLinkToCollection(),
    removeLink: useRemoveLinkFromCollection(),
});

/**
 * QR Code hooks
 */
export const useQrCodeHooks = () => ({
    get: useGetQrCode,
    getByLinkId: useGetQrCodeByLinkId,
    generate: useGenerateQrCode(),
    update: useUpdateQrCode(),
    delete: useDeleteQrCode(),
});
