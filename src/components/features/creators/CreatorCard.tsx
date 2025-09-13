// components/creators/CreatorCard.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Creator } from '@/types/creator';
import
{
    Award,
    ChevronRight,
    Hash,
    Instagram,
    MapPin,
    Sparkles,
    TrendingUp,
    Youtube
} from 'lucide-react';
import Link from 'next/link';

interface CreatorCardProps
{
    creator: Creator;
    viewMode?: 'grid' | 'list';
}

export function CreatorCard({ creator, viewMode = 'grid' }: CreatorCardProps)
{
    const formatFollowers = (count: number) =>
    {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
        return count.toString();
    };

    const getPlatformIcons = () => (
        <div className="flex items-center gap-2">
            {creator.platforms.instagram && <Instagram size={16} className="text-[#575757]" />}
            {creator.platforms.youtube && <Youtube size={16} className="text-[#575757]" />}
            {creator.platforms.tiktok && <Hash size={16} className="text-[#575757]" />}
        </div>
    );

    const getBadges = () => (
        <div className="flex gap-1">
            {creator.badges.map((badge, index) => (
                <Badge key={index} className="bg-black/60 backdrop-blur-sm text-white border-none">
                    {badge === 'Top Creator' && <Award size={12} className="mr-1" />}
                    {badge === 'Rising Star' && <TrendingUp size={12} className="mr-1" />}
                    {badge}
                </Badge>
            ))}
        </div>
    );

    if (viewMode === 'list')
    {
        return (
            <Link href={`/creators/${creator.handle.slice(1)}`}>
                <div className="bg-[#090909] border border-[#202020] rounded-xl p-6 hover:border-[#575757] transition-all duration-300 hover:shadow-lg group">
                    <div className="flex gap-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="relative">
                                <img
                                    src={creator.avatar}
                                    alt={creator.name}
                                    className="w-20 h-20 rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {creator.verified && (
                                    <div className="absolute -bottom-1 -right-1 bg-[#D78E59] rounded-full p-1">
                                        <Sparkles size={14} className="text-[#171717]" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-[#EDECF8] group-hover:text-[#D78E59] transition-colors">
                                            {creator.name}
                                        </h3>
                                        {creator.verified && (
                                            <Sparkles className="w-5 h-5 text-[#D78E59]" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-[#828288] mb-2">
                                        <span>{creator.handle}</span>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {creator.location}
                                        </div>
                                        {getPlatformIcons()}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    {getBadges()}
                                </div>
                            </div>

                            <p className="text-[#828288] mb-4 line-clamp-2">
                                {creator.bio}
                            </p>

                            <div className="flex items-center gap-6 text-sm text-[#575757] mb-4">
                                <div className="flex items-center gap-1">
                                    <span className="text-[#EDECF8] font-semibold">{formatFollowers(creator.followers)}</span>
                                    <span>followers</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-[#D78E59] font-semibold">{creator.engagementRate.toFixed(1)}%</span>
                                    <span>engagement</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-[#EDECF8] font-semibold">{creator.completedCampaigns}</span>
                                    <span>campaigns</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                    {creator.categories.slice(0, 3).map(category => (
                                        <Badge key={category} variant="outline" className="text-xs border-[#575757] text-[#828288]">
                                            {category}
                                        </Badge>
                                    ))}
                                    {creator.categories.length > 3 && (
                                        <Badge variant="outline" className="text-xs border-[#575757] text-[#828288]">
                                            +{creator.categories.length - 3}
                                        </Badge>
                                    )}
                                </div>
                                <Button
                                    size="sm"
                                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                >
                                    <ChevronRight className="w-4 h-4 mr-1" />
                                    View Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={`/creators/${creator.handle.slice(1)}`}
            className="group"
        >
            <div className="bg-[#090909] rounded-xl border border-[#202020] hover:border-[#575757] transition-all duration-300 overflow-hidden">
                {/* Cover Image */}
                <div className="relative h-32 bg-[#202020] overflow-hidden">
                    <img
                        src={creator.coverImage}
                        alt={`${creator.name} cover`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Badges */}
                    <div className="absolute top-2 right-2 flex gap-1">
                        {getBadges()}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Avatar and Name */}
                    <div className="flex items-start gap-4 -mt-12 mb-4">
                        <div className="relative">
                            <img
                                src={creator.avatar}
                                alt={creator.name}
                                className="w-20 h-20 rounded-full border-4 border-[#090909] object-cover"
                            />
                            {creator.verified && (
                                <div className="absolute -bottom-1 -right-1 bg-[#D78E59] rounded-full p-1">
                                    <Sparkles size={14} className="text-[#171717]" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 pt-4">
                            <h3 className="font-semibold text-[#EDECF8] group-hover:text-[#D78E59] transition-colors">
                                {creator.name}
                            </h3>
                            <p className="text-sm text-[#575757]">{creator.handle}</p>
                        </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-[#828288] line-clamp-2 mb-4">{creator.bio}</p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="text-center">
                            <p className="text-lg font-bold text-[#EDECF8]">{formatFollowers(creator.followers)}</p>
                            <p className="text-xs text-[#575757]">Followers</p>
                        </div>
                        <div className="text-center border-x border-[#202020]">
                            <p className="text-lg font-bold text-[#D78E59]">{creator.engagementRate.toFixed(1)}%</p>
                            <p className="text-xs text-[#575757]">Engagement</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-[#EDECF8]">{creator.completedCampaigns}</p>
                            <p className="text-xs text-[#575757]">Campaigns</p>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1 mb-4">
                        {creator.categories.slice(0, 2).map(category => (
                            <Badge key={category} variant="secondary" className="bg-[#202020] text-[#828288] text-xs">
                                {category}
                            </Badge>
                        ))}
                        {creator.categories.length > 2 && (
                            <Badge variant="secondary" className="bg-[#202020] text-[#828288] text-xs">
                                +{creator.categories.length - 2}
                            </Badge>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#202020]">
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-[#575757]" />
                            <span className="text-sm text-[#828288]">{creator.location}</span>
                        </div>
                        {getPlatformIcons()}
                    </div>

                    {/* Hover Action */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button className="w-full bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]">
                            View Profile
                            <ChevronRight size={16} className="ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
}