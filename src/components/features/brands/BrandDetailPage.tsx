// components/brands/BrandDetailPage.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useBrand } from '@/hooks/brand-hooks';
import
{
    Award,
    Calendar,
    CheckCircle,
    Edit,
    Facebook,
    Globe,
    Instagram,
    Mail,
    MapPin,
    Package,
    Phone,
    Shield,
    Star,
    TrendingUp,
    Twitter,
    Users
} from 'lucide-react';
// import { useSession } from 'next-auth/react'; // Removed auth
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BrandDetailPageProps
{
    brandId: string;
}

export default function BrandDetailPage({ brandId }: BrandDetailPageProps)
{
    const { data: brand, isLoading, error } = useBrand(brandId);
    const { data: session } = useSession();
    const router = useRouter();

    const isOwner = session?.user_info?.user_id === brand?.ownerId;

    const handleViewProducts = () =>
    {
        router.push(`/products?brands=${encodeURIComponent(brand?.name || '')}`);
    };

    const handleEdit = () =>
    {
        router.push(`/brands/${brandId}/edit`);
    };

    if (isLoading)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-64 bg-[#202020] rounded-xl mb-8"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="h-8 bg-[#202020] rounded w-1/2"></div>
                                <div className="h-4 bg-[#202020] rounded w-3/4"></div>
                                <div className="h-32 bg-[#202020] rounded"></div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-6 bg-[#202020] rounded w-1/3"></div>
                                <div className="h-48 bg-[#202020] rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !brand)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-[#EDECF8] mb-4">Brand Not Found</h1>
                    <p className="text-[#828288] mb-6">The brand you're looking for doesn't exist or has been removed.</p>
                    <Button onClick={() => router.push('/brands')} className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]">
                        Back to Brands
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Cover Image */}
                <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden mb-8 bg-gradient-to-r from-[#202020] to-[#575757]">
                    <img
                        src={brand.coverImage}
                        alt={brand.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Brand Info Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-end gap-6">
                            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden bg-[#202020] border-4 border-white flex-shrink-0">
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl lg:text-4xl font-bold text-white">{brand.name}</h1>
                                    {brand.isVerified && (
                                        <CheckCircle className="w-8 h-8 text-[#D78E59]" />
                                    )}
                                    {brand.isPartner && (
                                        <Shield className="w-8 h-8 text-[#FFAA6C]" />
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-white/90 mb-2">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-5 h-5" />
                                        {brand.location.city}, {brand.location.country}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-5 h-5 fill-[#FFAA6C] text-[#FFAA6C]" />
                                        {brand.rating} ({brand.reviewCount} reviews)
                                    </div>
                                </div>
                                <Badge className="bg-white/20 text-white border-white/30">
                                    {brand.category}
                                </Badge>
                            </div>
                            {isOwner && (
                                <Button
                                    onClick={handleEdit}
                                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Brand
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">About {brand.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-[#828288] leading-relaxed mb-6">
                                    {brand.description}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {brand.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="outline"
                                            className="border-[#575757] text-[#828288]"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Statistics */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center w-12 h-12 bg-[#202020] rounded-xl mb-3 mx-auto">
                                            <Package className="w-6 h-6 text-[#D78E59]" />
                                        </div>
                                        <div className="text-2xl font-bold text-[#EDECF8] mb-1">{brand.productsCount}</div>
                                        <div className="text-sm text-[#828288]">Products</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center w-12 h-12 bg-[#202020] rounded-xl mb-3 mx-auto">
                                            <TrendingUp className="w-6 h-6 text-[#FFAA6C]" />
                                        </div>
                                        <div className="text-2xl font-bold text-[#EDECF8] mb-1">{brand.collaborationsCount}</div>
                                        <div className="text-sm text-[#828288]">Collaborations</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center w-12 h-12 bg-[#202020] rounded-xl mb-3 mx-auto">
                                            <Star className="w-6 h-6 text-[#FFAA6C]" />
                                        </div>
                                        <div className="text-2xl font-bold text-[#EDECF8] mb-1">{brand.rating}</div>
                                        <div className="text-sm text-[#828288]">Rating</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center w-12 h-12 bg-[#202020] rounded-xl mb-3 mx-auto">
                                            <Users className="w-6 h-6 text-[#575757]" />
                                        </div>
                                        <div className="text-2xl font-bold text-[#EDECF8] mb-1">{brand.reviewCount}</div>
                                        <div className="text-sm text-[#828288]">Reviews</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Policies */}
                        {(brand.policies.shipping || brand.policies.returns || brand.policies.privacy) && (
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8]">Policies</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {brand.policies.shipping && (
                                        <div>
                                            <h4 className="font-semibold text-[#EDECF8] mb-2">Shipping Policy</h4>
                                            <p className="text-[#828288] text-sm">{brand.policies.shipping}</p>
                                        </div>
                                    )}
                                    {brand.policies.returns && (
                                        <div>
                                            <h4 className="font-semibold text-[#EDECF8] mb-2">Returns Policy</h4>
                                            <p className="text-[#828288] text-sm">{brand.policies.returns}</p>
                                        </div>
                                    )}
                                    {brand.policies.privacy && (
                                        <div>
                                            <h4 className="font-semibold text-[#EDECF8] mb-2">Privacy Policy</h4>
                                            <p className="text-[#828288] text-sm">{brand.policies.privacy}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Actions */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardContent className="p-6">
                                <Button
                                    onClick={handleViewProducts}
                                    className="w-full bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] mb-3"
                                >
                                    <Package className="w-4 h-4 mr-2" />
                                    View Products
                                </Button>
                                {brand.website && (
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                    >
                                        <Link href={brand.website} target="_blank" rel="noopener noreferrer">
                                            <Globe className="w-4 h-4 mr-2" />
                                            Visit Website
                                        </Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Company Info */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Company Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-[#575757]" />
                                    <div>
                                        <div className="text-sm text-[#828288]">Founded</div>
                                        <div className="text-[#EDECF8]">{brand.founded}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-[#575757]" />
                                    <div>
                                        <div className="text-sm text-[#828288]">Team Size</div>
                                        <div className="text-[#EDECF8]">{brand.employeeCount} employees</div>
                                    </div>
                                </div>
                                {brand.revenue && (
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="w-5 h-5 text-[#575757]" />
                                        <div>
                                            <div className="text-sm text-[#828288]">Revenue</div>
                                            <div className="text-[#EDECF8]">{brand.revenue}</div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-[#575757]" />
                                    <div>
                                        <div className="text-sm text-[#828288]">Location</div>
                                        <div className="text-[#EDECF8]">
                                            {brand.location.address || `${brand.location.city}, ${brand.location.country}`}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-[#575757]" />
                                    <div>
                                        <div className="text-sm text-[#828288]">Email</div>
                                        <Link
                                            href={`mailto:${brand.email}`}
                                            className="text-[#D78E59] hover:text-[#FFAA6C] transition-colors"
                                        >
                                            {brand.email}
                                        </Link>
                                    </div>
                                </div>
                                {brand.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-[#575757]" />
                                        <div>
                                            <div className="text-sm text-[#828288]">Phone</div>
                                            <Link
                                                href={`tel:${brand.phone}`}
                                                className="text-[#D78E59] hover:text-[#FFAA6C] transition-colors"
                                            >
                                                {brand.phone}
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Contact Person */}
                                <Separator className="bg-[#575757]" />
                                <div>
                                    <h4 className="font-semibold text-[#EDECF8] mb-2">Contact Person</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-4 h-4 text-[#575757]" />
                                            <div>
                                                <div className="text-[#EDECF8] font-medium">{brand.contactPerson.name}</div>
                                                <div className="text-sm text-[#828288]">{brand.contactPerson.position}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-4 h-4 text-[#575757]" />
                                            <Link
                                                href={`mailto:${brand.contactPerson.email}`}
                                                className="text-[#D78E59] hover:text-[#FFAA6C] transition-colors text-sm"
                                            >
                                                {brand.contactPerson.email}
                                            </Link>
                                        </div>
                                        {brand.contactPerson.phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-[#575757]" />
                                                <Link
                                                    href={`tel:${brand.contactPerson.phone}`}
                                                    className="text-[#D78E59] hover:text-[#FFAA6C] transition-colors text-sm"
                                                >
                                                    {brand.contactPerson.phone}
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Media */}
                        {Object.values(brand.socialMedia).some(Boolean) && (
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8]">Follow Us</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-3">
                                        {brand.socialMedia.instagram && (
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                            >
                                                <Link href={`https://instagram.com/${brand.socialMedia.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                                                    <Instagram className="w-4 h-4 mr-2" />
                                                    Instagram
                                                </Link>
                                            </Button>
                                        )}
                                        {brand.socialMedia.facebook && (
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                            >
                                                <Link href={`https://facebook.com/${brand.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer">
                                                    <Facebook className="w-4 h-4 mr-2" />
                                                    Facebook
                                                </Link>
                                            </Button>
                                        )}
                                        {brand.socialMedia.twitter && (
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                            >
                                                <Link href={`https://twitter.com/${brand.socialMedia.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                                                    <Twitter className="w-4 h-4 mr-2" />
                                                    Twitter
                                                </Link>
                                            </Button>
                                        )}
                                        {brand.socialMedia.tiktok && (
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                            >
                                                <Link href={`https://tiktok.com/${brand.socialMedia.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                                                    <Award className="w-4 h-4 mr-2" />
                                                    TikTok
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}