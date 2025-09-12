// components/FilePreview.tsx
'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { X, Eye, Download, FileText, Image as ImageIcon, Video, Music, File } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileWithId, PreviewConfig } from '../types/file-uploader.types';
import { formatFileSize } from '@/lib/file-utils';
import { getFileIcon, truncateFileName, createPreviewUrl, revokePreviewUrl } from '../utils/file-utils';
import { THEME_CONFIGS, SIZE_CONFIGS } from '../utils/file-configs';

interface FilePreviewProps {
    file: FileWithId;
    previewUrl?: string; // External signed URL (has priority)
    preview?: PreviewConfig;
    uploadProgress?: number;
    uploadError?: string;
    isProcessing?: boolean;
    disabled?: boolean;
    onRemove?: (fileId: string) => void;
    onView?: (file: FileWithId) => void;
    onDownload?: (file: FileWithId) => void;
    theme?: 'dark' | 'light';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    renderCustomPreview?: (file: FileWithId, previewUrl: string | null) => React.ReactNode;
    renderCustomProgress?: (file: FileWithId, progress: number) => React.ReactNode;
    renderCustomError?: (file: FileWithId, error: string) => React.ReactNode;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
    file,
    previewUrl,
    preview = { enabled: true, type: 'thumbnail' },
    uploadProgress,
    uploadError,
    isProcessing = false,
    disabled = false,
    onRemove,
    onView,
    onDownload,
    theme = 'dark',
    size = 'md',
    className = '',
    renderCustomPreview,
    renderCustomProgress,
    renderCustomError
}) => {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [imageLoadError, setImageLoadError] = useState(false);

    // Get configurations
    const themeConfig = THEME_CONFIGS[theme];
    const sizeConfig = SIZE_CONFIGS[size];

    // Create blob URL for immediate preview if no signed URL
    useEffect(() => {
        if (!previewUrl && preview.enabled && file.file.type.startsWith('image/')) {
            const url = createPreviewUrl(file.file);
            setBlobUrl(url);
        }

        // Cleanup on unmount or when signed URL becomes available
        return () => {
            if (blobUrl) {
                revokePreviewUrl(blobUrl);
            }
        };
    }, [file.file, previewUrl, preview.enabled]);

    // Get the preview URL with priority system
    const getPreviewUrl = useCallback((): string | null => {
        if (!preview.enabled) return null;
        
        // Priority 1: External signed URL (from API)
        if (previewUrl) return previewUrl;
        
        // Priority 2: Blob URL fallback (immediate preview)
        if (blobUrl) return blobUrl;
        
        return null;
    }, [previewUrl, blobUrl, preview.enabled]);

    // Get file icon
    const fileIcon = getFileIcon(file.type);
    const FileIconComponent = {
        image: ImageIcon,
        document: FileText,
        video: Video,
        audio: Music,
        file: File
    }[fileIcon];

    // Current preview URL
    const currentPreviewUrl = getPreviewUrl();

    // File status badges
    const getStatusBadges = () => {
        const badges = [];

        if (uploadProgress !== undefined && uploadProgress < 100) {
            badges.push(
                <Badge key="uploading" variant="secondary" className="bg-blue-500 text-white text-xs">
                    {uploadProgress}%
                </Badge>
            );
        }

        if (uploadProgress === 100) {
            badges.push(
                <Badge key="uploaded" variant="secondary" className="bg-green-500 text-white text-xs">
                    Uploaded
                </Badge>
            );
        }

        if (uploadError) {
            badges.push(
                <Badge key="error" variant="secondary" className="bg-red-500 text-white text-xs">
                    Error
                </Badge>
            );
        }

        if (isProcessing) {
            badges.push(
                <Badge key="processing" variant="secondary" className="bg-yellow-500 text-black text-xs">
                    Processing
                </Badge>
            );
        }

        return badges;
    };

    // Render preview based on type and configuration
    const renderPreview = () => {
        if (renderCustomPreview) {
            return renderCustomPreview(file, currentPreviewUrl);
        }

        if (!preview.enabled) return null;

        if (currentPreviewUrl && file.type.startsWith('image/') && !imageLoadError) {
            const dimensions = preview.dimensions || 
                (size === 'sm' ? { width: 80, height: 80 } :
                 size === 'lg' ? { width: 192, height: 192 } :
                 { width: 128, height: 128 });

            return preview.type === 'full' ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-[#575757]">
                    <Image
                        src={currentPreviewUrl}
                        alt={file.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onError={() => setImageLoadError(true)}
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {getStatusBadges()}
                    </div>
                </div>
            ) : (
                <div 
                    className="relative rounded-lg overflow-hidden border border-[#575757] flex-shrink-0"
                    style={{ 
                        width: dimensions.width, 
                        height: dimensions.height,
                        backgroundColor: themeConfig.colors.background 
                    }}
                >
                    <Image
                        src={currentPreviewUrl}
                        alt={file.name}
                        fill
                        className="object-cover"
                        sizes={`${dimensions.width}px`}
                        onError={() => setImageLoadError(true)}
                    />
                    <div className="absolute top-1 right-1">
                        {getStatusBadges().slice(0, 1)} {/* Show only first badge in thumbnail */}
                    </div>
                </div>
            );
        }

        // File icon fallback
        return (
            <div 
                className={`flex items-center justify-center rounded-lg border border-[#575757] ${sizeConfig.preview}`}
                style={{ backgroundColor: themeConfig.colors.background }}
            >
                <FileIconComponent className={`h-8 w-8 text-[${themeConfig.colors.accent}]`} />
            </div>
        );
    };

    // Render progress if custom renderer not provided
    const renderProgress = () => {
        if (renderCustomProgress && uploadProgress !== undefined) {
            return renderCustomProgress(file, uploadProgress);
        }

        if (uploadProgress !== undefined && uploadProgress < 100) {
            return (
                <div className="w-full bg-[#202020] rounded-full h-2 mt-2">
                    <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                    />
                </div>
            );
        }

        return null;
    };

    // Render error if custom renderer not provided
    const renderError = () => {
        if (renderCustomError && uploadError) {
            return renderCustomError(file, uploadError);
        }

        if (uploadError) {
            return (
                <div className="text-xs text-red-400 mt-1 flex items-center">
                    <span>{uploadError}</span>
                </div>
            );
        }

        return null;
    };

    return (
        <div 
            className={`flex items-start gap-3 p-3 rounded-lg border ${className}`}
            style={{ 
                backgroundColor: themeConfig.colors.background,
                borderColor: themeConfig.colors.border 
            }}
        >
            {/* Preview */}
            {renderPreview()}

            {/* File Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <p 
                        className={`font-medium truncate ${sizeConfig.text}`}
                        style={{ color: themeConfig.colors.text }}
                        title={file.name}
                    >
                        {truncateFileName(file.name, 40)}
                    </p>
                    
                    {/* Action buttons */}
                    <div className="flex gap-1 ml-2">
                        {onView && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onView(file)}
                                disabled={disabled || isProcessing}
                                className="h-6 w-6 p-0 border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                            >
                                <Eye className="w-3 h-3" />
                            </Button>
                        )}
                        
                        {onDownload && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onDownload(file)}
                                disabled={disabled || isProcessing}
                                className="h-6 w-6 p-0 border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                            >
                                <Download className="w-3 h-3" />
                            </Button>
                        )}
                        
                        {onRemove && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onRemove(file.fileId)}
                                disabled={disabled || isProcessing}
                                className="h-6 w-6 p-0 border-[#575757] text-[#828288] hover:text-red-400"
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* File details */}
                <p className="text-xs text-[#828288]">
                    {formatFileSize(file.size)}
                    {previewUrl && (
                        <span className="ml-2 text-[#D78E59]">• Signed URL</span>
                    )}
                    {!previewUrl && blobUrl && (
                        <span className="ml-2 text-[#575757]">• Preview</span>
                    )}
                </p>

                {/* Status badges (for non-image files or when preview is disabled) */}
                {(!currentPreviewUrl || !file.type.startsWith('image/')) && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {getStatusBadges()}
                    </div>
                )}

                {/* Progress */}
                {renderProgress()}

                {/* Error */}
                {renderError()}
            </div>
        </div>
    );
};