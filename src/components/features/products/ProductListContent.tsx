// app/products/ProductListContent.tsx
'use client'

import { ProductCard } from '@/components/features/products/ProductCard';
import { ActiveFilter, ActiveFilters } from '@/components/ui/active-filters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SimplePagination } from '@/components/ui/custom/simple-paginations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useProductHooks, useBrandHooks } from '@/hooks/api';
import { useProductFilterData, transformToCheckboxOptions } from '@/hooks/filter-data';
import { Slider } from '@/components/ui/slider';

// Define basic interface for product filters
interface ProductFilters {
    search?: string;
    sortBy?: 'featured' | 'newest' | 'popular' | 'name' | 'rating';
    page?: number;
    limit?: number;
}
import { Filter, Grid3X3, List, Search, SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// Filter data is now loaded from APIs using the filter data hook
// Price functionality removed as system will not contain product prices

interface ProductListContentProps
{
    searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProductListContent({ searchParams }: ProductListContentProps)
{
    const router = useRouter();
    const currentSearchParams = useSearchParams();

    // Parse search params
    const [filters, setFilters] = useState<ProductFilters>({
        search: searchParams.search as string || '',
        sortBy: searchParams.sort as ProductFilters['sortBy'] || 'featured',
        page: parseInt(searchParams.page as string) || 1,
        limit: 12,
    });

    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        searchParams.categories ? (searchParams.categories as string).split(',') : []
    );
    const [selectedBrands, setSelectedBrands] = useState<string[]>(
        searchParams.brands ? (searchParams.brands as string).split(',') : []
    );
    // Price functionality removed - system will not contain product prices

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // Load filter data from APIs
    const filterData = useProductFilterData();
    
    // Transform filter data for UI components
    const categoryOptions = transformToCheckboxOptions(filterData.categories);
    const brandOptions = transformToCheckboxOptions(filterData.tags); // Use tags as brand options for now
    
    // Query products with selected filters
    const productHooks = useProductHooks();
    const { data, isLoading, error } = productHooks.getAll({
        ...filters,
        category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
        brand: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined,
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

        if (selectedBrands.length > 0)
        {
            activeFilters.push({
                key: 'brands',
                value: selectedBrands,
                label: 'Brand',
            });
        }

        // Price filtering removed - system will not contain product prices

        if (filters.search)
        {
            activeFilters.push({
                key: 'search',
                value: filters.search,
                label: 'Search',
            });
        }

        return activeFilters;
    }, [selectedCategories, selectedBrands, filters.search]);

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

        // Update brands
        if (selectedBrands.length > 0)
        {
            params.set('brands', selectedBrands.join(','));
        } else
        {
            params.delete('brands');
        }

        // Price range functionality removed - system will not contain product prices

        // Update other filters
        if (filters.search)
        {
            params.set('search', filters.search);
        } else
        {
            params.delete('search');
        }

        if (filters.sortBy !== 'featured')
        {
            params.set('sort', filters.sortBy!);
        } else
        {
            params.delete('sort');
        }

        params.set('page', '1'); // Reset to page 1 when filters change

        router.push(`/products?${params.toString()}`);
    };

    // Update URL when filters change
    useEffect(() =>
    {
        const timeoutId = setTimeout(() =>
        {
            updateURL();
        }, 500); // Debounce URL updates

        return () => clearTimeout(timeoutId);
    }, [selectedCategories, selectedBrands, filters.search, filters.sortBy]);

    const handlePageChange = (page: number) =>
    {
        const params = new URLSearchParams(currentSearchParams.toString());
        params.set('page', page.toString());
        router.push(`/products?${params.toString()}`);
    };

    const toggleCategory = (category: string) =>
    {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const toggleBrand = (brand: string) =>
    {
        setSelectedBrands(prev =>
            prev.includes(brand)
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        );
    };

    const toggleFavorite = (productId: string) =>
    {
        setFavorites(prev =>
        {
            const newFavorites = new Set(prev);
            if (newFavorites.has(productId))
            {
                newFavorites.delete(productId);
            } else
            {
                newFavorites.add(productId);
            }
            return newFavorites;
        });
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
            case 'brands':
                if (value)
                {
                    setSelectedBrands(prev => prev.filter(b => b !== value));
                }
                break;
            // Price filtering removed - system will not contain product prices
            case 'search':
                setFilters(prev => ({ ...prev, search: '' }));
                break;
        }
    };

    const handleClearAllFilters = () =>
    {
        setSelectedCategories([]);
        setSelectedBrands([]);
        // Price range removed - system will not contain product prices
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

            {/* Brands/Tags */}
            {!filterData.isLoading && !filterData.error && (
                <div>
                    <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">
                        Brands {brandOptions.length > 0 && `(${brandOptions.length})`}
                    </h3>
                    <div className="space-y-2">
                        {brandOptions.map(option => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={option.id}
                                    checked={selectedBrands.includes(option.value)}
                                    onCheckedChange={() => toggleBrand(option.value)}
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
        </div>
    );

    if (error)
    {
        return (
            <div className="text-center py-12">
                <p className="text-red-500">Error loading products. Please try again.</p>
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
                        placeholder="Search products..."
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
                        onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as ProductFilters['sortBy'] }))}
                    >
                        <SelectTrigger className="w-[180px] bg-[#202020] border-[#575757] text-[#EDECF8]">
                            <SlidersHorizontal size={16} className="mr-2" />
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#171717] border-[#575757]">
                            <SelectItem value="featured">Featured</SelectItem>
                            {/* Price sorting removed - system will not contain product prices */}
                            <SelectItem value="rating">Top Rated</SelectItem>
                            <SelectItem value="popular">Most Popular</SelectItem>
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

                {/* Product Grid/List */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-[#828288]">Loading products...</p>
                        </div>
                    ) : (
                        <>
                            {/* Results Count */}
                            <p className="text-[#828288] mb-4">
                                Showing {data?.products?.length || 0} of {data?.total || 0} products
                            </p>

                            {/* Products */}
                            <div className={viewMode === 'grid'
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                : "space-y-4"
                            }>
                                {data?.products?.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        viewMode={viewMode}
                                        isFavorite={favorites.has(product.id)}
                                        onToggleFavorite={() => toggleFavorite(product.id)}
                                        // enableCommerce prop removed - system will not contain product prices
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