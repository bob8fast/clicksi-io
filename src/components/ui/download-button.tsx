// components/ui/download-button.tsx
'use client'

import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

// Base props shared across all modes
interface BaseDownloadButtonProps
{
    fileName: string;
    onDownloadStart?: () => void;
    onDownloadSuccess?: () => void;
    onDownloadError?: (error: Error) => void;
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg';
    className?: string;
    children?: React.ReactNode;
    disabled?: boolean;
}

// URL mode - direct URL download
interface UrlModeProps extends BaseDownloadButtonProps
{
    mode: 'url';
    fileUrl: string;
}

// Action mode - custom function that returns blob
interface ActionModeProps extends BaseDownloadButtonProps
{
    mode: 'action';
    downloadAction: () => Promise<Blob>;
}

type DownloadButtonProps = UrlModeProps | ActionModeProps;

export function DownloadButton(props: DownloadButtonProps)
{
    const [isDownloading, setIsDownloading] = useState(false);

    const {
        fileName,
        onDownloadStart,
        onDownloadSuccess,
        onDownloadError,
        variant = 'outline',
        size = 'sm',
        className = '',
        children,
        disabled = false
    } = props;

    const downloadBlob = useCallback((blob: Blob, filename: string) =>
    {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, []);

    const handleUrlDownload = useCallback(async (fileUrl: string) =>
    {
        // First try to download directly if same origin or CORS is properly configured
        if (fileUrl.startsWith('/') || fileUrl.startsWith(window.location.origin))
        {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return;
        }

        // For external URLs or when we need to fetch the file
        const response = await fetch(fileUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/octet-stream',
            },
        });

        if (!response.ok)
        {
            throw new Error(`Download failed: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        downloadBlob(blob, fileName);
    }, [fileName, downloadBlob]);

    const handleActionDownload = useCallback(async () =>
    {
        if (props.mode !== 'action') return;

        const blob = await props.downloadAction();
        downloadBlob(blob, fileName);
    }, [props, downloadBlob, fileName]);

    const handleDownload = useCallback(async () =>
    {
        if (isDownloading || disabled) return;

        setIsDownloading(true);
        onDownloadStart?.();

        try
        {
            switch (props.mode)
            {
                case 'url':
                    await handleUrlDownload(props.fileUrl);
                    break;
                case 'action':
                    await handleActionDownload();
                    break;
                default:
                    throw new Error('Invalid download mode');
            }

            onDownloadSuccess?.();
        } catch (error)
        {
            console.error('Download failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Download failed';
            onDownloadError?.(error instanceof Error ? error : new Error(errorMessage));
            toast.error(`Download failed: ${errorMessage}`);
        } finally
        {
            setIsDownloading(false);
        }
    }, [
        isDownloading,
        disabled,
        props,
        handleUrlDownload,
        handleActionDownload,
        onDownloadStart,
        onDownloadSuccess,
        onDownloadError
    ]);

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleDownload}
            disabled={isDownloading || disabled}
            className={className}
        >
            {isDownloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Download className="w-4 h-4 mr-2" />
            )}
            {children || (isDownloading ? 'Downloading...' : 'Download')}
        </Button>
    );
}

// // Example usage components showing both modes

// // 1. URL Mode - Direct URL download
// export function DocumentDownloadButtonUrl({ document }: { document: any })
// {
//     return (
//         <DownloadButton
//             mode="url"
//             fileUrl={document.downloadUrl}
//             fileName={document.name}
//             onDownloadSuccess={() => console.log('Downloaded via URL')}
//         />
//     );
// }

// // 2. Action Mode - Custom download function
// export function DocumentDownloadButtonAction({ document }: { document: any })
// {
//     const downloadAction = useCallback(async (): Promise<Blob> =>
//     {
//         // Custom download logic - could be a direct API call, 
//         // or any other logic that returns a Blob
//         const response = await fetch(`/api/documents/${document.id}/download`, {
//             headers: {
//                 'Authorization': `Bearer ${getToken()}`,
//             },
//         });

//         if (!response.ok)
//         {
//             throw new Error('Download failed');
//         }

//         return response.blob();
//     }, [document.id]);

//     return (
//         <DownloadButton
//             mode="action"
//             downloadAction={downloadAction}
//             fileName={document.name}
//             onDownloadSuccess={() => console.log('Downloaded via Action')}
//         />
//     );
// }