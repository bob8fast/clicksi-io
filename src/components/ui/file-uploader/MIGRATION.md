# Migration Guide: Unified File Uploader

This guide shows how to migrate existing file upload implementations to use the new unified FileUploader component.

## Overview

The unified FileUploader follows an **external state management** pattern where the component handles UI concerns while consumers manage upload logic through orval hooks.

### Key Changes:
1. **FileWithId System** - Files now have unique IDs to prevent name collisions
2. **External State Management** - Upload logic moved outside the component
3. **Signed URL Priority** - Automatic priority system for preview URLs
4. **Consistent API** - Same component works for all use cases

## Migration Steps

### 1. Profile Image Upload Migration

**Before (ProfileHeader.tsx):**
```tsx
const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch('/api/user/profile-image', {
            method: 'POST',
            body: formData,
        });
        
        const data = await response.json();
        setProfileImage(data.image_url);
    } catch (error) {
        setUploadError('Failed to upload image');
    } finally {
        setIsUploading(false);
    }
};

// In JSX
<input
    type="file"
    accept="image/*"
    onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleImageUpload(file);
    }}
/>
```

**After (Using Unified Component):**
```tsx
import { FileUploader, useProfileFileUpload } from '@/components/ui/file-uploader';

const ProfileImageUploader = () => {
    const [selectedFiles, setSelectedFiles] = useState<FileWithId[]>([]);
    const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
    const [isUploading, setIsUploading] = useState(false);
    
    const profileFileHooks = useProfileFileUpload();
    const uploadWithPreview = profileFileHooks.uploadWithPreview();
    
    const handleFileSelect = async (filesWithId: FileWithId[]) => {
        const fileWithId = filesWithId[0];
        setSelectedFiles([fileWithId]);
        setIsUploading(true);
        
        try {
            const result = await uploadWithPreview(fileWithId.file);
            setPreviewUrls({ [fileWithId.fileId]: result.previewUrl });
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };
    
    return (
        <FileUploader
            fileType="image"
            onFileSelect={handleFileSelect}
            onFileRemove={(fileId) => {
                setSelectedFiles([]);
                setPreviewUrls({});
            }}
            selectedFiles={selectedFiles}
            previewUrls={previewUrls}
            isUploading={isUploading}
            preview={{ enabled: true, type: 'full' }}
        />
    );
};
```

### 2. Verification Document Migration

**Important:** Verification documents are uploaded during form submission, not immediately on file selection.

**Before (FileUpload.tsx):**
```tsx
interface FileUploadProps {
    documentType: VerificationDocumentType;
    existingDocument?: VerificationDocumentDto;
    uploadedFile?: File;
    onFileSelect: (file: File) => void;
    onFileRemove: () => void;
    disabled?: boolean;
}

export function FileUpload({ 
    documentType, 
    existingDocument, 
    uploadedFile, 
    onFileSelect,
    onFileRemove,
    disabled 
}: FileUploadProps) {
    // Complex internal logic for dropzone, validation, preview
    // Files stored until form submission
    return (
        <div>
            {/* Dropzone implementation */}
            {/* File preview implementation */}
            {/* Error handling implementation */}
        </div>
    );
}
```

**After (Using Unified Component - Form Submission Pattern):**
```tsx
import { FileUploader, useVerificationFileUpload } from '@/components/ui/file-uploader';

interface VerificationDocumentFormProps {
    documentType: string;
    existingDocument?: VerificationDocumentDto;
    disabled?: boolean;
    onFormSubmit?: (result: any) => void;
}

export function VerificationDocumentForm({ 
    documentType, 
    existingDocument, 
    disabled,
    onFormSubmit 
}: VerificationDocumentFormProps) {
    const [selectedFiles, setSelectedFiles] = useState<FileWithId[]>([]);
    const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({ user_notes: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const verificationFileHooks = useVerificationFileUpload();
    
    // Initialize with existing document if provided
    useEffect(() => {
        if (existingDocument && !selectedFiles.length) {
            const existingFiles = verificationFileHooks.convertExistingDocumentsToFileWithId([existingDocument]);
            setSelectedFiles(existingFiles);
            
            // Get signed URLs for existing documents
            if (existingDocument.image_id) {
                verificationFileHooks.getSignedUrls([existingDocument.image_id])
                    .then(response => {
                        setPreviewUrls({ [existingFiles[0].fileId]: response.urls[0]?.url });
                    });
            }
        }
    }, [existingDocument]);
    
    const handleFileSelect = (filesWithId: FileWithId[]) => {
        // Just store files - NO upload happens here
        setSelectedFiles(filesWithId);
        // Preview URLs will be blob URLs (handled automatically by component)
    };
    
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Organize files by document type
            const filesByDocumentType = {
                [documentType]: selectedFiles.filter(f => !f.isExisting)
            };
            
            // Submit form with files using existing verification logic
            const result = await verificationFileHooks.submitVerificationForm(
                formData,
                filesByDocumentType
            );
            
            onFormSubmit?.(result);
        } catch (error) {
            console.error('Submission failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <form onSubmit={handleFormSubmit} className="space-y-4">
            <FileUploader
                fileType="document"
                accept={{
                    mimeTypes: ['application/pdf', 'image/*'],
                    extensions: ['.pdf', '.png', '.jpg'],
                    description: 'Verification documents'
                }}
                maxSize={10 * 1024 * 1024}
                onFileSelect={handleFileSelect}
                onFileRemove={(fileId) => {
                    setSelectedFiles(prev => prev.filter(f => f.fileId !== fileId));
                }}
                selectedFiles={selectedFiles}
                previewUrls={previewUrls} // Signed URLs for existing, blob for new
                disabled={disabled || isSubmitting}
                preview={{ enabled: true, type: 'thumbnail' }}
            />
            
            <button
                type="submit"
                disabled={isSubmitting || selectedFiles.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Verification'}
            </button>
        </form>
    );
}
```

**Key Points for Verification Migration:**
1. **No Immediate Upload** - Files are only selected, not uploaded on selection
2. **Form Integration** - Upload happens during form submission using existing verification hooks
3. **File State Management** - Files stored in component state until form submission
4. **Preview Priority** - Existing documents use signed URLs, new files use blob URLs
5. **Validation** - File validation happens before form submission

### 3. Category Image Migration

**Before (CategoryEditModal.tsx ImageUploadSection):**
```tsx
const ImageUploadSection = React.memo(({
    category,
    onImageUpload,
    pendingImageUrl
}) => {
    const categoryHooks = useCategoryHooks();
    const { mutateAsync: getImageUrls } = categoryHooks.getImageUrls();
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    
    // Complex logic for signed URLs, pending changes, etc.
    
    return (
        <div>
            {/* Image preview */}
            {/* File input */}
            {/* Upload button */}
        </div>
    );
});
```

**After (Using Unified Component):**
```tsx
import { FileUploader, useCategoryFileUpload } from '@/components/ui/file-uploader';

const CategoryImageSection = React.memo(({
    category,
    onImageChange
}: {
    category: EditingCategory;
    onImageChange: (changes: any) => void;
}) => {
    const [selectedFiles, setSelectedFiles] = useState<FileWithId[]>([]);
    const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
    const [isUploading, setIsUploading] = useState(false);
    
    const categoryFileHooks = useCategoryFileUpload();
    const uploadWithChanges = categoryFileHooks.uploadWithPendingChanges(category.id);
    
    const handleFileSelect = async (filesWithId: FileWithId[]) => {
        const fileWithId = filesWithId[0];
        setSelectedFiles([fileWithId]);
        setIsUploading(true);
        
        try {
            const result = await uploadWithChanges(fileWithId.file);
            setPreviewUrls({ [fileWithId.fileId]: result.previewUrl });
            
            // Notify parent of pending changes
            onImageChange({
                pendingImageFile: fileWithId.file,
                pendingImageUrl: result.previewUrl,
                fieldUpdates: [{
                    field: 'image_id',
                    value: result.imageId
                }]
            });
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };
    
    return (
        <FileUploader
            fileType="image"
            onFileSelect={handleFileSelect}
            onFileRemove={(fileId) => {
                setSelectedFiles([]);
                setPreviewUrls({});
                onImageChange({ pendingImageFile: null });
            }}
            selectedFiles={selectedFiles}
            previewUrls={previewUrls}
            isUploading={isUploading}
            preview={{ enabled: true, type: 'full' }}
            variant="dropzone"
        />
    );
});
```

## Migration Checklist

### For Each Component:

1. **✅ Install Dependencies**
   ```tsx
   import { FileUploader, useXxxFileUpload } from '@/components/ui/file-uploader';
   ```

2. **✅ Update State Management**
   - Replace internal file handling with FileWithId arrays
   - Add external state for preview URLs, progress, errors
   - Move upload logic to hook handlers

3. **✅ Replace UI Components**
   - Remove custom dropzone implementations
   - Remove custom file preview logic
   - Remove custom validation logic

4. **✅ Update Event Handlers**
   - Change from `(file: File)` to `(filesWithId: FileWithId[])`
   - Use unique fileId for removal instead of file references
   - Handle external state updates

5. **✅ Configure File Types**
   ```tsx
   // Use predefined config
   fileType="image" // or "document", "media", "any"
   
   // Or custom config
   accept={{
       mimeTypes: ['image/*'],
       extensions: ['.png', '.jpg'],
       description: 'Images only'
   }}
   ```

6. **✅ Test Migration**
   - File selection works correctly
   - Preview displays properly (signed URLs take priority)
   - Upload progress/errors show correctly
   - File removal works
   - Validation behaves as expected

## Common Patterns

### Pattern 1: Immediate Upload
```tsx
const handleFileSelect = async (filesWithId: FileWithId[]) => {
    const uploadHandler = serviceHooks.uploadImage();
    
    for (const fileWithId of filesWithId) {
        await uploadHandler(fileWithId.file);
    }
};
```

### Pattern 2: Temporary Upload with Confirmation
```tsx
const handleFileSelect = async (filesWithId: FileWithId[]) => {
    const tempResults = [];
    
    for (const fileWithId of filesWithId) {
        const tempResult = await serviceHooks.uploadToTemp(fileWithId.file);
        tempResults.push({ fileId: fileWithId.fileId, ...tempResult });
    }
    
    setTempDocuments(tempResults);
};

const confirmUploads = async () => {
    for (const tempDoc of tempDocuments) {
        await serviceHooks.confirmTempUpload(tempDoc.temp_id);
    }
};
```

### Pattern 3: Preview with Signed URLs
```tsx
const handleFileSelect = async (filesWithId: FileWithId[]) => {
    // Upload files
    const uploadResults = await Promise.all(
        filesWithId.map(f => serviceHooks.uploadImage(f.file))
    );
    
    // Get signed URLs for preview
    const imageIds = uploadResults.map(r => r.imageId);
    const signedUrls = await serviceHooks.getSignedUrls(imageIds);
    
    // Map to fileId -> URL for component
    const urlMap = filesWithId.reduce((acc, fileWithId, index) => {
        acc[fileWithId.fileId] = signedUrls.urls[index]?.url;
        return acc;
    }, {} as Record<string, string>);
    
    setPreviewUrls(urlMap);
};
```

## Benefits After Migration

1. **Consistency** - Same component for all file upload scenarios
2. **Maintainability** - Single codebase to maintain and update
3. **Features** - Built-in validation, preview, themes, accessibility
4. **Flexibility** - External state management allows any upload strategy
5. **Performance** - Optimized preview handling and signed URL management
6. **Type Safety** - Full TypeScript support with FileWithId system

## Rollback Plan

If issues arise during migration, you can:

1. Keep both old and new components side-by-side temporarily
2. Use feature flags to toggle between implementations
3. Migrate one component at a time
4. The old components remain unchanged and functional

The migration is non-breaking - existing components continue to work while you gradually adopt the unified system.