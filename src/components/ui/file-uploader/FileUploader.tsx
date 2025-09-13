// FileUploader.tsx
'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FileUploaderProps, FileWithId, FileValidationError } from './types/file-uploader.types';
import { DropZone } from './components/DropZone';
import { FileList } from './components/FileList';
import { getFileTypeConfig } from './utils/file-configs';
import { createFilesWithId, removeFileById } from './utils/file-utils';

/**
 * Unified File Uploader Component
 * 
 * Features:
 * - Drag & drop file selection with react-dropzone
 * - FileWithId system for unique file identification (prevents name collisions)
 * - External state management (consumer controls upload strategy)
 * - Signed URL priority system (signed URLs > blob URLs for preview)
 * - Flexible preview options (thumbnail, full, gallery)
 * - Comprehensive validation and error handling
 * - Dark/light theme support
 * - Size variants (sm, md, lg)
 * - Multiple layout variants (dropzone, button, inline)
 * 
 * What this component handles:
 * ✅ File selection and validation
 * ✅ Preview management (blob + signed URL priority)
 * ✅ UI state management (loading, error, disabled)
 * ✅ Accessibility and responsive design
 * 
 * What this component does NOT handle:
 * ❌ Upload logic (consumer manages via orval hooks)
 * ❌ API integration (consumer handles service calls)
 * ❌ Progress tracking (consumer provides progress state)
 * ❌ Storage strategy (consumer chooses temp/permanent)
 * ❌ Caching (consumer manages with React Query)
 */
export const FileUploader: React.FC<FileUploaderProps> = ({
    // Core functionality
    accept,
    maxSize,
    multiple = false,
    fileType,
    
    // Main callbacks
    onFileSelect,
    onFileRemove,
    
    // Preview configuration
    preview = { enabled: true, type: 'thumbnail' },
    
    // External state (managed by consumer)
    selectedFiles = [],
    previewUrls = {},
    uploadProgress = {},
    uploadErrors = {},
    
    // Loading states
    isUploading = false,
    isProcessing = false,
    
    // UI states
    disabled = false,
    readonly = false,
    
    // Error handling
    onError,
    onValidationError,
    
    // Customization
    className = '',
    theme = 'dark',
    size = 'md',
    variant = 'dropzone',
    
    // Custom renderers
    renderPreview,
    renderProgress,
    renderError
}) => {
    // Get file type configuration if no explicit accept provided
    const effectiveAccept = useMemo(() => {
        if (accept) return accept;
        return getFileTypeConfig(fileType).accept;
    }, [accept, fileType]);

    const effectiveMaxSize = maxSize || getFileTypeConfig(fileType).maxSize;
    const effectivePreview = preview || getFileTypeConfig(fileType).preview;

    // Handle new file selection
    const handleFilesAccepted = useCallback((files: File[]) => {
        // Convert to FileWithId objects with unique IDs
        const filesWithId = createFilesWithId(files);
        onFileSelect(filesWithId);
    }, [onFileSelect]);

    // Handle file removal
    const handleFileRemove = useCallback((fileId: string) => {
        onFileRemove(fileId);
    }, [onFileRemove]);

    // Handle validation errors
    const handleValidationError = useCallback((error: FileValidationError) => {
        if (onValidationError && error.file) {
            onValidationError(error.file, error.message);
        } else if (onError) {
            onError(error);
        }
        // If no custom handlers, DropZone will show toast
    }, [onError, onValidationError]);

    // Determine if upload is disabled
    const isUploadDisabled = disabled || readonly || isProcessing;

    // Render based on variant
    const renderContent = () => {
        switch (variant) {
            case 'inline':
                return (
                    <div className={`space-y-4 ${className}`}>
                        {/* File list first in inline mode */}
                        <FileList 
                            files={selectedFiles}
                            previewUrls={previewUrls}
                            uploadProgress={uploadProgress}
                            uploadErrors={uploadErrors}
                            preview={effectivePreview}
                            isProcessing={isProcessing}
                            disabled={isUploadDisabled}
                            onFileRemove={handleFileRemove}
                            theme={theme}
                            size={size}
                            renderCustomPreview={renderPreview}
                            renderCustomProgress={renderProgress}
                            renderCustomError={renderError}
                        />
                        
                        {/* Compact dropzone */}
                        <DropZone
                            accept={effectiveAccept}
                            maxSize={effectiveMaxSize}
                            multiple={multiple}
                            disabled={disabled}
                            isProcessing={isProcessing}
                            isStatusReadonly={readonly}
                            onFilesAccepted={handleFilesAccepted}
                            onValidationError={handleValidationError}
                            size="sm"
                            theme={theme}
                        />
                    </div>
                );

            case 'button':
                return (
                    <div className={`space-y-4 ${className}`}>
                        {/* Button-style dropzone */}
                        <DropZone
                            accept={effectiveAccept}
                            maxSize={effectiveMaxSize}
                            multiple={multiple}
                            disabled={disabled}
                            isProcessing={isProcessing}
                            isStatusReadonly={readonly}
                            onFilesAccepted={handleFilesAccepted}
                            onValidationError={handleValidationError}
                            size={size}
                            theme={theme}
                            className="!p-4 !border-solid !bg-transparent hover:!bg-[#202020]/30"
                        />
                        
                        {/* File list below */}
                        {selectedFiles.length > 0 && (
                            <FileList 
                                files={selectedFiles}
                                previewUrls={previewUrls}
                                uploadProgress={uploadProgress}
                                uploadErrors={uploadErrors}
                                preview={effectivePreview}
                                isProcessing={isProcessing}
                                disabled={isUploadDisabled}
                                onFileRemove={handleFileRemove}
                                theme={theme}
                                size={size}
                                renderCustomPreview={renderPreview}
                                renderCustomProgress={renderProgress}
                                renderCustomError={renderError}
                            />
                        )}
                    </div>
                );

            case 'dropzone':
            default:
                return (
                    <div className={`space-y-4 ${className}`}>
                        {/* Main dropzone */}
                        <DropZone
                            accept={effectiveAccept}
                            maxSize={effectiveMaxSize}
                            multiple={multiple}
                            disabled={disabled}
                            isProcessing={isProcessing}
                            isStatusReadonly={readonly}
                            onFilesAccepted={handleFilesAccepted}
                            onValidationError={handleValidationError}
                            size={size}
                            theme={theme}
                        />
                        
                        {/* File list below dropzone */}
                        {selectedFiles.length > 0 && (
                            <FileList 
                                files={selectedFiles}
                                previewUrls={previewUrls}
                                uploadProgress={uploadProgress}
                                uploadErrors={uploadErrors}
                                preview={effectivePreview}
                                isProcessing={isProcessing}
                                disabled={isUploadDisabled}
                                onFileRemove={handleFileRemove}
                                theme={theme}
                                size={size}
                                renderCustomPreview={renderPreview}
                                renderCustomProgress={renderProgress}
                                renderCustomError={renderError}
                            />
                        )}

                        {/* Replace/add more files when files are selected */}
                        {selectedFiles.length > 0 && !isUploadDisabled && (
                            <DropZone
                                accept={effectiveAccept}
                                maxSize={effectiveMaxSize}
                                multiple={multiple}
                                disabled={disabled}
                                isProcessing={isProcessing}
                                isStatusReadonly={readonly}
                                onFilesAccepted={handleFilesAccepted}
                                onValidationError={handleValidationError}
                                size="sm"
                                theme={theme}
                                className="!border-dashed !p-3"
                            >
                                <div className="text-sm text-[#828288]">
                                    Click or drag to {multiple ? 'add more files' : 'replace file'}
                                </div>
                            </DropZone>
                        )}
                    </div>
                );
        }
    };

    return renderContent();
};

export default FileUploader;