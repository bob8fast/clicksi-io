// app/brand-management/retailers/create/page.tsx
import { Suspense } from 'react';
import BrandRetailerForm from '@/components/features/brand-management/BrandRetailerForm';

export const metadata = {
    title: 'Create Self-Distributed Retailer - Brand Management',
    description: 'Set up your own retail location to distribute your products directly'
};

interface PageProps {
    searchParams: Promise<{ brandId?: string; teamId?: string }>;
}

export default async function CreateRetailerPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const brandId = params.brandId;
    const teamId = params.teamId;

    if (!brandId || !teamId) {
        return (
            <div className="min-h-screen bg-[#171717] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#EDECF8] mb-4">Missing Parameters</h1>
                    <p className="text-[#828288]">Brand ID and Team ID are required to create a retailer.</p>
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
            <BrandRetailerForm 
                brandId={brandId}
                teamId={teamId}
                mode="create"
            />
        </Suspense>
    );
}