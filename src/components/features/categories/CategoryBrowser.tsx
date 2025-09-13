// components/categories/CategoryBrowser.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategoryHooks } from '@/hooks/api';
import { useDeviceDetection } from '@/hooks/system/use-device-detection';
import
{
    SUPPORTED_LANGUAGES,
    SupportedLanguageCode,
    getCategoryTypeName,
    getCategoryName,
    getCategoryDescription,
    getChildrenForCategory as getChildrenMemoized
} from '@/types/app/category-types';
import { useCategoryLocalization, useCategoryHierarchy } from '../categories/hooks/category-hooks';
import
{
    ChevronDown,
    ChevronRight,
    Globe,
    Grid3X3,
    List,
    Search,
    X
} from 'lucide-react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import CategoryImage from './CategoryImage';
import { CategoryDto, CategoryType } from '@/types';

interface CategoryBrowserProps
{
    type: CategoryType;
    selectedCategoryId?: string;
    onCategorySelect?: (category: CategoryDto) => void;
    showSearch?: boolean;
    showLanguageSelector?: boolean;
    layout?: 'grid' | 'list' | 'tree';
    maxDepth?: number;
    allowMultiSelect?: boolean;
    className?: string;
}

export default function CategoryBrowser({
    type,
    selectedCategoryId,
    onCategorySelect,
    showSearch = true,
    showLanguageSelector = true,
    layout = 'grid',
    maxDepth = 3,
    allowMultiSelect = false,
    className = ''
}: CategoryBrowserProps)
{
    const { isMobile } = useDeviceDetection();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguageCode>('en');
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'tree'>(layout);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
        selectedCategoryId ? new Set([selectedCategoryId]) : new Set()
    );

    const { getLocalizedName, getLocalizedDescription } = useCategoryLocalization();
    const categoryHierarchy = useCategoryHierarchy();
    const categoryHooks = useCategoryHooks();

    // Get categories - search functionality would need to be implemented separately
    const { data: allCategories, isLoading: isLoadingAll } = categoryHooks.getAll(type);
    
    // Filter categories by search query locally for now
    const filteredCategories = searchQuery && allCategories 
        ? allCategories.filter(category => {
            const name = getCategoryName(category, selectedLanguage);
            const description = getCategoryDescription(category, selectedLanguage);
            const query = searchQuery.toLowerCase();
            return name.toLowerCase().includes(query) || description.toLowerCase().includes(query);
        })
        : allCategories;

    const isLoading = isLoadingAll;
    const categories = filteredCategories;

    // Handle category selection
    const handleCategoryClick = (category: CategoryDto) =>
    {
        if (allowMultiSelect)
        {
            const newSelected = new Set(selectedCategories);
            if (newSelected.has(category.category_id!))
            {
                newSelected.delete(category.category_id!);
            } else
            {
                newSelected.add(category.category_id!);
            }
            setSelectedCategories(newSelected);
        } else
        {
            setSelectedCategories(new Set([category.category_id!]));
        }

        onCategorySelect?.(category);
    };

    // Toggle category expansion
    const toggleExpanded = (categoryId: string) =>
    {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId))
        {
            newExpanded.delete(categoryId);
        } else
        {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    // Filter categories by depth
    const filterByDepth = (cats: CategoryDto[]): CategoryDto[] =>
    {
        return cats.filter(cat => (cat.level || 1) <= maxDepth);
    };

    if (isLoading)
    {
        return (
            <div className={`flex items-center justify-center py-12 ${className}`}>
                <div className="text-[#828288]">Loading categories...</div>
            </div>
        );
    }

    // Helper to get children for a category using memoized function
    const getChildrenForCategory = useCallback((category: CategoryDto): CategoryDto[] =>
    {
        if (!allCategories) return [];
        return getChildrenMemoized(allCategories, category.path || '');
    }, [allCategories]);

    const displayCategories = categories ? filterByDepth(categories) : [];

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header Controls */}
            <div className="flex flex-col space-y-4">
                {/* Search and Language */}
                {(showSearch || showLanguageSelector) && (
                    <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'flex-row'}`}>
                        {showSearch && (
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#575757] h-4 w-4" />
                                <Input
                                    placeholder={`Search ${getCategoryTypeName(type).toLowerCase()} categories...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-[#171717] border-[#575757] text-[#EDECF8] placeholder-[#575757] focus:border-[#D78E59]"
                                />
                                {searchQuery && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#575757] hover:text-[#EDECF8]"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        )}

                        {showLanguageSelector && (
                            <div className="flex items-center space-x-2">
                                <Globe className="h-4 w-4 text-[#575757]" />
                                <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as SupportedLanguageCode)}>
                                    <SelectTrigger className="bg-[#171717] border-[#575757] text-[#EDECF8] w-full sm:w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#171717] border-[#575757] text-[#EDECF8]">
                                        {SUPPORTED_LANGUAGES.map(lang => (
                                            <SelectItem key={lang.code} value={lang.code}>
                                                {lang.flag} {lang.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                )}

                {/* View Controls */}
                <div className="flex items-center justify-between">
                    <div className="text-sm text-[#575757]">
                        {displayCategories.length} categories found
                        {searchQuery && ` for "${searchQuery}"`}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                            className={viewMode === 'grid' ? 'bg-[#D78E59] text-[#171717]' : 'text-[#828288] hover:text-[#EDECF8]'}
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className={viewMode === 'list' ? 'bg-[#D78E59] text-[#171717]' : 'text-[#828288] hover:text-[#EDECF8]'}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Categories Display */}
            <ScrollArea className="h-96">
                {displayCategories.length === 0 ? (
                    <Card className="bg-[#171717] border-[#202020]">
                        <CardContent className="py-12 text-center">
                            <div className="text-[#575757] mb-2">No categories found</div>
                            {searchQuery && (
                                <div className="text-sm text-[#575757]">
                                    Try adjusting your search criteria
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className={`${viewMode === 'grid'
                        ? `grid gap-4 ${isMobile ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`
                        : 'space-y-2'
                        }`}>
                        {viewMode === 'grid' ? (
                            displayCategories.map((category) => (
                                <CategoryGridCard
                                    key={category.category_id}
                                    category={category}
                                    isSelected={selectedCategories.has(category.category_id!)}
                                    languageCode={selectedLanguage}
                                    onClick={() => handleCategoryClick(category)}
                                    getLocalizedName={getLocalizedName}
                                    getLocalizedDescription={getLocalizedDescription}
                                    getChildrenForCategory={getChildrenForCategory}
                                    isMobile={isMobile}
                                />
                            ))
                        ) : (
                            <CategoryTreeView
                                categories={displayCategories}
                                selectedCategories={selectedCategories}
                                expandedCategories={expandedCategories}
                                languageCode={selectedLanguage}
                                onCategoryClick={handleCategoryClick}
                                onToggleExpanded={toggleExpanded}
                                getLocalizedName={getLocalizedName}
                                getLocalizedDescription={getLocalizedDescription}
                                getChildrenForCategory={getChildrenForCategory}
                                maxDepth={maxDepth}
                                isMobile={isMobile}
                            />
                        )}
                    </div>
                )}
            </ScrollArea>

            {/* Selected Categories Summary */}
            {allowMultiSelect && selectedCategories.size > 0 && (
                <div className="border-t border-[#202020] pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-[#828288]">
                            Selected ({selectedCategories.size})
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCategories(new Set())}
                            className="text-[#575757] hover:text-[#EDECF8]"
                        >
                            Clear All
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Array.from(selectedCategories).map(categoryId =>
                        {
                            const category = displayCategories.find(cat => cat.category_id === categoryId);
                            if (!category) return null;

                            return (
                                <Badge
                                    key={categoryId}
                                    variant="secondary"
                                    className="bg-[#D78E59] text-[#171717] hover:bg-[#FFAA6C]"
                                >
                                    {getLocalizedName(category, selectedLanguage)}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                        {
                                            const newSelected = new Set(selectedCategories);
                                            newSelected.delete(categoryId);
                                            setSelectedCategories(newSelected);
                                        }}
                                        className="ml-1 h-auto p-0 text-[#171717] hover:text-[#575757]"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// Grid card component
interface CategoryGridCardProps
{
    category: CategoryDto;
    isSelected: boolean;
    languageCode: SupportedLanguageCode;
    onClick: () => void;
    getLocalizedName: (cat: CategoryDto, lang: SupportedLanguageCode) => string;
    getLocalizedDescription: (cat: CategoryDto, lang: SupportedLanguageCode) => string;
    getChildrenForCategory: (category: CategoryDto) => CategoryDto[];
    isMobile: boolean;
}

function CategoryGridCard({
    category,
    isSelected,
    languageCode,
    onClick,
    getLocalizedName,
    getLocalizedDescription,
    getChildrenForCategory,
    isMobile
}: CategoryGridCardProps)
{
    return (
        <Card
            className={`cursor-pointer transition-all duration-200 hover:scale-105 border-2 ${isSelected
                ? 'border-[#D78E59] bg-[#202020]'
                : 'border-[#202020] bg-[#171717] hover:border-[#575757]'
                }`}
            onClick={onClick}
        >
            <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
                <div className="space-y-3">
                    {/* CategoryDto Image */}
                    <CategoryImage
                        imageId={category.image_id}
                        alt={getLocalizedName(category, languageCode)}
                        className={`relative w-full rounded-lg overflow-hidden bg-[#090909] ${isMobile ? 'h-24' : 'h-32'} object-cover`}
                        fill
                    />

                    {/* CategoryDto Info */}
                    <div>
                        <h3 className={`font-semibold text-[#EDECF8] mb-1 ${isMobile ? 'text-sm' : 'text-base'}`}>
                            {getLocalizedName(category, languageCode)}
                        </h3>
                        {getLocalizedDescription(category, languageCode) && (
                            <p className={`text-[#828288] line-clamp-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                {getLocalizedDescription(category, languageCode)}
                            </p>
                        )}
                    </div>

                    {/* CategoryDto Meta */}
                    <div className="flex items-center justify-between">
                        <Badge
                            variant="secondary"
                            className="bg-[#090909] text-[#575757] text-xs"
                        >
                            Level {category.level}
                        </Badge>
                        {getChildrenForCategory(category).length > 0 && (
                            <div className="text-xs text-[#575757]">
                                {getChildrenForCategory(category).length} subcategories
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Tree view component
interface CategoryTreeViewProps
{
    categories: CategoryDto[];
    selectedCategories: Set<string>;
    expandedCategories: Set<string>;
    languageCode: SupportedLanguageCode;
    onCategoryClick: (category: CategoryDto) => void;
    onToggleExpanded: (categoryId: string) => void;
    getLocalizedName: (cat: CategoryDto, lang: SupportedLanguageCode) => string;
    getLocalizedDescription: (cat: CategoryDto, lang: SupportedLanguageCode) => string;
    getChildrenForCategory: (category: CategoryDto) => CategoryDto[];
    maxDepth: number;
    isMobile: boolean;
}

function CategoryTreeView({
    categories,
    selectedCategories,
    expandedCategories,
    languageCode,
    onCategoryClick,
    onToggleExpanded,
    getLocalizedName,
    getLocalizedDescription,
    getChildrenForCategory,
    maxDepth,
    isMobile
}: CategoryTreeViewProps)
{
    const renderCategory = (category: CategoryDto, level: number = 0) =>
    {
        if (level >= maxDepth) return null;

        const hasChildren = getChildrenForCategory(category).length > 0;
        const isExpanded = expandedCategories.has(category.category_id!);
        const isSelected = selectedCategories.has(category.category_id!);
        const indent = level * (isMobile ? 12 : 20);

        return (
            <div key={category.category_id}>
                <div
                    className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-colors ${isSelected
                        ? 'bg-[#D78E59] text-[#171717]'
                        : 'hover:bg-[#202020] text-[#EDECF8]'
                        }`}
                    style={{ marginLeft: `${indent}px` }}
                >
                    {hasChildren ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) =>
                            {
                                e.stopPropagation();
                                onToggleExpanded(category.category_id!);
                            }}
                            className={`p-0 h-auto ${isSelected ? 'text-[#171717]' : 'text-[#575757] hover:text-[#EDECF8]'
                                }`}
                        >
                            {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    ) : (
                        <div className="w-4" />
                    )}

                    <div
                        className="flex-1 flex items-center space-x-3"
                        onClick={() => onCategoryClick(category)}
                    >
                        <CategoryImage
                            imageId={category.image_id}
                            alt=""
                            className={`rounded overflow-hidden bg-[#090909] flex-shrink-0 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} object-cover`}
                            width={isMobile ? 24 : 32}
                            height={isMobile ? 24 : 32}
                        />

                        <div className="flex-1 min-w-0">
                            <div className={`font-medium ${isSelected ? 'text-[#171717]' : 'text-[#EDECF8]'
                                } ${isMobile ? 'text-sm' : 'text-base'}`}>
                                {getLocalizedName(category, languageCode)}
                            </div>
                            {getLocalizedDescription(category, languageCode) && (
                                <div className={`truncate ${isSelected ? 'text-[#575757]' : 'text-[#828288]'
                                    } ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                    {getLocalizedDescription(category, languageCode)}
                                </div>
                            )}
                        </div>

                        {hasChildren && (
                            <Badge
                                variant="secondary"
                                className={`text-xs ${isSelected
                                    ? 'bg-[#171717] text-[#EDECF8]'
                                    : 'bg-[#090909] text-[#575757]'
                                    }`}
                            >
                                {getChildrenForCategory(category).length}
                            </Badge>
                        )}
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div className="mt-1">
                        {getChildrenForCategory(category).map(child => renderCategory(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-1">
            {categories.map(category => renderCategory(category))}
        </div>
    );
}

