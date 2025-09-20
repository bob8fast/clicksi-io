// app/brand-management/retailers/[id]/edit/page.tsx
import { Suspense } from 'react';
import BrandRetailerForm from '@/components/features/brand-management/BrandRetailerForm';

export const metadata = {
    title: 'Edit Self-Distributed Retailer - Brand Management',
    description: 'Edit your retail location details and settings'
};

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ brandId?: string; teamId?: string }>;
}

export default async function EditRetailerPage({ params, searchParams }: PageProps) {
    const { id: retailerId } = await params;
    const searchParamsData = await searchParams;
    const brandId = searchParamsData.brandId;
    const teamId = searchParamsData.teamId;

    if (!brandId || !teamId || !retailerId) {
        return (
            <div className="min-h-screen bg-[#171717] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#EDECF8] mb-4">Missing Parameters</h1>
                    <p className="text-[#828288]">Brand ID, Team ID, and Retailer ID are required to edit a retailer.</p>
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
                retailerId={retailerId}
                mode="edit"
            />
        </Suspense>
    );
}