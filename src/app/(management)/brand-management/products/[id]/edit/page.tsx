// app/brand-management/products/[id]/edit/page.tsx
import { Suspense } from 'react';
import BrandProductForm from '@/components/features/brand-management/BrandProductForm';

export const metadata = {
    title: 'Edit Product - Brand Management',
    description: 'Edit your product details and settings'
};

interface EditProductPageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ brandId?: string; }>;
}

export default async function EditProductPage({ params, searchParams }: EditProductPageProps) {
    const { id: productId } = await params;
    const searchParamsData = await searchParams;
    const brandId = searchParamsData.brandId;

    if (!brandId || !productId) {
        return (
            <div className="min-h-screen bg-[#171717] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#EDECF8] mb-4">Missing Parameters</h1>
                    <p className="text-[#828288]">Brand ID, Team ID, and Product ID are required to edit a product.</p>
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
                productId={productId}
                mode="edit"
            />
        </Suspense>
    );
}