// app/brand-management/products/create/page.tsx
import { Suspense } from 'react';
import BrandProductForm from '@/components/features/brand-management/BrandProductForm';

export const metadata = {
    title: 'Create Product - Brand Management',
    description: 'Create a new product for your brand'
};

interface CreateProductPageProps {
    searchParams: Promise<{ brandId?: string; }>;
}

export default async function CreateProductPage({ searchParams }: CreateProductPageProps) {
    const searchParamsData = await searchParams;
    const brandId = searchParamsData.brandId;

    if (!brandId) {
        return (
            <div className="min-h-screen bg-[#171717] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#EDECF8] mb-4">Missing Parameters</h1>
                    <p className="text-[#828288]">Brand ID and Team ID are required to create a product.</p>
                </div>
            </div>
        );
    }

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#171717] flex items-center justify-center">
                <div className="text-[#828288]">Loading...</div>
            </div>
        }>
            <BrandProductForm 
                brandId={brandId}
                mode="create"
            />
        </Suspense>
    );
}
