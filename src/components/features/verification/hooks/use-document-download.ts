// hooks/use-document-download.ts
'use client'

import { useVerificationHooks } from '@/hooks/api';
import
{
    DOWNLOAD_ERROR_MESSAGES,
    createDocumentPreviewUrl,
    createInitialDownloadState,
    downloadDocumentFromBlob,
    finishDownloadState,
    getDownloadFilename,
    startDownloadState,
    validateDocumentForDownload
} from '@/lib/document-download-utils';
import { VerificationDocumentDto } from '@/types';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export interface UseDocumentDownloadOptions {
    /**
     * Show success toast message on successful download
     * @default true
     */
    showSuccessToast?: boolean;
    
    /**
     * Show error toast message on download failure
     * @default true
     */
    showErrorToast?: boolean;
    
    /**
     * Custom success message for toast
     */
    successMessage?: string;
    
    /**
     * Custom error message for toast
     */
    errorMessage?: string;
    
    /**
     * Callback fired on successful download
     */
    onSuccess?: (document: VerificationDocumentDto, blob: Blob) => void;
    
    /**
     * Callback fired on download error
     */
    onError?: (document: VerificationDocumentDto, error: unknown) => void;
}

export interface UseDocumentDownloadReturn
{
    /**
     * Download a document by triggering browser download
     * @param document - Document to download
     * @returns Promise that resolves when download is initiated
     */
    downloadDocument: (document: VerificationDocumentDto) => Promise<void>;

    /**
     * Get document blob without triggering download (for preview purposes)
     * @param document - Document to get blob for
     * @returns Promise that resolves to blob
     */
    getDocumentBlob: (document: VerificationDocumentDto) => Promise<Blob>;

    /**
     * Create blob URL for document (useful for preview)
     * @param document - Document to create URL for
     * @returns Promise that resolves to blob URL
     */
    createDocumentBlobUrl: (document: VerificationDocumentDto) => Promise<string>;

    /**
     * Loading state for any download operation
     */
    isDownloading: boolean;

    /**
     * ID of currently downloading document (if any)
     */
    downloadingDocumentId: string | null;
}

/**
 * Custom hook for handling verification document downloads
 * Provides centralized logic for downloading documents with proper error handling,
 * loading states, and toast notifications.
 */
export function useDocumentDownload(options: UseDocumentDownloadOptions = {}): UseDocumentDownloadReturn
{
    const {
        showSuccessToast = true,
        showErrorToast = true,
        successMessage = 'Document downloaded successfully',
        errorMessage = 'Failed to download document',
        onSuccess,
        onError
    } = options;

    const verificationHooks = useVerificationHooks();
    const [downloadState, setDownloadState] = useState(createInitialDownloadState());

    /**
     * Get document blob from API
     */
    const getDocumentBlob = useCallback(async (document: VerificationDocumentDto): Promise<Blob> =>
    {
        validateDocumentForDownload(document);

        const blob = await verificationHooks.downloadDocument({ documentId: document.id! });

        if (!(blob instanceof Blob))
        {
            throw new Error(DOWNLOAD_ERROR_MESSAGES.INVALID_BLOB);
        }

        return blob;
    }, [verificationHooks]);

    /**
     * Create blob URL for document
     */
    const createDocumentBlobUrl = useCallback(async (document: VerificationDocumentDto): Promise<string> =>
    {
        return createDocumentPreviewUrl(() => getDocumentBlob(document));
    }, [getDocumentBlob]);

    /**
     * Download document by triggering browser download
     */
    const downloadDocument = useCallback(async (verificationDocument: VerificationDocumentDto): Promise<void> =>
    {
        try
        {
            validateDocumentForDownload(verificationDocument);
        } catch (error)
        {
            if (showErrorToast)
            {
                toast.error(errorMessage || DOWNLOAD_ERROR_MESSAGES.NO_ID);
            }
            if (onError)
            {
                onError(verificationDocument, error);
            }
            throw error;
        }

        setDownloadState(startDownloadState(verificationDocument.id!));

        try
        {
            const blob = await getDocumentBlob(verificationDocument);
            const filename = getDownloadFilename(verificationDocument);

            downloadDocumentFromBlob(blob, filename, {
                onSuccess: () =>
                {
                    if (showSuccessToast)
                    {
                        toast.success(successMessage || 'Document downloaded successfully');
                    }

                    if (onSuccess)
                    {
                        onSuccess(verificationDocument, blob);
                    }
                },
                onError: (downloadError) =>
                {
                    throw downloadError;
                }
            });
        } catch (error)
        {
            console.error('Document download failed:', error);

            if (showErrorToast)
            {
                toast.error(errorMessage || DOWNLOAD_ERROR_MESSAGES.DOWNLOAD_FAILED);
            }

            if (onError)
            {
                onError(verificationDocument, error);
            }

            throw error;
        } finally
        {
            setDownloadState(finishDownloadState());
        }
    }, [
        getDocumentBlob,
        showSuccessToast,
        showErrorToast,
        successMessage,
        errorMessage,
        onSuccess,
        onError
    ]);

    return {
        downloadDocument,
        getDocumentBlob,
        createDocumentBlobUrl,
        isDownloading: downloadState.isDownloading,
        downloadingDocumentId: downloadState.downloadingDocumentId
    };
}

/**
 * Hook specifically for document preview functionality
 * Returns only the blob URL creation function with simplified interface
 */
export function useDocumentPreview()
{
    const { createDocumentBlobUrl, getDocumentBlob } = useDocumentDownload({
        showSuccessToast: false,
        showErrorToast: false
    });

    return {
        createDocumentBlobUrl,
        getDocumentBlob
    };
}