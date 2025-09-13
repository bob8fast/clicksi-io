// utils/file-utils.ts

import { FileWithId } from '../types/file-uploader.types';

/**
 * Creates a FileWithId object from a File with unique client-side ID
 * Prevents name collision issues by using unique identifiers
 */
export const createFileWithId = (file: File): FileWithId => {
    // Create unique ID combining timestamp, random string, and file properties
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(2, 9);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize name for ID
    
    return {
        fileId: `${timestamp}-${randomString}-${safeName}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
    };
};

/**
 * Creates multiple FileWithId objects from File array
 */
export const createFilesWithId = (files: File[]): FileWithId[] => {
    return files.map(createFileWithId);
};

/**
 * Finds a FileWithId by its unique ID
 */
export const findFileById = (files: FileWithId[], fileId: string): FileWithId | undefined => {
    return files.find(f => f.fileId === fileId);
};

/**
 * Removes a file by its unique ID
 */
export const removeFileById = (files: FileWithId[], fileId: string): FileWithId[] => {
    return files.filter(f => f.fileId !== fileId);
};

/**
 * Creates a blob URL for file preview with proper cleanup tracking
 */
export const createPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
};

/**
 * Revokes a blob URL to prevent memory leaks
 */
export const revokePreviewUrl = (url: string): void => {
    if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
    }
};

/**
 * Gets the appropriate icon for a file type
 */
export const getFileIcon = (mimeType: string): 'image' | 'document' | 'video' | 'audio' | 'file' => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'document';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'file';
};

/**
 * Sanitizes a filename for safe display
 */
export const sanitizeFileName = (fileName: string): string => {
    return fileName.replace(/[<>:"/\\|?*]/g, '_');
};

/**
 * Truncates a filename for display while preserving extension
 */
export const truncateFileName = (fileName: string, maxLength: number = 30): string => {
    if (fileName.length <= maxLength) return fileName;
    
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
        return fileName.substring(0, maxLength - 3) + '...';
    }
    
    const extension = fileName.substring(lastDotIndex);
    const nameWithoutExt = fileName.substring(0, lastDotIndex);
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 3) + '...';
    
    return truncatedName + extension;
};