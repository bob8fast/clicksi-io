"use client";
// UserDiscovery.tsx
import { UserInfo } from "@/types/next-auth";
import { ClicksiDataContractsCommonEnumsUserRole } from "@/gen/api/types";
import { useBrandHooks, useCreatorHooks } from "@/hooks/api";
import { useEngagementHooks } from "@/hooks/api/engagement-hooks";
import { useDebounce } from "@/hooks/ui/use-debounce";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Users, Star, Building2, UserPlus, Eye } from "lucide-react";
import React, { useState, useMemo } from "react";

interface UserDiscoveryProps {
    user: UserInfo;
}

const UserDiscovery: React.FC<UserDiscoveryProps> = ({ user }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const shouldSearch = debouncedSearchQuery.length >= 3;

    const brandHooks = useBrandHooks();
    const creatorHooks = useCreatorHooks();
    const engagementHooks = useEngagementHooks();

    // API calls only when search criteria is met
    const { data: brands, isLoading: brandsLoading } = brandHooks.getAll({ 
        limit: 10,
        ...(shouldSearch && { search: debouncedSearchQuery })
    });
    
    const { data: creators, isLoading: creatorsLoading } = creatorHooks.getAll({ 
        limit: 10,
        ...(shouldSearch && { search: debouncedSearchQuery })
    });

    const isLoading = brandsLoading || creatorsLoading;

    const searchResults = useMemo(() => {
        if (!shouldSearch) return { creators: [], brands: [] };
        
        return {
            creators: creators?.creators || [],
            brands: brands?.brands || []
        };
    }, [shouldSearch, creators, brands]);

    const handleFollowCreator = async (creatorId: string) => {
        try {
            await engagementHooks.follow.mutateAsync({ 
                data: {
                    consumer_id: user.user_id,
                    creator_id: creatorId,
                    enable_notifications: true,
                    follow_source: 'profile_discovery'
                }
            });
            // Optionally show success message
        } catch (error) {
            console.error('Failed to follow creator:', error);
            // Optionally show error message
        }
    };

    const handleViewProfile = (type: 'creator' | 'brand', id: string) => {
        const baseUrl = type === 'creator' ? '/creators' : '/brands';
        window.location.href = `${baseUrl}/${id}`;
    };

    const renderCreatorCard = (creator: any) => (
        <Card key={creator.id} className="bg-[#171717] border-[#202020]">
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-[#EDECF8] font-medium">{creator.displayName || creator.name}</h3>
                            <Badge variant="secondary" className="bg-[#4C1D95] text-white">
                                <Star className="w-3 h-3 mr-1" />
                                Creator
                            </Badge>
                        </div>
                        {creator.bio && (
                            <p className="text-[#828288] text-sm mb-3 line-clamp-2">{creator.bio}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-[#828288]">
                            {creator.followersCount && (
                                <span>{creator.followersCount} followers</span>
                            )}
                            {creator.categories && creator.categories.length > 0 && (
                                <span>{creator.categories.slice(0, 2).join(', ')}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex space-x-2 mt-4">
                    <Button 
                        size="sm"
                        onClick={() => handleViewProfile('creator', creator.id)}
                        variant="outline"
                        className="flex-1 border-[#202020] text-[#EDECF8] hover:bg-[#202020]"
                    >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                    </Button>
                    {user.user_role === ClicksiDataContractsCommonEnumsUserRole.Consumer && (
                        <Button 
                            size="sm"
                            onClick={() => handleFollowCreator(creator.id)}
                            className="flex-1 bg-[#D78E59] hover:bg-[#B86F47] text-white"
                        >
                            <UserPlus className="w-3 h-3 mr-1" />
                            Follow
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    const renderBrandCard = (brand: any) => (
        <Card key={brand.id} className="bg-[#171717] border-[#202020]">
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-[#EDECF8] font-medium">{brand.businessName || brand.name}</h3>
                            <Badge variant="outline" className="bg-[#059669] text-white border-[#059669]">
                                <Building2 className="w-3 h-3 mr-1" />
                                Brand
                            </Badge>
                        </div>
                        {brand.description && (
                            <p className="text-[#828288] text-sm mb-3 line-clamp-2">{brand.description}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-[#828288]">
                            {brand.location && <span>{brand.location}</span>}
                            {brand.categories && brand.categories.length > 0 && (
                                <span>{brand.categories.slice(0, 2).join(', ')}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex space-x-2 mt-4">
                    <Button 
                        size="sm"
                        onClick={() => handleViewProfile('brand', brand.id)}
                        variant="outline"
                        className="flex-1 border-[#202020] text-[#EDECF8] hover:bg-[#202020]"
                    >
                        <Eye className="w-3 h-3 mr-1" />
                        View Profile
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-lg font-medium text-[#EDECF8] mb-1">Discover Users</h2>
                <p className="text-[#828288] text-sm">Find and connect with creators and brands</p>
            </div>

            {/* Search */}
            <Card className="bg-[#171717] border-[#202020]">
                <CardHeader>
                    <CardTitle className="text-[#EDECF8] flex items-center">
                        <Search className="w-5 h-5 mr-2 text-[#D78E59]" />
                        Search Users
                    </CardTitle>
                    <CardDescription className="text-[#828288]">
                        Search for creators and brands by name, category, or keywords
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#828288] w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Search creators and brands... (minimum 3 characters)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-[#090909] border-[#202020] text-[#EDECF8] placeholder-[#828288]"
                        />
                    </div>
                    {searchQuery.length > 0 && searchQuery.length < 3 && (
                        <p className="text-[#828288] text-sm mt-2">
                            Type at least 3 characters to start searching
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Search Results */}
            {shouldSearch && (
                <>
                    {isLoading && (
                        <Card className="bg-[#171717] border-[#202020]">
                            <CardContent className="p-6 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D78E59] mx-auto"></div>
                                <p className="text-[#828288] mt-2">Searching...</p>
                            </CardContent>
                        </Card>
                    )}

                    {!isLoading && (
                        <>
                            {/* Creators Results */}
                            {searchResults.creators.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-[#EDECF8] font-medium flex items-center">
                                        <Star className="w-4 h-4 mr-2 text-[#4C1D95]" />
                                        Creators ({searchResults.creators.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {searchResults.creators.map(renderCreatorCard)}
                                    </div>
                                </div>
                            )}

                            {/* Brands Results */}
                            {searchResults.brands.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-[#EDECF8] font-medium flex items-center">
                                        <Building2 className="w-4 h-4 mr-2 text-[#059669]" />
                                        Brands ({searchResults.brands.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {searchResults.brands.map(renderBrandCard)}
                                    </div>
                                </div>
                            )}

                            {/* No Results */}
                            {!isLoading && searchResults.creators.length === 0 && searchResults.brands.length === 0 && (
                                <Card className="bg-[#171717] border-[#202020] border-dashed">
                                    <CardContent className="p-6 text-center">
                                        <Search className="w-8 h-8 text-[#828288] mx-auto mb-2" />
                                        <h3 className="text-[#EDECF8] font-medium mb-1">No results found</h3>
                                        <p className="text-[#828288] text-sm">
                                            Try different keywords or check the spelling
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </>
            )}

            {/* Browse Suggestions */}
            {!shouldSearch && (
                <Card className="bg-[#171717] border-[#202020]">
                    <CardHeader>
                        <CardTitle className="text-[#EDECF8] flex items-center">
                            <Users className="w-5 h-5 mr-2 text-[#D78E59]" />
                            Browse
                        </CardTitle>
                        <CardDescription className="text-[#828288]">
                            Explore creators and brands by category
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button 
                            variant="outline"
                            onClick={() => window.location.href = '/creators'}
                            className="w-full justify-start border-[#202020] text-[#EDECF8] hover:bg-[#202020]"
                        >
                            <Star className="w-4 h-4 mr-2" />
                            Browse All Creators
                        </Button>
                        <Button 
                            variant="outline"
                            onClick={() => window.location.href = '/brands'}
                            className="w-full justify-start border-[#202020] text-[#EDECF8] hover:bg-[#202020]"
                        >
                            <Building2 className="w-4 h-4 mr-2" />
                            Browse All Brands
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default UserDiscovery;