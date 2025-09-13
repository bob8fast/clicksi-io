// components/brands/BrandListContent.tsx
'use client'

import { BrandCard } from '@/components/features/brands/BrandCard';
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
import { useBrandHooks } from '@/hooks/api';
import { useBrandFilterData, transformToCheckboxOptions } from '@/hooks/filter-data';
// Define basic interface for brand filters
interface BrandFilters {
    search?: string;
    sortBy?: 'popular' | 'rating' | 'name' | 'newest' | 'collaborations';
    page?: number;
    limit?: number;
}
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

interface BrandListContentProps
{
    searchParams: { [key: string]: string | string[] | undefined };
}

export default function BrandListContent({ searchParams }: BrandListContentProps)
{
    const router = useRouter();
    const currentSearchParams = useSearchParams();

    // Parse search params
    const [filters, setFilters] = useState<BrandFilters>({
        search: searchParams.search as string || '',
        sortBy: searchParams.sort as BrandFilters['sortBy'] || 'popular',
        page: parseInt(searchParams.page as string) || 1,
        limit: 12,
    });

    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        searchParams.categories ? (searchParams.categories as string).split(',') : []
    );
    const [selectedLocations, setSelectedLocations] = useState<string[]>(
        searchParams.locations ? (searchParams.locations as string).split(',') : []
    );
    const [selectedTags, setSelectedTags] = useState<string[]>(
        searchParams.tags ? (searchParams.tags as string).split(',') : []
    );
    const [minRating, setMinRating] = useState<[number]>([
        searchParams.minRating ? parseFloat(searchParams.minRating as string) : 0
    ]);
    const [isVerified, setIsVerified] = useState<boolean | undefined>(
        searchParams.verified === 'true' ? true : searchParams.verified === 'false' ? false : undefined
    );
    const [isPartner, setIsPartner] = useState<boolean | undefined>(
        searchParams.partner === 'true' ? true : searchParams.partner === 'false' ? false : undefined
    );

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    // Load filter data from APIs
    const filterData = useBrandFilterData();
    
    // Transform filter data for UI components
    const categoryOptions = transformToCheckboxOptions(filterData.categories);
    const locationOptions = transformToCheckboxOptions(filterData.locations);
    const tagOptions = transformToCheckboxOptions(filterData.tags);

    // Query brands with selected filters
    const brandHooks = useBrandHooks();
    const { data, isLoading, error } = brandHooks.getAll({
        ...filters,
        category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
        location: selectedLocations.length > 0 ? selectedLocations.join(',') : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        minRating: minRating[0] > 0 ? minRating[0] : undefined,
        isVerified,
        isPartner,
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

        if (selectedTags.length > 0)
        {
            activeFilters.push({
                key: 'tags',
                value: selectedTags,
                label: 'Tag',
            });
        }

        if (minRating[0] > 0)
        {
            activeFilters.push({
                key: 'rating',
                value: `Min ${minRating[0]} stars`,
                label: 'Rating',
            });
        }

        if (isVerified === true)
        {
            activeFilters.push({
                key: 'verified',
                value: 'Verified only',
                label: 'Verification',
            });
        }

        if (isPartner === true)
        {
            activeFilters.push({
                key: 'partner',
                value: 'Partners only',
                label: 'Partnership',
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
    }, [selectedCategories, selectedLocations, selectedTags, minRating, isVerified, isPartner, filters.search]);

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

        // Update tags
        if (selectedTags.length > 0)
        {
            params.set('tags', selectedTags.join(','));
        } else
        {
            params.delete('tags');
        }

        // Update rating
        if (minRating[0] > 0)
        {
            params.set('minRating', minRating[0].toString());
        } else
        {
            params.delete('minRating');
        }

        // Update verification
        if (isVerified !== undefined)
        {
            params.set('verified', isVerified.toString());
        } else
        {
            params.delete('verified');
        }

        // Update partner
        if (isPartner !== undefined)
        {
            params.set('partner', isPartner.toString());
        } else
        {
            params.delete('partner');
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

        router.push(`/brands?${params.toString()}`);
    };

    // Update URL when filters change
    useEffect(() =>
    {
        const timeoutId = setTimeout(() =>
        {
            updateURL();
        }, 500); // Debounce URL updates

        return () => clearTimeout(timeoutId);
    }, [selectedCategories, selectedLocations, selectedTags, minRating, isVerified, isPartner, filters.search, filters.sortBy]);

    const handlePageChange = (page: number) =>
    {
        const params = new URLSearchParams(currentSearchParams.toString());
        params.set('page', page.toString());
        router.push(`/brands?${params.toString()}`);
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

    const toggleTag = (tag: string) =>
    {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
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
            case 'tags':
                if (value)
                {
                    setSelectedTags(prev => prev.filter(t => t !== value));
                }
                break;
            case 'rating':
                setMinRating([0]);
                break;
            case 'verified':
                setIsVerified(undefined);
                break;
            case 'partner':
                setIsPartner(undefined);
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
        setSelectedTags([]);
        setMinRating([0]);
        setIsVerified(undefined);
        setIsPartner(undefined);
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

            {/* Tags */}
            {!filterData.isLoading && !filterData.error && (
                <div>
                    <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">
                        Tags {tagOptions.length > 0 && `(${tagOptions.length})`}
                    </h3>
                    <div className="space-y-2">
                        {tagOptions.map(option => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={option.id}
                                    checked={selectedTags.includes(option.value)}
                                    onCheckedChange={() => toggleTag(option.value)}
                                    className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                                />
                                <Label
                                    htmlFor={option.id}
                                    className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal capitalize"
                                >
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Rating */}
            <div>
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">
                    Minimum Rating: {minRating[0]} stars
                </h3>
                <Slider
                    value={minRating}
                    onValueChange={(value) => setMinRating([value[0]])}
                    min={0}
                    max={5}
                    step={0.5}
                    className="mt-2"
                />
            </div>

            {/* Verification */}
            <div>
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Status</h3>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="verified"
                            checked={isVerified === true}
                            onCheckedChange={(checked) => setIsVerified(checked ? true : undefined)}
                            className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                        />
                        <Label
                            htmlFor="verified"
                            className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal"
                        >
                            Verified brands only
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="partner"
                            checked={isPartner === true}
                            onCheckedChange={(checked) => setIsPartner(checked ? true : undefined)}
                            className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                        />
                        <Label
                            htmlFor="partner"
                            className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal"
                        >
                            Partner brands only
                        </Label>
                    </div>
                </div>
            </div>
        </div>
    );

    if (error)
    {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Error loading brands. Please try again.</p>
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
                        placeholder="Search brands..."
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
                        onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as BrandFilters['sortBy'] }))}
                    >
                        <SelectTrigger className="w-[180px] bg-[#202020] border-[#575757] text-[#EDECF8]">
                            <SlidersHorizontal size={16} className="mr-2" />
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#171717] border-[#575757]">
                            <SelectItem value="popular">Most Popular</SelectItem>
                            <SelectItem value="rating">Highest Rated</SelectItem>
                            <SelectItem value="name">Name A-Z</SelectItem>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="collaborations">Most Collaborations</SelectItem>
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

                {/* Brand Grid/List */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-[#828288]">Loading brands...</p>
                        </div>
                    ) : (
                        <>
                            {/* Results Count */}
                            <p className="text-[#828288] mb-4">
                                Showing {data?.brands?.length || 0} of {data?.total || 0} brands
                            </p>

                            {/* Brands */}
                            <div className={viewMode === 'grid'
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                : "space-y-4"
                            }>
                                {data?.brands?.map((brand) => (
                                    <BrandCard
                                        key={brand.id}
                                        brand={brand}
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