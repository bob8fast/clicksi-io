// app/creators/page.tsx

import CreatorListContent from '@/components/features/creators/CreatorListContent';
import { CreatorListSkeleton } from '@/components/ui/loading';
import { Suspense } from 'react';

export const metadata = {
    title: 'Discover Creators - Clicksi',
    description: 'Connect with talented creators for your next campaign',
    keywords: ['beauty creators', 'influencers', 'content creators', 'beauty influencers', 'makeup artists'],
};

interface PageProps
{
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CreatorsPage({ searchParams }: PageProps)
{
    const params = await searchParams;

    return (
        <div className="min-h-screen bg-[#171717]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#EDECF8] mb-2">Discover Creators</h1>
                    <p className="text-[#828288]">Connect with talented creators for your next campaign</p>
                </div>

                {/* Content with Suspense */}
                <Suspense fallback={<CreatorListSkeleton />}>
                    <CreatorListContent searchParams={params} />
                </Suspense>
            </div>
        </div>
    );
}