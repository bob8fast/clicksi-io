// app/retailers/page.tsx

import RetailerListContent from '@/components/features/retailers/RetailerListContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Beauty Retailers | Clicksi',
    description: 'Find the best beauty retailers and stores. Discover online and physical stores offering premium beauty products.',
    keywords: ['beauty retailers', 'beauty stores', 'online beauty shop', 'cosmetics store', 'skincare retailer'],
};

interface RetailersPageProps
{
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RetailersPage({ searchParams }: RetailersPageProps)
{
    const resolvedSearchParams = await searchParams;
    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-[#EDECF8] mb-4">
                        Beauty Retailers
                    </h1>
                    <p className="text-[#828288] text-lg max-w-2xl">
                        Explore trusted beauty retailers offering premium products from top brands.
                        Find online stores, physical locations, and hybrid shopping experiences.
                    </p>
                </div>

                {/* Retailer List Content */}
                <RetailerListContent searchParams={resolvedSearchParams} />
            </div>
        </div>
    );
}