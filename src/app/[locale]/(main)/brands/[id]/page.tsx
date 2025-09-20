// app/brands/[id]/page.tsx

import BrandDetailPage from '@/components/features/brands/BrandDetailPage';
import { brandService } from '@/services/brand-service';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface BrandPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const brand = await brandService.getBrand(resolvedParams.id);
    
    if (!brand) {
      return {
        title: 'Brand Not Found | Clicksi',
        description: 'The brand you are looking for could not be found.',
      };
    }

    return {
      title: `${brand.name} | Beauty Brand | Clicksi`,
      description: brand.description,
      keywords: [brand.name, brand.category, ...brand.tags, 'beauty brand', 'skincare', 'cosmetics'],
      openGraph: {
        title: `${brand.name} | Beauty Brand`,
        description: brand.description,
        images: [
          {
            url: brand.logo,
            width: 400,
            height: 400,
            alt: `${brand.name} logo`,
          },
          {
            url: brand.coverImage,
            width: 1200,
            height: 600,
            alt: `${brand.name} cover image`,
          },
        ],
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${brand.name} | Beauty Brand`,
        description: brand.description,
        images: [brand.coverImage],
      },
    };
  } catch {
    return {
      title: 'Brand Not Found | Clicksi',
      description: 'The brand you are looking for could not be found.',
    };
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  const resolvedParams = await params;
  // Pre-check if brand exists for better error handling
  try {
    const brand = await brandService.getBrand(resolvedParams.id);
    if (!brand) {
      notFound();
    }
  } catch {
    notFound();
  }

  return <BrandDetailPage brandId={resolvedParams.id} />;
}