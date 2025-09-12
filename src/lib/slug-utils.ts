// utils/slug-utils.ts
import getSlug from 'speakingurl';

/**
 * Options for slug generation - extends speakingurl options
 */
export interface SlugOptions
{
    /** Maximum length of the generated slug (default: 50) */
    maxLength?: number;
    /** Separator character (default: '-') */
    separator?: string;
    /** Language code for better transliteration (default: 'en') */
    lang?: string;
    /** Whether to remove trailing separators (default: true) */
    truncate?: number;
    /** Custom replacement patterns */
    custom?: Record<string, string>;
    /** Whether to allow symbols like dots */
    symbols?: boolean;
    /** Whether to maintain case */
    maintainCase?: boolean;
    /** Title case conversion */
    titleCase?: boolean | string[];
    /** Whether to transliterate */
    transliterate?: boolean;
}

/**
 * Enhanced options interface for our wrapper
 */
export interface EnhancedSlugOptions extends SlugOptions
{
    /** Whether to ensure uniqueness against existing slugs */
    ensureUnique?: boolean;
    /** Array of existing slugs to check against */
    existingSlugs?: string[];
    /** Preset configuration name */
    preset?: keyof typeof SLUG_PRESETS;
}

/**
 * Predefined slug generation presets for common use cases
 */
export const SLUG_PRESETS = {
    /** Standard category slugs */
    category: {
        maxLength: 50,
        separator: '-',
        lang: 'en',
        symbols: false,
        maintainCase: false,
        transliterate: true
    } as SlugOptions,

    /** Product slugs with longer length */
    product: {
        maxLength: 75,
        separator: '-',
        lang: 'en',
        symbols: false,
        maintainCase: false,
        transliterate: true
    } as SlugOptions,

    /** Article/blog post slugs */
    article: {
        maxLength: 100,
        separator: '-',
        lang: 'en',
        symbols: false,
        maintainCase: false,
        transliterate: true
    } as SlugOptions,

    /** User profile slugs */
    user: {
        maxLength: 30,
        separator: '-',
        lang: 'en',
        symbols: false,
        maintainCase: false,
        transliterate: true
    } as SlugOptions,

    /** File-friendly slugs */
    file: {
        maxLength: 60,
        separator: '_',
        lang: 'en',
        symbols: false,
        maintainCase: false,
        transliterate: true
    } as SlugOptions,

    /** API endpoint slugs */
    api: {
        maxLength: 40,
        separator: '-',
        lang: 'en',
        symbols: false,
        maintainCase: false,
        transliterate: true
    } as SlugOptions
} as const;

/**
 * Language-specific custom replacements for better slug generation
 */
const LANGUAGE_CUSTOM_REPLACEMENTS: Record<string, Record<string, string>> = {
    'uk': {
        'та': 'ta',
        'і': 'i',
        'й': 'y',
        'ь': '',
        'ий': 'yy',
        'ій': 'iy',
        'ьо': 'yo',
        'йо': 'yo',
        '\'': ''
    },
    'ru': {
        'и': 'i',
        'й': 'y',
        'ь': '',
        'ъ': '',
        'ий': 'yy',
        'ей': 'ey',
        'ая': 'aya',
        'ое': 'oe',
        'ые': 'ye'
    },
    'de': {
        'sch': 'sh',
        'tsch': 'tsh',
        'und': 'und',
        'oder': 'oder'
    },
    'fr': {
        'eau': 'o',
        'eux': 'eu',
        'et': 'et',
        'ou': 'ou'
    },
    'es': {
        'ñ': 'n',
        'Ñ': 'N',
        'y': 'y',
        'o': 'o'
    },
    'pl': {
        'ą': 'a',
        'ć': 'c',
        'ę': 'e',
        'ł': 'l',
        'ń': 'n',
        'ó': 'o',
        'ś': 's',
        'ź': 'z',
        'ż': 'z'
    }
};

/**
 * Generate a URL-friendly slug from text using speakingurl
 * 
 * @param text - The input text to convert to a slug
 * @param options - Configuration options for slug generation
 * @returns A URL-friendly slug string
 * 
 * @example
 * ```typescript
 * // Basic usage
 * generateSlug('Hello World!') // 'hello-world'
 * 
 * // With language support
 * generateSlug('Привіт Світ!', { lang: 'uk', maxLength: 20 }) // 'pryvit-svit'
 * 
 * // Custom separator
 * generateSlug('Product Name', { separator: '_' }) // 'product_name'
 * 
 * // Using preset
 * generateSlug('My Category', { preset: 'category' }) // 'my-category'
 * ```
 */
export function generateSlug(text: string, options: EnhancedSlugOptions = {}): string
{
    if (!text || typeof text !== 'string')
    {
        return '';
    }

    // Apply preset if specified
    let finalOptions = { ...options };
    if (options.preset)
    {
        finalOptions = { ...SLUG_PRESETS[options.preset], ...options };
    }

    const {
        maxLength = 50,
        separator = '-',
        lang = 'en',
        custom,
        ensureUnique = false,
        existingSlugs = [],
        ...restOptions
    } = finalOptions;

    // Merge language-specific custom replacements
    const languageCustom = LANGUAGE_CUSTOM_REPLACEMENTS[lang] || {};
    const mergedCustom = { ...languageCustom, ...custom };

    // Prepare speakingurl options
    const speakingUrlOptions = {
        separator,
        lang,
        custom: mergedCustom,
        truncate: maxLength,
        symbols: false,
        maintainCase: false,
        transliterate: true,
        ...restOptions
    };

    // Generate the slug using speakingurl
    let slug = getSlug(text.trim(), speakingUrlOptions);

    // Ensure uniqueness if requested
    if (ensureUnique && existingSlugs.length > 0)
    {
        slug = ensureUniqueSlug(slug, existingSlugs, { separator, maxLength });
    }

    return slug;
}

/**
 * Generate a unique slug by appending a number if the slug already exists
 * 
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @param options - Configuration options
 * @returns A unique URL-friendly slug string
 * 
 * @example
 * ```typescript
 * const existing = ['hello-world', 'hello-world-1'];
 * ensureUniqueSlug('hello-world', existing) // 'hello-world-2'
 * ```
 */
export function ensureUniqueSlug(
    baseSlug: string,
    existingSlugs: string[],
    options: { separator?: string; maxLength?: number } = {}
): string
{
    if (!existingSlugs.includes(baseSlug))
    {
        return baseSlug;
    }

    const { separator = '-', maxLength = 50 } = options;
    let counter = 1;
    let uniqueSlug: string;

    do
    {
        const suffix = `${separator}${counter}`;
        const maxBaseLength = maxLength - suffix.length;

        // Ensure we have room for the suffix
        if (maxBaseLength <= 0)
        {
            uniqueSlug = counter.toString();
        } else
        {
            const truncatedBase = baseSlug.length > maxBaseLength
                ? baseSlug.substring(0, maxBaseLength)
                : baseSlug;
            uniqueSlug = `${truncatedBase}${suffix}`;
        }

        counter++;
    } while (existingSlugs.includes(uniqueSlug) && counter < 1000); // Safety limit

    return uniqueSlug;
}

/**
 * Generate a unique slug directly from text
 * 
 * @param text - The input text to convert to a unique slug
 * @param existingSlugs - Array of existing slugs to check against
 * @param options - Configuration options for slug generation
 * @returns A unique URL-friendly slug string
 * 
 * @example
 * ```typescript
 * const existing = ['hello-world', 'hello-world-1'];
 * generateUniqueSlug('Hello World', existing) // 'hello-world-2'
 * ```
 */
export function generateUniqueSlug(
    text: string,
    existingSlugs: string[],
    options: EnhancedSlugOptions = {}
): string
{
    const baseSlug = generateSlug(text, options);
    return ensureUniqueSlug(baseSlug, existingSlugs, options);
}

/**
 * Validate if a string is a valid slug
 * 
 * @param slug - The slug string to validate
 * @param options - Configuration options for validation
 * @returns True if the slug is valid, false otherwise
 * 
 * @example
 * ```typescript
 * isValidSlug('hello-world') // true
 * isValidSlug('hello world') // false
 * isValidSlug('hello_world', { separator: '_' }) // true
 * ```
 */
export function isValidSlug(slug: string, options: SlugOptions = {}): boolean
{
    if (!slug || typeof slug !== 'string')
    {
        return false;
    }

    const {
        maxLength = 50,
        separator = '-'
    } = options;

    // Check length
    if (slug.length > maxLength || slug.length === 0)
    {
        return false;
    }

    // Use speakingurl to generate what the slug should be and compare
    const expectedSlug = getSlug(slug, {
        separator,
        symbols: false,
        maintainCase: false,
        //transliterate: false // Don't transliterate since we're validating existing slug
    });

    return slug === expectedSlug;
}

/**
 * Convert a slug back to a readable title
 * 
 * @param slug - The slug to convert
 * @param options - Configuration options
 * @returns A human-readable title
 * 
 * @example
 * ```typescript
 * slugToTitle('hello-world') // 'Hello World'
 * slugToTitle('product_name', { separator: '_' }) // 'Product Name'
 * ```
 */
export function slugToTitle(slug: string, options: { separator?: string } = {}): string
{
    if (!slug || typeof slug !== 'string')
    {
        return '';
    }

    const { separator = '-' } = options;

    return slug
        .split(separator)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Generate slug using a preset configuration
 * 
 * @param text - The input text
 * @param presetName - Name of the preset to use
 * @param additionalOptions - Additional options to override preset
 * @returns Generated slug
 * 
 * @example
 * ```typescript
 * generateSlugWithPreset('My Product Name', 'product') // 'my-product-name'
 * generateSlugWithPreset('User Profile', 'user', { maxLength: 20 }) // 'user-profile'
 * ```
 */
export function generateSlugWithPreset(
    text: string,
    presetName: keyof typeof SLUG_PRESETS,
    additionalOptions: EnhancedSlugOptions = {}
): string
{
    return generateSlug(text, { preset: presetName, ...additionalOptions });
}

/**
 * Batch generate slugs for multiple texts
 * 
 * @param texts - Array of texts to convert to slugs
 * @param options - Configuration options for slug generation
 * @param ensureUnique - Whether to ensure all generated slugs are unique
 * @returns Array of generated slugs
 * 
 * @example
 * ```typescript
 * const texts = ['Hello World', 'Hello World', 'Goodbye World'];
 * generateSlugs(texts, { preset: 'category' }, true) 
 * // ['hello-world', 'hello-world-1', 'goodbye-world']
 * ```
 */
export function generateSlugs(
    texts: string[],
    options: EnhancedSlugOptions = {},
    ensureUnique: boolean = false
): string[]
{
    if (!ensureUnique)
    {
        return texts.map(text => generateSlug(text, options));
    }

    const slugs: string[] = [];

    texts.forEach(text =>
    {
        const slug = generateUniqueSlug(text, slugs, options);
        slugs.push(slug);
    });

    return slugs;
}

/**
 * Get slug statistics for analysis
 * 
 * @param slug - The slug to analyze
 * @returns Statistics about the slug
 * 
 * @example
 * ```typescript
 * getSlugStats('hello-world-product-name')
 * // {
 * //   length: 23,
 * //   wordCount: 4,
 * //   hasNumbers: false,
 * //   hasSpecialChars: false,
 * //   isValid: true
 * // }
 * ```
 */
export function getSlugStats(slug: string):
    {
        length: number;
        wordCount: number;
        hasNumbers: boolean;
        hasSpecialChars: boolean;
        isValid: boolean;
    }
{
    if (!slug || typeof slug !== 'string')
    {
        return {
            length: 0,
            wordCount: 0,
            hasNumbers: false,
            hasSpecialChars: false,
            isValid: false
        };
    }

    return {
        length: slug.length,
        wordCount: slug.split('-').length,
        hasNumbers: /\d/.test(slug),
        hasSpecialChars: /[^a-z0-9-_]/.test(slug),
        isValid: isValidSlug(slug)
    };
}

// Export default generateSlug for convenience
export default generateSlug;