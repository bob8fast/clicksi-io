// components/FileList.tsx
'use client'

import React from 'react';
import { FileWithId, PreviewConfig } from '../types/file-uploader.types';
import { FilePreview } from './FilePreview';

interface FileListProps {
    files: FileWithId[];
    previewUrls?: Record<string, string>; // fileId -> signed URL mapping
    uploadProgress?: Record<string, number>; // fileId -> progress mapping
    uploadErrors?: Record<string, string>; // fileId -> error mapping
    preview?: PreviewConfig;
    isProcessing?: boolean;
    disabled?: boolean;
    onFileRemove?: (fileId: string) => void;
    onFileView?: (file: FileWithId) => void;
    onFileDownload?: (file: FileWithId) => void;
    theme?: 'dark' | 'light';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    // Custom render functions
    renderCustomPreview?: (file: FileWithId, previewUrl: string | null) => React.ReactNode;
    renderCustomProgress?: (file: FileWithId, progress: number) => React.ReactNode;
    renderCustomError?: (file: FileWithId, error: string) => React.ReactNode;
}

export const FileList: React.FC<FileListProps> = ({
    files,
    previewUrls,
    uploadProgress,
    uploadErrors,
    preview,
    isProcessing = false,
    disabled = false,
    onFileRemove,
    onFileView,
    onFileDownload,
    theme = 'dark',
    size = 'md',
    className = '',
    renderCustomPreview,
    renderCustomProgress,
    renderCustomError
}) => {
    if (!files.length) {
        return null;
    }

    // Determine layout based on preview type
    const isGalleryLayout = preview?.type === 'gallery';

    return (
        <div 
            className={`${
                isGalleryLayout 
                    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4' 
                    : 'space-y-3'
            } ${className}`}
        >
            {files.map((file) => (
                <FilePreview
                    key={file.fileId}
                    file={file}
                    previewUrl={previewUrls?.[file.fileId]}
                    preview={preview}
                    uploadProgress={uploadProgress?.[file.fileId]}
                    uploadError={uploadErrors?.[file.fileId]}
                    isProcessing={isProcessing}
                    disabled={disabled}
                    onRemove={onFileRemove}
                    onView={onFileView}
                    onDownload={onFileDownload}
                    theme={theme}
                    size={size}
                    renderCustomPreview={renderCustomPreview}
                    renderCustomProgress={renderCustomProgress}
                    renderCustomError={renderCustomError}
                />
            ))}
        </div>
    );
};