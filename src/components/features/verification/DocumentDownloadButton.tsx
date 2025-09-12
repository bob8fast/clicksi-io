// components/verification/DocumentDownloadButton.tsx
'use client'

import { Button } from '@/components/ui/button';
import { VerificationDocumentDto } from '@/types';
import { Download } from 'lucide-react';
import { useDocumentDownload } from './hooks';
import { formatFileSize } from '@/lib/file-utils';

interface DocumentDownloadButtonProps
{
    document: VerificationDocumentDto;
    variant?: 'default' | 'outline' | 'ghost';
    size?: "default" | "sm" | "lg" | undefined;
    className?: string;
    showFileInfo?: boolean;
    disabled?: boolean;
    children?: React.ReactNode;
}


export function DocumentDownloadButton({
    document,
    variant = 'outline',
    size = 'sm',
    className = '',
    showFileInfo = false,
    disabled = false,
    children
}: DocumentDownloadButtonProps)
{
    const { downloadDocument, isDownloading, downloadingDocumentId } = useDocumentDownload();
    
    const isCurrentDocumentDownloading = downloadingDocumentId === document.id;

    
    const handleDownload = async () => {
        try {
            await downloadDocument(document);
        } catch (error) {
            // Error handling is done in the hook
            console.error('Download failed:', error);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <Button
                variant={variant}
                size={size}
                onClick={handleDownload}
                disabled={disabled || isCurrentDocumentDownloading}
                className={className}
            >
                <Download className="w-4 h-4 mr-2" />
                {children || (isCurrentDocumentDownloading ? 'Downloading...' : 'Download')}
            </Button>
            {showFileInfo && (
                <div className="text-xs text-[#575757]">
                    {formatFileSize(document.file_size || 0)}
                </div>
            )}
        </div>
    );
}
