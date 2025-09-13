// components/categories/CategoryControlsSection.tsx
'use client'

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CategoryItemSize, SUPPORTED_LANGUAGES, SupportedLanguageCode } from '@/types/app/category-types';
import
{
    ChevronDown,
    ChevronUp,
    Globe,
    Monitor,
    Plus,
    Save,
    Square,
    X
} from 'lucide-react';
import React from 'react';

interface CategoryControlsSectionProps
{
    // State props
    showInactiveCategories: boolean;
    showImages: boolean;
    itemSize: CategoryItemSize;
    selectedLanguage: SupportedLanguageCode;
    hasUnsavedChanges: boolean;
    changedCategoriesCount: number;
    validationErrors: string[];
    isUpdating: boolean;
    expandedCategories: Set<string>;
    categoriesWithChildren: any[];

    // Available data
    availableLanguages: typeof SUPPORTED_LANGUAGES[number][];

    // Event handlers
    onAddCategory: () => void;
    onToggleInactive: (value: boolean) => void;
    onToggleImages: (value: boolean) => void;
    onItemSizeChange: (size: CategoryItemSize) => void;
    onLanguageChange: (lang: SupportedLanguageCode) => void;
    onSaveChanges: () => void;
    onCancelChanges: () => void;
    onExpandAll: () => void;
    onCollapseAll: () => void;
}

// Separate component for item size selector
const ItemSizeSelector = React.memo(({
    itemSize,
    onItemSizeChange
}: {
    itemSize: CategoryItemSize;
    onItemSizeChange: (size: CategoryItemSize) => void;
}) => (
    <div className="flex items-center space-x-2">
        <Label className="text-[#828288] text-sm whitespace-nowrap">Size:</Label>
        <div className="flex items-center bg-[#090909] border border-[#575757] rounded-md overflow-hidden">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onItemSizeChange('small')}
                className={`${itemSize === 'small'
                    ? 'bg-[#D78E59] text-[#171717]'
                    : 'text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]'
                    } px-3 py-1.5 h-8 text-xs rounded-none border-0 font-medium`}
                title="Small size - Compact view"
            >
                <Square className="h-3 w-3 mr-1" />
                S
            </Button>
            <div className="w-px h-6 bg-[#575757]" />
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onItemSizeChange('medium')}
                className={`${itemSize === 'medium'
                    ? 'bg-[#D78E59] text-[#171717]'
                    : 'text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]'
                    } px-3 py-1.5 h-8 text-xs rounded-none border-0 font-medium`}
                title="Medium size - Standard view"
            >
                <Monitor className="h-3 w-3 mr-1" />
                M
            </Button>
            <div className="w-px h-6 bg-[#575757]" />
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onItemSizeChange('large')}
                className={`${itemSize === 'large'
                    ? 'bg-[#D78E59] text-[#171717]'
                    : 'text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]'
                    } px-3 py-1.5 h-8 text-xs rounded-none border-0 font-medium`}
                title="Large size - Detailed view"
            >
                <Square className="h-4 w-4 mr-1" />
                L
            </Button>
        </div>
    </div>
));

ItemSizeSelector.displayName = 'ItemSizeSelector';

// Separate component for expand/collapse controls
const ExpandCollapseControls = React.memo(({
    expandedCategories,
    categoriesWithChildren,
    onExpandAll,
    onCollapseAll
}: {
    expandedCategories: Set<string>;
    categoriesWithChildren: any[];
    onExpandAll: () => void;
    onCollapseAll: () => void;
}) => (
    <div className="flex items-center space-x-1">
        <Button
            variant="ghost"
            size="sm"
            onClick={onExpandAll}
            disabled={categoriesWithChildren.length === 0}
            className="text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] px-2 py-1 h-8"
            title="Expand all categories"
        >
            <ChevronDown className="h-4 w-4" />
        </Button>
        <Button
            variant="ghost"
            size="sm"
            onClick={onCollapseAll}
            disabled={expandedCategories.size === 0}
            className="text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] px-2 py-1 h-8"
            title="Collapse all categories"
        >
            <ChevronUp className="h-4 w-4" />
        </Button>
    </div>
));

ExpandCollapseControls.displayName = 'ExpandCollapseControls';

// Separate component for toggle switches
const ToggleSwitches = React.memo(({
    showInactiveCategories,
    showImages,
    onToggleInactive,
    onToggleImages
}: {
    showInactiveCategories: boolean;
    showImages: boolean;
    onToggleInactive: (value: boolean) => void;
    onToggleImages: (value: boolean) => void;
}) => (
    <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
            <Switch
                id="show-inactive"
                checked={showInactiveCategories}
                onCheckedChange={onToggleInactive}
            />
            <Label htmlFor="show-inactive" className="text-[#828288] text-sm whitespace-nowrap">
                Show inactive
            </Label>
        </div>

        <div className="flex items-center space-x-2">
            <Switch
                id="show-images"
                checked={showImages}
                onCheckedChange={onToggleImages}
            />
            <Label htmlFor="show-images" className="text-[#828288] text-sm whitespace-nowrap">
                Show images
            </Label>
        </div>
    </div>
));

ToggleSwitches.displayName = 'ToggleSwitches';

// Separate component for language selector
const LanguageSelector = React.memo(({
    selectedLanguage,
    availableLanguages,
    onLanguageChange
}: {
    selectedLanguage: SupportedLanguageCode;
    availableLanguages: typeof SUPPORTED_LANGUAGES[number][];
    onLanguageChange: (lang: SupportedLanguageCode) => void;
}) => (
    <div className="flex items-center space-x-2">
        <Globe className="h-4 w-4 text-[#575757] flex-shrink-0" />
        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
            <SelectTrigger className="bg-[#171717] border-[#575757] text-[#EDECF8] min-w-0 flex-1 sm:flex-initial sm:w-32">
                <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#171717] border-[#575757] text-[#EDECF8]">
                {availableLanguages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
));

LanguageSelector.displayName = 'LanguageSelector';

// Separate component for action buttons
const ActionButtons = React.memo(({
    hasUnsavedChanges,
    changedCategoriesCount,
    validationErrors,
    isUpdating,
    onSaveChanges,
    onCancelChanges
}: {
    hasUnsavedChanges: boolean;
    changedCategoriesCount: number;
    validationErrors: string[];
    isUpdating: boolean;
    onSaveChanges: () => void;
    onCancelChanges: () => void;
}) =>
{
    if (!hasUnsavedChanges) return null;

    return (
        <div className="flex flex-col sm:flex-row gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={onCancelChanges}
                disabled={isUpdating}
                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] text-sm px-3 py-2"
            >
                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Cancel
            </Button>
            <Button
                onClick={onSaveChanges}
                disabled={isUpdating || validationErrors.length > 0}
                className={`text-sm px-3 py-2 ${validationErrors.length > 0
                    ? 'bg-gray-500 hover:bg-gray-600 cursor-not-allowed'
                    : 'bg-[#D78E59] hover:bg-[#FFAA6C]'
                    } text-[#171717]`}
                title={validationErrors.length > 0 ? 'Fix validation errors before saving' : ''}
            >
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                {isUpdating ? 'Saving...' : `Save (${changedCategoriesCount})`}
            </Button>
        </div>
    );
});

ActionButtons.displayName = 'ActionButtons';

export default function CategoryControlsSection(props: CategoryControlsSectionProps)
{
    const {
        showInactiveCategories,
        showImages,
        itemSize,
        selectedLanguage,
        hasUnsavedChanges,
        changedCategoriesCount,
        validationErrors,
        isUpdating,
        expandedCategories,
        categoriesWithChildren,
        availableLanguages,
        onAddCategory,
        onToggleInactive,
        onToggleImages,
        onItemSizeChange,
        onLanguageChange,
        onSaveChanges,
        onCancelChanges,
        onExpandAll,
        onCollapseAll
    } = props;

    return (
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                <Button
                    onClick={onAddCategory}
                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] text-sm sm:text-base"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </Button>

                <div className="flex flex-wrap items-center gap-4">
                    <ToggleSwitches
                        showInactiveCategories={showInactiveCategories}
                        showImages={showImages}
                        onToggleInactive={onToggleInactive}
                        onToggleImages={onToggleImages}
                    />

                    <ExpandCollapseControls
                        expandedCategories={expandedCategories}
                        categoriesWithChildren={categoriesWithChildren}
                        onExpandAll={onExpandAll}
                        onCollapseAll={onCollapseAll}
                    />

                    <ItemSizeSelector
                        itemSize={itemSize}
                        onItemSizeChange={onItemSizeChange}
                    />
                </div>
            </div>

            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                <LanguageSelector
                    selectedLanguage={selectedLanguage}
                    availableLanguages={availableLanguages}
                    onLanguageChange={onLanguageChange}
                />

                <ActionButtons
                    hasUnsavedChanges={hasUnsavedChanges}
                    changedCategoriesCount={changedCategoriesCount}
                    validationErrors={validationErrors}
                    isUpdating={isUpdating}
                    onSaveChanges={onSaveChanges}
                    onCancelChanges={onCancelChanges}
                />
            </div>
        </div>
    );
}