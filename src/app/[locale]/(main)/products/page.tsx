// app/products/page.tsx

import ProductListContent from '@/components/features/products/ProductListContent';
import { ProductListSkeleton } from '@/components/ui/loading';
import { Suspense } from 'react';

export const metadata = {
    title: 'Products - Clicksi',
    description: 'Discover amazing beauty products from Ukrainian brands',
};

interface PageProps
{
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: PageProps)
{
    const params = await searchParams;

    return (
        <div className="min-h-screen bg-[#171717]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#EDECF8] mb-2">Products</h1>
                    <p className="text-[#828288]">Discover amazing beauty products from Ukrainian brands</p>
                </div>

                {/* Content with Suspense */}
                <Suspense fallback={<ProductListSkeleton />}>
                    <ProductListContent searchParams={params} />
                </Suspense>
            </div>
        </div>
    );
}