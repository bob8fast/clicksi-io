/**
 * Filter Data Management Hook
 * 
 * Centralized hook for managing filter options across list components.
 * Uses real API data where available and falls back to temporary constants
 * for missing endpoints. Designed for easy migration when APIs become available.
 */

import { useMemo } from 'react';
import { useCategoryHooks } from '@/hooks/api';
import { 
    TEMPORARY_UKRAINIAN_CITIES, 
    TEMPORARY_PRODUCT_TAGS, 
    TEMPORARY_BRAND_TAGS,
    TEMPORARY_RETAILER_TYPES 
} from '@/constants/filter-options';
// Removed useCategoryTransformations import - not needed for filter data
import type { ClicksiDataContractsCommonEnumsCategoryType } from '@/gen/api/types';

// =============================================================================
// FILTER DATA INTERFACES
// =============================================================================

export interface FilterOption {
    id: string;
    name: string;
    value: string;
    count?: number;
}

export interface FilterSection {
    categories: FilterOption[];
    locations: FilterOption[];
    tags: FilterOption[];
    retailerTypes?: FilterOption[];
    isLoading: boolean;
    error?: string;
}

// =============================================================================
// MAIN FILTER DATA HOOK
// =============================================================================

/**
 * Main hook for filter data management
 * @param categoryType - Type of categories to fetch (optional)
 * @param includeRetailerTypes - Whether to include retailer types (default: false)
 */
export const useFilterData = (
    categoryType?: ClicksiDataContractsCommonEnumsCategoryType, 
    includeRetailerTypes: boolean = false
): FilterSection => {
    
    // Get categories from API
    const categoryHooks = useCategoryHooks();
    const categoriesQuery = categoryHooks.getAll(categoryType);
    
    // Transform categories to filter options
    const categoryOptions = useMemo(() => {
        if (!categoriesQuery.data || !Array.isArray(categoriesQuery.data)) return [];
        
        return categoriesQuery.data
            .filter(category => category.is_active)
            .map(category => {
                // Get localized name from localizations array
                const localization = category.localizations?.[0]; // Use first localization or implement language selection
                const displayName = localization?.name || `Category ${category.category_id}`;
                
                return {
                    id: category.category_id,
                    name: displayName,
                    value: category.category_id, // Use category_id as value
                    count: undefined // Category count not available in this DTO
                };
            });
    }, [categoriesQuery.data]);
    
    // Location options (temporary until Location API available)
    const locationOptions = useMemo(() => {
        return TEMPORARY_UKRAINIAN_CITIES.map(city => ({
            id: city.toLowerCase().replace(/\s+/g, '-'),
            name: city,
            value: city
        }));
    }, []);
    
    // Tag options (temporary until Configuration API available)
    const tagOptions = useMemo(() => {
        // Use different tag sets based on context
        const tagSet = categoryType === 'Product' ? TEMPORARY_PRODUCT_TAGS : TEMPORARY_BRAND_TAGS;
        
        return tagSet.map(tag => ({
            id: tag,
            name: tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' '),
            value: tag
        }));
    }, [categoryType]);
    
    // Retailer type options (temporary until Configuration API available)
    const retailerTypeOptions = useMemo(() => {
        if (!includeRetailerTypes) return [];
        
        return TEMPORARY_RETAILER_TYPES.map(type => ({
            id: type.id,
            name: type.name,
            value: type.id
        }));
    }, [includeRetailerTypes]);
    
    return {
        categories: categoryOptions,
        locations: locationOptions,
        tags: tagOptions,
        retailerTypes: includeRetailerTypes ? retailerTypeOptions : undefined,
        isLoading: categoriesQuery.isLoading,
        error: categoriesQuery.error ? 'Failed to load filter options' : undefined
    };
};

// =============================================================================
// SPECIALIZED FILTER HOOKS
// =============================================================================

/**
 * Hook specifically for brand list filters
 */
export const useBrandFilterData = () => {
    return useFilterData('Product', false); // Use product categories for brand filtering
};

/**
 * Hook specifically for product list filters  
 */
export const useProductFilterData = () => {
    return useFilterData('Product', false);
};

/**
 * Hook specifically for creator list filters
 */
export const useCreatorFilterData = () => {
    return useFilterData('Content', false); // Use content categories for creator filtering
};

/**
 * Hook specifically for retailer list filters
 */
export const useRetailerFilterData = () => {
    return useFilterData('Product', true); // Include retailer types
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Transform filter options to checkbox data format
 */
export const transformToCheckboxOptions = (options: FilterOption[]) => {
    return options.map(option => ({
        id: option.value,
        label: option.name,
        value: option.value,
        count: option.count
    }));
};

/**
 * Transform filter options to select dropdown format
 */
export const transformToSelectOptions = (options: FilterOption[]) => {
    return options.map(option => ({
        label: option.count ? `${option.name} (${option.count})` : option.name,
        value: option.value
    }));
};

/**
 * Get filter option by value
 */
export const getFilterOptionByValue = (options: FilterOption[], value: string): FilterOption | undefined => {
    return options.find(option => option.value === value);
};

/**
 * Get multiple filter options by values
 */
export const getFilterOptionsByValues = (options: FilterOption[], values: string[]): FilterOption[] => {
    return values.map(value => getFilterOptionByValue(options, value)).filter(Boolean) as FilterOption[];
};

// =============================================================================
// EXPORT DEFAULT HOOK
// =============================================================================

export default useFilterData;