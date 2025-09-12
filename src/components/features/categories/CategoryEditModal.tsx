// components/categories/CategoryEditModal.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ResponsiveModal from '@/components/ui/responsive-modal';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { generateSlug } from '@/lib/slug-utils';
import { CategoryLocalizationDto } from '@/types';
import { useCategoryHooks } from '@/hooks/api';
import { EditingCategory, SUPPORTED_LANGUAGES, SupportedLanguageCode, getCategoryName, getCategoryDescription, getCategorySlug } from '@/types/app/category-types';
import
{
    AlertCircle,
    Edit3,
    Info,
    Palette,
    Save,
    Upload,
    X
} from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import IconGallery, { ICON_MAP } from './IconGallery';

interface CategoryEditModalProps
{
    category: EditingCategory;
    selectedLanguage: SupportedLanguageCode;
    onClose: () => void;
    onUpdate: (field: string, value: any) => void;
    onUpdateLocalization: (lang: SupportedLanguageCode, field: keyof CategoryLocalizationDto, value: string) => void;
    onOpenIconGallery: () => void;
    onImageUpload: (file: File) => void;
    availableLanguages: typeof SUPPORTED_LANGUAGES[number][];
    onSave?: (changes: {
        fieldUpdates: { field: string; value: any }[];
        localizationUpdates: { lang: SupportedLanguageCode; field: keyof CategoryLocalizationDto; value: string }[];
        imageFile?: File;
        iconName?: string;
    }) => void;
}

// Local state interface for pending changes
interface PendingChanges
{
    localizations: { [key: string]: Partial<CategoryLocalizationDto> };
    displayOrder?: number;
    isActive?: boolean;
    pendingImageFile?: File;
    pendingImageUrl?: string;
    pendingIconName?: string;
    fieldUpdates: { field: string; value: any }[];
    localizationUpdates: { lang: SupportedLanguageCode; field: keyof CategoryLocalizationDto; value: string }[];
}

// Separate component for image upload section
const ImageUploadSection = React.memo(({
    category,
    onImageUpload,
    pendingImageUrl
}: {
    category: EditingCategory;
    onImageUpload: (file: File) => void;
    pendingImageUrl?: string;
}) =>
{
    const fileInputRef = useRef<HTMLInputElement>(null);

    const categoryHooks = useCategoryHooks();
    const { mutateAsync: getImageUrls } = categoryHooks.getImageUrls();
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null | undefined>(null);
    
    // Load signed URL for existing image
    useEffect(() => {
        if (pendingImageUrl) {
            setCurrentImageUrl(pendingImageUrl);
        } else if (category.image_id) {
            getImageUrls({data: { image_storage_paths: [category.image_id] }})
                .then(response => {
                    if (response.image_urls) {
                        const urls = response.image_urls || [];
                        setCurrentImageUrl(urls.length > 0 ? urls[0].url : null);
                    }
                })
                .catch(() => setCurrentImageUrl(null));
        } else {
            setCurrentImageUrl(null);
        }
    }, [category.image_id, pendingImageUrl, getImageUrls]);
    
    const has_image_changed = Boolean(pendingImageUrl);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const file = e.target.files?.[0];
        if (file)
        {
            onImageUpload(file);
        }
    }, [onImageUpload]);

    return (
        <div className="space-y-3">
            <Label className="text-[#828288] text-sm font-medium">Category Image</Label>

            {currentImageUrl && (
                <div className="relative w-full h-40 rounded-lg overflow-hidden bg-[#090909] border border-[#202020]">
                    <Image
                        src={currentImageUrl}
                        alt="Category image"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {has_image_changed && (
                            <Badge className="bg-blue-500 text-white text-xs">
                                Changed
                            </Badge>
                        )}
                        {category.has_image_change && (
                            <Badge className="bg-green-500 text-white text-xs">
                                Uploaded
                            </Badge>
                        )}
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
            />

            <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:border-[#828288]"
            >
                <Upload className="h-4 w-4 mr-2" />
                {currentImageUrl ? 'Change Image' : 'Upload Image'}
            </Button>

            <div className="flex items-center text-xs text-[#575757] bg-[#202020]/30 p-2 rounded">
                <Info className="h-3 w-3 mr-2 flex-shrink-0" />
                <span>Recommended: 400x300px, JPG/PNG, max 2MB</span>
            </div>
        </div>
    );
});

ImageUploadSection.displayName = 'ImageUploadSection';

// Separate component for icon selection
const IconSelectionSection = React.memo(({
    category,
    onOpenIconGallery,
    pendingIconChange
}: {
    category: EditingCategory;
    onOpenIconGallery: () => void;
    pendingIconChange?: string;
}) =>
{
    // Use pending icon change if available, otherwise use current icon
    const currentIconName = pendingIconChange || category.icon_name;
    const IconComponent = currentIconName ? ICON_MAP[currentIconName] : null;
    const hasIconChanged = pendingIconChange && pendingIconChange !== category.icon_name;

    return (
        <div className="space-y-3">
            <Label className="text-[#828288] text-sm font-medium">Category Icon</Label>

            {currentIconName ? (
                <div className="relative">
                    <div className="flex items-center space-x-3 p-4 bg-[#090909] rounded-lg border border-[#575757]">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#D78E59] to-[#FFAA6C] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                            {IconComponent && React.createElement(IconComponent, {
                                className: "h-7 w-7 text-[#171717]"
                            })}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[#EDECF8] font-medium text-sm">
                                {currentIconName}
                            </div>
                            <div className="text-[#575757] text-xs">
                                {hasIconChanged ? 'New icon selected' : 'Currently selected icon'}
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <Badge variant="secondary" className="bg-[#D78E59] text-[#171717] text-xs flex-shrink-0">
                                Active
                            </Badge>
                            {hasIconChanged && (
                                <Badge variant="secondary" className="bg-blue-500 text-white text-xs flex-shrink-0">
                                    Changed
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-[#575757] rounded-lg">
                    <div className="text-center">
                        <Palette className="h-8 w-8 text-[#575757] mx-auto mb-2" />
                        <div className="text-[#575757] text-sm">No icon selected</div>
                    </div>
                </div>
            )}

            <Button
                variant="outline"
                onClick={onOpenIconGallery}
                className="w-full border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:border-[#828288]"
            >
                <Palette className="h-4 w-4 mr-2" />
                {currentIconName ? 'Change Icon' : 'Select Icon'}
            </Button>

            <div className="flex items-center text-xs text-[#575757] bg-[#202020]/30 p-2 rounded">
                <Info className="h-3 w-3 mr-2 flex-shrink-0" />
                <span>Choose an icon to represent this category</span>
            </div>
        </div>
    );
});

IconSelectionSection.displayName = 'IconSelectionSection';

// Separate component for category information display
const CategoryInfoSection = React.memo(({ category }: { category: EditingCategory }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#EDECF8] border-b border-[#575757] pb-2">
            Category Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#090909] rounded-lg border border-[#202020]">
                <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-[#D78E59] rounded-full mr-2"></div>
                    <span className="text-xs font-medium text-[#828288] uppercase tracking-wide">Path</span>
                </div>
                <div className="text-[#EDECF8] font-mono text-sm break-all leading-relaxed">
                    {category.path}
                </div>
            </div>

            <div className="p-4 bg-[#090909] rounded-lg border border-[#202020]">
                <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-[#FFAA6C] rounded-full mr-2"></div>
                    <span className="text-xs font-medium text-[#828288] uppercase tracking-wide">Level</span>
                </div>
                <div className="text-[#EDECF8] text-sm">
                    Level {category.level}
                </div>
            </div>

            <div className="p-4 bg-[#090909] rounded-lg border border-[#202020]">
                <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-[#575757] rounded-full mr-2"></div>
                    <span className="text-xs font-medium text-[#828288] uppercase tracking-wide">Parent</span>
                </div>
                <div className="text-[#EDECF8] font-mono text-sm break-all leading-relaxed">
                    {category.parent_path || 'Root Category'}
                </div>
            </div>

            <div className="p-4 bg-[#090909] rounded-lg border border-[#202020]">
                <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-[#828288] rounded-full mr-2"></div>
                    <span className="text-xs font-medium text-[#828288] uppercase tracking-wide">Translations</span>
                </div>
                <div className="text-[#EDECF8] text-sm">
                    {category.localizations?.length || 0} languages
                </div>
            </div>
        </div>
    </div>
));

CategoryInfoSection.displayName = 'CategoryInfoSection';

export default function CategoryEditModal({
    category,
    selectedLanguage,
    onClose,
    onUpdate,
    onUpdateLocalization,
    onOpenIconGallery,
    onImageUpload,
    availableLanguages,
    onSave
}: CategoryEditModalProps)
{
    // Local state for ALL pending changes - only commit on save
    const [pendingChanges, setPendingChanges] = useState<PendingChanges>({
        localizations: {},
        displayOrder: category.display_order,
        isActive: category.is_active,
        pendingImageFile: undefined,
        pendingImageUrl: undefined,
        pendingIconName: undefined,
        fieldUpdates: [],
        localizationUpdates: []
    });

    // State for icon gallery
    const [showIconGallery, setShowIconGallery] = useState(false);

    // Cleanup blob URLs on unmount
    useEffect(() =>
    {
        return () =>
        {
            if (pendingChanges.pendingImageUrl)
            {
                URL.revokeObjectURL(pendingChanges.pendingImageUrl);
            }
        };
    }, [pendingChanges.pendingImageUrl]);

    // Get current localization with pending changes applied
    const currentLocalization = useMemo(() =>
    {
        const original = category.localizations?.find(loc => loc.language_code === selectedLanguage) ||
            category.localizations?.find(loc => loc.language_code === 'en') ||
            category.localizations?.[0] ||
            { language_code: selectedLanguage, name: '', slug: '', description: '' };

        const pending = pendingChanges.localizations[selectedLanguage] || {};

        return {
            ...original,
            ...pending
        };
    }, [category.localizations, selectedLanguage, pendingChanges.localizations]);

    // Enhanced slug generation using speakingurl
    const generateSlugForLanguage = useCallback((name: string, language: SupportedLanguageCode): string =>
    {
        return generateSlug(name, {
            preset: 'category',
            lang: language,
            maxLength: 50
        });
    }, []);

    // Update pending localization changes
    const updatePendingLocalization = useCallback((field: keyof CategoryLocalizationDto, value: string) =>
    {
        setPendingChanges(prev => ({
            ...prev,
            localizations: {
                ...prev.localizations,
                [selectedLanguage]: {
                    ...prev.localizations[selectedLanguage],
                    [field]: value
                }
            },
            localizationUpdates: [
                ...prev.localizationUpdates.filter(u => !(u.lang === selectedLanguage && u.field === field)),
                { lang: selectedLanguage, field, value }
            ]
        }));
    }, [selectedLanguage]);

    // Handle name change with auto-slug generation
    const handleNameChange = useCallback((value: string) =>
    {
        const currentSlug = currentLocalization.slug;
        const originalName = category.localizations?.find(loc => loc.language_code === selectedLanguage)?.name || '';
        const expectedSlug = generateSlugForLanguage(originalName, selectedLanguage);

        // Auto-generate slug if it's empty or matches the expected pattern for the original name
        const shouldGenerateSlug = !currentSlug || currentSlug === expectedSlug;

        setPendingChanges(prev =>
        {
            const newLocalizations = {
                ...prev.localizations,
                [selectedLanguage]: {
                    ...prev.localizations[selectedLanguage],
                    name: value,
                    ...(shouldGenerateSlug && { slug: generateSlugForLanguage(value, selectedLanguage) })
                }
            };

            return {
                ...prev,
                localizations: newLocalizations
            };
        });
    }, [selectedLanguage, currentLocalization.slug, category.localizations, generateSlugForLanguage]);

    // Handle slug change with validation
    const handleSlugChange = useCallback((value: string) =>
    {
        const cleanSlug = generateSlug(value, {
            preset: 'category',
            lang: selectedLanguage,
            maxLength: 50
        });
        updatePendingLocalization('slug', cleanSlug);
    }, [selectedLanguage, updatePendingLocalization]);

    // Handle description change
    const handleDescriptionChange = useCallback((value: string) =>
    {
        updatePendingLocalization('description', value);
    }, [updatePendingLocalization]);

    // Handle display order change
    const handleDisplayOrderChange = useCallback((value: string) =>
    {
        const numValue = parseInt(value) || 0;
        setPendingChanges(prev => ({
            ...prev,
            display_order: numValue
        }));
    }, []);

    // Handle image upload with preview - internal only
    const handleImageUpload = useCallback((file: File) =>
    {
        const imageUrl = URL.createObjectURL(file);
        setPendingChanges(prev => ({
            ...prev,
            pendingImageFile: file,
            pendingImageUrl: imageUrl,
            fieldUpdates: [
                ...prev.fieldUpdates.filter(u => u.field !== 'image_id'),
                {
                    field: 'image_id',
                    value: 'pending_upload'
                }
            ]
        }));
    }, [category.image_id]);

    // Handle icon selection - internal only
    const handleIconSelect = useCallback((iconName: string) =>
    {
        setPendingChanges(prev => ({
            ...prev,
            pendingIconName: iconName,
            fieldUpdates: [
                ...prev.fieldUpdates.filter(u => u.field !== 'icon_name'),
                {
                    field: 'icon_name',
                    value: iconName
                }
            ]
        }));
        setShowIconGallery(false);
    }, [category.icon_name]);

    // Handle opening icon gallery
    const handleOpenIconGallery = useCallback(() =>
    {
        setShowIconGallery(true);
    }, []);

    // Handle active status change
    const handleIsActiveChange = useCallback((checked: boolean) =>
    {
        setPendingChanges(prev => ({
            ...prev,
            is_active: checked
        }));
    }, []);

    // Check if there are any pending changes
    const hasChanges = useMemo(() =>
    {
        // Check localizations
        if (Object.keys(pendingChanges.localizations).length > 0)
        {
            const hasLocalizationChanges = Object.values(pendingChanges.localizations).some(loc =>
                Object.keys(loc).length > 0
            );
            if (hasLocalizationChanges) return true;
        }

        // Check field updates, image, icon, or other changes
        return pendingChanges.fieldUpdates.length > 0 ||
            !!pendingChanges.pendingImageFile ||
            !!pendingChanges.pendingIconName ||
            pendingChanges.displayOrder !== category.display_order ||
            pendingChanges.isActive !== category.is_active;
    }, [pendingChanges, category]);

    // Save all pending changes
    const handleSaveChanges = useCallback(() =>
    {
        // Use new onSave callback if available (preferred)
        if (onSave)
        {
            onSave({
                fieldUpdates: pendingChanges.fieldUpdates,
                localizationUpdates: pendingChanges.localizationUpdates,
                imageFile: pendingChanges.pendingImageFile,
                iconName: pendingChanges.pendingIconName
            });
        } else
        {
            // Fallback to old method for backward compatibility
            // Apply localization changes
            Object.entries(pendingChanges.localizations).forEach(([lang, changes]) =>
            {
                Object.entries(changes).forEach(([field, value]) =>
                {
                    if (value !== undefined)
                    {
                        onUpdateLocalization(lang as SupportedLanguageCode, field as keyof CategoryLocalizationDto, value as string);
                    }
                });
            });

            // Apply field changes
            pendingChanges.fieldUpdates.forEach(({ field, value }) =>
            {
                onUpdate(field, value);
            });

            // Apply image upload
            if (pendingChanges.pendingImageFile)
            {
                onImageUpload(pendingChanges.pendingImageFile);
            }
        }

        onClose();
    }, [pendingChanges, onSave, onUpdateLocalization, onUpdate, onImageUpload, onClose]);

    // Cancel changes and close
    const handleCancel = useCallback(() =>
    {
        // Clean up any blob URLs to prevent memory leaks
        if (pendingChanges.pendingImageUrl)
        {
            URL.revokeObjectURL(pendingChanges.pendingImageUrl);
        }

        setPendingChanges({
            localizations: {},
            displayOrder: category.display_order,
            isActive: category.is_active,
            pendingImageFile: undefined,
            pendingImageUrl: undefined,
            pendingIconName: undefined,
            fieldUpdates: [],
            localizationUpdates: []
        });
        onClose();
    }, [category, onClose, pendingChanges.pendingImageUrl]);

    // Footer with status badges and action buttons
    const footer = useMemo(() => (
        <div className="space-y-4">
            {/* Status Badges */}
            <div className="p-4 bg-[#090909] rounded-lg border border-[#202020]">
                <div className="text-sm font-medium text-[#828288] mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Category Status
                </div>
                <div className="flex flex-wrap gap-2">
                    {category.is_new && (
                        <Badge variant="secondary" className="bg-green-500 text-white">
                            New Category
                        </Badge>
                    )}
                    {category.is_dirty && !category.is_new && (
                        <Badge variant="secondary" className="bg-orange-500 text-white">
                            Has Changes
                        </Badge>
                    )}
                    {(category.has_image_change || pendingChanges.pendingImageFile) && (
                        <Badge variant="secondary" className="bg-blue-500 text-white">
                            Image Changed
                        </Badge>
                    )}
                    {(category.icon_name || pendingChanges.pendingIconName) && (
                        <Badge variant="secondary" className="bg-purple-500 text-white">
                            Icon Selected
                        </Badge>
                    )}
                    {pendingChanges.pendingIconName && pendingChanges.pendingIconName !== category.icon_name && (
                        <Badge variant="secondary" className="bg-blue-500 text-white">
                            Icon Changed
                        </Badge>
                    )}
                    {pendingChanges.isActive !== undefined && pendingChanges.isActive !== category.is_active && (
                        <Badge variant="secondary" className="bg-purple-500 text-white">
                            Status Pending
                        </Badge>
                    )}
                    {hasChanges && (
                        <Badge variant="secondary" className="bg-yellow-500 text-black">
                            Unsaved Changes
                        </Badge>
                    )}
                    {!pendingChanges.isActive && (
                        <Badge variant="secondary" className="bg-gray-500 text-white">
                            Inactive
                        </Badge>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
                <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                </Button>
                <Button
                    onClick={handleSaveChanges}
                    disabled={!hasChanges}
                    className={`${hasChanges
                        ? 'bg-[#D78E59] hover:bg-[#FFAA6C]'
                        : 'bg-gray-500 cursor-not-allowed'
                        } text-[#171717]`}
                >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                </Button>
            </div>
        </div>
    ), [handleCancel, handleSaveChanges, hasChanges, category, pendingChanges]);

    // Status badges with pending changes indicator
    const statusBadges = useMemo(() => (
        <div className="flex flex-wrap gap-2 mb-6 p-4 bg-[#090909] rounded-lg border border-[#202020]">
            <div className="text-sm font-medium text-[#828288] mb-2 w-full flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Category Status
            </div>
            <div className="flex flex-wrap gap-2">
                {category.is_new && (
                    <Badge variant="secondary" className="bg-green-500 text-white">
                        New Category
                    </Badge>
                )}
                {category.is_dirty && !category.is_new && (
                    <Badge variant="secondary" className="bg-orange-500 text-white">
                        Has Changes
                    </Badge>
                )}
                {category.has_image_change && (
                    <Badge variant="secondary" className="bg-blue-500 text-white">
                        Image Changed
                    </Badge>
                )}
                {category.icon_name && (
                    <Badge variant="secondary" className="bg-purple-500 text-white">
                        Icon Selected
                    </Badge>
                )}
                {pendingChanges.pendingIconName && pendingChanges.pendingIconName !== category.icon_name && (
                    <Badge variant="secondary" className="bg-blue-500 text-white">
                        Icon Changed
                    </Badge>
                )}
                {pendingChanges.isActive !== undefined && pendingChanges.isActive !== category.is_active && (
                    <Badge variant="secondary" className="bg-purple-500 text-white">
                        Status Pending
                    </Badge>
                )}
                {hasChanges && (
                    <Badge variant="secondary" className="bg-yellow-500 text-black">
                        Unsaved Changes
                    </Badge>
                )}
                {!pendingChanges.isActive && (
                    <Badge variant="secondary" className="bg-gray-500 text-white">
                        Inactive
                    </Badge>
                )}
            </div>
        </div>
    ), [category, pendingChanges, hasChanges]);

    return (
        <ResponsiveModal
            isOpen={true}
            onClose={handleCancel}
            title="Edit Category"
            description={`${category.path} • Level ${category.level}`}
            icon={<Edit3 className="h-5 w-5 text-[#D78E59]" />}
            maxWidth="4xl"
            height="90vh"
            footer={footer}
            useWideLayout={true}
        >
            <div className="space-y-6">
                {/* Unsaved Changes Warning */}
                {hasChanges && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="text-sm text-yellow-400 font-medium flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            You have unsaved changes. Click "Save Changes" to apply them.
                        </div>
                    </div>
                )}

                {/* Main Content - Desktop Landscape Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Basic Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#EDECF8] border-b border-[#575757] pb-2">
                                Basic Information
                            </h3>

                            <div>
                                <Label className="text-[#828288] text-sm font-medium">
                                    Name ({selectedLanguage.toUpperCase()})
                                    {selectedLanguage === 'en' && <span className="text-red-400 ml-1">*</span>}
                                </Label>
                                <Input
                                    value={currentLocalization.name || ''}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    className="bg-[#090909] border-[#575757] text-[#EDECF8] mt-1"
                                    placeholder="Category name"
                                    maxLength={100}
                                />
                                <div className="text-xs text-[#575757] mt-1">
                                    {(currentLocalization.name || '').length}/100 characters
                                </div>
                            </div>

                            <div>
                                <Label className="text-[#828288] text-sm font-medium">
                                    Slug ({selectedLanguage.toUpperCase()})
                                    {selectedLanguage === 'en' && <span className="text-red-400 ml-1">*</span>}
                                </Label>

                                {/* Slug Preview */}
                                <div className="mt-1 mb-2">
                                    <div className="text-xs text-[#575757] mb-1 flex items-center">
                                        <span>Preview:</span>
                                    </div>
                                    <div className="px-3 py-2 bg-[#202020] border border-[#575757] rounded-md">
                                        <span className="text-[#D78E59] text-sm font-mono break-words break-all leading-relaxed">
                                            {currentLocalization.slug || 'category-slug'}
                                        </span>
                                    </div>
                                </div>

                                <Input
                                    value={currentLocalization.slug || ''}
                                    onChange={(e) => handleSlugChange(e.target.value)}
                                    className="bg-[#090909] border-[#575757] text-[#EDECF8]"
                                    placeholder="category-slug"
                                    maxLength={50}
                                />
                                <div className="text-xs text-[#575757] mt-1">
                                    {(currentLocalization.slug || '').length}/50 characters • Generated using speakingurl with {selectedLanguage.toUpperCase()} support
                                </div>
                            </div>

                            <div>
                                <Label className="text-[#828288] text-sm font-medium">
                                    Description ({selectedLanguage.toUpperCase()})
                                </Label>
                                <Textarea
                                    value={currentLocalization.description || ''}
                                    onChange={(e) => handleDescriptionChange(e.target.value)}
                                    className="bg-[#090909] border-[#575757] text-[#EDECF8] mt-1"
                                    placeholder="Category description"
                                    rows={4}
                                    maxLength={500}
                                />
                                <div className="text-xs text-[#575757] mt-1">
                                    {(currentLocalization.description || '').length}/500 characters
                                </div>
                            </div>

                            {/* Settings */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-[#828288] text-sm font-medium">Display Order</Label>
                                    <Input
                                        type="number"
                                        value={pendingChanges.displayOrder}
                                        onChange={(e) => handleDisplayOrderChange(e.target.value)}
                                        className="bg-[#090909] border-[#575757] text-[#EDECF8] mt-1"
                                        min={0}
                                        max={9999}
                                    />
                                </div>
                                <div className="flex items-center space-x-2 pt-6">
                                    <Switch
                                        id="active-edit"
                                        checked={pendingChanges.isActive}
                                        onCheckedChange={handleIsActiveChange}
                                    />
                                    <Label htmlFor="active-edit" className="text-[#828288] text-sm font-medium">
                                        Active Category
                                    </Label>
                                </div>
                            </div>
                        </div>

                        {/* Category Information */}
                        <CategoryInfoSection category={category} />
                    </div>

                    {/* Right Column - Media */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-[#EDECF8] border-b border-[#575757] pb-2">
                            Media & Display
                        </h3>

                        <ImageUploadSection
                            category={category}
                            onImageUpload={handleImageUpload}
                            pendingImageUrl={pendingChanges.pendingImageUrl}
                        />
                        <IconSelectionSection
                            category={category}
                            onOpenIconGallery={handleOpenIconGallery}
                            pendingIconChange={pendingChanges.pendingIconName}
                        />
                    </div>
                </div>

                {/* Language Notice */}
                <div className="text-xs text-[#575757] bg-[#202020]/50 p-3 rounded-lg">
                    <strong>Note:</strong> You're currently editing the {selectedLanguage.toUpperCase()} localization.
                    Changes will only be saved when you click "Save Changes".
                </div>
            </div>

            {/* Icon Gallery Modal */}
            <IconGallery
                isOpen={showIconGallery}
                onClose={() => setShowIconGallery(false)}
                onIconSelect={handleIconSelect}
                selectedIcon={pendingChanges.pendingIconName || category.icon_name || undefined}
                showSelectButton={false}
            />
        </ResponsiveModal>
    );
}