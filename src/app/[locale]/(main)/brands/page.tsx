// app/brands/page.tsx

import BrandListContent from '@/components/features/brands/BrandListContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Beauty Brands | Clicksi',
    description: 'Discover top beauty brands from Ukraine and around the world. Find premium skincare, cosmetics, and beauty products.',
    keywords: ['beauty brands', 'skincare', 'cosmetics', 'makeup', 'Ukrainian brands'],
};

interface BrandsPageProps
{
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BrandsPage({ searchParams }: BrandsPageProps)
{
    const resolvedSearchParams = await searchParams;
    
    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-[#EDECF8] mb-4">
                        Beauty Brands
                    </h1>
                    <p className="text-[#828288] text-lg max-w-2xl">
                        Discover premium beauty brands offering the finest skincare, cosmetics, and beauty products.
                        Connect with trusted Ukrainian and international brands.
                    </p>
                </div>

                {/* Brand List Content */}
                <BrandListContent searchParams={resolvedSearchParams} />
            </div>
        </div>
    );
}