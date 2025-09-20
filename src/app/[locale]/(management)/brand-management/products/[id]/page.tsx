import BrandProductDetail from '@/components/features/brand-management/BrandProductDetail';

interface ProductDetailPageProps
{
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps)
{
    const resolvedParams = await params;
    // In a real app, you would get the brandId from session or params
    const brandId = 'brand-1';

    return <BrandProductDetail brandId={brandId} productId={resolvedParams.id} />;
}