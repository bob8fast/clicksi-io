// types/file-uploader.types.ts

/**
 * File with unique identifier for reliable tracking
 * Prevents name collision issues by using client-side generated unique IDs
 */
export interface FileWithId {
    fileId: string; // Unique identifier (generated client-side)
    file: File; // Original File object
    name: string; // File name (for display)
    size: number; // File size
    type: string; // MIME type
    lastModified: number; // Last modified timestamp
    
    // Optional properties for service-specific extensions
    isExisting?: boolean; // True if this represents an existing uploaded file
    [key: string]: any; // Allow service-specific additional properties
}

/**
 * File acceptance configuration
 */
export interface FileAcceptConfig {
    mimeTypes: string[];
    extensions: string[];
    description: string;
}

/**
 * Preview configuration options
 */
export interface PreviewConfig {
    enabled: boolean;
    type?: 'thumbnail' | 'full' | 'gallery';
    dimensions?: { width: number; height: number };
}

/**
 * File validation error
 */
export interface FileValidationError {
    code: 'file-too-large' | 'file-invalid-type' | 'file-rejected' | 'general';
    message: string;
    file?: File;
}

/**
 * Upload result from API services
 */
export interface UploadResult {
    file: File;
    imageId: string; // S3 storage path/key or other storage identifier
    signedUrl?: string; // Optional immediate signed URL
    uploadStatus: 'success' | 'error';
    error?: string;
    // Additional fields from specific API services
    metadata?: Record<string, any>;
}

/**
 * Generic interface that all services should conform to for signed URLs
 * Based on actual MediaUrlResponse structure from backend
 */
export interface BaseSignedUrlResponse {
    ttl_seconds: number;
    expires_at: string;
    urls: Array<{
        media_id: string;
        url: string;
        [key: string]: any; // Allow service-specific additional fields
    }>;
    [key: string]: any; // Allow service-specific additional response fields
}

/**
 * Normalized interface for consistent consumption in React components
 */
export interface NormalizedSignedUrlResponse {
    ttl_seconds: number;
    expires_at: string;
    image_urls: Array<{
        image_id: string;
        url: string;
        expires_at: string; // Duplicated from parent for easier access
        ttl_seconds: number; // Duplicated from parent for easier access
        metadata?: Record<string, any>; // Service-specific fields
    }>;
    metadata?: Record<string, any>; // Service-specific response fields
}

/**
 * Main FileUploader component props
 */
export interface FileUploaderProps {
    // Core functionality
    accept: FileAcceptConfig;
    maxSize?: number;
    multiple?: boolean;
    
    // File type specific features
    fileType: 'image' | 'document' | 'media' | 'any';
    
    // File selection handler - MAIN CALLBACK
    onFileSelect: (files: FileWithId[]) => void; // Files with unique IDs
    onFileRemove: (fileId: string) => void; // Remove by unique ID
    
    // Preview configuration
    preview?: PreviewConfig;
    
    // External state management - using unique file IDs
    selectedFiles?: FileWithId[]; // Files with unique IDs
    previewUrls?: Record<string, string>; // fileId -> signed URL mapping
    uploadProgress?: Record<string, number>; // fileId -> progress mapping
    uploadErrors?: Record<string, string>; // fileId -> error mapping
    
    // Loading states (managed externally)
    isUploading?: boolean;
    isProcessing?: boolean;
    
    // UI States
    disabled?: boolean;
    readonly?: boolean;
    
    // UI Callbacks
    onError?: (error: FileValidationError) => void; // Only validation errors
    onValidationError?: (file: File, error: string) => void;
    
    // Customization
    className?: string;
    theme?: 'dark' | 'light';
    size?: 'sm' | 'md' | 'lg';
    variant?: 'dropzone' | 'button' | 'inline';
    
    // Custom render functions for external control
    renderPreview?: (file: FileWithId, previewUrl: string | null) => React.ReactNode;
    renderProgress?: (file: FileWithId, progress: number) => React.ReactNode;
    renderError?: (file: FileWithId, error: string) => React.ReactNode;
}

/**
 * File type specific configurations
 */
export interface FileTypeConfig {
    accept: FileAcceptConfig;
    maxSize: number;
    preview: PreviewConfig;
    features: string[];
}

/**
 * Disabled state reasons
 */
export type DisabledReason = 'status' | 'processing' | 'general' | null;

/**
 * Theme configuration
 */
export interface ThemeConfig {
    colors: {
        background: string;
        border: string;
        text: string;
        accent: string;
        error: string;
        success: string;
    };
}

/**
 * Size variant configuration
 */
export interface SizeConfig {
    container: string;
    dropzone: string;
    preview: string;
    text: string;
}