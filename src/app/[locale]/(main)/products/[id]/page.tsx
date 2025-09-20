// app/products/[id]/page.tsx

import { Suspense } from 'react';
import ProductDetailsContent from '@/components/features/products/ProductDetailsContent';
import { ProductDetailsSkeleton } from '@/components/ui/loading';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id: _id } = await params;
  
  // Metadata will be handled by the client component with real API data
  return {
    title: 'Product Details - Clicksi',
    description: 'Discover amazing beauty products from Ukrainian brands',
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-[#171717]">
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetailsContent productId={id} />
      </Suspense>
    </div>
  );
}