// index.ts - Main exports for file uploader components

// Main components
export { FileUploader as default, FileUploader } from './FileUploader';
export { ImageDisplay } from './ImageDisplay';

// Sub-components
export { DropZone } from './components/DropZone';
export { FileList } from './components/FileList';
export { FilePreview } from './components/FilePreview';

// Types
export type {
    BaseSignedUrlResponse, DisabledReason, FileAcceptConfig, FileTypeConfig, FileUploaderProps, FileValidationError, FileWithId, NormalizedSignedUrlResponse, PreviewConfig, SizeConfig, ThemeConfig, UploadResult
} from './types/file-uploader.types';

// Utilities
export
{
    createFilesWithId, createFileWithId, createPreviewUrl, findFileById, getFileIcon, removeFileById, revokePreviewUrl, sanitizeFileName,
    truncateFileName
} from './utils/file-utils';

export
{
    validateFile,
    validateFiles
} from './utils/file-validation';

export
{
    DISABLED_REASON_MESSAGES, FILE_TYPE_CONFIGS,
    getFileTypeConfig, SIZE_CONFIGS, THEME_CONFIGS
} from './utils/file-configs';

