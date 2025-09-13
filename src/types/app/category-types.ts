import type { CategoryDto, CategoryLocalizationDto, CategoryType } from '@/types';
import
{
    FileText,
    Package,
    ShoppingCart,
    Star,
    Users
} from 'lucide-react';
import memoizee from 'memoizee';

/**
 * Extended category interface for editing with additional UI state
 * Extends CategoryDto but provides better defaults and required properties
 */
export interface EditingCategory extends CategoryDto
{
    // UI state for editing
    is_new?: boolean;
    is_dirty?: boolean;
    temp_id?: string;
    has_image_change?: boolean;
}

export type CategoryItemSize = 'small' | 'medium' | 'large';

export const CATEGORY_TYPE_CONFIG = {
    ['Consumer']: {
        icon: Users,
        color: 'bg-blue-500',
        borderColor: 'border-blue-500/30',
        lightColor: 'bg-blue-100 text-blue-800',
        description: 'End users who purchase products/services',
        gradient: 'from-blue-500 to-blue-600',
        examples: ['Fashion', 'Electronics', 'Home & Garden']
    },
    ['Creator']: {
        icon: Star,
        color: 'bg-purple-500',
        borderColor: 'border-purple-500/30',
        lightColor: 'bg-purple-100 text-purple-800',
        description: 'Content creators, influencers who promote products',
        gradient: 'from-purple-500 to-purple-600',
        examples: ['Beauty Creators', 'Lifestyle Influencers', 'Tech Reviewers']
    },
    ['Brand']: {
        icon: Package,
        color: 'bg-orange-500',
        borderColor: 'border-orange-500/30',
        lightColor: 'bg-orange-100 text-orange-800',
        description: 'Product manufacturers/owners who create the original products',
        gradient: 'from-orange-500 to-orange-600',
        examples: ['Beauty Brands', 'Fashion Labels', 'Tech Companies']
    },
    ['Retailer']: {
        icon: ShoppingCart,
        color: 'bg-green-500',
        borderColor: 'border-green-500/30',
        lightColor: 'bg-green-100 text-green-800',
        description: 'Businesses that sell products (could be their own or others\')',
        gradient: 'from-green-500 to-green-600',
        examples: ['Online Stores', 'Department Stores', 'Specialty Retailers']
    },
    ['Product']: {
        icon: Package,
        color: 'bg-cyan-500',
        borderColor: 'border-cyan-500/30',
        lightColor: 'bg-cyan-100 text-cyan-800',
        description: 'Physical or digital items being promoted',
        gradient: 'from-cyan-500 to-cyan-600',
        examples: ['Skincare', 'Electronics', 'Clothing']
    },
    ['Content']: {
        icon: FileText,
        color: 'bg-pink-500',
        borderColor: 'border-pink-500/30',
        lightColor: 'bg-pink-100 text-pink-800',
        description: 'Articles, videos, reviews, and other promotional materials',
        gradient: 'from-pink-500 to-pink-600',
        examples: ['Reviews', 'Tutorials', 'Comparisons']
    },
};

/**
 * Supported languages for category localization
 */
export const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
] as const;

export type SupportedLanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];



export const categoryTypes: CategoryType[] = [
    'Consumer',
    'Creator',
    'Brand',
    'Retailer',
    'Product',
    'Content'
];

/**
 * Gets the description for a category type
 */
export const getCategoryTypeDescription = (type: CategoryType): string =>
{
    switch (type)
    {
        case 'Consumer': return 'End users who purchase products/services';
        case 'Creator': return 'Content creators, influencers who promote products';
        case 'Brand': return 'Product manufacturers/owners who create the original products';
        case 'Retailer': return 'Businesses that sell products (could be their own or others\')';
        case 'Product': return 'Physical or digital items being promoted';
        case 'Content': return 'Articles, videos, reviews, and other promotional materials';
        default: return 'Unknown category type';
    }
};

/**
 * Gets the display name for a category type
 */
export const getCategoryTypeName = (type: CategoryType): string =>
{
    switch (type)
    {
        case 'Consumer': return 'Consumer';
        case 'Creator': return 'Creator';
        case 'Brand': return 'Brand';
        case 'Retailer': return 'Retailer';
        case 'Product': return 'Product';
        case 'Content': return 'Content';
        default: return 'Unknown';
    }
};

/**
 * Converts a string to CategoryType enum, with validation
 */
export const convertToCategoryTypeEnum = (value: string): CategoryType | null =>
{
    if (categoryTypes.includes(value as CategoryType))
    {
        return value as CategoryType;
    }
    return null;
};

/**
 * Helper to get localized category data
 */
export const getLocalizedCategory = (
    category: CategoryDto,
    languageCode: string = 'en'
): CategoryLocalizationDto =>
{
    const localizations = category.localizations || [];
    const localization = localizations.find(l => l.language_code === languageCode);
    return localization || localizations.find(l => l.language_code === 'en') || localizations[0];
};

/**
 * Memoized function to get category name with fallback to English
 * Using memoizee for performance optimization as this is called frequently
 */
export const getCategoryName = memoizee(
    (category: CategoryDto, languageCode: string = 'en'): string =>
    {
        const localizations = category.localizations || [];
        const localization = localizations.find(l => l.language_code === languageCode);
        const fallbackLocalization = localizations.find(l => l.language_code === 'en');

        return localization?.name ||
            fallbackLocalization?.name ||
            localizations[0]?.name ||
            'Unnamed Category';
    },
    {
        // Cache for 5 minutes with max 1000 entries
        maxAge: 5 * 60 * 1000,
        max: 1000,
        // Create cache key from category_id and language_code
        normalizer: (args) => `${args[0]?.category_id}-${args[1] || 'en'}`
    }
);

/**
 * Memoized function to get category description with fallback to English
 */
export const getCategoryDescription = memoizee(
    (category: CategoryDto, languageCode: string = 'en'): string =>
    {
        const localizations = category.localizations || [];
        const localization = localizations.find(l => l.language_code === languageCode);
        const fallbackLocalization = localizations.find(l => l.language_code === 'en');

        return localization?.description ||
            fallbackLocalization?.description ||
            localizations[0]?.description ||
            '';
    },
    {
        maxAge: 5 * 60 * 1000,
        max: 1000,
        normalizer: (args) => `${args[0]?.category_id}-${args[1] || 'en'}`
    }
);

/**
 * Memoized function to get category slug with fallback to English
 */
export const getCategorySlug = memoizee(
    (category: CategoryDto, languageCode: string = 'en'): string =>
    {
        const localizations = category.localizations || [];
        const localization = localizations.find(l => l.language_code === languageCode);
        const fallbackLocalization = localizations.find(l => l.language_code === 'en');

        return localization?.slug ||
            fallbackLocalization?.slug ||
            localizations[0]?.slug ||
            '';
    },
    {
        maxAge: 5 * 60 * 1000,
        max: 1000,
        normalizer: (args) => `${args[0]?.category_id}-${args[1] || 'en'}`
    }
);

/**
 * Clears the memoized caches (useful when categories are updated)
 */
export const clearCategoryLocalizationCache = (): void =>
{
    getCategoryName.clear();
    getCategoryDescription.clear();
    getCategorySlug.clear();
    getChildrenForCategory.clear();
};

/**
 * Helper to create a new category with default structure
 */
export const createNewCategory = (
    type: CategoryType,
    parentPath?: string,
    displayOrder: number = 0
): EditingCategory => ({
    category_id: crypto.randomUUID(),
    path: parentPath ? `${parentPath}.new` : 'new',
    display_order: displayOrder,
    type,
    is_active: true,
    localizations: [{
        language_code: 'en',
        name: '',
        slug: '',
        description: ''
    }],
    level: parentPath ? parentPath.split('.').length + 1 : 1,
    parent_path: parentPath,
    // Add required UI properties
    is_new: true,
    is_dirty: false,
    temp_id: crypto.randomUUID(),
    created_at: '',
    modified_at: ''
});

/**
 * Helper to convert CategoryDto to EditingCategory with safe defaults
 */
export const toEditingCategory = (dto: CategoryDto): EditingCategory => ({
    ...dto,
    // Ensure required properties have defaults
    category_id: dto.category_id || crypto.randomUUID(),
    path: dto.path || 'unknown',
    level: dto.level || 1,
    display_order: dto.display_order || 0,
    is_active: dto.is_active ?? true,
    localizations: dto.localizations || [],
    // UI state defaults
    is_new: false,
    is_dirty: false,
    has_image_change: false,
});

/**
 * Helper to validate category hierarchy
 */
export const validateCategoryHierarchy = (categories: CategoryDto[]): string[] =>
{
    const errors: string[] = [];
    const pathSet = new Set<string>();
    const slugSets = new Map<CategoryType, Set<string>>();

    categories.forEach(category =>
    {
        // Check for duplicate paths
        const path = category.path;
        if (path && pathSet.has(path))
        {
            errors.push(`Duplicate path found: ${path}`);
        }
        if (path) pathSet.add(path);

        // Check for duplicate slugs within the same category type
        const categoryType = category.type;
        if (categoryType && !slugSets.has(categoryType))
        {
            slugSets.set(categoryType, new Set());
        }
        const typeSlugSet = slugSets.get(categoryType!)!;

        const localizations = category.localizations || [];
        localizations.forEach(loc =>
        {
            const slug = loc.slug;
            if (slug && typeSlugSet.has(slug))
            {
                errors.push(`Duplicate slug found in ${categoryType}: ${slug}`);
            }
            if (slug) typeSlugSet.add(slug);
        });

        // Validate required fields
        if (!localizations.some(l => l.language_code === 'en'))
        {
            errors.push(`Category ${category.path} is missing English localization`);
        }

        // Validate parent-child relationships
        const parentPath = category.parent_path;
        if (parentPath && !pathSet.has(parentPath))
        {
            errors.push(`Category ${category.path} references non-existent parent: ${parentPath}`);
        }
    });

    return errors;
};

/**
 * Helper to check if a category is a root category
 */
export const isRootCategory = (category: CategoryDto): boolean =>
{
    return !category.parent_path || (category.level || 1) === 1;
};

/**
 * Helper to get all parent categories of a given category
 */
export const getParentCategories = (category: CategoryDto, allCategories: CategoryDto[]): CategoryDto[] =>
{
    const parents: CategoryDto[] = [];
    let currentParentPath = category.parent_path;

    while (currentParentPath)
    {
        const parent = allCategories.find(cat => cat.path === currentParentPath);
        if (parent)
        {
            parents.unshift(parent); // Add to beginning to maintain order
            currentParentPath = parent.parent_path;
        } else
        {
            break;
        }
    }

    return parents;
};

/**
 * Helper to get the full category breadcrumb
 */
export const getCategoryBreadcrumb = (
    category: CategoryDto,
    allCategories: CategoryDto[],
    languageCode: SupportedLanguageCode = 'en'
): { name: string; path: string }[] =>
{
    const parents = getParentCategories(category, allCategories);

    return [
        ...parents.map(parent => ({
            name: getCategoryName(parent, languageCode),
            path: parent.path || ''
        })),
        {
            name: getCategoryName(category, languageCode),
            path: category.path || ''
        }
    ];
};

/**
 * Memoized function to get children for a category
 * Optimized for performance with caching since this is called frequently in UI
 */
export const getChildrenForCategory = memoizee(
    (categories: CategoryDto[], parentPath: string): CategoryDto[] =>
    {
        return categories.filter(cat => cat.parent_path === parentPath);
    },
    {
        // Cache for 2 minutes with max 500 entries
        maxAge: 2 * 60 * 1000,
        max: 500,
        // Create cache key from categories length + parentPath
        normalizer: (args) => `${args[0]?.length || 0}-${args[1] || 'root'}`
    }
);

/**
 * Clear the children cache (useful when categories are updated)
 */
export const clearChildrenCache = (): void =>
{
    getChildrenForCategory.clear();
};