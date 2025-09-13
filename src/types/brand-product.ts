// types/brand-product.ts
export {
    ClicksiDataContractsCommonEnumsProductLifecycleStatus as ProductLifecycleStatus,
} from '@/gen/api/types/clicksi_data_contracts_common_enums_product_lifecycle_status';

export {
    ClicksiDataContractsCommonEnumsProductPublicationStatus as ProductPublicationStatus,
} from '@/gen/api/types/clicksi_data_contracts_common_enums_product_publication_status';

export type { GetBrandProductsParams } from '@/gen/api/types/get_brand_products_params';

// Brand product filters interface
export interface BrandProductFilters {
    search?: string;
    brandId?: string;
    categoryId?: string;
    publicationStatus?: string[];
    lifecycleStatus?: string[];
    tags?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

// Product categories constants
export const PRODUCT_CATEGORIES = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports & Outdoors',
    'Health & Beauty',
    'Books & Media',
    'Toys & Games',
    'Automotive',
    'Food & Beverages',
    'Other'
] as const;

// Product subcategories constants
export const PRODUCT_SUBCATEGORIES = {
    Electronics: [
        'Smartphones',
        'Laptops',
        'Tablets',
        'Headphones',
        'Cameras',
        'Gaming',
        'Other Electronics'
    ],
    Clothing: [
        'Men\'s Clothing',
        'Women\'s Clothing',
        'Children\'s Clothing',
        'Shoes',
        'Accessories',
        'Other Clothing'
    ],
    'Home & Garden': [
        'Furniture',
        'Kitchen & Dining',
        'Bedding',
        'Decor',
        'Garden',
        'Other Home'
    ],
    'Sports & Outdoors': [
        'Fitness',
        'Outdoor Recreation',
        'Sports Equipment',
        'Other Sports'
    ],
    'Health & Beauty': [
        'Skincare',
        'Makeup',
        'Hair Care',
        'Health Supplements',
        'Other Beauty'
    ],
    'Books & Media': [
        'Books',
        'Movies',
        'Music',
        'Games',
        'Other Media'
    ],
    'Toys & Games': [
        'Action Figures',
        'Board Games',
        'Educational Toys',
        'Electronic Toys',
        'Other Toys'
    ],
    Automotive: [
        'Car Accessories',
        'Motorcycle',
        'Parts',
        'Other Automotive'
    ],
    'Food & Beverages': [
        'Snacks',
        'Beverages',
        'Gourmet Food',
        'Health Food',
        'Other Food'
    ],
    Other: [
        'Miscellaneous'
    ]
} as const;