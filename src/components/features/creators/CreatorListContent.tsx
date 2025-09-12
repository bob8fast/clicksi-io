// components/creators/CreatorListContent.tsx
'use client'

import { CreatorCard } from '@/components/features/creators/CreatorCard';
import { ActiveFilter, ActiveFilters } from '@/components/ui/active-filters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SimplePagination } from '@/components/ui/custom/simple-paginations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { useCreatorHooks } from '@/hooks/api';
import { useCreatorFilterData, transformToCheckboxOptions } from '@/hooks/filter-data';
import
{
    Filter,
    Grid3X3,
    List,
    Search,
    SlidersHorizontal
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// Filter data is now loaded from APIs using the filter data hook
// Price functionality removed - system will not contain prices for creator collaborations

// Define basic interface for creator filters
interface CreatorFilters {
    search?: string;
    sortBy?: 'popular' | 'followers' | 'engagement' | 'rating' | 'newest';
    page?: number;
    limit?: number;
}

interface CreatorListContentProps
{
    searchParams: { [key: string]: string | string[] | undefined };
}

export default function CreatorListContent({ searchParams }: CreatorListContentProps)
{
    const router = useRouter();
    const currentSearchParams = useSearchParams();

    // Parse search params
    const [filters, setFilters] = useState<CreatorFilters>({
        search: searchParams.search as string || '',
        sortBy: searchParams.sort as CreatorFilters['sortBy'] || 'popular',
        page: parseInt(searchParams.page as string) || 1,
        limit: 12,
    });

    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        searchParams.categories ? (searchParams.categories as string).split(',') : []
    );
    const [selectedLocations, setSelectedLocations] = useState<string[]>(
        searchParams.locations ? (searchParams.locations as string).split(',') : []
    );
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
        searchParams.platforms ? (searchParams.platforms as string).split(',') : []
    );
    const [followerRange, setFollowerRange] = useState<[number, number]>([
        searchParams.minFollowers ? parseInt(searchParams.minFollowers as string) : 0,
        searchParams.maxFollowers ? parseInt(searchParams.maxFollowers as string) : 1000000,
    ]);
    const [minEngagement, setMinEngagement] = useState<[number]>([
        searchParams.minEngagement ? parseFloat(searchParams.minEngagement as string) : 0
    ]);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Load filter data from APIs
    const filterData = useCreatorFilterData();
    
    // Transform filter data for UI components
    const categoryOptions = transformToCheckboxOptions(filterData.categories);
    const locationOptions = transformToCheckboxOptions(filterData.locations);
    
    // Query creators with selected filters
    const creatorHooks = useCreatorHooks();
    const { data, isLoading, error } = creatorHooks.getAll({
        ...filters,
        category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
        location: selectedLocations.length > 0 ? selectedLocations.join(',') : undefined,
        platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
        minFollowers: followerRange[0] > 0 ? followerRange[0] : undefined,
        maxFollowers: followerRange[1] < 1000000 ? followerRange[1] : undefined,
        minEngagement: minEngagement[0] > 0 ? minEngagement[0] : undefined,
    });

    // Build active filters for display
    const activeFilters: ActiveFilter[] = useMemo(() =>
    {
        const activeFilters: ActiveFilter[] = [];

        if (selectedCategories.length > 0)
        {
            activeFilters.push({
                key: 'categories',
                value: selectedCategories,
                label: 'Category',
            });
        }

        if (selectedLocations.length > 0)
        {
            activeFilters.push({
                key: 'locations',
                value: selectedLocations,
                label: 'Location',
            });
        }

        if (selectedPlatforms.length > 0)
        {
            activeFilters.push({
                key: 'platforms',
                value: selectedPlatforms,
                label: 'Platform',
            });
        }

        if (followerRange[0] > 0 || followerRange[1] < 1000000)
        {
            const formatFollowers = (count: number) =>
            {
                if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
                if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
                return count.toString();
            };
            activeFilters.push({
                key: 'followers',
                value: `${formatFollowers(followerRange[0])} - ${formatFollowers(followerRange[1])}`,
                label: 'Followers',
            });
        }

        if (minEngagement[0] > 0)
        {
            activeFilters.push({
                key: 'engagement',
                value: `Min ${minEngagement[0]}%`,
                label: 'Engagement',
            });
        }

        if (filters.search)
        {
            activeFilters.push({
                key: 'search',
                value: filters.search,
                label: 'Search',
            });
        }

        return activeFilters;
    }, [selectedCategories, selectedLocations, selectedPlatforms, followerRange, minEngagement, filters.search]);

    // Update URL when filters change
    const updateURL = () =>
    {
        const params = new URLSearchParams(currentSearchParams.toString());

        // Update categories
        if (selectedCategories.length > 0)
        {
            params.set('categories', selectedCategories.join(','));
        } else
        {
            params.delete('categories');
        }

        // Update locations
        if (selectedLocations.length > 0)
        {
            params.set('locations', selectedLocations.join(','));
        } else
        {
            params.delete('locations');
        }

        // Update platforms
        if (selectedPlatforms.length > 0)
        {
            params.set('platforms', selectedPlatforms.join(','));
        } else
        {
            params.delete('platforms');
        }

        // Update follower range
        if (followerRange[0] > 0)
        {
            params.set('minFollowers', followerRange[0].toString());
        } else
        {
            params.delete('minFollowers');
        }

        if (followerRange[1] < 1000000)
        {
            params.set('maxFollowers', followerRange[1].toString());
        } else
        {
            params.delete('maxFollowers');
        }

        // Update engagement
        if (minEngagement[0] > 0)
        {
            params.set('minEngagement', minEngagement[0].toString());
        } else
        {
            params.delete('minEngagement');
        }

        // Update other filters
        if (filters.search)
        {
            params.set('search', filters.search);
        } else
        {
            params.delete('search');
        }

        if (filters.sortBy !== 'popular')
        {
            params.set('sort', filters.sortBy!);
        } else
        {
            params.delete('sort');
        }

        params.set('page', '1'); // Reset to page 1 when filters change

        router.push(`/creators?${params.toString()}`);
    };

    // Update URL when filters change
    useEffect(() =>
    {
        const timeoutId = setTimeout(() =>
        {
            updateURL();
        }, 500); // Debounce URL updates

        return () => clearTimeout(timeoutId);
    }, [selectedCategories, selectedLocations, selectedPlatforms, followerRange, minEngagement, filters.search, filters.sortBy]);

    const handlePageChange = (page: number) =>
    {
        const params = new URLSearchParams(currentSearchParams.toString());
        params.set('page', page.toString());
        router.push(`/creators?${params.toString()}`);
    };

    const toggleCategory = (category: string) =>
    {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const toggleLocation = (location: string) =>
    {
        setSelectedLocations(prev =>
            prev.includes(location)
                ? prev.filter(l => l !== location)
                : [...prev, location]
        );
    };

    const togglePlatform = (platform: string) =>
    {
        setSelectedPlatforms(prev =>
            prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        );
    };

    const handleRemoveFilter = (filterKey: string, value?: string) =>
    {
        switch (filterKey)
        {
            case 'categories':
                if (value)
                {
                    setSelectedCategories(prev => prev.filter(c => c !== value));
                }
                break;
            case 'locations':
                if (value)
                {
                    setSelectedLocations(prev => prev.filter(l => l !== value));
                }
                break;
            case 'platforms':
                if (value)
                {
                    setSelectedPlatforms(prev => prev.filter(p => p !== value));
                }
                break;
            case 'followers':
                setFollowerRange([0, 1000000]);
                break;
            case 'engagement':
                setMinEngagement([0]);
                break;
            case 'search':
                setFilters(prev => ({ ...prev, search: '' }));
                break;
        }
    };

    const handleClearAllFilters = () =>
    {
        setSelectedCategories([]);
        setSelectedLocations([]);
        setSelectedPlatforms([]);
        setFollowerRange([0, 1000000]);
        setMinEngagement([0]);
        setFilters(prev => ({ ...prev, search: '' }));
    };

    const FilterSidebar = () => (
        <div className="space-y-6">
            {/* Loading State */}
            {filterData.isLoading && (
                <div className="text-center py-4">
                    <p className="text-[#828288] text-sm">Loading filters...</p>
                </div>
            )}
            
            {/* Error State */}
            {filterData.error && (
                <div className="text-center py-4">
                    <p className="text-[#ff6b6b] text-sm">{filterData.error}</p>
                </div>
            )}
            
            {/* Categories */}
            {!filterData.isLoading && !filterData.error && (
                <div>
                    <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">
                        Categories {categoryOptions.length > 0 && `(${categoryOptions.length})`}
                    </h3>
                    <div className="space-y-2">
                        {categoryOptions.map(option => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={option.id}
                                    checked={selectedCategories.includes(option.value)}
                                    onCheckedChange={() => toggleCategory(option.value)}
                                    className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                                />
                                <Label
                                    htmlFor={option.id}
                                    className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal"
                                >
                                    {option.label} {option.count && `(${option.count})`}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Location */}
            {!filterData.isLoading && !filterData.error && (
                <div>
                    <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">
                        Location {locationOptions.length > 0 && `(${locationOptions.length})`}
                    </h3>
                    <div className="space-y-2">
                        {locationOptions.map(option => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={option.id}
                                    checked={selectedLocations.includes(option.value)}
                                    onCheckedChange={() => toggleLocation(option.value)}
                                    className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                                />
                                <Label
                                    htmlFor={option.id}
                                    className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal"
                                >
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Follower Range */}
            <div>
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Followers</h3>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm text-[#828288]">
                        <span>{followerRange[0].toLocaleString()}</span>
                        <span>{followerRange[1] >= 1000000 ? '1M+' : followerRange[1].toLocaleString()}</span>
                    </div>
                    <Slider
                        value={followerRange}
                        onValueChange={(value) => setFollowerRange([value[0], value[1]])}
                        min={0}
                        max={1000000}
                        step={10000}
                        className="mt-2"
                    />
                </div>
            </div>

            {/* Engagement Rate */}
            <div>
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">
                    Min Engagement Rate: {minEngagement[0]}%
                </h3>
                <Slider
                    value={minEngagement}
                    onValueChange={(value) => setMinEngagement([value[0]])}
                    min={0}
                    max={10}
                    step={0.5}
                    className="mt-2"
                />
            </div>

            {/* Platforms */}
            <div>
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Platforms</h3>
                <div className="space-y-2">
                    {['instagram', 'youtube', 'tiktok'].map(platform => (
                        <div key={platform} className="flex items-center space-x-2">
                            <Checkbox
                                id={platform}
                                checked={selectedPlatforms.includes(platform)}
                                onCheckedChange={() => togglePlatform(platform)}
                                className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                            />
                            <Label
                                htmlFor={platform}
                                className="text-[#828288] hover:text-[#EDECF8] cursor-pointer capitalize font-normal"
                            >
                                {platform}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (error)
    {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Error loading creators. Please try again.</p>
            </div>
        );
    }

    return (
        <>
            {/* Search and Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#575757] h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Search creators..."
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="pl-10 bg-[#202020] border-[#575757] text-[#EDECF8] placeholder:text-[#575757]"
                    />
                </div>

                <div className="flex gap-2">
                    {/* Mobile Filter */}
                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="lg:hidden border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]">
                                <Filter size={20} className="mr-2" />
                                Filters
                                {activeFilters.length > 0 && (
                                    <Badge className="ml-2 bg-[#D78E59] text-[#171717]">
                                        {activeFilters.length}
                                    </Badge>
                                )}
                                {filterData.isLoading && (
                                    <Badge className="ml-2 bg-[#575757] text-[#828288]">
                                        ...
                                    </Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="bg-[#090909] border-[#575757]">
                            <SheetHeader>
                                <SheetTitle className="text-[#EDECF8]">Filters</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                                <FilterSidebar />
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Sort */}
                    <Select
                        value={filters.sortBy}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as CreatorFilters['sortBy'] }))}
                    >
                        <SelectTrigger className="w-[180px] bg-[#202020] border-[#575757] text-[#EDECF8]">
                            <SlidersHorizontal size={16} className="mr-2" />
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#171717] border-[#575757]">
                            <SelectItem value="popular">Most Popular</SelectItem>
                            <SelectItem value="followers">Most Followers</SelectItem>
                            <SelectItem value="engagement">Highest Engagement</SelectItem>
                            <SelectItem value="rating">Top Rated</SelectItem>
                            {/* Price sorting removed - system will not contain creator collaboration prices */}
                        </SelectContent>
                    </Select>

                    {/* View Mode */}
                    <div className="flex gap-1 bg-[#202020] rounded-lg p-1">
                        <Button
                            size="icon"
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            onClick={() => setViewMode('grid')}
                            className={viewMode === 'grid' ? 'bg-[#D78E59] hover:bg-[#FFAA6C]' : 'hover:bg-[#575757]'}
                        >
                            <Grid3X3 size={20} />
                        </Button>
                        <Button
                            size="icon"
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            onClick={() => setViewMode('list')}
                            className={viewMode === 'list' ? 'bg-[#D78E59] hover:bg-[#FFAA6C]' : 'hover:bg-[#575757]'}
                        >
                            <List size={20} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Active Filters */}
            <ActiveFilters
                filters={activeFilters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
            />

            {/* Main Content */}
            <div className="flex gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="bg-[#090909] rounded-xl p-6 border border-[#202020]">
                        <FilterSidebar />
                    </div>
                </aside>

                {/* Creator Grid */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-[#828288]">Loading creators...</p>
                        </div>
                    ) : (
                        <>
                            {/* Results Count */}
                            <p className="text-[#828288] mb-4">
                                Showing {data?.creators?.length || 0} of {data?.total || 0} creators
                            </p>

                            {/* Creators */}
                            <div className={viewMode === 'grid'
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                : "space-y-4"
                            }>
                                {data?.creators?.map((creator) => (
                                    <CreatorCard
                                        key={creator.id}
                                        creator={creator}
                                        viewMode={viewMode}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {data && data.total_pages > 1 && (
                                <SimplePagination
                                    currentPage={data.page}
                                    totalPages={data.total_pages}
                                    onPageChange={handlePageChange}
                                    className="mt-12"
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}