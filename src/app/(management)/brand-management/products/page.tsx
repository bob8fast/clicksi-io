// app/brand-management/products/page.tsx
import BrandProductList from '@/components/features/brand-management/BrandProductList';

interface ProductsPageProps
{
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps)
{
    const resolvedSearchParams = await searchParams;
    // In a real app, you would get the brandId from session or params
    const brandId = 'brand-1';

    return <BrandProductList brandId={brandId} searchParams={resolvedSearchParams} />;
}