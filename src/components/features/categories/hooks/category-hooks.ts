'use client'

import { CategoryDto } from "@/types";
import { 
    SUPPORTED_LANGUAGES, 
    SupportedLanguageCode, 
    getCategoryName, 
    getCategoryDescription, 
    getCategorySlug 
} from "@/types/app/category-types";
import { useCategoryHooks } from "@/hooks/api";
import { useCallback, useMemo } from "react";

/**
 * Hook for category hierarchy management
 * Note: CategoryDto is flat data from API, no children property
 */
export function useCategoryHierarchy()
{
    const getCategoryPath = useCallback((category: CategoryDto): string[] =>
    {
        return category.path?.split('.') || [];
    }, []);

    const getParentCategory = useCallback((category: CategoryDto, allCategories: CategoryDto[]): CategoryDto | undefined =>
    {
        const parentPath = category.parent_path;
        if (!parentPath) return undefined;

        return allCategories.find(cat => cat.path === parentPath);
    }, []);

    const getChildCategories = useCallback((category: CategoryDto, allCategories: CategoryDto[]): CategoryDto[] =>
    {
        const path = category.path;
        if (!path) return [];

        return allCategories.filter(cat => cat.parent_path === path);
    }, []);

    const validateHierarchy = useCallback((categories: CategoryDto[]): string[] =>
    {
        const errors: string[] = [];
        const pathSet = new Set<string>();

        categories.forEach(category =>
        {
            const path = category.path;

            // Check for duplicate paths
            if (path && pathSet.has(path))
            {
                errors.push(`Duplicate path found: ${path}`);
            } else if (path)
            {
                pathSet.add(path);
            }

            // Validate required fields
            const localizations = category.localizations || [];
            if (!localizations.some(l => l.language_code === 'en'))
            {
                errors.push(`Category ${path || 'unknown'} is missing English localization`);
            }
        });

        return errors;
    }, []);

    // Simple sorting function for flat categories
    const sortCategories = useCallback((categories: CategoryDto[]): CategoryDto[] =>
    {
        return [...categories].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    }, []);

    return {
        getCategoryPath,
        getParentCategory,
        getChildCategories,
        validateHierarchy,
        sortCategories
    };
}

/**
 * Hook to manage category localization
 */
export function useCategoryLocalization()
{
    // Memoize available languages to prevent unnecessary re-renders
    const availableLanguages = useMemo(() => [...SUPPORTED_LANGUAGES], []);

    // Use memoized functions for better performance
    const getLocalizedName = useCallback((category: CategoryDto, languageCode: SupportedLanguageCode = 'en'): string =>
        getCategoryName(category, languageCode), []);

    const getLocalizedDescription = useCallback((category: CategoryDto, languageCode: SupportedLanguageCode = 'en'): string =>
        getCategoryDescription(category, languageCode), []);

    const getLocalizedSlug = useCallback((category: CategoryDto, languageCode: SupportedLanguageCode = 'en'): string =>
        getCategorySlug(category, languageCode), []);

    const hasTranslation = useCallback((category: CategoryDto, languageCode: SupportedLanguageCode): boolean =>
    {
        const localizations = category.localizations || [];
        return localizations.some(l => l.language_code === languageCode);
    }, []);

    const getMissingTranslations = useCallback((category: CategoryDto): SupportedLanguageCode[] =>
    {
        const localizations = category.localizations || [];
        const existingLanguages = new Set(localizations.map(l => l.language_code));
        return availableLanguages
            .map(lang => lang.code)
            .filter(code => !existingLanguages.has(code)) as SupportedLanguageCode[];
    }, [availableLanguages]);

    const addTranslation = useCallback((
        category: CategoryDto,
        languageCode: SupportedLanguageCode
    ): CategoryDto =>
    {
        if (hasTranslation(category, languageCode))
        {
            return category;
        }

        const localizations = category.localizations || [];
        const englishLocalization = localizations.find(l => l.language_code === 'en');
        const newLocalization = {
            language_code: languageCode,
            name: englishLocalization?.name || '',
            slug: englishLocalization?.slug || '',
            description: englishLocalization?.description || ''
        };

        return {
            ...category,
            localizations: [...localizations, newLocalization]
        };
    }, [hasTranslation]);

    const removeTranslation = useCallback((
        category: CategoryDto,
        languageCode: SupportedLanguageCode
    ): CategoryDto =>
    {
        if (languageCode === 'en')
        {
            // Cannot remove English translation
            return category;
        }

        const localizations = category.localizations || [];
        return {
            ...category,
            localizations: localizations.filter(l => l.language_code !== languageCode)
        };
    }, []);

    return {
        availableLanguages,
        getLocalizedName,
        getLocalizedDescription,
        getLocalizedSlug,
        hasTranslation,
        getMissingTranslations,
        addTranslation,
        removeTranslation
    };
}
