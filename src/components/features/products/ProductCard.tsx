// app/components/products/ProductCard.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ProductCatalogDomainDTOsProductListDto } from '@/gen/api/types';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface ProductCardProps
{
    product: ProductCatalogDomainDTOsProductListDto;
    viewMode: 'grid' | 'list';
    isFavorite: boolean;
    onToggleFavorite: () => void;
    enableCommerce?: boolean;
}

export function ProductCard({ product, viewMode, isFavorite, onToggleFavorite, enableCommerce = true }: ProductCardProps)
{
    const handleAddToCart = (e: React.MouseEvent) =>
    {
        e.preventDefault();
        toast.success(`Added ${product.name} to cart`);
    };

    const handleToggleFavorite = (e: React.MouseEvent) =>
    {
        e.preventDefault();
        onToggleFavorite();
    };

    return (
        <div
            className={`group relative bg-[#090909] rounded-xl border border-[#202020] hover:border-[#575757] transition-all duration-300 overflow-hidden ${viewMode === 'list' ? 'flex' : ''
                }`}
        >
            {/* Image */}
            <Link href={`/products/${product.id}`} className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}>
                <div className={`relative ${viewMode === 'list' ? 'h-full' : 'aspect-square'} bg-[#202020] overflow-hidden`}>
                    {product.primary_image ? (
                        <img
                            src={product.primary_image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#575757]">
                            No image available
                        </div>
                    )}
                    {!product.is_available && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-[#EDECF8] font-semibold">Unavailable</span>
                        </div>
                    )}
                    {/* Publication Status Badge */}
                    <Badge className={`absolute top-2 left-2 ${product.publication_status === 'active' ? 'bg-[#4ade80] text-[#171717]' : 'bg-[#ef4444] text-white'}`}>
                        {product.publication_status}
                    </Badge>
                </div>
            </Link>

            {/* Content */}
            <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                    <Link href={`/products/${product.id}`} className="flex-1">
                        <h3 className="font-semibold text-[#EDECF8] hover:text-[#D78E59] transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                    </Link>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleToggleFavorite}
                        className="ml-2 hover:bg-[#202020]"
                    >
                        <Heart
                            size={18}
                            className={isFavorite ? 'fill-[#D78E59] text-[#D78E59]' : 'text-[#575757]'}
                        />
                    </Button>
                </div>

                {/* SKU and Short Description */}
                <div className="mb-2">
                    <Badge variant="secondary" className="bg-[#202020] text-[#828288] text-xs mb-1">
                        SKU: {product.sku}
                    </Badge>
                    {product.short_description && (
                        <p className="text-[#575757] text-sm line-clamp-2">{product.short_description}</p>
                    )}
                </div>

                {/* Categories */}
                {product.primary_category && product.primary_category.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {product.primary_category.slice(0, 2).map((category, index) => (
                            <Badge key={index} variant="secondary" className="bg-[#202020] text-[#828288] text-xs">
                                {category}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Availability Status */}
                <div className="flex items-center gap-2 mb-3">
                    <Badge variant={product.is_available ? "default" : "destructive"} className="text-xs">
                        {product.is_available ? 'Available' : 'Unavailable'}
                    </Badge>
                    <span className="text-[#575757] text-xs">
                        Updated: {new Date(product.updated_at).toLocaleDateString()}
                    </span>
                </div>

                {/* Price functionality removed as per project requirements */}
                
                {/* Action Button */}
                {enableCommerce && (
                    <div className={`${viewMode === 'list' ? 'mt-auto' : ''} flex justify-end`}>
                        <Button
                            size="sm"
                            disabled={!product.is_available}
                            onClick={handleAddToCart}
                            className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                        >
                            <ShoppingBag size={16} className="mr-1" />
                            Learn More
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}