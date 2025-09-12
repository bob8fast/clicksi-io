// components/verification/FileUpload.tsx
'use client'

import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/file-utils';
import { VerificationDocumentDto, VerificationDocumentType } from '@/types';
import { DOCUMENT_DESCRIPTIONS, DOCUMENT_LABELS } from '@/types/app/verification';


import { Download, Eye, FileText, Image as ImageIcon, Lock, Upload, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

/**
 * Represents the reason why file upload is disabled
 * @typedef {Object} DisabledReason
 * @property {'status'} status - Upload disabled due to verification status restrictions
 * @property {'processing'} processing - Upload temporarily disabled while processing operations
 * @property {'general'} general - Upload disabled for general/other reasons
 * @property {null} null - Upload is enabled
 */
type DisabledReason = 'status' | 'processing' | 'general' | null;

/**
 * Constant mapping of disabled reasons to their descriptions
 */
const DISABLED_REASON_MESSAGES = {
    status: 'Upload not available - verification status does not allow modifications',
    processing: 'Upload temporarily disabled while processing',
    general: 'Upload disabled',
    enabled: 'Click to upload or drag and drop'
} as const;

interface FileUploadProps
{
    documentType: VerificationDocumentType;
    isRequired: boolean;
    existingDocument?: VerificationDocumentDto;
    uploadedFile?: File;
    onFileSelect: (file: File) => void;
    onFileRemove: () => void;
    onDocumentView?: (document: VerificationDocumentDto) => void;
    onDocumentDownload?: (document: VerificationDocumentDto) => void;
    renderDownloadButton?: (document: VerificationDocumentDto) => React.ReactNode;
    disabled?: boolean;
    isProcessing?: boolean;
    isStatusReadonly?: boolean;
    className?: string;
}

export function FileUpload({
    documentType,
    isRequired,
    existingDocument,
    uploadedFile,
    onFileSelect,
    onFileRemove,
    onDocumentView,
    onDocumentDownload,
    renderDownloadButton,
    disabled = false,
    isProcessing = false,
    isStatusReadonly = false,
    className = '',
}: FileUploadProps)
{
    const [dragOver, setDragOver] = useState(false);

    // Memoized values for performance
    const hasFile = useMemo(() =>
    {
        const result = existingDocument || uploadedFile;
  
        return result;
    }, [existingDocument, uploadedFile]);

    const disabledReason = useMemo((): DisabledReason =>
    {
        if (isStatusReadonly) return 'status';
        if (isProcessing) return 'processing';
        if (disabled) return 'general';
        return null;
    }, [isStatusReadonly, isProcessing, disabled]);

    const isUploadDisabled = useMemo(() =>
    {
        return disabled || isProcessing || isStatusReadonly;
    }, [disabled, isProcessing, isStatusReadonly]);

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) =>
    {
        if (rejectedFiles.length > 0)
        {
            const error = rejectedFiles[0].errors[0];
            if (error.code === 'file-too-large')
            {
                toast.error('File is too large. Maximum size is 10MB.');
            } else if (error.code === 'file-invalid-type')
            {
                toast.error('Invalid file type. Please upload PDF or image files only.');
            } else
            {
                toast.error('File upload failed. Please try again.');
            }
            return;
        }

        if (acceptedFiles.length > 0)
        {
            onFileSelect(acceptedFiles[0]);
            toast.success('File selected successfully');
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.tiff']
        },
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: false,
        disabled: isUploadDisabled,
        onDragEnter: () => !isUploadDisabled && setDragOver(true),
        onDragLeave: () => setDragOver(false),
    });

    const getFileIcon = useCallback((mimeType?: string | null) =>
    {
        if (mimeType?.startsWith('image/') || uploadedFile?.type.startsWith('image/'))
        {
            return <ImageIcon className="w-5 h-5 text-[#D78E59]" />;
        }
        return <FileText className="w-5 h-5 text-[#D78E59]" />;
    }, [uploadedFile?.type]);

    const getFilePreview = useCallback(() =>
    {
        if (uploadedFile && uploadedFile.type.startsWith('image/'))
        {
            return URL.createObjectURL(uploadedFile);
        }
        return null;
    }, [uploadedFile]);

    const getDisabledMessage = (reason: DisabledReason): string =>
    {
        switch (reason)
        {
            case 'status':
                return DISABLED_REASON_MESSAGES.status;
            case 'processing':
                return DISABLED_REASON_MESSAGES.processing;
            case 'general':
                return DISABLED_REASON_MESSAGES.general;
            default:
                return DISABLED_REASON_MESSAGES.enabled;
        }
    };

    const getHelpText = (reason: DisabledReason): string[] =>
    {
        const baseHelp = [
            '• Maximum file size: 10MB',
            '• Supported formats: PDF, PNG, JPG, GIF, WebP, BMP, TIFF',
            '• For images with transparency, ensure important content is visible against dark backgrounds'
        ];

        if (reason === 'processing')
        {
            baseHelp.push('• Upload temporarily disabled while processing');
        } else if (reason === 'status')
        {
            baseHelp.push('• Upload not available in current verification status');
        }

        return baseHelp;
    };

    return (
        <div className={`border border-[#575757] rounded-lg overflow-hidden ${className}`}>
            {/* Header */}
            <div className="p-4 bg-[#090909] border-b border-[#575757]">
                <div className="flex items-start justify-between">
                    <div>
                        <h4 className="text-[#EDECF8] font-semibold flex items-center gap-2">
                            {DOCUMENT_LABELS[documentType]}
                            {isRequired && <span className="text-red-500">*</span>}
                            {disabledReason === 'status' && (
                                <Lock className="w-4 h-4 text-[#575757]" />
                            )}
                        </h4>
                        <p className="text-sm text-[#828288] mt-1">
                            {DOCUMENT_DESCRIPTIONS[documentType]}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {hasFile ? (
                    <div className="space-y-4">
                        {/* File Info */}
                        <div className="flex items-center justify-between p-3 bg-[#202020] rounded-lg border border-[#575757]">
                            <div className="flex items-center gap-3">
                                {getFileIcon(existingDocument?.mime_type)}
                                <div>
                                    <p className="text-[#EDECF8] font-medium">
                                        {uploadedFile?.name || existingDocument?.file_name}
                                    </p>
                                    <p className="text-xs text-[#828288]">
                                        {uploadedFile
                                            ? formatFileSize(uploadedFile.size)
                                            : formatFileSize(existingDocument?.file_size || 0)
                                        }
                                        {uploadedFile && (
                                            <span className="ml-2 text-[#D78E59]">• New file selected</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {/* View button for existing documents */}
                                {existingDocument && onDocumentView && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onDocumentView(existingDocument)}
                                        disabled={isProcessing}
                                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                )}

                                {/* Download button - use custom render function if provided */}
                                {existingDocument && (
                                    renderDownloadButton ? (
                                        renderDownloadButton(existingDocument)
                                    ) : onDocumentDownload ? (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onDocumentDownload(existingDocument)}
                                            disabled={isProcessing}
                                            className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    ) : null
                                )}

                                {/* Remove button */}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={onFileRemove}
                                    disabled={isUploadDisabled}
                                    className="border-[#575757] text-[#828288] hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Image Preview */}
                        {uploadedFile && uploadedFile.type.startsWith('image/') && (
                            <div className="relative">
                                <img
                                    src={getFilePreview()!}
                                    alt="Preview"
                                    className="w-full max-w-md h-48 object-cover rounded-lg bg-white border border-[#575757]"
                                />
                                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                    Preview
                                </div>
                            </div>
                        )}

                        {/* Replace file option */}
                        {!isUploadDisabled && (
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-all ${isDragActive || dragOver
                                    ? 'border-[#D78E59] bg-[#D78E59]/5'
                                    : 'border-[#575757] hover:border-[#828288]'
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <Upload className="w-5 h-5 text-[#575757] mx-auto mb-1" />
                                <p className="text-sm text-[#828288]">
                                    Click or drag to replace file
                                </p>
                            </div>
                        )}

                        {/* Show disabled message when disabled */}
                        {isUploadDisabled && (
                            <div className={`border-2 border-dashed rounded-lg p-3 text-center ${isUploadDisabled ? 'opacity-50' : ''}`}>
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    {disabledReason === 'status' && <Lock className="w-5 h-5 text-[#575757]" />}
                                    <Upload className="w-5 h-5 text-[#575757]" />
                                </div>
                                <p className="text-sm text-[#575757]">
                                    {getDisabledMessage(disabledReason)}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Upload Area */
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${isDragActive || dragOver
                                ? 'border-[#D78E59] bg-[#D78E59]/5'
                                : isUploadDisabled
                                    ? 'border-[#575757] opacity-50 cursor-not-allowed'
                                    : 'border-[#575757] hover:border-[#828288] cursor-pointer'
                            }`}
                    >
                        <input {...getInputProps()} />

                        <div className="flex items-center justify-center gap-2 mb-4">
                            {disabledReason === 'status' && <Lock className="w-12 h-12 text-[#575757]" />}
                            <Upload className="w-12 h-12 text-[#575757]" />
                        </div>

                        {isDragActive && !isUploadDisabled ? (
                            <div>
                                <p className="text-[#D78E59] font-medium mb-1">Drop file here</p>
                                <p className="text-sm text-[#828288]">Release to upload</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-[#EDECF8] font-medium mb-1">
                                    {getDisabledMessage(disabledReason)}
                                </p>
                                <p className="text-sm text-[#828288] mb-3">
                                    {isUploadDisabled
                                        ? disabledReason === 'status'
                                            ? 'Verification status does not allow file modifications'
                                            : 'File upload is currently disabled'
                                        : 'PDF, PNG, JPG, GIF, WebP up to 10MB'
                                    }
                                </p>

                                {/* File type examples - only show when not disabled */}
                                {!isUploadDisabled && (
                                    <div className="flex justify-center gap-4 text-xs text-[#575757]">
                                        <div className="flex items-center gap-1">
                                            <FileText className="w-3 h-3" />
                                            <span>PDF</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ImageIcon className="w-3 h-3" />
                                            <span>Images</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Help text */}
                <div className="mt-3 text-xs text-[#575757]">
                    {getHelpText(disabledReason).map((text, index) => (
                        <p key={index}>{text}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Export the DisabledReason type for potential reuse in other components  
export type { DisabledReason };
