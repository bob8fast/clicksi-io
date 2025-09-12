// components/DropZone.tsx
'use client'

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Lock } from 'lucide-react';
import { toast } from 'sonner';

import { FileAcceptConfig, FileValidationError, DisabledReason } from '../types/file-uploader.types';
import { validateFiles } from '../utils/file-validation';
import { createFilesWithId } from '../utils/file-utils';
import { DISABLED_REASON_MESSAGES, SIZE_CONFIGS, THEME_CONFIGS } from '../utils/file-configs';

interface DropZoneProps {
    accept: FileAcceptConfig;
    maxSize?: number;
    multiple?: boolean;
    disabled?: boolean;
    isProcessing?: boolean;
    isStatusReadonly?: boolean;
    onFilesAccepted: (files: File[]) => void;
    onValidationError?: (error: FileValidationError) => void;
    size?: 'sm' | 'md' | 'lg';
    theme?: 'dark' | 'light';
    className?: string;
    children?: React.ReactNode;
}

export const DropZone: React.FC<DropZoneProps> = ({
    accept,
    maxSize,
    multiple = false,
    disabled = false,
    isProcessing = false,
    isStatusReadonly = false,
    onFilesAccepted,
    onValidationError,
    size = 'md',
    theme = 'dark',
    className = '',
    children
}) => {
    const [dragOver, setDragOver] = useState(false);

    // Determine disabled state and reason
    const disabledReason: DisabledReason = isStatusReadonly 
        ? 'status' 
        : isProcessing 
        ? 'processing' 
        : disabled 
        ? 'general' 
        : null;

    const isUploadDisabled = Boolean(disabledReason);

    // Handle file drop
    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        // Handle rejected files
        if (rejectedFiles.length > 0) {
            const error = rejectedFiles[0].errors[0];
            let validationError: FileValidationError;

            if (error.code === 'file-too-large') {
                validationError = {
                    code: 'file-too-large',
                    message: `File is too large. Maximum size is ${maxSize ? Math.round(maxSize / (1024 * 1024)) : 10}MB.`,
                    file: rejectedFiles[0].file
                };
            } else if (error.code === 'file-invalid-type') {
                validationError = {
                    code: 'file-invalid-type',
                    message: `Invalid file type. ${accept.description} only.`,
                    file: rejectedFiles[0].file
                };
            } else {
                validationError = {
                    code: 'file-rejected',
                    message: 'File upload failed. Please try again.',
                    file: rejectedFiles[0].file
                };
            }

            if (onValidationError) {
                onValidationError(validationError);
            } else {
                toast.error(validationError.message);
            }
            return;
        }

        // Additional validation
        const validationError = validateFiles(acceptedFiles, accept, maxSize, multiple);
        if (validationError) {
            if (onValidationError) {
                onValidationError(validationError);
            } else {
                toast.error(validationError.message);
            }
            return;
        }

        if (acceptedFiles.length > 0) {
            onFilesAccepted(acceptedFiles);
            toast.success(`${acceptedFiles.length} file${acceptedFiles.length > 1 ? 's' : ''} selected successfully`);
        }
    }, [accept, maxSize, multiple, onFilesAccepted, onValidationError]);

    // Setup dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: accept.mimeTypes.reduce((acc, mimeType) => {
            acc[mimeType] = accept.extensions;
            return acc;
        }, {} as Record<string, string[]>),
        maxSize,
        multiple,
        disabled: isUploadDisabled,
        onDragEnter: () => !isUploadDisabled && setDragOver(true),
        onDragLeave: () => setDragOver(false),
    });

    // Get configurations
    const themeConfig = THEME_CONFIGS[theme];
    const sizeConfig = SIZE_CONFIGS[size];

    // Determine disabled message
    const getDisabledMessage = (): string => {
        if (!disabledReason) return DISABLED_REASON_MESSAGES.enabled;
        return DISABLED_REASON_MESSAGES[disabledReason];
    };

    // Determine help text
    const getHelpText = (): string => {
        if (disabledReason === 'processing') {
            return 'Upload temporarily disabled while processing';
        } else if (disabledReason === 'status') {
            return 'Upload not available in current verification status';
        }
        return accept.description;
    };

    return (
        <div
            {...getRootProps()}
            className={`
                border-2 border-dashed rounded-lg text-center transition-all cursor-pointer
                ${isDragActive || dragOver
                    ? `border-[${themeConfig.colors.accent}] bg-[${themeConfig.colors.accent}]/5`
                    : isUploadDisabled
                    ? `border-[${themeConfig.colors.border}] opacity-50 cursor-not-allowed`
                    : `border-[${themeConfig.colors.border}] hover:border-[#828288] hover:bg-[${themeConfig.colors.background}]/50`
                }
                ${sizeConfig.dropzone}
                ${className}
            `}
            style={{
                backgroundColor: isDragActive || dragOver
                    ? `${themeConfig.colors.accent}0D` // 5% opacity
                    : themeConfig.colors.background,
                borderColor: isDragActive || dragOver
                    ? themeConfig.colors.accent
                    : themeConfig.colors.border,
                color: themeConfig.colors.text
            }}
        >
            <input {...getInputProps()} />

            {children ? (
                children
            ) : (
                <>
                    {/* Icon */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                        {disabledReason === 'status' && (
                            <Lock className={`w-8 h-8 text-[${themeConfig.colors.border}]`} />
                        )}
                        <Upload className={`w-8 h-8 text-[${themeConfig.colors.border}]`} />
                    </div>

                    {/* Main message */}
                    {isDragActive && !isUploadDisabled ? (
                        <div>
                            <p className={`text-[${themeConfig.colors.accent}] font-medium mb-1 ${sizeConfig.text}`}>
                                Drop file{multiple ? 's' : ''} here
                            </p>
                            <p className={`text-sm text-[#828288]`}>
                                Release to upload
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p className={`font-medium mb-1 ${sizeConfig.text}`} style={{ color: themeConfig.colors.text }}>
                                {getDisabledMessage()}
                            </p>
                            <p className="text-sm text-[#828288]">
                                {isUploadDisabled
                                    ? disabledReason === 'status'
                                        ? 'Verification status does not allow file modifications'
                                        : 'File upload is currently disabled'
                                    : getHelpText()
                                }
                            </p>

                            {/* File size info */}
                            {!isUploadDisabled && maxSize && (
                                <p className="text-xs text-[#575757] mt-2">
                                    Maximum file size: {Math.round(maxSize / (1024 * 1024))}MB
                                </p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};