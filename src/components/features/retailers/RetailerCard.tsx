// components/retailers/RetailerCard.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Retailer } from '@/types/retailer';
import
{
    CheckCircle,
    Clock,
    ExternalLink,
    MapPin,
    Package,
    Shield,
    ShoppingBag,
    Star,
    Store
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface RetailerCardProps
{
    retailer: Retailer;
    viewMode?: 'grid' | 'list';
}

export function RetailerCard({ retailer, viewMode = 'grid' }: RetailerCardProps)
{
    const router = useRouter();

    const handleViewProducts = (e: React.MouseEvent) =>
    {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/products?retailers=${encodeURIComponent(retailer.name)}`);
    };

    const getTypeIcon = (type: string) =>
    {
        switch (type)
        {
            case 'online':
                return <ShoppingBag className="w-4 h-4" />;
            case 'physical':
                return <Store className="w-4 h-4" />;
            case 'hybrid':
                return <Package className="w-4 h-4" />;
            default:
                return <Store className="w-4 h-4" />;
        }
    };

    const getTypeLabel = (type: string) =>
    {
        switch (type)
        {
            case 'online':
                return 'Online Store';
            case 'physical':
                return 'Physical Store';
            case 'hybrid':
                return 'Hybrid Store';
            default:
                return 'Store';
        }
    };

    const isOpenNow = () =>
    {
        if (!retailer.operatingHours || retailer.type === 'online') return null;

        const now = new Date();
        const dayName = now.toLocaleString().toLocaleLowerCase().substring(0, 3) +
            ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()].substring(3);
        const hours = retailer.operatingHours[dayName];

        if (!hours || hours.closed) return false;

        const currentTime = now.getHours() * 100 + now.getMinutes();
        const openTime = hours.open ? parseInt(hours.open?.replace(':', '')) : undefined;
        const closeTime = hours.close ? parseInt(hours.close?.replace(':', '')) : undefined;

        return openTime && closeTime ? currentTime >= openTime && currentTime <= closeTime : false;
    };

    const isOpen = isOpenNow();

    if (viewMode === 'list')
    {
        return (
            <Link href={`/retailers/${retailer.id}`}>
                <div className="bg-[#090909] border border-[#202020] rounded-xl p-6 hover:border-[#575757] transition-all duration-300 hover:shadow-lg group">
                    <div className="flex gap-6">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#202020] border border-[#575757]">
                                <img
                                    src={retailer.logo}
                                    alt={retailer.name}
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
                                            {retailer.name}
                                        </h3>
                                        {retailer.isVerified && (
                                            <CheckCircle className="w-5 h-5 text-[#D78E59]" />
                                        )}
                                        {retailer.isPartner && (
                                            <Shield className="w-5 h-5 text-[#FFAA6C]" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-[#828288] mb-2">
                                        <div className="flex items-center gap-1">
                                            {getTypeIcon(retailer.type)}
                                            {getTypeLabel(retailer.type)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {retailer.locations[0]?.city}, {retailer.locations[0]?.country}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-[#FFAA6C] text-[#FFAA6C]" />
                                            {retailer.rating} ({retailer.reviewCount})
                                        </div>
                                        {isOpen !== null && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span className={isOpen ? 'text-green-400' : 'text-red-400'}>
                                                    {isOpen ? 'Open' : 'Closed'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    {retailer.categories.slice(0, 2).map((category) => (
                                        <Badge
                                            key={category}
                                            variant="secondary"
                                            className="bg-[#202020] text-[#828288] border-[#575757] text-xs"
                                        >
                                            {category}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <p className="text-[#828288] mb-4 line-clamp-2">
                                {retailer.description}
                            </p>

                            <div className="flex items-center gap-6 text-sm text-[#575757] mb-4">
                                <div className="flex items-center gap-1">
                                    <Package className="w-4 h-4" />
                                    {retailer.productsCount} products
                                </div>
                                <div className="flex items-center gap-1">
                                    <ShoppingBag className="w-4 h-4" />
                                    {retailer.brandsCount} brands
                                </div>
                                <div className="flex items-center gap-1">
                                    <Store className="w-4 h-4" />
                                    {retailer.locations.length} location{retailer.locations.length !== 1 ? 's' : ''}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                    {retailer.tags.slice(0, 3).map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="outline"
                                            className="text-xs border-[#575757] text-[#828288]"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                    {retailer.tags.length > 3 && (
                                        <Badge
                                            variant="outline"
                                            className="text-xs border-[#575757] text-[#828288]"
                                        >
                                            +{retailer.tags.length - 3}
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
        <Link href={`/retailers/${retailer.id}`}>
            <div className="bg-[#090909] border border-[#202020] rounded-xl overflow-hidden hover:border-[#575757] transition-all duration-300 hover:shadow-lg group">
                {/* Cover Image */}
                <div className="relative h-32 bg-gradient-to-r from-[#202020] to-[#575757] overflow-hidden">
                    <img
                        src={retailer.coverImage}
                        alt={retailer.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex gap-2">
                        {retailer.isVerified && (
                            <div className="bg-[#D78E59] text-[#171717] p-1 rounded-full">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                        )}
                        {retailer.isPartner && (
                            <div className="bg-[#FFAA6C] text-[#171717] p-1 rounded-full">
                                <Shield className="w-4 h-4" />
                            </div>
                        )}
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3">
                        <Badge className="bg-black/50 text-[#EDECF8] border-[#575757]">
                            <div className="flex items-center gap-1">
                                {getTypeIcon(retailer.type)}
                                {getTypeLabel(retailer.type)}
                            </div>
                        </Badge>
                    </div>
                </div>

                <div className="p-6">
                    {/* Logo and Header */}
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#202020] border border-[#575757] flex-shrink-0">
                            <img
                                src={retailer.logo}
                                alt={retailer.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-[#EDECF8] group-hover:text-[#D78E59] transition-colors mb-1 truncate">
                                {retailer.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-[#828288] mb-2">
                                <MapPin className="w-4 h-4" />
                                {retailer.locations[0]?.city}
                                {retailer.locations.length > 1 && (
                                    <span className="text-xs">+{retailer.locations.length - 1}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-[#FFAA6C] text-[#FFAA6C]" />
                                    <span className="text-sm text-[#828288]">
                                        {retailer.rating} ({retailer.reviewCount})
                                    </span>
                                </div>
                                {isOpen !== null && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span className={`text-xs ${isOpen ? 'text-green-400' : 'text-red-400'}`}>
                                            {isOpen ? 'Open' : 'Closed'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1 mb-3">
                        {retailer.categories.slice(0, 2).map((category) => (
                            <Badge
                                key={category}
                                variant="secondary"
                                className="bg-[#202020] text-[#828288] border-[#575757] text-xs"
                            >
                                {category}
                            </Badge>
                        ))}
                        {retailer.categories.length > 2 && (
                            <Badge
                                variant="secondary"
                                className="bg-[#202020] text-[#828288] border-[#575757] text-xs"
                            >
                                +{retailer.categories.length - 2}
                            </Badge>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-[#828288] text-sm mb-4 line-clamp-2">
                        {retailer.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-[#575757] mb-4">
                        <div className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {retailer.productsCount}
                        </div>
                        <div className="flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3" />
                            {retailer.brandsCount}
                        </div>
                        <div className="flex items-center gap-1">
                            <Store className="w-3 h-3" />
                            {retailer.locations.length}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                        {retailer.tags.slice(0, 2).map((tag) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs border-[#575757] text-[#575757]"
                            >
                                {tag}
                            </Badge>
                        ))}
                        {retailer.tags.length > 2 && (
                            <Badge
                                variant="outline"
                                className="text-xs border-[#575757] text-[#575757]"
                            >
                                +{retailer.tags.length - 2}
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