// components/categories/CompactCategoryItem.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CategoryDto } from '@/types';
import { CategoryItemSize, EditingCategory, SUPPORTED_LANGUAGES, SupportedLanguageCode, getCategoryName } from '@/types/app/category-types';
import CategoryImage from './CategoryImage';
import
{
    ChevronDown,
    ChevronRight,
    Edit3,
    GitBranch,
    GripVertical,
    Languages,
    Trash2
} from 'lucide-react';
import Image from 'next/image';
import React, { useMemo } from 'react';
import { ICON_MAP } from './IconGallery';
interface CompactCategoryItemProps
{
    category: EditingCategory;
    selectedLanguage: SupportedLanguageCode;
    onEdit: () => void;
    onDelete: (id: string) => void;
    onAddChild: (parentPath: string) => void;
    onOpenTranslations: (categoryId: string) => void;
    dragHandleProps: any;
    isDragging: boolean;
    getLocalizedName: (cat: CategoryDto, lang: SupportedLanguageCode) => string;
    hasTranslation: (cat: EditingCategory, lang: SupportedLanguageCode) => boolean;
    getMissingTranslations: (cat: EditingCategory) => SupportedLanguageCode[];
    availableLanguages: typeof SUPPORTED_LANGUAGES[number][];
    showImages: boolean;
    isExpanded?: boolean;
    onToggleExpanded?: () => void;
    hasChildren?: boolean;
    childrenCount?: number;
    size?: CategoryItemSize;
    maxHierarchyLevel?: number;
    consistentWidth?: number;
}

// Separate component for status badges
const StatusBadges = React.memo(({
    category
}: {
    category: EditingCategory
}) =>
{
    const badges = useMemo(() =>
    {
        const badgeList = [];

        if (category.is_new)
        {
            badgeList.push(
                <Badge key="new" variant="secondary" className="bg-green-500 text-white text-xs px-1 py-0">
                    New
                </Badge>
            );
        }

        if (category.is_dirty && !category.is_new)
        {
            badgeList.push(
                <Badge key="modified" variant="secondary" className="bg-orange-500 text-white text-xs px-1 py-0">
                    Modified
                </Badge>
            );
        }

        if (category.has_image_change)
        {
            badgeList.push(
                <Badge key="image" variant="secondary" className="bg-blue-500 text-white text-xs px-1 py-0">
                    Image
                </Badge>
            );
        }

        return badgeList;
    }, [category.is_new, category.is_dirty, category.has_image_change]);

    if (badges.length === 0) return null;

    return (
        <div className="absolute top-2 right-2 flex flex-wrap gap-1 z-10">
            {badges}
        </div>
    );
});

StatusBadges.displayName = 'StatusBadges';

// Separate component for expand/collapse button
const ExpandCollapseButton = React.memo(({
    hasChildren,
    isExpanded,
    onToggleExpanded,
    size
}: {
    hasChildren: boolean;
    isExpanded: boolean;
    onToggleExpanded?: () => void;
    size: CategoryItemSize;
}) =>
{
    const buttonSize = size === 'small' ? 'h-6 w-6' : size === 'medium' ? 'h-7 w-7' : 'h-8 w-8';
    const iconSize = size === 'small' ? 'h-3 w-3' : 'h-3.5 w-3.5';

    if (!hasChildren) return null;

    return (
        <div className="flex-shrink-0 w-6 flex justify-center mt-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpanded}
                className={`text-[#575757] hover:text-[#828288] p-0 ${buttonSize}`}
                title={isExpanded ? "Collapse children" : "Expand children"}
            >
                {isExpanded ? (
                    <ChevronDown className={iconSize} />
                ) : (
                    <ChevronRight className={iconSize} />
                )}
            </Button>
        </div>
    );
});

ExpandCollapseButton.displayName = 'ExpandCollapseButton';

// Separate component for category icon
const CategoryIcon = React.memo(({
    category,
    size
}: {
    category: EditingCategory;
    size: CategoryItemSize;
}) =>
{
    const IconComponent = category.icon_name ? ICON_MAP[category.icon_name] : null;
    const iconSize = size === 'small' ? 'w-6 h-6' : 'w-6 h-6';
    const wrapperSize = size === 'small' ? 'w-6 h-6' : size === 'medium' ? 'w-8 h-8' : 'w-10 h-10';

    return (
        <div className={`flex-shrink-0 ${wrapperSize} flex items-center justify-center mt-1`}>
            {IconComponent ? (
                <div className={`${iconSize} text-[#D78E59] flex items-center justify-center`}>
                    <IconComponent className="w-full h-full" />
                </div>
            ) : (
                <div className={`${iconSize} rounded bg-[#575757]/20 flex items-center justify-center`}>
                    <div className="w-2 h-2 bg-[#575757] rounded"></div>
                </div>
            )}
        </div>
    );
});

CategoryIcon.displayName = 'CategoryIcon';

// Separate component for category details
const CategoryDetails = React.memo(({
    category,
    localizedName,
    hasChildren,
    childrenCount,
    missingTranslations,
    size
}: {
    category: EditingCategory;
    localizedName: string;
    hasChildren: boolean;
    childrenCount: number;
    missingTranslations: SupportedLanguageCode[];
    size: CategoryItemSize;
}) =>
{
    const textSize = size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : 'text-base';
    const textSizeSecondary = size === 'small' ? 'text-xs' : 'text-xs';

    return (
        <div className="flex-1 min-w-0">
            <div className={`font-medium text-[#EDECF8] ${textSize} leading-tight mb-1`}>
                <div className="break-words">
                    {localizedName}
                </div>
            </div>

            <div className={`flex flex-col space-y-1 ${textSizeSecondary} text-[#828288]`}>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>Level {category.level}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>Order {category.display_order}</span>
                    {hasChildren && (
                        <>
                            <span className="hidden sm:inline">•</span>
                            <span>{childrenCount} children</span>
                        </>
                    )}
                </div>
                {missingTranslations.length > 0 && (
                    <div className="text-orange-400">
                        {missingTranslations.length} missing translations
                    </div>
                )}
            </div>
        </div>
    );
});

CategoryDetails.displayName = 'CategoryDetails';

// Separate component for action buttons
const ActionButtons = React.memo(({
    category,
    size,
    onAddChild,
    onOpenTranslations,
    onEdit,
    onDelete
}: {
    category: EditingCategory;
    size: CategoryItemSize;
    onAddChild: (parentPath: string) => void;
    onOpenTranslations: (categoryId: string) => void;
    onEdit: () => void;
    onDelete: (id: string) => void;
}) =>
{
    const buttonSize = size === 'small' ? 'h-6 w-6' : size === 'medium' ? 'h-7 w-7' : 'h-8 w-8';
    const iconSize = size === 'small' ? 'h-3 w-3' : size === 'medium' ? 'h-3.5 w-3.5' : 'h-4 w-4';

    return (
        <div className="absolute top-3 right-3 flex items-center space-x-1 mt-6">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddChild(category.path || '')}
                className={`text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] p-1.5 ${buttonSize}`}
                title="Add subcategory"
            >
                <GitBranch className={iconSize} />
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenTranslations(category.category_id || '')}
                className={`text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] p-1.5 ${buttonSize}`}
                title="Manage translations"
            >
                <Languages className={iconSize} />
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className={`text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] p-1.5 ${buttonSize}`}
                title="Edit category"
            >
                <Edit3 className={iconSize} />
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(category.category_id || '')}
                className={`text-red-400 hover:text-red-300 hover:bg-red-900/20 p-1.5 ${buttonSize}`}
                title="Delete category"
            >
                <Trash2 className={iconSize} />
            </Button>
        </div>
    );
});

ActionButtons.displayName = 'ActionButtons';

// Separate component for image preview
const ImagePreview = React.memo(({
    category,
    size
}: {
    category: EditingCategory;
    size: CategoryItemSize;
}) =>
{
    const textSizeSecondary = size === 'small' ? 'text-xs' : 'text-xs';
    const imageSize = size === 'small' ? 'w-12 h-12' : size === 'medium' ? 'w-16 h-16' : 'w-20 h-20';

    if (!category.image_id) return null;

    return (
        <div className="mt-3 pt-3 border-t border-[#202020]">
            <div className="flex items-center space-x-3">
                <div className={`${textSizeSecondary} text-[#575757] font-medium`}>Preview:</div>
                <div className={`relative ${imageSize} rounded-lg overflow-hidden bg-[#090909] border border-[#202020]`}>
                    <CategoryImage
                        imageId={category.image_id}
                        alt="Category preview"
                        fill
                        className="object-cover"
                        sizes="64px"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                        showLoadingState={true}
                    />
                    {category.has_image_change && (
                        <div className="absolute top-1 right-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className={`${textSizeSecondary} text-[#828288] truncate`}>
                        {category.image_id}
                    </div>
                    {category.has_image_change && (
                        <div className={`${textSizeSecondary} text-blue-400`}>Changed</div>
                    )}
                </div>
            </div>
        </div>
    );
});

ImagePreview.displayName = 'ImagePreview';

// Separate component for drag handle
const DragHandle = React.memo(({
    dragHandleProps,
    size
}: {
    dragHandleProps: any;
    size: CategoryItemSize;
}) =>
{
    const iconSize = size === 'small' ? 'h-3 w-3' : size === 'medium' ? 'h-3.5 w-3.5' : 'h-4 w-4';

    return (
        <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing flex-shrink-0 p-1 mt-1 hover:bg-[#202020] rounded transition-colors select-none"
            title="Drag to reorder"
            onMouseDown={(e) =>
            {
                e.preventDefault(); // Prevent text selection during drag
            }}
        >
            <GripVertical className={`${iconSize} text-[#575757] hover:text-[#D78E59] pointer-events-none`} />
        </div>
    );
});

DragHandle.displayName = 'DragHandle';

export function calculateConsistentWidth(
    size: CategoryItemSize,
    maxHierarchyLevel: number)
{
    const baseWidth = size === 'small' ? 190 : size === 'medium' ? 250 : 300;
    const maxIndentPerLevel = size === 'small' ? 12 : size === 'medium' ? 16 : 20;
    const maxIndent = Math.min((maxHierarchyLevel! - 1) * maxIndentPerLevel, 120);
    const buttonsWidth = 200;
    return baseWidth + maxIndent + buttonsWidth;
}

const LEVEL_COLORS: Record<number, string> = {
    1: 'bg-green-500 shadow-green-500/50',
    2: 'bg-blue-500 shadow-blue-500/50',
    3: 'bg-purple-500 shadow-purple-500/50',
    4: 'bg-pink-500 shadow-pink-500/50',
    5: 'bg-yellow-400 shadow-yellow-400/50',
    6: 'bg-red-400 shadow-red-400/50',
    7: 'bg-teal-400 shadow-teal-400/50',
    8: 'bg-indigo-500 shadow-indigo-500/50',
    9: 'bg-orange-400 shadow-orange-400/50',
    10: 'bg-cyan-400 shadow-cyan-400/50',
};

function LevelIndicatorBar({ category }: { category: EditingCategory })
{
    const colorClass = LEVEL_COLORS[category.level || 1] || 'bg-gray-500 shadow-gray-500/50';

    return (
        <div className={`h-3 w-full rounded-xl ${colorClass} shadow-md transition-colors`} />
    );
}


export default function CompactCategoryItem({
    category,
    selectedLanguage,
    onEdit,
    onDelete,
    onAddChild,
    onOpenTranslations,
    dragHandleProps,
    isDragging,
    getLocalizedName,
    hasTranslation,
    getMissingTranslations,
    availableLanguages,
    showImages,
    isExpanded = false,
    onToggleExpanded,
    hasChildren = false,
    childrenCount = 0,
    size = 'medium',
    maxHierarchyLevel = 5,
    consistentWidth
}: CompactCategoryItemProps)
{

    // Memoized calculations
    const missingTranslations = useMemo(() =>
        getMissingTranslations(category),
        [category, getMissingTranslations]
    );

    const localizedName = useMemo(() =>
        getLocalizedName(category, selectedLanguage),
        [category, selectedLanguage, getLocalizedName]
    );

    // Size-based styling
    const sizeStyles = useMemo(() => ({
        small: {
            cardPadding: 'p-2',
            spacing: 'space-x-2',
        },
        medium: {
            cardPadding: 'p-3',
            spacing: 'space-x-3',
        },
        large: {
            cardPadding: 'p-4',
            spacing: 'space-x-4',
        }
    }), []);

    const currentStyles = sizeStyles[size];

    // Calculate final width
    const finalWidth = useMemo(() =>
    {
        if (consistentWidth) return consistentWidth;

        return calculateConsistentWidth(size, maxHierarchyLevel);
    }, [consistentWidth, size, maxHierarchyLevel]);

    // Card class names with enhanced drag feedback
    const cardClassName = useMemo(() =>
    {
        const baseClasses = "bg-[#171717] border-[#202020] transition-all relative min-h-fit";
        const dirtyClass = category.is_dirty ? 'border-[#D78E59]' : '';
        const draggingClass = isDragging
            ? 'shadow-lg scale-105 z-50 bg-[#202020] border-[#D78E59] rotate-1'
            : 'hover:border-[#575757]';

        // Add visual hint for potential drop target when category can accept children
        const dropTargetClass = !isDragging && (category.level || 1) < 3 ? 'hover:bg-[#171717]/80' : '';

        return `${baseClasses} ${dirtyClass} ${draggingClass} ${dropTargetClass}`;
    }, [category.is_dirty, category.level, isDragging]);

    // Enhanced expand/collapse behavior for better UX
    const handleToggleExpanded = useMemo(() =>
    {
        if (!onToggleExpanded || !hasChildren) return undefined;

        return () =>
        {
            onToggleExpanded();
            // Provide user feedback about the action
            if (isExpanded)
            {
                // Collapsing - we could add a subtle animation or sound here
            } else
            {
                // Expanding - we could add a subtle animation or sound here
            }
        };
    }, [onToggleExpanded, hasChildren, isExpanded]);

    return (
        <Card
            className={cardClassName}
            style={{
                width: `${finalWidth}px`,
                minWidth: `${finalWidth}px`
            }}
        >
            <CardHeader>
                {/* Level indicator line */}
                <LevelIndicatorBar category={category} />
            </CardHeader>


            <CardContent className={`${currentStyles.cardPadding} relative`}>
                {/* Status Badges */}
                <StatusBadges category={category} />

                {/* Main Content */}
                <div className={`flex items-start ${currentStyles.spacing} min-w-0 pr-24`}>
                    {/* Drag Handle */}
                    <DragHandle dragHandleProps={dragHandleProps} size={size} />

                    {/* Expand/Collapse Button */}
                    <ExpandCollapseButton
                        hasChildren={hasChildren}
                        isExpanded={isExpanded}
                        onToggleExpanded={handleToggleExpanded}
                        size={size}
                    />

                    {/* Category Icon */}
                    <CategoryIcon category={category} size={size} />

                    {/* Category Details */}
                    <CategoryDetails
                        category={category}
                        localizedName={localizedName}
                        hasChildren={hasChildren}
                        childrenCount={childrenCount}
                        missingTranslations={missingTranslations}
                        size={size}
                    />
                </div>

                {/* Action Buttons */}
                <ActionButtons
                    category={category}
                    size={size}
                    onAddChild={onAddChild}
                    onOpenTranslations={onOpenTranslations}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />

                {/* Image Preview */}
                {showImages && <ImagePreview category={category} size={size} />}

                {/* Drop Zone Indicator - shows when this category can accept children */}
                {!isDragging && (category.level || 1) < 3 && (
                    <div className="absolute inset-0 pointer-events-none border-2 border-transparent hover:border-[#D78E59]/30 rounded-lg transition-colors opacity-0 hover:opacity-100" />
                )}
            </CardContent>
        </Card>
    );
}