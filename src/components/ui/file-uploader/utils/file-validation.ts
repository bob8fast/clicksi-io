// utils/file-validation.ts

import { FileAcceptConfig, FileValidationError } from '../types/file-uploader.types';
import { formatFileSize } from '@/lib/file-utils';

/**
 * Validates a file against acceptance criteria
 */
export const validateFile = (
    file: File,
    accept: FileAcceptConfig,
    maxSize?: number
): FileValidationError | null => {
    // Check file size
    if (maxSize && file.size > maxSize) {
        return {
            code: 'file-too-large',
            message: `File is too large. Maximum size is ${formatFileSize(maxSize)}.`,
            file
        };
    }

    // Check MIME type
    const isValidMimeType = accept.mimeTypes.some(mimeType => {
        if (mimeType.endsWith('/*')) {
            const baseMimeType = mimeType.slice(0, -2);
            return file.type.startsWith(baseMimeType);
        }
        return file.type === mimeType;
    });

    if (!isValidMimeType) {
        return {
            code: 'file-invalid-type',
            message: `Invalid file type. ${accept.description} only.`,
            file
        };
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = accept.extensions.some(ext => 
        fileName.endsWith(ext.toLowerCase())
    );

    if (!hasValidExtension) {
        return {
            code: 'file-invalid-type',
            message: `Invalid file extension. Supported: ${accept.extensions.join(', ')}.`,
            file
        };
    }

    return null; // File is valid
};

/**
 * Validates multiple files
 */
export const validateFiles = (
    files: File[],
    accept: FileAcceptConfig,
    maxSize?: number,
    multiple: boolean = true
): FileValidationError | null => {
    if (!multiple && files.length > 1) {
        return {
            code: 'file-rejected',
            message: 'Only one file is allowed.',
        };
    }

    // Validate each file
    for (const file of files) {
        const error = validateFile(file, accept, maxSize);
        if (error) {
            return error;
        }
    }

    return null;
};