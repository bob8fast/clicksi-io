// utils/file-configs.ts

import { FileTypeConfig } from '../types/file-uploader.types';

/**
 * Predefined file type configurations based on the analysis
 */
export const FILE_TYPE_CONFIGS: Record<string, FileTypeConfig> = {
    image: {
        accept: {
            mimeTypes: ['image/*'],
            extensions: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.tiff'],
            description: 'Images (PNG, JPG, GIF, WebP, BMP, TIFF)'
        },
        maxSize: 10 * 1024 * 1024, // 10MB
        preview: { enabled: true, type: 'full' },
        features: ['crop', 'resize', 'filters']
    },
    document: {
        accept: {
            mimeTypes: ['application/pdf', 'image/*'],
            extensions: ['.pdf', '.png', '.jpg', '.jpeg'],
            description: 'Documents (PDF) and Images'
        },
        maxSize: 10 * 1024 * 1024, // 10MB
        preview: { enabled: true, type: 'thumbnail' },
        features: ['view', 'download']
    },
    media: {
        accept: {
            mimeTypes: ['video/*', 'audio/*'],
            extensions: ['.mp4', '.webm', '.mp3', '.wav'],
            description: 'Media files (Video, Audio)'
        },
        maxSize: 100 * 1024 * 1024, // 100MB
        preview: { enabled: true, type: 'thumbnail' },
        features: ['play', 'seek', 'volume']
    },
    any: {
        accept: {
            mimeTypes: ['*/*'],
            extensions: ['.*'],
            description: 'All file types'
        },
        maxSize: 50 * 1024 * 1024, // 50MB
        preview: { enabled: false, type: 'thumbnail' },
        features: ['download']
    }
};

/**
 * Gets the configuration for a specific file type
 */
export const getFileTypeConfig = (fileType: keyof typeof FILE_TYPE_CONFIGS): FileTypeConfig => {
    return FILE_TYPE_CONFIGS[fileType] || FILE_TYPE_CONFIGS.any;
};

/**
 * Theme configurations
 */
export const THEME_CONFIGS = {
    dark: {
        colors: {
            background: '#171717',
            border: '#575757',
            text: '#EDECF8',
            accent: '#D78E59',
            error: '#EF4444',
            success: '#10B981'
        }
    },
    light: {
        colors: {
            background: '#FFFFFF',
            border: '#E5E7EB',
            text: '#111827',
            accent: '#D78E59',
            error: '#EF4444',
            success: '#10B981'
        }
    }
};

/**
 * Size configurations
 */
export const SIZE_CONFIGS = {
    sm: {
        container: 'p-3',
        dropzone: 'p-4',
        preview: 'h-20 w-20',
        text: 'text-sm'
    },
    md: {
        container: 'p-4',
        dropzone: 'p-6',
        preview: 'h-32 w-32',
        text: 'text-base'
    },
    lg: {
        container: 'p-6',
        dropzone: 'p-8',
        preview: 'h-48 w-48',
        text: 'text-lg'
    }
};

/**
 * Disabled reason messages
 */
export const DISABLED_REASON_MESSAGES = {
    status: 'Upload not available - verification status does not allow modifications',
    processing: 'Upload temporarily disabled while processing',
    general: 'Upload disabled',
    enabled: 'Click to upload or drag and drop'
} as const;