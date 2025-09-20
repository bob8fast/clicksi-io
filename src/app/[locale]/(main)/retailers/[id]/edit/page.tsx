// app/retailers/[id]/edit/page.tsx

import RetailerEditPage from '@/components/features/retailers/RetailerEditPage';
// import { retailerService } from '@/services/retailer-service'; // Service removed
import { Metadata } from 'next';

interface RetailerEditPageProps
{
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: RetailerEditPageProps): Promise<Metadata>
{
    const _resolvedParams = await params;
    return {
        title: `Edit Retailer | Clicksi`,
        description: `Edit retailer information`,
        robots: 'noindex, nofollow', // Don't index edit pages
    };
}

export default async function RetailerEditPageRoute({ params }: RetailerEditPageProps)
{
    const resolvedParams = await params;
    return <RetailerEditPage retailerId={resolvedParams.id} />;
}