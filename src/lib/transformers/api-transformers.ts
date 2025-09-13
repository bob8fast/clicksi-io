/**
 * API Data Transformation Utilities
 * 
 * This file contains transformation functions to convert API response data
 * into component-friendly formats. Each transformer is memoized for performance
 * and follows a consistent pattern for easy maintenance.
 */

import { useMemo } from 'react';
import type { 
    BrandDto, 
    ProductDto, 
    CreatorDto, 
    CategoryDto,
    ProductCategoryDto
} from '@/types';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

// Component-friendly interfaces (simplified from API DTOs)
export interface SimpleBrand {
    id: string;
    legalName: string;
    displayName: string;
    description?: string;
    logoUrl?: string;
    coverUrl?: string;
    isVerified: boolean;
    websiteUrl?: string;
    createdAt: string;
    modifiedAt: string;
}

export interface SimpleProduct {
    id: string;
    name: string;
    description: string;
    shortDescription?: string;
    sku: string;
    brandId: string;
    primaryImage?: string;
    images: string[];
    categories: ProductCategoryDto[];
    categoryNames: string[];
    categoryIds: string[];
    size?: string;
    weight?: string;
    keyIngredients: string[];
    howToUse: string[];
    skinTypes: string[];
    tags: string[];
    isAvailable: boolean;
    externalUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SimpleCreator {
    id: string;
    displayName: string;
    bio?: string;
    isVerified: boolean;
    verifiedAt?: string;
    totalFollowers: number;
    totalFollowing: number;
    categories: string[];
    createdAt: string;
    modifiedAt: string;
}

export interface SimpleCategory {
    id: string;
    name: string;
    nameLocalized?: string;
    description?: string;
    parentId?: string;
    level: number;
    iconUrl?: string;
    isActive: boolean;
    productCount?: number;
}

export interface SimpleSearchResult {
    id: string;
    title: string;
    type: 'Product' | 'Brand' | 'Creator' | 'Article' | 'Tutorial';
    url: string;
    description: string;
    imageUrl?: string;
    metadata?: {
        brandName?: string;
        categoryName?: string;
        followerCount?: number;
        [key: string]: unknown;
    };
}

// =============================================================================
// BRAND TRANSFORMERS  
// =============================================================================

/**
 * Transform API BrandDto to component-friendly SimpleBrand
 */
export const transformBrand = (brandDto: BrandDto): SimpleBrand => {
    return {
        id: brandDto.id,
        legalName: brandDto.legal_name,
        displayName: brandDto.display_name,
        description: brandDto.description || undefined,
        logoUrl: brandDto.logo_storage_path || undefined,
        coverUrl: brandDto.cover_storage_path || undefined,
        isVerified: brandDto.is_verified,
        websiteUrl: brandDto.website_url || undefined,
        createdAt: brandDto.created_at,
        modifiedAt: brandDto.modified_at
    };
};

/**
 * Transform array of brand DTOs with memoization
 */
export const useBrandTransformations = (brands: BrandDto[] | undefined) => {
    return useMemo(() => {
        if (!Array.isArray(brands)) return [];
        
        return brands.map(transformBrand);
    }, [brands]);
};

// =============================================================================
// PRODUCT TRANSFORMERS
// =============================================================================

/**
 * Transform API ProductDto to component-friendly SimpleProduct
 */
export const transformProduct = (productDto: ProductDto): SimpleProduct => {
    // Extract category information
    const categoryNames = productDto.categories.map(cat => cat.name);
    const categoryIds = productDto.categories.map(cat => cat.id);
    
    // Extract key ingredients as strings
    const keyIngredients = productDto.key_ingredients.map(ingredient => ingredient.name || '').filter(Boolean);
    
    return {
        id: productDto.id,
        name: productDto.name,
        description: productDto.description,
        shortDescription: productDto.short_description || undefined,
        sku: productDto.sku,
        brandId: productDto.brand_id,
        primaryImage: productDto.primary_image || undefined,
        images: productDto.images,
        categories: productDto.categories,
        categoryNames,
        categoryIds,
        size: productDto.size || undefined,
        weight: productDto.weight || undefined,
        keyIngredients,
        howToUse: productDto.how_to_use,
        skinTypes: productDto.skin_types,
        tags: productDto.tags,
        isAvailable: productDto.is_available,
        externalUrl: productDto.external_url || undefined,
        createdAt: productDto.created_at,
        updatedAt: productDto.updated_at
    };
};

/**
 * Transform array of product DTOs with memoization
 */
export const useProductTransformations = (products: ProductDto[] | undefined) => {
    return useMemo(() => {
        if (!Array.isArray(products)) return [];
        
        return products.map(transformProduct);
    }, [products]);
};

// =============================================================================
// CREATOR TRANSFORMERS
// =============================================================================

/**
 * Transform API CreatorDto to component-friendly SimpleCreator
 */
export const transformCreator = (creatorDto: CreatorDto): SimpleCreator => {
    // Extract categories from creator_category_settings if available
    const categories = creatorDto.creator_category_settings?.primary_categories || [];
    
    return {
        id: creatorDto.id,
        displayName: creatorDto.display_name,
        bio: creatorDto.bio || undefined,
        isVerified: creatorDto.is_verified,
        verifiedAt: creatorDto.verified_at || undefined,
        totalFollowers: creatorDto.metrics.total_followers,
        totalFollowing: creatorDto.creatorStatistics.total_followers, // Using statistics for following count
        categories,
        createdAt: creatorDto.created_at,
        modifiedAt: creatorDto.modified_at
    };
};

/**
 * Transform array of creator DTOs with memoization
 */
export const useCreatorTransformations = (creators: CreatorDto[] | undefined) => {
    return useMemo(() => {
        if (!Array.isArray(creators)) return [];
        
        return creators.map(transformCreator);
    }, [creators]);
};

// =============================================================================
// CATEGORY TRANSFORMERS
// =============================================================================

/**
 * Transform API CategoryDto to component-friendly SimpleCategory
 */
export const transformCategory = (categoryDto: CategoryDto): SimpleCategory => {
    return {
        id: categoryDto.id,
        name: categoryDto.name,
        nameLocalized: categoryDto.localized_name || undefined,
        description: categoryDto.description || undefined,
        parentId: categoryDto.parent_id || undefined,
        level: categoryDto.level,
        iconUrl: categoryDto.icon_url || undefined,
        isActive: categoryDto.is_active,
        productCount: categoryDto.product_count || undefined
    };
};

/**
 * Transform array of category DTOs with memoization
 */
export const useCategoryTransformations = (categories: CategoryDto[] | undefined) => {
    return useMemo(() => {
        if (!Array.isArray(categories)) return [];
        
        return categories.map(transformCategory);
    }, [categories]);
};

// =============================================================================
// SEARCH RESULT TRANSFORMERS
// =============================================================================

/**
 * Transform API search results to component-friendly format
 */
export const transformSearchResult = (resultDto: BrandDto | ProductDto | CreatorDto | unknown, type: SimpleSearchResult['type']): SimpleSearchResult => {
    let metadata: SimpleSearchResult['metadata'] = {};
    let title = '';
    let description = '';
    let imageUrl = '';
    let id = '';
    
    // Type-specific data extraction
    switch (type) {
        case 'Product':
            const product = resultDto as ProductDto;
            id = product.id;
            title = product.name;
            description = product.short_description || product.description;
            imageUrl = product.primary_image || product.images[0];
            metadata = {
                categoryName: product.categories[0]?.name
            };
            break;
        case 'Creator':
            const creator = resultDto as CreatorDto;
            id = creator.id;
            title = creator.display_name;
            description = creator.bio || '';
            metadata = {
                followerCount: creator.metrics.total_followers
            };
            break;
        case 'Brand':
            const brand = resultDto as BrandDto;
            id = brand.id;
            title = brand.display_name;
            description = brand.description || '';
            imageUrl = brand.logo_storage_path || '';
            break;
        default:
            // Generic handling for other types
            const generic = resultDto as Record<string, unknown>;
            id = String(generic.id || '');
            title = String(generic.title || generic.name || 'Unknown');
            description = String(generic.description || '');
            imageUrl = String(generic.imageUrl || '');
    }
    
    return {
        id,
        title,
        type,
        url: generateUrl(type, { id, name: title }),
        description,
        imageUrl,
        metadata
    };
};

/**
 * Generate URL based on type and data (fallback when URL not provided)
 */
const generateUrl = (type: SimpleSearchResult['type'], data: { id: string; name: string }): string => {
    const id = data.id;
    const slug = data.name.toLowerCase().replace(/\s+/g, '-') || id;
    
    switch (type) {
        case 'Product':
            return `/products/${slug}`;
        case 'Brand':
            return `/brands/${slug}`;
        case 'Creator':
            return `/creators/${slug}`;
        case 'Article':
            return `/blog/${slug}`;
        case 'Tutorial':
            return `/tutorials/${slug}`;
        default:
            return '#';
    }
};

/**
 * Transform mixed search results with memoization
 */
export const useSearchResultTransformations = (
    searchResults: {
        products?: ProductDto[];
        brands?: BrandDto[];
        creators?: CreatorDto[];
        content?: Array<{ type?: string; [key: string]: unknown }>;
    } | undefined
) => {
    return useMemo(() => {
        if (!searchResults) return [];
        
        const results: SimpleSearchResult[] = [];
        
        // Transform products
        if (Array.isArray(searchResults.products)) {
            results.push(...searchResults.products.map(product => 
                transformSearchResult(product, 'Product')
            ));
        }
        
        // Transform brands
        if (Array.isArray(searchResults.brands)) {
            results.push(...searchResults.brands.map(brand => 
                transformSearchResult(brand, 'Brand')
            ));
        }
        
        // Transform creators
        if (Array.isArray(searchResults.creators)) {
            results.push(...searchResults.creators.map(creator => 
                transformSearchResult(creator, 'Creator')
            ));
        }
        
        // Transform content (articles, tutorials, etc.)
        if (Array.isArray(searchResults.content)) {
            results.push(...searchResults.content.map(content => 
                transformSearchResult(content, (content?.type as SimpleSearchResult['type']) || 'Article')
            ));
        }
        
        return results.filter(result => result.id);
    }, [searchResults]);
};

// =============================================================================
// UTILITY TRANSFORMERS
// =============================================================================

/**
 * Transform pagination metadata
 */
export const transformPaginationMeta = (meta: {
    currentPage?: number;
    page?: number;
    totalPages?: number;
    pages?: number;
    totalItems?: number;
    total?: number;
    count?: number;
    itemsPerPage?: number;
    pageSize?: number;
    limit?: number;
    hasNextPage?: boolean;
    hasNext?: boolean;
    hasPreviousPage?: boolean;
    hasPrev?: boolean;
}) => {
    return {
        currentPage: meta?.currentPage || meta?.page || 1,
        totalPages: meta?.totalPages || meta?.pages || 1,
        totalItems: meta?.totalItems || meta?.total || meta?.count || 0,
        itemsPerPage: meta?.itemsPerPage || meta?.pageSize || meta?.limit || 10,
        hasNextPage: meta?.hasNextPage || meta?.hasNext || false,
        hasPreviousPage: meta?.hasPreviousPage || meta?.hasPrev || false
    };
};

/**
 * Transform filter options for dropdowns
 */
export const transformFilterOptions = <T extends Record<string, unknown>>(
    items: T[],
    valueKey: keyof T = 'id' as keyof T,
    labelKey: keyof T = 'name' as keyof T
) => {
    if (!Array.isArray(items)) return [];
    
    return items.map(item => ({
        value: String(item[valueKey] || ''),
        label: String(item[labelKey] || item.name || item.title || 'Unknown'),
        data: item // Keep original data for additional context
    })).filter(option => option.value);
};

// =============================================================================
// EXPORT ALL TRANSFORMERS
// =============================================================================

export const apiTransformers = {
    // Individual transformers
    transformBrand,
    transformProduct,
    transformCreator,
    transformCategory,
    transformSearchResult,
    transformPaginationMeta,
    transformFilterOptions,
    
    // Memoized hooks
    useBrandTransformations,
    useProductTransformations,
    useCreatorTransformations,
    useCategoryTransformations,
    useSearchResultTransformations
};

export default apiTransformers;