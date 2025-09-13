/**
 * Filter Options Constants
 * 
 * This file centralizes filter options used across the application.
 * Structure follows API-first approach where available APIs are used,
 * and temporary constants are provided for missing endpoints.
 */

// =============================================================================
// TEMPORARY CONSTANTS (Until APIs are available)
// =============================================================================

/**
 * Ukrainian Cities - TEMPORARY
 * TODO: Replace with LocationAPI.getUkrainianCities() when available
 * Backend API needed: GET /api/locations/cities?country=UA
 */
export const TEMPORARY_UKRAINIAN_CITIES = [
    'Kyiv',
    'Lviv', 
    'Odesa',
    'Kharkiv',
    'Dnipro',
    'Zaporizhzhia',
    'Kryvyi Rih',
    'Mykolaiv',
    'Mariupol',
    'Vinnytsia',
    'Kherson',
    'Poltava',
    'Chernihiv',
    'Cherkasy',
    'Sumy',
    'Zhytomyr',
    'Khmelnytskyi',
    'Rivne',
    'Ivano-Frankivsk',
    'Ternopil',
    'Lutsk',
    'Uzhhorod',
    'Chernivtsi'
] as const;

/**
 * Countries List - TEMPORARY  
 * TODO: Replace with LocationAPI.getCountries() when available
 * Backend API needed: GET /api/locations/countries
 */
export const TEMPORARY_COUNTRIES = [
    { code: 'UA', name: 'Ukraine' },
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'PL', name: 'Poland' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'SK', name: 'Slovakia' },
    { code: 'HU', name: 'Hungary' },
    { code: 'RO', name: 'Romania' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'HR', name: 'Croatia' },
    { code: 'SI', name: 'Slovenia' },
    { code: 'AT', name: 'Austria' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'BE', name: 'Belgium' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'DK', name: 'Denmark' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'FI', name: 'Finland' },
    { code: 'EE', name: 'Estonia' },
    { code: 'LV', name: 'Latvia' },
    { code: 'LT', name: 'Lithuania' },
    { code: 'IE', name: 'Ireland' },
    { code: 'PT', name: 'Portugal' },
    { code: 'GR', name: 'Greece' },
    { code: 'CY', name: 'Cyprus' },
    { code: 'MT', name: 'Malta' }
] as const;

/**
 * Retailer Types - TEMPORARY
 * TODO: Replace with ConfigurationAPI.getRetailerTypes() when available  
 * Backend API needed: GET /api/configuration/retailer-types
 */
export const TEMPORARY_RETAILER_TYPES = [
    { id: 'online_store', name: 'Online Store', description: 'E-commerce platform' },
    { id: 'physical_store', name: 'Physical Store', description: 'Brick and mortar location' },
    { id: 'hybrid', name: 'Hybrid', description: 'Both online and physical presence' },
    { id: 'marketplace', name: 'Marketplace', description: 'Multi-vendor platform' },
    { id: 'boutique', name: 'Boutique', description: 'Specialized beauty boutique' },
    { id: 'pharmacy', name: 'Pharmacy', description: 'Pharmacy with beauty section' },
    { id: 'department_store', name: 'Department Store', description: 'Large retail chain' },
    { id: 'beauty_salon', name: 'Beauty Salon', description: 'Professional beauty services' }
] as const;

/**
 * Product/Brand Tags - TEMPORARY
 * TODO: Replace with ConfigurationAPI.getProductTags() when available
 * Backend API needed: GET /api/configuration/tags?category=products
 */
export const TEMPORARY_PRODUCT_TAGS = [
    'natural',
    'organic', 
    'premium',
    'affordable',
    'cruelty-free',
    'vegan',
    'sustainable',
    'eco-friendly',
    'dermatologist-tested',
    'hypoallergenic',
    'paraben-free',
    'sulfate-free',
    'fragrance-free',
    'sensitive-skin',
    'anti-aging',
    'moisturizing',
    'long-lasting',
    'waterproof',
    'matte',
    'gluten-free'
] as const;

/**
 * Brand Tags - TEMPORARY  
 * TODO: Replace with ConfigurationAPI.getBrandTags() when available
 * Backend API needed: GET /api/configuration/tags?category=brands
 */
export const TEMPORARY_BRAND_TAGS = [
    'ukrainian',
    'international',
    'startup',
    'established',
    'luxury',
    'mass-market',
    'niche',
    'innovative',
    'traditional',
    'celebrity-owned',
    'family-owned',
    'women-owned',
    'minority-owned',
    'b-corp-certified',
    'cruelty-free-certified'
] as const;

/**
 * Product Availability Filters - TEMPORARY
 * TODO: Replace with ConfigurationAPI.getAvailabilityFilters() when available  
 * Backend API needed: GET /api/configuration/availability-filters
 */
export const TEMPORARY_AVAILABILITY_FILTERS = [
    { id: 'available', name: 'Available', value: true },
    { id: 'out_of_stock', name: 'Out of Stock', value: false },
    { id: 'all', name: 'All Products', value: null }
] as const;

/**
 * Social Media Platforms - TEMPORARY
 * TODO: Replace with ConfigurationAPI.getSocialPlatforms() when available
 * Backend API needed: GET /api/configuration/social-platforms  
 */
export const TEMPORARY_SOCIAL_PLATFORMS = [
    { id: 'instagram', name: 'Instagram', icon: 'instagram', baseUrl: 'https://instagram.com/' },
    { id: 'tiktok', name: 'TikTok', icon: 'tiktok', baseUrl: 'https://tiktok.com/@' },
    { id: 'youtube', name: 'YouTube', icon: 'youtube', baseUrl: 'https://youtube.com/c/' },
    { id: 'facebook', name: 'Facebook', icon: 'facebook', baseUrl: 'https://facebook.com/' },
    { id: 'twitter', name: 'Twitter/X', icon: 'twitter', baseUrl: 'https://x.com/' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', baseUrl: 'https://linkedin.com/in/' },
    { id: 'pinterest', name: 'Pinterest', icon: 'pinterest', baseUrl: 'https://pinterest.com/' },
    { id: 'telegram', name: 'Telegram', icon: 'telegram', baseUrl: 'https://t.me/' }
] as const;

/**
 * Popular Search Terms - TEMPORARY
 * TODO: Replace with SearchAPI.getPopularSearches() when available
 * Backend API needed: GET /api/search/popular-terms
 */
export const TEMPORARY_POPULAR_SEARCHES = [
    'organic skincare',
    'beauty influencers Ukraine', 
    'makeup brands',
    'skincare routine',
    'beauty collaborations',
    'natural cosmetics',
    'eco-friendly beauty',
    'Ukrainian brands',
    'cruelty-free makeup',
    'vegan cosmetics',
    'anti-aging products',
    'Korean skincare',
    'professional makeup',
    'sensitive skin products',
    'moisturizers',
    'serums',
    'face masks',
    'cleansers',
    'toners',
    'sunscreen',
    'foundation',
    'concealer',
    'lipstick',
    'eyeshadow',
    'mascara',
    'eyeliner',
    'blush',
    'bronzer',
    'highlighter',
    'primer',
    'setting spray',
    'nail polish',
    'perfume',
    'hair care',
    'body lotion',
    'exfoliants',
    'retinol',
    'vitamin C',
    'hyaluronic acid',
    'niacinamide'
] as const;

// =============================================================================
// API-BASED CONSTANTS (Use hooks for real-time data)
// =============================================================================

/**
 * NOTE: The following data should be fetched using API hooks:
 * 
 * Categories: useGetCategories() from @/gen/api/hooks/product_catalog/categories
 * Brands: useGetBrands() from @/gen/api/hooks/user_management/brands  
 * Products: useGetProducts() from @/gen/api/hooks/product_catalog/products
 * Creators: useGetCreators() from @/gen/api/hooks/user_management/creators
 * 
 * These are available and should be used directly in components instead
 * of constants.
 */

// =============================================================================
// TYPE EXPORTS  
// =============================================================================

export type UkrainianCity = typeof TEMPORARY_UKRAINIAN_CITIES[number];
export type Country = typeof TEMPORARY_COUNTRIES[number];
export type RetailerType = typeof TEMPORARY_RETAILER_TYPES[number];
export type ProductTag = typeof TEMPORARY_PRODUCT_TAGS[number];
export type BrandTag = typeof TEMPORARY_BRAND_TAGS[number];
export type AvailabilityFilter = typeof TEMPORARY_AVAILABILITY_FILTERS[number];
export type SocialPlatform = typeof TEMPORARY_SOCIAL_PLATFORMS[number];
export type PopularSearch = typeof TEMPORARY_POPULAR_SEARCHES[number];