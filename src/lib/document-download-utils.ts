// lib/document-download-utils.ts
// Consolidated document download utilities

import { createBlobUrl, revokeBlobUrl, sanitizeFilename } from './file-utils';

/**
 * Generic document interface for download operations
 */
export interface DownloadableDocument
{
    id?: string;
    file_name?: string;
    download_url?: string;
    [key: string]: any;
}

/**
 * Downloads a document by creating and triggering a download link
 */
export const downloadDocumentFromBlob = (
    blob: Blob,
    filename: string,
    options: { onSuccess?: () => void; onError?: (error: Error) => void } = {}
): void =>
{
    try
    {
        // Create download link and trigger download
        const url = createBlobUrl(blob as File);
        const link = document.createElement('a');
        link.href = url;
        link.download = sanitizeFilename(filename);

        // Append to body, click, and cleanup
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cleanup blob URL
        revokeBlobUrl(url);

        options.onSuccess?.();
    } catch (error)
    {
        const downloadError = error instanceof Error ? error : new Error('Download failed');
        options.onError?.(downloadError);
        throw downloadError;
    }
};

/**
 * Creates a blob URL for document preview
 */
export const createDocumentPreviewUrl = async (
    getBlob: () => Promise<Blob>
): Promise<string> =>
{
    try
    {
        const blob = await getBlob();
        return createBlobUrl(blob as File);
    } catch (error)
    {
        console.error('Failed to create document preview URL:', error);
        throw error;
    }
};

/**
 * Validates document has required properties for download
 */
export const validateDocumentForDownload = (document: DownloadableDocument): void =>
{
    if (!document.id)
    {
        throw new Error('Document ID is required for download');
    }
};

/**
 * Gets safe filename for download
 */
export const getDownloadFilename = (document: DownloadableDocument): string =>
{
    return document.file_name || 'document';
};

/**
 * Common error messages for document downloads
 */
export const DOWNLOAD_ERROR_MESSAGES = {
    NO_ID: 'Document ID is required for download',
    INVALID_BLOB: 'Invalid response: expected blob',
    DOWNLOAD_FAILED: 'Failed to download document',
    PREVIEW_FAILED: 'Failed to load document preview'
} as const;

/**
 * Generic document download state management
 */
export interface DocumentDownloadState
{
    isDownloading: boolean;
    downloadingDocumentId: string | null;
}

/**
 * Creates initial download state
 */
export const createInitialDownloadState = (): DocumentDownloadState => ({
    isDownloading: false,
    downloadingDocumentId: null
});

/**
 * Updates download state for starting download
 */
export const startDownloadState = (documentId: string): DocumentDownloadState => ({
    isDownloading: true,
    downloadingDocumentId: documentId
});

/**
 * Updates download state for finishing download
 */
export const finishDownloadState = (): DocumentDownloadState => ({
    isDownloading: false,
    downloadingDocumentId: null
});