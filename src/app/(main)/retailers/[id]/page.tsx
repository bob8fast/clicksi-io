// app/retailers/[id]/page.tsx

import RetailerDetailPage from '@/components/features/retailers/RetailerDetailPage';
// import { retailerService } from '@/services/retailer-service'; // Service removed
import { Metadata } from 'next';

interface RetailerPageProps
{
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: RetailerPageProps): Promise<Metadata>
{
    const _resolvedParams = await params;
    return {
        title: `Retailer | Clicksi`,
        description: 'View retailer details on Clicksi',
    };
}

export default async function RetailerPage({ params }: RetailerPageProps)
{
    const resolvedParams = await params;
    return <RetailerDetailPage retailerId={resolvedParams.id} />;
}