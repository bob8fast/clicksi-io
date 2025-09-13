// app/creators/[handle]/CreatorPageContent.tsx
'use client'

import { CollectionCard } from '@/components/features/creators/CollectionCard';
import { CreatorStats } from '@/components/features/creators/CreatorStats';
import { PostCard } from '@/components/features/creators/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreator, useCreatorPosts } from '@/hooks/creator-hooks';
import
{
    Award,
    Calendar,
    ExternalLink,
    Eye,
    Grid3X3,
    Hash,
    Instagram,
    MapPin,
    MessageCircle,
    PlayCircle,
    Share2,
    ShoppingBag,
    Sparkles,
    Star, TrendingUp, Users,
    Youtube
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface CreatorPageContentProps
{
    handle: string;
}

export default function CreatorPageContent({ handle }: CreatorPageContentProps)
{
    const { data: creator, isLoading, error } = useCreator(handle);
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const { data: posts } = useCreatorPosts(creator?.id || '', selectedCollection || undefined);

    const [isProductSheetOpen, setIsProductSheetOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [highlightedProducts, setHighlightedProducts] = useState<Set<string>>(new Set());
    const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
    const [showAllProductsHighlight, setShowAllProductsHighlight] = useState(false);
    const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

    if (error)
    {
        notFound();
    }

    if (isLoading || !creator)
    {
        return null; // The Suspense boundary will show the skeleton
    }

    const formatFollowers = (count: number) =>
    {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
        return count.toString();
    };

    const handlePinClick = (pin: any) =>
    {
        setSelectedProduct({
            id: pin.productId,
            name: pin.productName,
            price: pin.price,
            image: 'https://images.unsplash.com/photo-1556228720-da4c5f67b13f?w=400&h=400&fit=crop',
            brand: 'YASA Beauty',
            rating: 4.7,
            reviews: 234,
        });
        setIsProductSheetOpen(true);
    };

    const toggleHighlight = (productId: string) =>
    {
        const newHighlighted = new Set(highlightedProducts);
        if (newHighlighted.has(productId))
        {
            newHighlighted.delete(productId);
        } else
        {
            newHighlighted.add(productId);
        }
        setHighlightedProducts(newHighlighted);
    };

    const toggleAllHighlights = () =>
    {
        setShowAllProductsHighlight(!showAllProductsHighlight);
        if (!showAllProductsHighlight)
        {
            // Highlight all products
            const allProductIds = new Set<string>();
            posts?.forEach(post =>
            {
                if (post.type === 'image' && post.images)
                {
                    post.images.forEach(img =>
                    {
                        img.productPins.forEach(pin =>
                        {
                            allProductIds.add(pin.id);
                        });
                    });
                }
            });
            setHighlightedProducts(allProductIds);
        } else
        {
            setHighlightedProducts(new Set());
        }
    };

    const nextImage = (postId: string, maxImages: number) =>
    {
        setCurrentImageIndex(prev => ({
            ...prev,
            [postId]: ((prev[postId] || 0) + 1) % maxImages
        }));
    };

    const prevImage = (postId: string, maxImages: number) =>
    {
        setCurrentImageIndex(prev => ({
            ...prev,
            [postId]: ((prev[postId] || 0) - 1 + maxImages) % maxImages
        }));
    };

    const toggleSave = (postId: string) =>
    {
        setSavedPosts(prev =>
        {
            const newSaved = new Set(prev);
            if (newSaved.has(postId))
            {
                newSaved.delete(postId);
                toast.success('Post removed from saved');
            } else
            {
                newSaved.add(postId);
                toast.success('Post saved');
            }
            return newSaved;
        });
    };

    const toggleLike = (postId: string) =>
    {
        setLikedPosts(prev =>
        {
            const newLiked = new Set(prev);
            if (newLiked.has(postId))
            {
                newLiked.delete(postId);
            } else
            {
                newLiked.add(postId);
            }
            return newLiked;
        });
    };

    const ProductSheet = () => (
        <Sheet open={isProductSheetOpen} onOpenChange={setIsProductSheetOpen}>
            <SheetContent className="bg-[#090909] border-[#575757] w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="text-[#EDECF8]">Tagged Product</SheetTitle>
                </SheetHeader>

                {selectedProduct && (
                    <div className="mt-6 space-y-4">
                        <div className="aspect-square bg-[#202020] rounded-xl overflow-hidden">
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-[#EDECF8]">{selectedProduct.name}</h3>
                            <p className="text-[#828288]">{selectedProduct.brand}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-[#EDECF8]">₴{selectedProduct.price}</span>
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-[#FFAA6C] text-[#FFAA6C]" />
                                <span className="text-sm text-[#828288]">{selectedProduct.rating} ({selectedProduct.reviews})</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]">
                                <ShoppingBag size={16} className="mr-2" />
                                Add to Cart
                            </Button>
                            <Link href={`/products/${selectedProduct.id}`}>
                                <Button variant="outline" className="w-full border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]">
                                    View Details
                                    <ExternalLink size={16} className="ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );

    return (
        <>
            {/* Cover Image */}
            <div className="relative h-64 sm:h-80 bg-[#202020]">
                <img
                    src={creator.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/80 to-transparent" />
            </div>

            {/* Profile Header */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative -mt-20 sm:-mt-24 mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-[#171717]">
                                <AvatarImage src={creator.avatar} alt={creator.name} />
                                <AvatarFallback>{creator.name[0]}</AvatarFallback>
                            </Avatar>
                            {creator.verified && (
                                <div className="absolute bottom-2 right-2 bg-[#D78E59] rounded-full p-2">
                                    <Sparkles size={20} className="text-[#171717]" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                                <h1 className="text-2xl sm:text-3xl font-bold text-[#EDECF8]">{creator.name}</h1>
                                <div className="flex items-center gap-2">
                                    {creator.badges.map((badge, index) => (
                                        <Badge key={index} className="bg-[#202020] text-[#D78E59]">
                                            {badge === 'Top Creator' && <Award size={12} className="mr-1" />}
                                            {badge === 'Rising Star' && <TrendingUp size={12} className="mr-1" />}
                                            {badge}
                                        </Badge>
                                    ))}
                                    <Badge className="bg-[#202020] text-[#828288]">
                                        <Star size={12} className="mr-1" />
                                        {creator.rating.toFixed(1)}
                                    </Badge>
                                </div>
                            </div>
                            <p className="text-[#828288] mb-4">{creator.handle}</p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <Button className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]">
                                    <MessageCircle size={16} className="mr-2" />
                                    Contact
                                </Button>
                                <Button variant="outline" className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]">
                                    <Users size={16} className="mr-2" />
                                    Collaborate
                                </Button>
                                <Button variant="outline" className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]">
                                    <Share2 size={16} />
                                </Button>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-[#090909] rounded-xl p-6 border border-[#202020] min-w-[280px]">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-[#EDECF8]">
                                        {formatFollowers(creator.followers)}
                                    </p>
                                    <p className="text-xs text-[#575757]">Followers</p>
                                </div>
                                <div className="border-x border-[#202020]">
                                    <p className="text-2xl font-bold text-[#D78E59]">{creator.engagementRate.toFixed(1)}%</p>
                                    <p className="text-xs text-[#575757]">Engagement</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-[#EDECF8]">{creator.completedCampaigns}</p>
                                    <p className="text-xs text-[#575757]">Campaigns</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="mb-8">
                    <p className="text-[#828288] mb-4">{creator.bio}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-[#575757]">
                            <MapPin size={16} />
                            <span>{creator.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#575757]">
                            <Calendar size={16} />
                            <span>Joined {creator.joinedDate}</span>
                        </div>
                        {Object.entries(creator.platforms).map(([platform, data]) => (
                            <a
                                key={platform}
                                href={data.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-[#828288] hover:text-[#D78E59] transition-colors"
                            >
                                {platform === 'instagram' && <Instagram size={16} />}
                                {platform === 'youtube' && <Youtube size={16} />}
                                {platform === 'tiktok' && <Hash size={16} />}
                                <span className="capitalize">{platform}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Collections */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-[#EDECF8]">Content Collections</h2>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleAllHighlights}
                            className={`border-[#575757] ${showAllProductsHighlight
                                    ? 'bg-[#D78E59] text-[#171717] hover:bg-[#FFAA6C]'
                                    : 'text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]'
                                }`}
                        >
                            <Sparkles size={16} className="mr-2" />
                            {showAllProductsHighlight ? 'Hide All Products' : 'Show All Products'}
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {creator.collections.map(collection => (
                            <CollectionCard
                                key={collection.id}
                                collection={collection}
                                isSelected={selectedCollection === collection.id}
                                onClick={() => setSelectedCollection(collection.id === selectedCollection ? null : collection.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="posts" className="mb-12">
                    <TabsList className="bg-[#090909] border border-[#202020]">
                        <TabsTrigger value="posts" className="data-[state=active]:bg-[#202020]">
                            <Grid3X3 size={16} className="mr-2" />
                            Posts
                        </TabsTrigger>
                        <TabsTrigger value="videos" className="data-[state=active]:bg-[#202020]">
                            <PlayCircle size={16} className="mr-2" />
                            Videos
                        </TabsTrigger>
                        <TabsTrigger value="stats" className="data-[state=active]:bg-[#202020]">
                            <TrendingUp size={16} className="mr-2" />
                            Stats
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="posts" className="mt-6">
                        <div className="grid gap-6">
                            {posts?.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    creator={creator}
                                    currentImageIndex={currentImageIndex[post.id] || 0}
                                    highlightedProducts={highlightedProducts}
                                    showAllProductsHighlight={showAllProductsHighlight}
                                    isLiked={likedPosts.has(post.id)}
                                    isSaved={savedPosts.has(post.id)}
                                    onPinClick={handlePinClick}
                                    onNextImage={() => post.images && nextImage(post.id, post.images.length)}
                                    onPrevImage={() => post.images && prevImage(post.id, post.images.length)}
                                    onToggleLike={() => toggleLike(post.id)}
                                    onToggleSave={() => toggleSave(post.id)}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="videos" className="mt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts?.filter(p => p.type === 'video').map(post => (
                                <div key={post.id} className="group cursor-pointer">
                                    <div className="relative aspect-square rounded-xl overflow-hidden bg-[#202020]">
                                        <img
                                            src={post.thumbnail}
                                            alt="Video thumbnail"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                            <PlayCircle size={48} className="text-white" />
                                        </div>
                                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-sm">
                                            <span className="flex items-center gap-1">
                                                <Eye size={14} />
                                                {post.views?.toLocaleString()}
                                            </span>
                                            <span>{post.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="stats" className="mt-6">
                        <CreatorStats stats={creator.stats} />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Product Sheet */}
            <ProductSheet />
        </>
    );
}