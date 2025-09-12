// components/retailers/RetailerDetailPage.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRetailer } from '@/hooks/retailer-hooks';
import
{
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    Edit,
    Facebook,
    Globe,
    Instagram,
    Mail,
    MapPin,
    Package,
    Phone,
    Shield,
    ShoppingBag,
    Star,
    Store,
    Truck,
    Twitter,
    Users
} from 'lucide-react';
// import { useSession } from 'next-auth/react'; // Removed auth
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface RetailerDetailPageProps
{
    retailerId: string;
}

export default function RetailerDetailPage({ retailerId }: RetailerDetailPageProps)
{
    const { data: retailer, isLoading, error } = useRetailer(retailerId);
    const { data: session } = useSession();
    const router = useRouter();

    const isOwner = session?.user_info?.user_id === retailer?.ownerId;

    const handleViewProducts = () =>
    {
        router.push(`/products?retailers=${encodeURIComponent(retailer?.name || '')}`);
    };

    const handleEdit = () =>
    {
        router.push(`/retailers/${retailerId}/edit`);
    };

    const getTypeIcon = (type: string) =>
    {
        switch (type)
        {
            case 'online':
                return <ShoppingBag className="w-5 h-5" />;
            case 'physical':
                return <Store className="w-5 h-5" />;
            case 'hybrid':
                return <Package className="w-5 h-5" />;
            default:
                return <Store className="w-5 h-5" />;
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
        if (!retailer?.operatingHours || retailer.type === 'online') return null;

        const now = new Date(); // toLocaleLowerCase
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

    if (error || !retailer)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-[#EDECF8] mb-4">Retailer Not Found</h1>
                    <p className="text-[#828288] mb-6">The retailer you're looking for doesn't exist or has been removed.</p>
                    <Button onClick={() => router.push('/retailers')} className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]">
                        Back to Retailers
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
                        src={retailer.coverImage}
                        alt={retailer.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Store Type Badge */}
                    <div className="absolute top-6 left-6">
                        <Badge className="bg-black/50 text-white border-white/30">
                            <div className="flex items-center gap-2">
                                {getTypeIcon(retailer.type)}
                                {getTypeLabel(retailer.type)}
                            </div>
                        </Badge>
                    </div>

                    {/* Retailer Info Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-end gap-6">
                            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl overflow-hidden bg-[#202020] border-4 border-white flex-shrink-0">
                                <img
                                    src={retailer.logo}
                                    alt={retailer.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl lg:text-4xl font-bold text-white">{retailer.name}</h1>
                                    {retailer.isVerified && (
                                        <CheckCircle className="w-8 h-8 text-[#D78E59]" />
                                    )}
                                    {retailer.isPartner && (
                                        <Shield className="w-8 h-8 text-[#FFAA6C]" />
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-white/90 mb-2">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-5 h-5" />
                                        {retailer.locations[0]?.city}, {retailer.locations[0]?.country}
                                        {retailer.locations.length > 1 && (
                                            <span className="text-sm">+{retailer.locations.length - 1}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-5 h-5 fill-[#FFAA6C] text-[#FFAA6C]" />
                                        {retailer.rating} ({retailer.reviewCount} reviews)
                                    </div>
                                    {isOpen !== null && (
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-5 h-5" />
                                            <span className={isOpen ? 'text-green-300' : 'text-red-300'}>
                                                {isOpen ? 'Open' : 'Closed'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {retailer.categories.slice(0, 3).map((category) => (
                                        <Badge key={category} className="bg-white/20 text-white border-white/30">
                                            {category}
                                        </Badge>
                                    ))}
                                    {retailer.categories.length > 3 && (
                                        <Badge className="bg-white/20 text-white border-white/30">
                                            +{retailer.categories.length - 3}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            {isOwner && (
                                <Button
                                    onClick={handleEdit}
                                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Store
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
                                <CardTitle className="text-[#EDECF8]">About {retailer.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-[#828288] leading-relaxed mb-6">
                                    {retailer.description}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {retailer.tags.map((tag) => (
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
                                <CardTitle className="text-[#EDECF8]">Store Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center w-12 h-12 bg-[#202020] rounded-xl mb-3 mx-auto">
                                            <Package className="w-6 h-6 text-[#D78E59]" />
                                        </div>
                                        <div className="text-2xl font-bold text-[#EDECF8] mb-1">{retailer.productsCount}</div>
                                        <div className="text-sm text-[#828288]">Products</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center w-12 h-12 bg-[#202020] rounded-xl mb-3 mx-auto">
                                            <ShoppingBag className="w-6 h-6 text-[#FFAA6C]" />
                                        </div>
                                        <div className="text-2xl font-bold text-[#EDECF8] mb-1">{retailer.brandsCount}</div>
                                        <div className="text-sm text-[#828288]">Brands</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center w-12 h-12 bg-[#202020] rounded-xl mb-3 mx-auto">
                                            <Star className="w-6 h-6 text-[#FFAA6C]" />
                                        </div>
                                        <div className="text-2xl font-bold text-[#EDECF8] mb-1">{retailer.rating}</div>
                                        <div className="text-sm text-[#828288]">Rating</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center w-12 h-12 bg-[#202020] rounded-xl mb-3 mx-auto">
                                            <Store className="w-6 h-6 text-[#575757]" />
                                        </div>
                                        <div className="text-2xl font-bold text-[#EDECF8] mb-1">{retailer.locations.length}</div>
                                        <div className="text-sm text-[#828288]">Locations</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Operating Hours */}
                        {retailer.operatingHours && (
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        Operating Hours
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(retailer.operatingHours).map(([day, hours]) => (
                                            <div key={day} className="flex justify-between items-center">
                                                <span className="text-[#EDECF8] capitalize font-medium">{day}</span>
                                                <span className="text-[#828288]">
                                                    {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Locations */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Store Locations
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {retailer.locations.map((location, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 bg-[#202020] rounded-lg">
                                        <MapPin className="w-5 h-5 text-[#D78E59] flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-medium text-[#EDECF8]">
                                                {location.city}, {location.country}
                                            </div>
                                            {location.address && (
                                                <div className="text-sm text-[#828288] mt-1">
                                                    {location.address}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Payment & Delivery */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" />
                                        Payment Methods
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {retailer.paymentMethods.map((method) => (
                                            <Badge
                                                key={method}
                                                variant="outline"
                                                className="border-[#575757] text-[#828288]"
                                            >
                                                {method}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                        <Truck className="w-5 h-5" />
                                        Delivery Options
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {retailer.deliveryOptions.map((option) => (
                                            <Badge
                                                key={option}
                                                variant="outline"
                                                className="border-[#575757] text-[#828288]"
                                            >
                                                {option}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Policies */}
                        {(retailer.policies.shipping || retailer.policies.returns || retailer.policies.privacy || retailer.policies.terms) && (
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8]">Store Policies</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {retailer.policies.shipping && (
                                        <div>
                                            <h4 className="font-semibold text-[#EDECF8] mb-2">Shipping Policy</h4>
                                            <p className="text-[#828288] text-sm">{retailer.policies.shipping}</p>
                                        </div>
                                    )}
                                    {retailer.policies.returns && (
                                        <div>
                                            <h4 className="font-semibold text-[#EDECF8] mb-2">Returns Policy</h4>
                                            <p className="text-[#828288] text-sm">{retailer.policies.returns}</p>
                                        </div>
                                    )}
                                    {retailer.policies.privacy && (
                                        <div>
                                            <h4 className="font-semibold text-[#EDECF8] mb-2">Privacy Policy</h4>
                                            <p className="text-[#828288] text-sm">{retailer.policies.privacy}</p>
                                        </div>
                                    )}
                                    {retailer.policies.terms && (
                                        <div>
                                            <h4 className="font-semibold text-[#EDECF8] mb-2">Terms & Conditions</h4>
                                            <p className="text-[#828288] text-sm">{retailer.policies.terms}</p>
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
                                    type='button'
                                    className="w-full bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] mb-3"
                                >
                                    <Package className="w-4 h-4 mr-2" />
                                    View Products
                                </Button>
                                {retailer.website && (
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                    >
                                        <Link href={retailer.website} target="_blank" rel="noopener noreferrer">
                                            <Globe className="w-4 h-4 mr-2" />
                                            Visit Website
                                        </Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Store Info */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Store Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-[#575757]" />
                                    <div>
                                        <div className="text-sm text-[#828288]">Founded</div>
                                        <div className="text-[#EDECF8]">{retailer.founded}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-[#575757]" />
                                    <div>
                                        <div className="text-sm text-[#828288]">Team Size</div>
                                        <div className="text-[#EDECF8]">{retailer.employeeCount} employees</div>
                                    </div>
                                </div>
                                {retailer.revenue && (
                                    <div className="flex items-center gap-3">
                                        <Building2 className="w-5 h-5 text-[#575757]" />
                                        <div>
                                            <div className="text-sm text-[#828288]">Revenue</div>
                                            <div className="text-[#EDECF8]">{retailer.revenue}</div>
                                        </div>
                                    </div>
                                )}
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
                                            href={`mailto:${retailer.email}`}
                                            className="text-[#D78E59] hover:text-[#FFAA6C] transition-colors"
                                        >
                                            {retailer.email}
                                        </Link>
                                    </div>
                                </div>
                                {retailer.phone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-[#575757]" />
                                        <div>
                                            <div className="text-sm text-[#828288]">Phone</div>
                                            <Link
                                                href={`tel:${retailer.phone}`}
                                                className="text-[#D78E59] hover:text-[#FFAA6C] transition-colors"
                                            >
                                                {retailer.phone}
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
                                                <div className="text-[#EDECF8] font-medium">{retailer.contactPerson.name}</div>
                                                <div className="text-sm text-[#828288]">{retailer.contactPerson.position}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-4 h-4 text-[#575757]" />
                                            <Link
                                                href={`mailto:${retailer.contactPerson.email}`}
                                                className="text-[#D78E59] hover:text-[#FFAA6C] transition-colors text-sm"
                                            >
                                                {retailer.contactPerson.email}
                                            </Link>
                                        </div>
                                        {retailer.contactPerson.phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-[#575757]" />
                                                <Link
                                                    href={`tel:${retailer.contactPerson.phone}`}
                                                    className="text-[#D78E59] hover:text-[#FFAA6C] transition-colors text-sm"
                                                >
                                                    {retailer.contactPerson.phone}
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Media */}
                        {Object.values(retailer.socialMedia).some(Boolean) && (
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8]">Follow Us</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-3">
                                        {retailer.socialMedia.instagram && (
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                            >
                                                <Link href={`https://instagram.com/${retailer.socialMedia.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                                                    <Instagram className="w-4 h-4 mr-2" />
                                                    Instagram
                                                </Link>
                                            </Button>
                                        )}
                                        {retailer.socialMedia.facebook && (
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                            >
                                                <Link href={`https://facebook.com/${retailer.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer">
                                                    <Facebook className="w-4 h-4 mr-2" />
                                                    Facebook
                                                </Link>
                                            </Button>
                                        )}
                                        {retailer.socialMedia.twitter && (
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                            >
                                                <Link href={`https://twitter.com/${retailer.socialMedia.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                                                    <Twitter className="w-4 h-4 mr-2" />
                                                    Twitter
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