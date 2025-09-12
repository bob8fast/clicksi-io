'use client';
import { TEMPORARY_POPULAR_SEARCHES } from '@/constants/filter-options';
import { useBrandHooks, useCategoryHooks, useCreatorHooks, useDebounce, useProductHooks } from '@/hooks';
import { useBrandTransformations, useCreatorTransformations } from '@/lib/transformers/api-transformers';
import { getCategoryDescription, getCategoryName } from '@/types/app/category-types';
import { useEffect, useMemo, useState } from 'react';

// ============================================================================= 
// SEARCH HOOKS AND DATA MANAGEMENT
// =============================================================================
/**
 * Custom hook for managing search functionality with debouncing and minimum character requirement
 * TODO: Replace with Global Search API when available (GET /api/search/global)
 */
export const useSearchData = (searchQuery: string) =>
{
    const [recentSearches, setRecentSearches] = useState<Array<{ id: string; query: string; url: string; }>>([]);

    // Debounce search query with 300ms delay
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Only trigger API calls if search query has 3+ characters
    const shouldSearch = debouncedSearchQuery.length >= 3;
    const apiSearchQuery = shouldSearch ? debouncedSearchQuery : '';

    // API hooks for real data
    const brandHooks = useBrandHooks();
    const creatorHooks = useCreatorHooks();
    const productHooks = useProductHooks();
    const categoryHooks = useCategoryHooks();

    // Get data with search-optimized parameters - only call APIs when we should search
    const brandsQuery = brandHooks.getAll({
        search: apiSearchQuery || undefined,
        limit: 5, // Limit for search dropdown
        page: 1
    });

    const creatorsQuery = creatorHooks.getAll({
        search: apiSearchQuery || undefined,
        limit: 5, // Limit for search dropdown
        page: 1
    });

    const productsQuery = productHooks.getAll({
        search: apiSearchQuery || undefined,
        limit: 5, // Limit for search dropdown
        page: 1
    });

    // Get categories for search - all categories without type filter for search
    const categoriesQuery = categoryHooks.getAll();

    // Filter categories based on search query using optimized memoized functions
    const filteredCategories = useMemo(() =>
    {
        if (!shouldSearch || !categoriesQuery.data) return [];

        return categoriesQuery.data
            .filter(category =>
            {
                // Check if category is active
                if (!category.is_active) return false;

                // Use memoized function to get category name with language fallback
                const categoryName = getCategoryName(category, 'en');
                const categoryDescription = getCategoryDescription(category, 'en');

                // Search in both name and description for better results
                const searchLower = apiSearchQuery.toLowerCase();
                return categoryName.toLowerCase().includes(searchLower) ||
                    categoryDescription.toLowerCase().includes(searchLower);
            })
            .slice(0, 5); // Limit to 5 for dropdown
    }, [shouldSearch, categoriesQuery.data, apiSearchQuery]);

    // Transform API data to component-friendly format
    const transformedBrands = useBrandTransformations(brandsQuery.data?.brands);
    const transformedCreators = useCreatorTransformations(creatorsQuery.data?.creators);

    // Create grouped search results structure: Creator → Brand → Product → Categories
    const groupedSearchResults = useMemo(() =>
    {
        if (!shouldSearch) return { creators: [], brands: [], products: [], categories: [] };

        // Transform creators
        const creators = creatorsQuery.data?.creators?.map(creator => ({
            id: creator.id,
            title: creator.display_name,
            type: 'Creator' as const,
            url: `/creators/${creator.display_name.toLowerCase().replace(/\s+/g, '-')}`,
            description: creator.bio || 'Content creator',
            imageUrl: undefined
        })) || [];

        // Transform brands  
        const brands = brandsQuery.data?.brands?.map(brand => ({
            id: brand.id,
            title: brand.display_name,
            type: 'Brand' as const,
            url: `/brands/${brand.display_name.toLowerCase().replace(/\s+/g, '-')}`,
            description: brand.description || 'Beauty brand',
            imageUrl: brand.logo_storage_path || undefined
        })) || [];

        // Transform products
        const products = productsQuery.data?.products?.map(product => ({
            id: product.id,
            title: product.name,
            type: 'Product' as const,
            url: `/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`,
            description: product.short_description || 'Beauty product',
            imageUrl: product.primary_image || undefined
        })) || [];

        // Transform categories using optimized memoized functions
        // Only include Creator, Brand, and Product categories as specified
        const categories = filteredCategories
            .filter(category =>
            {
                const categoryType = category.type;
                return categoryType === 'Creator' || categoryType === 'Brand' || categoryType === 'Product';
            })
            .map(category =>
            {
                // Use memoized functions for performance and proper language fallback
                const categoryName = getCategoryName(category, 'en');
                const categoryDescription = getCategoryDescription(category, 'en');
                const categoryType = category.type;

                // Redirect to appropriate list page based on category type
                let url = '';
                switch (categoryType)
                {
                    case 'Creator':
                        url = `/creators?category=${category.category_id}`;
                        break;
                    case 'Brand':
                        url = `/brands?category=${category.category_id}`;
                        break;
                    case 'Product':
                        url = `/products?category=${category.category_id}`;
                        break;
                    default:
                        url = `/categories/${category.category_id}`;
                }

                return {
                    id: category.category_id,
                    title: categoryName,
                    type: 'Category' as const,
                    url,
                    description: categoryDescription || `${categoryType} category`
                };
            });

        return { creators, brands, products, categories };
    }, [shouldSearch, creatorsQuery.data, brandsQuery.data, productsQuery.data, filteredCategories]);

    // Load recent searches from localStorage on mount
    useEffect(() =>
    {
        const stored = localStorage.getItem('clicksi-recent-searches');
        if (stored)
        {
            try
            {
                const parsed = JSON.parse(stored);
                setRecentSearches(Array.isArray(parsed) ? parsed.slice(0, 8) : []);
            } catch
            {
                setRecentSearches([]);
            }
        } else
        {
            // Add temporary recent searches for testing styles
            const tempRecentSearches = [
                { id: '1', query: 'Ukrainian beauty brands', url: '/search?q=Ukrainian+beauty+brands' },
                { id: '2', query: 'Natural skincare', url: '/search?q=Natural+skincare' },
                { id: '3', query: 'Eco-friendly cosmetics', url: '/search?q=Eco-friendly+cosmetics' },
                { id: '4', query: 'Organic makeup', url: '/search?q=Organic+makeup' },
                { id: '5', query: 'Vegan beauty products', url: '/search?q=Vegan+beauty+products' },
                { id: '31', query: 'Eco-friendly cosmetics', url: '/search?q=Eco-friendly+cosmetics' },
                { id: '41', query: 'Organic makeup', url: '/search?q=Organic+makeup' },
                { id: '51', query: 'Vegan beauty products', url: '/search?q=Vegan+beauty+products' },
                { id: '12', query: 'Ukrainian beauty brands', url: '/search?q=Ukrainian+beauty+brands' },
                { id: '22', query: 'Natural skincare', url: '/search?q=Natural+skincare' },
                { id: '32', query: 'Eco-friendly cosmetics', url: '/search?q=Eco-friendly+cosmetics' },
                { id: '42', query: 'Organic makeup', url: '/search?q=Organic+makeup' },
                { id: '52', query: 'Vegan beauty products', url: '/search?q=Vegan+beauty+products' },
                { id: '31', query: 'Eco-friendly cosmetics', url: '/search?q=Eco-friendly+cosmetics' },
                { id: '422', query: 'Organic makeup', url: '/search?q=Organic+makeup' },
                { id: '521', query: 'Vegan beauty products', url: '/search?q=Vegan+beauty+products' }
            ];
            setRecentSearches(tempRecentSearches);
        }
    }, []);

    // Function to add search to recent searches with URL update support
    const addToRecentSearches = (query: string) =>
    {
        const newSearch = {
            id: Date.now().toString(),
            query,
            url: `/search?q=${encodeURIComponent(query)}`
        };

        setRecentSearches(prev =>
        {
            const filtered = prev.filter(item => item.query !== query);
            const updated = [newSearch, ...filtered].slice(0, 8);
            localStorage.setItem('clicksi-recent-searches', JSON.stringify(updated));
            return updated;
        });
    };

    return {
        // Grouped search results from APIs (Creator → Brand → Product → Categories)
        groupedSearchResults,

        // Individual results (for backward compatibility)
        transformedBrands: shouldSearch ? transformedBrands : [],
        transformedCreators: shouldSearch ? transformedCreators : [],

        // Search state
        shouldSearch,
        debouncedSearchQuery,

        // Loading states (only show loading when actually searching)
        isLoading: shouldSearch && (brandsQuery.isLoading || creatorsQuery.isLoading || productsQuery.isLoading || categoriesQuery.isLoading),
        isError: shouldSearch && (brandsQuery.isError || creatorsQuery.isError || productsQuery.isError || categoriesQuery.isError),

        // Recent searches (localStorage)
        recentSearches,
        addToRecentSearches,

        // Popular searches (temporary constants until API available)
        popularSearches: TEMPORARY_POPULAR_SEARCHES
    };
};
