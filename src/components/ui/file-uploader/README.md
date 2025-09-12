# Unified File Uploader Component

A comprehensive, reusable file upload system for the Clicksi platform that supports multiple file types, S3 signed URL integration, and external state management.

## Features

- 🔄 **External State Management** - Consumer controls upload strategy (temporary/permanent)
- 🆔 **FileWithId System** - Prevents name collision issues with unique client-side IDs
- 🖼️ **Signed URL Priority** - Signed URLs automatically take priority over blob URLs
- 🎨 **Theme Support** - Dark/light themes with customizable styling
- 📱 **Responsive Design** - Mobile-friendly with multiple layout variants
- ✅ **Comprehensive Validation** - File type, size, and format validation
- ♿ **Accessibility** - Full ARIA support and keyboard navigation
- ⚡ **React Query Ready** - Built for TTL-based signed URL refresh

## Quick Start

```tsx
import { FileUploader } from '@/components/ui/file-uploader';

function MyComponent() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    
    return (
        <FileUploader
            fileType="image"
            onFileSelect={setSelectedFiles}
            onFileRemove={(fileId) => {
                setSelectedFiles(prev => prev.filter(f => f.fileId !== fileId));
            }}
            selectedFiles={selectedFiles}
            preview={{ enabled: true, type: 'full' }}
        />
    );
}
```

## Component Architecture

### What the Component Handles ✅
- File selection and validation
- Preview management (blob + signed URL priority)
- UI state management (loading, error, disabled)
- Accessibility and responsive design
- FileWithId system for unique identification

### What the Component Does NOT Handle ❌
- Upload logic (consumer manages via orval hooks)
- API integration (consumer handles service calls)
- Progress tracking (consumer provides progress state)
- Storage strategy (consumer chooses temp/permanent)
- Caching (consumer manages with React Query)

## Core Components

### FileUploader
Main component that orchestrates file selection and display.

```tsx
interface FileUploaderProps {
    // Core functionality
    fileType: 'image' | 'document' | 'media' | 'any';
    onFileSelect: (files: FileWithId[]) => void;
    onFileRemove: (fileId: string) => void;
    
    // External state management
    selectedFiles?: FileWithId[];
    previewUrls?: Record<string, string>; // fileId -> signed URL
    uploadProgress?: Record<string, number>;
    uploadErrors?: Record<string, string>;
    
    // Configuration
    accept?: FileAcceptConfig;
    maxSize?: number;
    multiple?: boolean;
    preview?: PreviewConfig;
    
    // UI customization
    variant?: 'dropzone' | 'button' | 'inline';
    theme?: 'dark' | 'light';
    size?: 'sm' | 'md' | 'lg';
}
```

### ImageDisplay
Standalone component for displaying existing images with S3 integration.

```tsx
<ImageDisplay
    imageId={user.profile_image_id}
    onGetSignedUrls={async (ids) => {
        const profileHooks = useProfileHooks();
        const { mutateAsync } = profileHooks.getImageSignedUrls();
        return mutateAsync({ data: { image_storage_paths: ids } });
    }}
    alt="Profile image"
    className="w-24 h-24 rounded-full"
    fallback={<DefaultAvatarIcon />}
/>
```

## FileWithId System

The component uses a unique identification system to prevent file name collisions:

```typescript
interface FileWithId {
    fileId: string; // Unique identifier (generated client-side)
    file: File; // Original File object
    name: string; // File name (for display)
    size: number; // File size
    type: string; // MIME type
    lastModified: number; // Last modified timestamp
}

// Utility function
const createFileWithId = (file: File): FileWithId => {
    return {
        fileId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
    };
};
```

## Preview Priority System

The component automatically handles preview URLs with a priority system:

1. **Priority 1**: External signed URLs (from API)
2. **Priority 2**: Blob URLs (immediate preview)

```tsx
// Component automatically chooses the best available preview
const getPreviewUrl = (fileWithId: FileWithId): string | null => {
    // Signed URL has priority
    if (previewUrls?.[fileWithId.fileId]) {
        return previewUrls[fileWithId.fileId];
    }
    
    // Fallback to blob URL for immediate preview
    if (fileWithId.file.type.startsWith('image/')) {
        return URL.createObjectURL(fileWithId.file);
    }
    
    return null;
};
```

## Usage Patterns

### Pattern 1: Profile Image Upload
```tsx
const ProfileImageUploader = () => {
    const [selectedFiles, setSelectedFiles] = useState<FileWithId[]>([]);
    const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
    
    const profileHooks = useProfileHooks();
    const { mutate: uploadImage } = profileHooks.uploadProfileImage();
    
    const handleFileSelect = async (filesWithId: FileWithId[]) => {
        setSelectedFiles(filesWithId);
        
        // Option 1: Upload immediately
        const file = filesWithId[0].file;
        uploadImage({ data: { image: file } });
        
        // Option 2: Upload to temp storage first
        // const tempResult = await uploadToTempStorage(file);
        // const signedUrls = await getSignedUrls([tempResult.temp_id]);
        // setPreviewUrls({ [filesWithId[0].fileId]: signedUrls[0].url });
    };
    
    return (
        <FileUploader
            fileType="image"
            onFileSelect={handleFileSelect}
            onFileRemove={(fileId) => {
                setSelectedFiles(prev => prev.filter(f => f.fileId !== fileId));
            }}
            selectedFiles={selectedFiles}
            previewUrls={previewUrls}
        />
    );
};
```

### Pattern 2: Verification Documents
```tsx
const VerificationUploader = ({ documentType }) => {
    const [selectedFiles, setSelectedFiles] = useState<FileWithId[]>([]);
    const [tempDocuments, setTempDocuments] = useState<TempDocument[]>([]);
    
    const verificationHooks = useVerificationHooks();
    
    const handleFileSelect = async (filesWithId: FileWithId[]) => {
        setSelectedFiles(filesWithId);
        
        // Upload to temporary storage for preview
        const tempPromises = filesWithId.map(async (fileWithId) => {
            const tempResult = await verificationHooks.uploadToTemp({
                file: fileWithId.file,
                document_type: documentType
            });
            
            return {
                fileId: fileWithId.fileId,
                temp_id: tempResult.temp_id
            };
        });
        
        const tempDocs = await Promise.all(tempPromises);
        setTempDocuments(tempDocs);
    };
    
    return (
        <FileUploader
            fileType="document"
            multiple={true}
            onFileSelect={handleFileSelect}
            selectedFiles={selectedFiles}
            preview={{ enabled: true, type: 'thumbnail' }}
        />
    );
};
```

### Pattern 3: Category Image Management
```tsx
const CategoryImageUploader = ({ category }) => {
    const [selectedFiles, setSelectedFiles] = useState<FileWithId[]>([]);
    const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
    const [hasPendingChanges, setHasPendingChanges] = useState(false);
    
    const categoryHooks = useCategoryHooks();
    
    const handleFileSelect = async (filesWithId: FileWithId[]) => {
        const fileWithId = filesWithId[0]; // Single image
        setSelectedFiles([fileWithId]);
        setHasPendingChanges(true);
        
        // Create immediate blob preview
        const blobUrl = URL.createObjectURL(fileWithId.file);
        setPreviewUrls({ [fileWithId.fileId]: blobUrl });
    };
    
    const handleSave = async () => {
        if (selectedFiles.length > 0) {
            const file = selectedFiles[0].file;
            await categoryHooks.uploadImage({ data: { image: file } });
            setHasPendingChanges(false);
        }
    };
    
    return (
        <div>
            <FileUploader
                fileType="image"
                onFileSelect={handleFileSelect}
                selectedFiles={selectedFiles}
                previewUrls={previewUrls}
                preview={{ enabled: true, type: 'full' }}
            />
            {hasPendingChanges && (
                <button onClick={handleSave}>Save Changes</button>
            )}
        </div>
    );
};
```

## React Query Integration

For optimal signed URL management with automatic refresh:

```tsx
const useSignedUrls = (imageIds: string[], onGetSignedUrls: Function) => {
    return useQuery({
        queryKey: ['signed-urls', imageIds.sort().join(',')],
        queryFn: () => onGetSignedUrls(imageIds),
        enabled: imageIds.length > 0,
        
        // Smart stale/refetch timing based on backend TTL
        staleTime: (data) => {
            if (!data?.expires_at) return 5 * 60 * 1000;
            const expiresAt = new Date(data.expires_at);
            const timeUntilExpiry = expiresAt.getTime() - Date.now();
            return Math.max(timeUntilExpiry * 0.75, 30 * 1000);
        },
        
        // Background refresh when URLs are about to expire
        refetchInterval: (data) => {
            if (!data?.expires_at) return false;
            const timeUntilExpiry = new Date(data.expires_at).getTime() - Date.now();
            return timeUntilExpiry < (data.ttl_seconds || 3600) * 500 ? 60000 : false;
        },
        
        keepPreviousData: true,
    });
};
```

## Customization

### Themes
```tsx
// Built-in dark theme (default)
<FileUploader theme="dark" />

// Built-in light theme
<FileUploader theme="light" />

// Custom styling via className
<FileUploader className="custom-uploader" />
```

### Variants
```tsx
// Full dropzone (default)
<FileUploader variant="dropzone" />

// Button-style upload
<FileUploader variant="button" />

// Inline with compact dropzone
<FileUploader variant="inline" />
```

### Sizes
```tsx
<FileUploader size="sm" />  // Compact size
<FileUploader size="md" />  // Default size
<FileUploader size="lg" />  // Large size
```

## Migration from Existing Components

### From Verification FileUpload
```tsx
// Before
<FileUpload
    documentType={documentType}
    onFileSelect={handleFileSelect}
    existingDocument={document}
    disabled={isDisabled}
/>

// After
<FileUploader
    fileType="document"
    onFileSelect={handleFileSelect}
    selectedFiles={selectedFiles} // Convert from existing document
    disabled={isDisabled}
/>
```

### From Profile Image Upload
```tsx
// Before - internal upload handling
const handleImageUpload = async (file) => {
    const response = await fetch('/api/user/profile-image', {
        method: 'POST',
        body: formData
    });
};

// After - external upload handling
const handleFileSelect = async (filesWithId) => {
    const profileHooks = useProfileHooks();
    const file = filesWithId[0].file;
    profileHooks.uploadImage({ data: { image: file } });
};
```

## Best Practices

1. **Always use FileWithId** - Prevents name collision issues
2. **External State Management** - Keep upload logic outside the component  
3. **Signed URL Priority** - Provide signed URLs when available for better UX
4. **React Query Integration** - Use for automatic signed URL refresh
5. **Error Handling** - Provide comprehensive error callbacks
6. **Accessibility** - Always provide alt text and proper ARIA labels
7. **File Validation** - Use built-in validation or provide custom rules

## API Integration

The component is designed to work with any API service through the external state management pattern:

```tsx
// Profile Service
const profileHooks = useProfileHooks();
const { mutate: uploadImage } = profileHooks.uploadProfileImage();
const { mutateAsync: getSignedUrls } = profileHooks.getImageSignedUrls();

// Verification Service  
const verificationHooks = useVerificationHooks();
const { mutate: uploadDoc } = verificationHooks.uploadDocument();

// Category Service
const categoryHooks = useCategoryHooks();
const { mutate: uploadCategoryImage } = categoryHooks.uploadImage();
```

This design allows the same component to work with different API services while maintaining consistency in the UI and UX.