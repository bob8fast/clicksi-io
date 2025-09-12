// components/brand-management/BrandProductDetail.tsx
'use client'

import
{
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBrandProduct, useDeleteBrandProduct } from '@/hooks/use-brand-product';
import
{
    ProductLifecycleStatus,
    ProductPublicationStatus
} from '@/types/brand-product';
import
{
    AlertTriangle,
    ArrowLeft,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    Heart,
    Package,
    ShoppingCart,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface BrandProductDetailProps
{
    brandId: string;
    productId: string;
}

const getStatusColor = (publicationStatus: ProductPublicationStatus) =>
{
    switch (publicationStatus)
    {
        case ProductPublicationStatus.Active:
            return 'bg-[#D78E59] text-[#171717]';
        case ProductPublicationStatus.Draft:
            return 'bg-[#575757] text-[#EDECF8]';
        case ProductPublicationStatus.Inactive:
            return 'bg-red-900 text-red-200';
        default:
            return 'bg-[#202020] text-[#828288]';
    }
};

const getStatusText = (publicationStatus: ProductPublicationStatus) =>
{
    switch (publicationStatus)
    {
        case ProductPublicationStatus.Active:
            return 'Active';
        case ProductPublicationStatus.Draft:
            return 'Draft';
        case ProductPublicationStatus.Inactive:
            return 'Inactive';
        default:
            return 'Unknown';
    }
};

const getLifecycleText = (lifecycleStatus: ProductLifecycleStatus) =>
{
    switch (lifecycleStatus)
    {
        case ProductLifecycleStatus.Regular:
            return 'Regular';
        case ProductLifecycleStatus.ComingSoon:
            return 'Coming Soon';
        case ProductLifecycleStatus.Discontinued:
            return 'Discontinued';
        default:
            return 'Unknown';
    }
};

export default function BrandProductDetail({ brandId, productId }: BrandProductDetailProps)
{
    const router = useRouter();
    const { data: product, isLoading, error } = useBrandProduct(brandId, productId);
    const deleteProduct = useDeleteBrandProduct(brandId);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDeleteProduct = async () =>
    {
        try
        {
            await deleteProduct.mutateAsync(productId);
            router.push('/brand-management/products');
        } catch (error)
        {
            console.error('Failed to delete product:', error);
        }
    };

    if (isLoading)
    {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-[#202020] rounded w-1/3"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="aspect-square bg-[#202020] rounded-xl"></div>
                            <div className="grid grid-cols-4 gap-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="aspect-square bg-[#202020] rounded-lg"></div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="h-8 bg-[#202020] rounded w-3/4"></div>
                            <div className="h-4 bg-[#202020] rounded w-1/2"></div>
                            <div className="h-32 bg-[#202020] rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product)
    {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-[#575757] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#EDECF8] mb-2">Product Not Found</h3>
                    <p className="text-[#828288] mb-6">
                        The product you're looking for doesn't exist or has been removed.
                    </p>
                    <Button
                        onClick={() => router.push('/brand-management/products')}
                        className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                    >
                        Back to Products
                    </Button>
                </div>
            </div>
        );
    }

    const isLowStock = product.totalStock <= product.lowStockThreshold;
    const stockPercentage = product.lowStockThreshold > 0
        ? (product.totalStock / product.lowStockThreshold) * 100
        : 100;

    return (
        <div className="p-6 max-w-7xl mx-auto relative z-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/brand-management/products')}
                        className="text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] relative z-10"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Products
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-[#EDECF8]">{product.name}</h1>
                        <p className="text-[#828288] mt-1">{product.category} • {product.sku}</p>
                    </div>
                </div>
                <div className="flex gap-3 relative z-10">
                    <Link href={`/brand-management/products/${productId}/edit`}>
                        <Button className="bg-[#575757] hover:bg-[#828288] text-[#EDECF8]">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Product
                        </Button>
                    </Link>
                    <Button
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images Section */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative aspect-square bg-[#202020] rounded-xl overflow-hidden border border-[#575757]">
                        <img
                            src={product.images[currentImageIndex]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            style={{
                                backgroundColor: '#202020',
                                backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3e%3cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23575757' stroke-width='0.5'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100' height='100' fill='url(%23grid)'/%3e%3c/svg%3e")`,
                            }}
                        />

                        {/* Navigation */}
                        {product.images.length > 1 && (
                            <>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setCurrentImageIndex(prev =>
                                        prev > 0 ? prev - 1 : product.images.length - 1
                                    )}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                                >
                                    <ChevronLeft size={20} />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setCurrentImageIndex(prev =>
                                        prev < product.images.length - 1 ? prev + 1 : 0
                                    )}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                                >
                                    <ChevronRight size={20} />
                                </Button>
                            </>
                        )}

                        {/* Status Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <Badge className={getStatusColor(product.publicationStatus)}>
                                {getStatusText(product.publicationStatus)}
                            </Badge>
                            {product.lifecycleStatus !== ProductLifecycleStatus.Regular && (
                                <Badge className="bg-[#202020] text-[#828288] border border-[#575757]">
                                    {getLifecycleText(product.lifecycleStatus)}
                                </Badge>
                            )}
                        </div>

                        {/* Low Stock Warning */}
                        {isLowStock && (
                            <Badge className="absolute top-4 right-4 bg-[#575757] text-[#FFAA6C]">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Low Stock
                            </Badge>
                        )}
                    </div>

                    {/* Thumbnail Images */}
                    {product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-3">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === index
                                            ? 'border-[#D78E59]'
                                            : 'border-[#575757] hover:border-[#828288]'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        style={{
                                            backgroundColor: '#202020',
                                            backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3e%3cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23575757' stroke-width='0.5'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100' height='100' fill='url(%23grid)'/%3e%3c/svg%3e")`,
                                        }}
                                    />
                                    {index === 0 && (
                                        <div className="absolute inset-0 bg-black/20 flex items-end p-1">
                                            <Badge className="bg-[#D78E59] text-[#171717] text-xs">
                                                Primary
                                            </Badge>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    {/* Price & Stock */}
                    <Card className="bg-[#090909] border-[#202020]">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-3xl font-bold text-[#EDECF8]">${product.basePrice}</span>
                                <div className="text-right">
                                    <p className="text-sm text-[#828288]">Stock Level</p>
                                    <p className="text-xl font-semibold text-[#EDECF8]">{product.totalStock}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#828288]">Stock Progress</span>
                                    <span className="text-[#575757]">
                                        {product.totalStock} / {product.lowStockThreshold} (threshold)
                                    </span>
                                </div>
                                <Progress
                                    value={Math.min(stockPercentage, 100)}
                                    className="h-2"
                                />
                                {isLowStock && (
                                    <p className="text-[#FFAA6C] text-sm flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Running low on stock
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Performance Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#202020] rounded-lg flex items-center justify-center">
                                        <Eye className="w-5 h-5 text-[#FFAA6C]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#828288]">Views</p>
                                        <p className="text-xl font-bold text-[#EDECF8]">{product.viewCount.toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#090909] border-[#202020]">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#202020] rounded-lg flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-[#D78E59]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#828288]">Creator Interest</p>
                                        <p className="text-xl font-bold text-[#EDECF8]">{product.creatorInterest}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card className="bg-[#090909] border-[#202020]">
                        <CardHeader>
                            <CardTitle className="text-[#EDECF8]">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link href={`/brand-management/products/${productId}/edit`}>
                                <Button variant="outline" className="w-full border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] relative z-10">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Product Details
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="w-full border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] relative z-10"
                                disabled
                            >
                                <BarChart3 className="w-4 h-4 mr-2" />
                                View Analytics
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] relative z-10"
                                disabled
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Manage Retailers
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Product Details Summary */}
                    <Card className="bg-[#090909] border-[#202020]">
                        <CardHeader>
                            <CardTitle className="text-[#EDECF8]">Product Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-[#828288]">Category</p>
                                    <p className="text-[#EDECF8]">{product.category}</p>
                                </div>
                                {product.subcategory && (
                                    <div>
                                        <p className="text-[#828288]">Subcategory</p>
                                        <p className="text-[#EDECF8]">{product.subcategory}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-[#828288]">SKU</p>
                                    <p className="text-[#EDECF8] font-mono">{product.sku}</p>
                                </div>
                                {product.size && (
                                    <div>
                                        <p className="text-[#828288]">Size</p>
                                        <p className="text-[#EDECF8]">{product.size}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-[#828288]">Created</p>
                                    <p className="text-[#EDECF8]">
                                        {new Date(product.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[#828288]">Updated</p>
                                    <p className="text-[#EDECF8]">
                                        {new Date(product.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Detailed Information Tabs */}
            <div className="mt-12 relative z-10">
                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="bg-[#090909] border border-[#202020] relative z-10">
                        <TabsTrigger value="details" className="relative z-10">Product Details</TabsTrigger>
                        <TabsTrigger value="ingredients" className="relative z-10">Ingredients</TabsTrigger>
                        <TabsTrigger value="usage" className="relative z-10">How to Use</TabsTrigger>
                        <TabsTrigger value="retailers" className="relative z-10">Retailers</TabsTrigger>
                        <TabsTrigger value="seo" className="relative z-10">SEO & Marketing</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="mt-6 relative z-10">
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Description</h3>
                                        <p className="text-[#828288] leading-relaxed">{product.description}</p>
                                        {product.shortDescription && (
                                            <>
                                                <h4 className="text-md font-semibold text-[#EDECF8] mt-4 mb-2">Short Description</h4>
                                                <p className="text-[#828288]">{product.shortDescription}</p>
                                            </>
                                        )}
                                    </div>

                                    {/* Physical Properties */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {product.size && (
                                            <div>
                                                <h4 className="text-md font-semibold text-[#EDECF8] mb-2">Size</h4>
                                                <p className="text-[#828288]">{product.size}</p>
                                            </div>
                                        )}
                                        {product.weight && (
                                            <div>
                                                <h4 className="text-md font-semibold text-[#EDECF8] mb-2">Weight</h4>
                                                <p className="text-[#828288]">{product.weight}</p>
                                            </div>
                                        )}
                                        {product.dimensions && (
                                            <div>
                                                <h4 className="text-md font-semibold text-[#EDECF8] mb-2">Dimensions</h4>
                                                <p className="text-[#828288]">
                                                    {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <h4 className="text-md font-semibold text-[#EDECF8] mb-3">Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {product.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="bg-[#202020] text-[#828288]">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Skin Types */}
                                    {product.skinType && product.skinType.length > 0 && (
                                        <div>
                                            <h4 className="text-md font-semibold text-[#EDECF8] mb-3">Suitable for</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {product.skinType.map(type => (
                                                    <Badge key={type} variant="outline" className="border-[#575757] text-[#EDECF8]">
                                                        {type}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="ingredients" className="mt-6 relative z-10">
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {product.keyIngredients.map((ingredient, index) => (
                                        <div key={index} className="border border-[#575757] rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="text-lg font-semibold text-[#EDECF8]">{ingredient.name}</h4>
                                                {ingredient.percentage && (
                                                    <Badge className="bg-[#D78E59] text-[#171717]">
                                                        {ingredient.percentage}%
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-[#828288]">{ingredient.benefit}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="usage" className="mt-6 relative z-10">
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardContent className="p-6">
                                <ol className="space-y-4">
                                    {product.howToUse.map((step, index) => (
                                        <li key={index} className="flex gap-4">
                                            <span className="flex-shrink-0 w-8 h-8 bg-[#D78E59] text-[#171717] rounded-full flex items-center justify-center text-sm font-semibold">
                                                {index + 1}
                                            </span>
                                            <p className="text-[#828288] pt-1">{step}</p>
                                        </li>
                                    ))}
                                </ol>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="retailers" className="mt-6 relative z-10">
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardContent className="p-6">
                                {product.retailers.length > 0 ? (
                                    <div className="space-y-4">
                                        {product.retailers.map((retailer) => (
                                            <div key={retailer.id} className="border border-[#575757] rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-lg font-semibold text-[#EDECF8]">{retailer.name}</h4>
                                                    <Badge
                                                        className={
                                                            retailer.status === 'approved'
                                                                ? "bg-[#D78E59] text-[#171717]"
                                                                : retailer.status === 'pending'
                                                                    ? "bg-[#575757] text-[#EDECF8]"
                                                                    : "bg-red-900 text-red-200"
                                                        }
                                                    >
                                                        {retailer.status}
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-[#828288]">Price</p>
                                                        <p className="text-[#EDECF8] font-semibold">${retailer.price}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[#828288]">Stock</p>
                                                        <p className="text-[#EDECF8]">
                                                            {retailer.inStock ? `${retailer.stockCount || 'Available'}` : 'Out of Stock'}
                                                        </p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        {retailer.url && (
                                                            <Link
                                                                href={retailer.url}
                                                                target="_blank"
                                                                className="text-[#D78E59] hover:text-[#FFAA6C] text-sm relative z-10"
                                                            >
                                                                View on retailer site →
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <ShoppingCart className="w-12 h-12 text-[#575757] mx-auto mb-4" />
                                        <p className="text-[#828288]">No retailers assigned yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="seo" className="mt-6 relative z-10">
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {product.seoTitle && (
                                        <div>
                                            <h4 className="text-md font-semibold text-[#EDECF8] mb-2">SEO Title</h4>
                                            <p className="text-[#828288]">{product.seoTitle}</p>
                                        </div>
                                    )}

                                    {product.seoDescription && (
                                        <div>
                                            <h4 className="text-md font-semibold text-[#EDECF8] mb-2">SEO Description</h4>
                                            <p className="text-[#828288]">{product.seoDescription}</p>
                                        </div>
                                    )}

                                    {product.marketingCopy && (
                                        <div>
                                            <h4 className="text-md font-semibold text-[#EDECF8] mb-2">Marketing Copy</h4>
                                            <p className="text-[#828288]">{product.marketingCopy}</p>
                                        </div>
                                    )}

                                    {!product.seoTitle && !product.seoDescription && !product.marketingCopy && (
                                        <div className="text-center py-8">
                                            <p className="text-[#575757]">No SEO or marketing content added yet</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="bg-[#171717] border-[#575757] relative z-50">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[#EDECF8]">Delete Product</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#828288]">
                            Are you sure you want to delete "{product.name}"? This action cannot be undone and will remove all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-[#575757] text-[#828288] hover:bg-[#202020] relative z-10">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteProduct}
                            disabled={deleteProduct.isPending}
                            className="bg-red-600 hover:bg-red-700 text-white relative z-10"
                        >
                            {deleteProduct.isPending ? 'Deleting...' : 'Delete Product'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}