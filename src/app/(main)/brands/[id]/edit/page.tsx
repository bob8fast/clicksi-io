// app/brands/[id]/edit/page.tsx

import BrandEditPage from '@/components/features/brands/BrandEditPage';
import { brandService } from '@/services/brand-service';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface BrandEditPageProps
{
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({ params }: BrandEditPageProps): Promise<Metadata>
{
    const resolvedParams = await params;
    try
    {
        const brand = await brandService.getBrand(resolvedParams.id);

        if (!brand)
        {
            return {
                title: 'Brand Not Found | Clicksi',
                description: 'The brand you are looking for could not be found.',
            };
        }

        return {
            title: `Edit ${brand.name} | Brand Management | Clicksi`,
            description: `Edit and manage your brand information for ${brand.name}`,
            robots: 'noindex, nofollow', // Don't index edit pages
        };
    } catch
    {
        return {
            title: 'Brand Not Found | Clicksi',
            description: 'The brand you are looking for could not be found.',
        };
    }
}

export default async function BrandEditPageRoute({ params }: BrandEditPageProps)
{
    const resolvedParams = await params;
    // Pre-check if brand exists for better error handling
    try
    {
        const brand = await brandService.getBrand(resolvedParams.id);
        if (!brand)
        {
            notFound();
        }
    } catch
    {
        notFound();
    }

    return <BrandEditPage brandId={resolvedParams.id} />;
}