// components/brands/BrandCard.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brand } from '@/types/brand';
import
{
    CheckCircle,
    ExternalLink,
    MapPin,
    Package,
    Shield,
    Star,
    TrendingUp,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BrandCardProps
{
    brand: Brand;
    viewMode?: 'grid' | 'list';
}

export function BrandCard({ brand, viewMode = 'grid' }: BrandCardProps)
{
    const router = useRouter();

    const handleViewProducts = (e: React.MouseEvent) =>
    {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/products?brands=${encodeURIComponent(brand.name)}`);
    };

    if (viewMode === 'list')
    {
        return (
            <Link href={`/brands/${brand.id}`}>
                <div className="bg-[#090909] border border-[#202020] rounded-xl p-6 hover:border-[#575757] transition-all duration-300 hover:shadow-lg group">
                    <div className="flex gap-6">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#202020] border border-[#575757]">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-[#EDECF8] group-hover:text-[#D78E59] transition-colors">
                                            {brand.name}
                                        </h3>
                                        {brand.isVerified && (
                                            <CheckCircle className="w-5 h-5 text-[#D78E59]" />
                                        )}
                                        {brand.isPartner && (
                                            <Shield className="w-5 h-5 text-[#FFAA6C]" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-[#828288] mb-2">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {brand.location.city}, {brand.location.country}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-[#FFAA6C] text-[#FFAA6C]" />
                                            {brand.rating} ({brand.reviewCount})
                                        </div>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="bg-[#202020] text-[#828288] border-[#575757]">
                                    {brand.category}
                                </Badge>
                            </div>

                            <p className="text-[#828288] mb-4 line-clamp-2">
                                {brand.description}
                            </p>

                            <div className="flex items-center gap-6 text-sm text-[#575757] mb-4">
                                <div className="flex items-center gap-1">
                                    <Package className="w-4 h-4" />
                                    {brand.productsCount} products
                                </div>
                                <div className="flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    {brand.collaborationsCount} collaborations
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    Founded {brand.founded}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                    {brand.tags.slice(0, 3).map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="outline"
                                            className="text-xs border-[#575757] text-[#828288]"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                    {brand.tags.length > 3 && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs border-[#575757] text-[#828288]"
                                        >
                                            +{brand.tags.length - 3}
                                        </Badge>
                                    )}
                                </div>
                                <Button
                                    size="sm"
                                    onClick={handleViewProducts}
                                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                >
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    View Products
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/brands/${brand.id}`}>
            <div className="bg-[#090909] border border-[#202020] rounded-xl overflow-hidden hover:border-[#575757] transition-all duration-300 hover:shadow-lg group">
                {/* Cover Image */}
                <div className="relative h-32 bg-gradient-to-r from-[#202020] to-[#575757] overflow-hidden">
                    <img
                        src={brand.coverImage}
                        alt={brand.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex gap-2">
                        {brand.isVerified && (
                            <div className="bg-[#D78E59] text-[#171717] p-1 rounded-full">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                        )}
                        {brand.isPartner && (
                            <div className="bg-[#FFAA6C] text-[#171717] p-1 rounded-full">
                                <Shield className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    {/* Logo and Header */}
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#202020] border border-[#575757] flex-shrink-0">
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-[#EDECF8] group-hover:text-[#D78E59] transition-colors mb-1 truncate">
                                {brand.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-[#828288] mb-2">
                                <MapPin className="w-4 h-4" />
                                {brand.location.city}
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-[#FFAA6C] text-[#FFAA6C]" />
                                <span className="text-sm text-[#828288]">
                                    {brand.rating} ({brand.reviewCount})
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <Badge
                        variant="secondary"
                        className="bg-[#202020] text-[#828288] border-[#575757] mb-3"
                    >
                        {brand.category}
                    </Badge>

                    {/* Description */}
                    <p className="text-[#828288] text-sm mb-4 line-clamp-2">
                        {brand.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-[#575757] mb-4">
                        <div className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {brand.productsCount}
                        </div>
                        <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {brand.collaborationsCount}
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {brand.founded}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                        {brand.tags.slice(0, 2).map((tag) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs border-[#575757] text-[#575757]"
                            >
                                {tag}
                            </Badge>
                        ))}
                        {brand.tags.length > 2 && (
                            <Badge
                                variant="outline"
                                className="text-xs border-[#575757] text-[#575757]"
                            >
                                +{brand.tags.length - 2}
                            </Badge>
                        )}
                    </div>

                    {/* Action Button */}
                    <Button
                        size="sm"
                        onClick={handleViewProducts}
                        className="w-full bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Products
                    </Button>
                </div>
            </div>
        </Link>
    );
}