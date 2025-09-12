// lib/file-utils.ts
// Consolidated file utility functions

/**
 * Formats file size for display with proper units
 * Consolidated from multiple duplicate implementations
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Checks if a file is an image based on MIME type
 */
export const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
};

/**
 * Checks if a file is a document (PDF or image)
 */
export const isDocumentFile = (file: File): boolean => {
    return file.type === 'application/pdf' || isImageFile(file);
};

/**
 * Checks if a file is a media file (video/audio)
 */
export const isMediaFile = (file: File): boolean => {
    return file.type.startsWith('video/') || file.type.startsWith('audio/');
};

/**
 * Validates file type against allowed types
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.some(type => {
        if (type.endsWith('/*')) {
            const baseType = type.slice(0, -2);
            return file.type.startsWith(baseType);
        }
        return file.type === type;
    });
};

/**
 * Validates file size against maximum allowed size
 */
export const isValidFileSize = (file: File, maxSizeBytes: number): boolean => {
    return file.size <= maxSizeBytes;
};

/**
 * Creates a blob URL for a file (with cleanup tracking)
 */
export const createBlobUrl = (file: File): string => {
    return URL.createObjectURL(file);
};

/**
 * Safely revokes a blob URL
 */
export const revokeBlobUrl = (url: string): void => {
    if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
    }
};

/**
 * Gets file extension from filename
 */
export const getFileExtension = (filename: string): string => {
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 ? filename.substring(lastDot) : '';
};

/**
 * Gets filename without extension
 */
export const getFileNameWithoutExtension = (filename: string): string => {
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 ? filename.substring(0, lastDot) : filename;
};

/**
 * Sanitizes filename for safe storage
 */
export const sanitizeFilename = (filename: string): string => {
    // Remove special characters and spaces, keep only alphanumeric, dots, hyphens, underscores
    return filename.replace(/[^a-zA-Z0-9.-_]/g, '_');
};

/**
 * Generates unique filename with timestamp
 */
export const generateUniqueFilename = (originalFilename: string): string => {
    const extension = getFileExtension(originalFilename);
    const nameWithoutExt = getFileNameWithoutExtension(originalFilename);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    
    return `${sanitizeFilename(nameWithoutExt)}_${timestamp}_${random}${extension}`;
};

/**
 * Converts bytes to human readable format with specific unit
 */
export const formatFileSizeWithUnit = (bytes: number, unit: 'KB' | 'MB' | 'GB'): string => {
    const divisors = { KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 };
    const value = bytes / divisors[unit];
    return `${value.toFixed(2)} ${unit}`;
};

/**
 * Gets MIME type category (image, document, media, other)
 */
export const getFileCategory = (file: File): 'image' | 'document' | 'media' | 'other' => {
    if (isImageFile(file)) return 'image';
    if (file.type === 'application/pdf') return 'document';
    if (isMediaFile(file)) return 'media';
    return 'other';
};

/**
 * Common file validation for verification documents
 */
export const validateVerificationFile = (file: File): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/tiff'
    ];

    if (!isValidFileType(file, allowedTypes)) {
        errors.push('File type not supported');
    }

    if (!isValidFileSize(file, maxSize)) {
        errors.push('File size exceeds 10MB limit');
    }

    if (file.size === 0) {
        errors.push('File is empty');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Common file validation for profile images
 */
export const validateProfileImage = (file: File): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/*'];

    if (!isValidFileType(file, allowedTypes)) {
        errors.push('Please select a valid image file');
    }

    if (!isValidFileSize(file, maxSize)) {
        errors.push('Image size must be less than 5MB');
    }

    if (file.size === 0) {
        errors.push('File is empty');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Common file validation for category images
 */
export const validateCategoryImage = (file: File): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/*'];

    if (!isValidFileType(file, allowedTypes)) {
        errors.push('Please select a valid image file');
    }

    if (!isValidFileSize(file, maxSize)) {
        errors.push('Image size must be less than 2MB');
    }

    if (file.size === 0) {
        errors.push('File is empty');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};