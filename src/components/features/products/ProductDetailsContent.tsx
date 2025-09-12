// app/products/[id]/ProductDetailsContent.tsx
'use client'

// Removed RelatedProductCard and ReviewCard - features not available in current API
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBrandHooks, useProductHooks, useRetailerHooks } from '@/hooks/api';
import type {
    ProductIngredientDto,
    RetailerProductDto
} from '@/types';
import
{
    Check,
    ChevronLeft, ChevronRight
} from 'lucide-react';
// import { useSession } from 'next-auth/react'; // Removed auth
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState } from 'react';

// Environment variables
const ENABLE_COMMERCE = process.env.NEXT_PUBLIC_ENABLE_COMMERCE !== 'false';
const ENABLE_REVIEWS = process.env.NEXT_PUBLIC_ENABLE_REVIEWS !== 'false';

// Component to fetch and display retailer info
function RetailerInfo({ retailerProduct }: { retailerProduct: RetailerProductDto })
{
    const { data: retailer } = useRetailerHooks().getById({ id: retailerProduct.id });

    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#202020]">
            <div>
                <span className="text-[#EDECF8] font-semibold">
                    {retailer?.display_name || `Retailer ${retailerProduct.id}`}
                </span>
                <p className="text-sm text-[#828288]">Status: {retailerProduct.status}</p>
                {retailer?.description && (
                    <p className="text-xs text-[#575757] line-clamp-1">{retailer.description}</p>
                )}
            </div>
            <div className="text-right">
                <Badge className={`${retailerProduct.is_available ? 'bg-[#4ade80] text-[#171717]' : 'bg-[#ef4444] text-white'}`}>
                    {retailerProduct.is_available ? 'Available' : 'Unavailable'}
                </Badge>
                {retailerProduct.retailer_url && (
                    <a
                        href={retailerProduct.retailer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-[#D78E59] hover:underline mt-1"
                    >
                        View on retailer site
                    </a>
                )}
            </div>
        </div>
    );
}

interface ProductDetailsContentProps
{
    productId: string;
}

export default function ProductDetailsContent({ productId }: ProductDetailsContentProps)
{
    const { data: session } = useSession();
    const { data: product, isLoading, error } = useProductHooks().getById({ productId: productId });

    // Fetch brand details if product is loaded
    const { data: brand } = useBrandHooks().getById({ id: product?.brand_id || '' }, { query: { enabled: !!product?.brand_id } });

    // Note: We'll create a separate component for retailer details to avoid hook rules violation

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const isCreator = session?.user_info?.user_role === 'Creator';

    if (error)
    {
        notFound();
    }

    if (isLoading || !product)
    {
        return null; // The Suspense boundary will show the skeleton
    }

    // Removed CreatorLinkModal - functionality not available in current API

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="text-sm mb-6">
                <ol className="flex items-center space-x-2">
                    <li><Link href="/" className="text-[#828288] hover:text-[#D78E59]">Home</Link></li>
                    <li><span className="text-[#575757]">/</span></li>
                    <li><Link href="/products" className="text-[#828288] hover:text-[#D78E59]">Products</Link></li>
                    <li><span className="text-[#575757]">/</span></li>
                    <li><span className="text-[#EDECF8]">{product.name}</span></li>
                </ol>
            </nav>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Images Section */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative aspect-square bg-[#202020] rounded-xl overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                            <img
                                src={product.images[currentImageIndex] || product.primary_image || ''}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : product.primary_image ? (
                            <img
                                src={product.primary_image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#575757]">
                                No image available
                            </div>
                        )}

                        {/* Image Navigation */}
                        {product.images && product.images.length > 1 && (
                            <>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                                >
                                    <ChevronLeft size={20} />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setCurrentImageIndex(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                                >
                                    <ChevronRight size={20} />
                                </Button>
                            </>
                        )}

                        {/* Availability Badge */}
                        <Badge className={`absolute top-4 right-4 ${product.is_available ? 'bg-[#4ade80] text-[#171717]' : 'bg-[#ef4444] text-white'}`}>
                            {product.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                    </div>

                    {/* Thumbnail Images */}
                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-3 gap-4">
                            {product.images.map((image: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === index
                                        ? 'border-[#D78E59]'
                                        : 'border-[#202020] hover:border-[#575757]'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    {/* Brand Info */}
                    {brand ? (
                        <Link href={`/brands/${brand.id}`} className="inline-flex items-center gap-3 group">
                            {brand.logo_storage_path ? (
                                <img
                                    src={brand.logo_storage_path}
                                    alt={brand.display_name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-lg bg-[#202020] flex items-center justify-center">
                                    <span className="text-[#828288] text-sm font-semibold">{brand.display_name?.charAt(0) || 'B'}</span>
                                </div>
                            )}
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[#828288] group-hover:text-[#D78E59] transition-colors">
                                        {brand.display_name}
                                    </span>
                                    {brand.is_verified && (
                                        <Badge variant="secondary" className="bg-[#202020] text-[#D78E59]">
                                            <Check size={12} className="mr-1" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                                {brand.description && (
                                    <p className="text-xs text-[#575757] line-clamp-1">{brand.description}</p>
                                )}
                            </div>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-[#202020] flex items-center justify-center">
                                <span className="text-[#828288] text-sm font-semibold">BR</span>
                            </div>
                            <div>
                                <span className="text-[#828288]">Brand ID: {product.brand_id}</span>
                            </div>
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#EDECF8] mb-3">
                            {product.name}
                        </h1>
                        {product.short_description && (
                            <p className="text-[#828288] mb-3">{product.short_description}</p>
                        )}
                        <div className="flex gap-2 mb-3">
                            <Badge variant="secondary" className="bg-[#202020] text-[#828288]">
                                SKU: {product.sku}
                            </Badge>
                            <Badge variant="secondary" className={`${product.publication_status === 'active' ? 'bg-[#4ade80] text-[#171717]' : 'bg-[#575757] text-[#EDECF8]'}`}>
                                {product.publication_status}
                            </Badge>
                        </div>
                    </div>

                    {/* Retailer Information */}
                    {product.retailers.length > 0 && (
                        <div className="bg-[#090909] rounded-xl p-6 border border-[#202020]">
                            <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Retailer Availability</h3>
                            <div className="space-y-3">
                                {product.retailers.map((retailerProduct: RetailerProductDto) => (
                                    <RetailerInfo key={retailerProduct.id} retailerProduct={retailerProduct} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Commerce features not available in current API */}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {product.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-[#202020] text-[#828288]">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="description" className="mt-12">
                <TabsList className="bg-[#090909] border border-[#202020]">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                    <TabsTrigger value="how-to-use">How to Use</TabsTrigger>
                    <TabsTrigger value="technical">Technical Details</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                    <div className="bg-[#090909] rounded-xl p-6 border border-[#202020]">
                        <p className="text-[#828288] leading-relaxed">{product.description}</p>
                        <div className="mt-4 space-y-2">
                            {product.size && (
                                <div>
                                    <span className="text-[#575757]">Size: </span>
                                    <span className="text-[#EDECF8]">{product.size}</span>
                                </div>
                            )}
                            {product.weight && (
                                <div>
                                    <span className="text-[#575757]">Weight: </span>
                                    <span className="text-[#EDECF8]">{product.weight}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="ingredients" className="mt-6">
                    <div className="bg-[#090909] rounded-xl p-6 border border-[#202020]">
                        <div className="space-y-4">
                            {product.key_ingredients.map((ingredient: ProductIngredientDto, index: number) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#D78E59] mt-2 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-[#EDECF8] font-semibold">{ingredient.name}</h4>
                                        <p className="text-[#828288] text-sm">{ingredient.benefit}</p>
                                        {ingredient.percentage && (
                                            <p className="text-xs text-[#575757]">{ingredient.percentage}%</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="how-to-use" className="mt-6">
                    <div className="bg-[#090909] rounded-xl p-6 border border-[#202020]">
                        <ol className="space-y-3">
                            {product.how_to_use.map((step: string, index: number) => (
                                <li key={index} className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-[#D78E59] text-[#171717] rounded-full flex items-center justify-center text-sm font-semibold">
                                        {index + 1}
                                    </span>
                                    <span className="text-[#828288]">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </TabsContent>

                <TabsContent value="technical" className="mt-6">
                    <div className="bg-[#090909] rounded-xl p-6 border border-[#202020]">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-[#EDECF8] font-semibold mb-3">Product Information</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[#575757]">SKU:</span>
                                        <span className="text-[#EDECF8]">{product.sku}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#575757]">Publication Status:</span>
                                        <span className="text-[#EDECF8]">{product.publication_status}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#575757]">Lifecycle Status:</span>
                                        <span className="text-[#EDECF8]">{product.lifecycle_status}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#575757]">Available:</span>
                                        <span className="text-[#EDECF8]">{product.is_available ? 'Yes' : 'No'}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[#EDECF8] font-semibold mb-3">Specifications</h4>
                                <div className="space-y-2 text-sm">
                                    {product.dimensions && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-[#575757]">Length:</span>
                                                <span className="text-[#EDECF8]">{product.dimensions.length} cm</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[#575757]">Width:</span>
                                                <span className="text-[#EDECF8]">{product.dimensions.width} cm</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[#575757]">Height:</span>
                                                <span className="text-[#EDECF8]">{product.dimensions.height} cm</span>
                                            </div>
                                        </>
                                    )}
                                    {product.skin_types.length > 0 && (
                                        <div>
                                            <span className="text-[#575757]">Skin Types:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {product.skin_types.map((type: string, index: number) => (
                                                    <Badge key={index} variant="secondary" className="bg-[#202020] text-[#828288] text-xs">
                                                        {type}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Reviews, Creators, and Creator Insights features not available in current API */}
            </Tabs>

            {/* Related Products feature not available in current API */}
        </div>
    );
}