// app/components/creators/PostCard.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreatorDetail, Post } from '@/types/creator';
import
{
    Bookmark,
    ChevronLeft, ChevronRight,
    Eye,
    Heart, MessageCircle,
    PlayCircle,
    Share2,
    ShoppingBag,
    Sparkles,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ProductPin } from './ProductPin';

interface PostCardProps
{
    post: Post;
    creator: CreatorDetail;
    currentImageIndex: number;
    highlightedProducts: Set<string>;
    showAllProductsHighlight: boolean;
    isLiked: boolean;
    isSaved: boolean;
    onPinClick: (pin: any) => void;
    onNextImage: () => void;
    onPrevImage: () => void;
    onToggleLike: () => void;
    onToggleSave: () => void;
}

export function PostCard({
    post,
    creator,
    currentImageIndex,
    highlightedProducts,
    showAllProductsHighlight,
    isLiked,
    isSaved,
    onPinClick,
    onNextImage,
    onPrevImage,
    onToggleLike,
    onToggleSave,
}: PostCardProps)
{
    const [showPostProducts, setShowPostProducts] = useState(false);

    // Check if post has products
    const hasProducts = (post.type === 'image' && post.images &&
        post.images.some(img => img.productPins && img.productPins.length > 0)) ||
        (post.type === 'video' && post.linkedProducts && post.linkedProducts.length > 0);

    // Get all product pins for current post
    const getAllProductPins = () =>
    {
        if (post.type === 'image' && post.images)
        {
            return post.images.flatMap(img => img.productPins || []);
        }
        return [];
    };

    const allPins = getAllProductPins();

    return (
        <div className="bg-[#090909] rounded-xl border border-[#202020] overflow-hidden">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={creator.avatar} alt={creator.name} />
                        <AvatarFallback>{creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-[#EDECF8]">{creator.name}</p>
                        <p className="text-sm text-[#575757]">{post.date}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {hasProducts && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPostProducts(!showPostProducts)}
                            className={`border-[#575757] ${showPostProducts
                                    ? 'bg-[#D78E59] text-[#171717] hover:bg-[#FFAA6C]'
                                    : 'text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]'
                                }`}
                        >
                            <Sparkles size={14} className="mr-1" />
                            {showPostProducts ? 'Hide' : 'Show'} Products
                        </Button>
                    )}
                    <Badge className="bg-[#202020] text-[#D78E59]">
                        <TrendingUp size={12} className="mr-1" />
                        {post.engagement}% engagement
                    </Badge>
                </div>
            </div>

            {/* Post Content */}
            {post.type === 'image' && post.images && (
                <div className="relative">
                    <div className="relative aspect-square bg-[#202020]">
                        <img
                            src={post.images[currentImageIndex].url}
                            alt="Post"
                            className="w-full h-full object-cover"
                        />

                        {/* Product Pins */}
                        {post.images[currentImageIndex].productPins.map(pin => (
                            <ProductPin
                                key={pin.id}
                                pin={pin}
                                isHighlighted={showAllProductsHighlight || showPostProducts || highlightedProducts.has(pin.id)}
                                onClick={onPinClick}
                            />
                        ))}

                        {/* Product Counter Badge */}
                        {hasProducts && (
                            <Badge className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white border-none">
                                <ShoppingBag size={14} className="mr-1" />
                                {allPins.length} Product{allPins.length !== 1 ? 's' : ''}
                            </Badge>
                        )}

                        {/* Navigation for multiple images */}
                        {post.images.length > 1 && (
                            <>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={onPrevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                                >
                                    <ChevronLeft size={20} />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={onNextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                                >
                                    <ChevronRight size={20} />
                                </Button>

                                {/* Image indicators */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                                    {post.images.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {post.type === 'video' && (
                <div className="relative aspect-square bg-[#202020]">
                    <img
                        src={post.thumbnail}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <PlayCircle size={64} className="text-white" />
                    </div>
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                        <Eye size={16} />
                        <span className="text-sm">{post.views?.toLocaleString()} views</span>
                    </div>

                    {/* Product Counter Badge for Videos */}
                    {post.linkedProducts && post.linkedProducts.length > 0 && (
                        <Badge className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white border-none">
                            <ShoppingBag size={14} className="mr-1" />
                            {post.linkedProducts.length} Product{post.linkedProducts.length !== 1 ? 's' : ''}
                        </Badge>
                    )}
                </div>
            )}

            {/* Post Actions */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onToggleLike}
                            className="flex items-center gap-2 text-[#828288] hover:text-[#D78E59] transition-colors"
                        >
                            <Heart
                                size={20}
                                className={isLiked ? 'fill-[#D78E59] text-[#D78E59]' : ''}
                            />
                            <span className="text-sm">{post.likes.toLocaleString()}</span>
                        </button>
                        <button className="flex items-center gap-2 text-[#828288] hover:text-[#EDECF8] transition-colors">
                            <MessageCircle size={20} />
                            <span className="text-sm">{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-[#828288] hover:text-[#EDECF8] transition-colors">
                            <Share2 size={20} />
                        </button>
                    </div>
                    <button
                        onClick={onToggleSave}
                        className="text-[#828288] hover:text-[#D78E59] transition-colors"
                    >
                        <Bookmark
                            size={20}
                            className={isSaved ? 'fill-[#D78E59] text-[#D78E59]' : ''}
                        />
                    </button>
                </div>

                {/* Caption */}
                <p className="text-[#EDECF8] mb-3">{post.caption}</p>

                {/* Show all products from this post (for images) */}
                {showPostProducts && post.type === 'image' && allPins.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <p className="text-sm font-semibold text-[#828288]">Products in this post:</p>
                        {allPins.map(pin => (
                            <button
                                key={pin.id}
                                onClick={() => onPinClick(pin)}
                                className="w-full flex items-center justify-between p-2 bg-[#202020] rounded-lg hover:bg-[#575757] transition-colors"
                            >
                                <span className="text-[#EDECF8]">{pin.productName}</span>
                                <span className="text-[#D78E59] font-semibold">₴{pin.price}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Linked Products for Videos */}
                {post.type === 'video' && post.linkedProducts && (showPostProducts || post.linkedProducts.length <= 3) && (
                    <div className="mt-4 space-y-2">
                        <p className="text-sm font-semibold text-[#828288]">Products in this video:</p>
                        {post.linkedProducts.map(product => (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="flex items-center justify-between p-2 bg-[#202020] rounded-lg hover:bg-[#575757] transition-colors"
                            >
                                <span className="text-[#EDECF8]">{product.name}</span>
                                <span className="text-[#D78E59] font-semibold">₴{product.price}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}