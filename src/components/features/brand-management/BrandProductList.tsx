// components/brand-management/BrandProductList.tsx
'use client'

import { ActiveFilter, ActiveFilters } from '@/components/ui/active-filters';
import
{
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SimplePagination } from '@/components/ui/custom/simple-paginations';
import
{
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { useBrandProducts, useDeleteBrandProduct } from '@/hooks/use-brand-product';
import
{
    BrandProductFilters,
    PRODUCT_CATEGORIES,
    PRODUCT_SUBCATEGORIES,
    ProductLifecycleStatus,
    ProductPublicationStatus
} from '@/types/brand-product';
import
{
    AlertTriangle,
    BarChart3,
    Edit,
    Eye,
    Filter,
    Grid3X3,
    Heart,
    List,
    MoreHorizontal,
    Package,
    Plus,
    Search,
    SlidersHorizontal,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface BrandProductListProps
{
    brandId: string;
    searchParams: { [key: string]: string | string[] | undefined };
}

const getStatusColor = (publicationStatus: ProductPublicationStatus) =>
{
    switch (publicationStatus)
    {
        case ProductPublicationStatus.Active:
            return 'bg-[#D78E59] text-[#171717]';
        case ProductPublicationStatus.Draft:
            return 'bg-[#575757] text-[#EDECF8]';
        case ProductPublicationStatus.Inactive:
            return 'bg-red-900 text-red-200';
        default:
            return 'bg-[#202020] text-[#828288]';
    }
};

const getStatusText = (publicationStatus: ProductPublicationStatus) =>
{
    switch (publicationStatus)
    {
        case ProductPublicationStatus.Active:
            return 'Active';
        case ProductPublicationStatus.Draft:
            return 'Draft';
        case ProductPublicationStatus.Inactive:
            return 'Inactive';
        default:
            return 'Unknown';
    }
};

const getLifecycleText = (lifecycleStatus: ProductLifecycleStatus) =>
{
    switch (lifecycleStatus)
    {
        case ProductLifecycleStatus.Regular:
            return 'Regular';
        case ProductLifecycleStatus.ComingSoon:
            return 'Coming Soon';
        case ProductLifecycleStatus.Discontinued:
            return 'Discontinued';
        default:
            return 'Unknown';
    }
};

export default function BrandProductList({ brandId, searchParams }: BrandProductListProps)
{
    const router = useRouter();
    const currentSearchParams = useSearchParams();

    // Parse search params
    const [filters, setFilters] = useState<BrandProductFilters>({
        search: searchParams.search as string || '',
        sortBy: searchParams.sortBy as BrandProductFilters['sortBy'] || 'updatedAt',
        sortOrder: searchParams.sortOrder as 'asc' | 'desc' || 'desc',
        page: parseInt(searchParams.page as string) || 1,
        limit: 12,
    });

    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        searchParams.categories ? (searchParams.categories as string).split(',') : []
    );
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
        searchParams.subcategories ? (searchParams.subcategories as string).split(',') : []
    );
    const [selectedPublicationStatus, setSelectedPublicationStatus] = useState<ProductPublicationStatus[]>(
        searchParams.publicationStatus
            ? (searchParams.publicationStatus as string).split(',').map(s => parseInt(s) as ProductPublicationStatus)
            : []
    );
    const [selectedLifecycleStatus, setSelectedLifecycleStatus] = useState<ProductLifecycleStatus[]>(
        searchParams.lifecycleStatus
            ? (searchParams.lifecycleStatus as string).split(',').map(s => parseInt(s) as ProductLifecycleStatus)
            : []
    );
    const [selectedTags, setSelectedTags] = useState<string[]>(
        searchParams.tags ? (searchParams.tags as string).split(',') : []
    );
    const [priceRange, setPriceRange] = useState<[number, number]>([
        searchParams.minPrice ? parseFloat(searchParams.minPrice as string) : 0,
        searchParams.maxPrice ? parseFloat(searchParams.maxPrice as string) : 100,
    ]);
    const [lowStock, setLowStock] = useState<boolean>(
        searchParams.lowStock === 'true'
    );

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

    // Query products with selected filters
    const { data, isLoading, error } = useBrandProducts(brandId, {
        ...filters,
        category: selectedCategories.length > 0 ? selectedCategories[0] : undefined,
        subcategory: selectedSubcategories.length > 0 ? selectedSubcategories[0] : undefined,
        publicationStatus: selectedPublicationStatus.length > 0 ? selectedPublicationStatus : undefined,
        lifecycleStatus: selectedLifecycleStatus.length > 0 ? selectedLifecycleStatus : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 100 ? priceRange[1] : undefined,
        lowStock,
    });

    const deleteProduct = useDeleteBrandProduct(brandId);

    // Available tags from current products
    const availableTags = useMemo(() =>
    {
        if (!data?.products) return [];
        const tags = new Set<string>();
        data.products.forEach(product =>
        {
            product.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [data?.products]);

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

        if (selectedSubcategories.length > 0)
        {
            activeFilters.push({
                key: 'subcategories',
                value: selectedSubcategories,
                label: 'Subcategory',
            });
        }

        if (selectedPublicationStatus.length > 0)
        {
            activeFilters.push({
                key: 'publicationStatus',
                value: selectedPublicationStatus.map(s => getStatusText(s)),
                label: 'Status',
            });
        }

        if (selectedLifecycleStatus.length > 0)
        {
            activeFilters.push({
                key: 'lifecycleStatus',
                value: selectedLifecycleStatus.map(s => getLifecycleText(s)),
                label: 'Lifecycle',
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

        if (priceRange[0] > 0 || priceRange[1] < 100)
        {
            activeFilters.push({
                key: 'price',
                value: `$${priceRange[0]} - $${priceRange[1]}`,
                label: 'Price',
            });
        }

        if (lowStock)
        {
            activeFilters.push({
                key: 'lowStock',
                value: 'Low stock only',
                label: 'Stock',
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
    }, [selectedCategories, selectedSubcategories, selectedPublicationStatus, selectedLifecycleStatus, selectedTags, priceRange, lowStock, filters.search]);

    // Update URL when filters change
    const updateURL = () =>
    {
        const params = new URLSearchParams(currentSearchParams.toString());

        // Update filters
        if (selectedCategories.length > 0)
        {
            params.set('categories', selectedCategories.join(','));
        } else
        {
            params.delete('categories');
        }

        if (selectedSubcategories.length > 0)
        {
            params.set('subcategories', selectedSubcategories.join(','));
        } else
        {
            params.delete('subcategories');
        }

        if (selectedPublicationStatus.length > 0)
        {
            params.set('publicationStatus', selectedPublicationStatus.join(','));
        } else
        {
            params.delete('publicationStatus');
        }

        if (selectedLifecycleStatus.length > 0)
        {
            params.set('lifecycleStatus', selectedLifecycleStatus.join(','));
        } else
        {
            params.delete('lifecycleStatus');
        }

        if (selectedTags.length > 0)
        {
            params.set('tags', selectedTags.join(','));
        } else
        {
            params.delete('tags');
        }

        if (priceRange[0] > 0)
        {
            params.set('minPrice', priceRange[0].toString());
        } else
        {
            params.delete('minPrice');
        }

        if (priceRange[1] < 100)
        {
            params.set('maxPrice', priceRange[1].toString());
        } else
        {
            params.delete('maxPrice');
        }

        if (lowStock)
        {
            params.set('lowStock', 'true');
        } else
        {
            params.delete('lowStock');
        }

        if (filters.search)
        {
            params.set('search', filters.search);
        } else
        {
            params.delete('search');
        }

        if (filters.sortBy !== 'updatedAt')
        {
            params.set('sortBy', filters.sortBy!);
        } else
        {
            params.delete('sortBy');
        }

        if (filters.sortOrder !== 'desc')
        {
            params.set('sortOrder', filters.sortOrder!);
        } else
        {
            params.delete('sortOrder');
        }

        params.set('page', '1'); // Reset to page 1 when filters change

        router.push(`/brand-management/products?${params.toString()}`);
    };

    // Update URL when filters change
    useEffect(() =>
    {
        const timeoutId = setTimeout(() =>
        {
            updateURL();
        }, 500); // Debounce URL updates

        return () => clearTimeout(timeoutId);
    }, [selectedCategories, selectedSubcategories, selectedPublicationStatus, selectedLifecycleStatus, selectedTags, priceRange, lowStock, filters.search, filters.sortBy, filters.sortOrder]);

    const handlePageChange = (page: number) =>
    {
        const params = new URLSearchParams(currentSearchParams.toString());
        params.set('page', page.toString());
        router.push(`/brand-management/products?${params.toString()}`);
    };

    const toggleCategory = (category: string) =>
    {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [category] // Only allow one category
        );
        setSelectedSubcategories([]); // Reset subcategories when category changes
    };

    const toggleSubcategory = (subcategory: string) =>
    {
        setSelectedSubcategories(prev =>
            prev.includes(subcategory)
                ? prev.filter(s => s !== subcategory)
                : [subcategory] // Only allow one subcategory
        );
    };

    const togglePublicationStatus = (status: ProductPublicationStatus) =>
    {
        setSelectedPublicationStatus(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };

    const toggleLifecycleStatus = (status: ProductLifecycleStatus) =>
    {
        setSelectedLifecycleStatus(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
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
            case 'subcategories':
                if (value)
                {
                    setSelectedSubcategories(prev => prev.filter(s => s !== value));
                }
                break;
            case 'publicationStatus':
                if (value)
                {
                    const statusValue = Object.values(ProductPublicationStatus)
                        .find(s => getStatusText(s as ProductPublicationStatus) === value) as ProductPublicationStatus;
                    setSelectedPublicationStatus(prev => prev.filter(s => s !== statusValue));
                }
                break;
            case 'lifecycleStatus':
                if (value)
                {
                    const statusValue = Object.values(ProductLifecycleStatus)
                        .find(s => getLifecycleText(s as ProductLifecycleStatus) === value) as ProductLifecycleStatus;
                    setSelectedLifecycleStatus(prev => prev.filter(s => s !== statusValue));
                }
                break;
            case 'tags':
                if (value)
                {
                    setSelectedTags(prev => prev.filter(t => t !== value));
                }
                break;
            case 'price':
                setPriceRange([0, 100]);
                break;
            case 'lowStock':
                setLowStock(false);
                break;
            case 'search':
                setFilters(prev => ({ ...prev, search: '' }));
                break;
        }
    };

    const handleClearAllFilters = () =>
    {
        setSelectedCategories([]);
        setSelectedSubcategories([]);
        setSelectedPublicationStatus([]);
        setSelectedLifecycleStatus([]);
        setSelectedTags([]);
        setPriceRange([0, 100]);
        setLowStock(false);
        setFilters(prev => ({ ...prev, search: '' }));
    };

    const handleDeleteProduct = async () =>
    {
        if (!deleteProductId) return;

        try
        {
            await deleteProduct.mutateAsync(deleteProductId);
            setDeleteProductId(null);
        } catch (error)
        {
            console.error('Failed to delete product:', error);
        }
    };

    const FilterSidebar = () => (
        <div className="space-y-6">
            {/* Categories */}
            <div>
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Category</h3>
                <div className="space-y-2">
                    {PRODUCT_CATEGORIES.map(category => (
                        <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                                id={category}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={() => toggleCategory(category)}
                                className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                            />
                            <Label
                                htmlFor={category}
                                className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal"
                            >
                                {category}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subcategories */}
            {selectedCategories.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Subcategory</h3>
                    <div className="space-y-2">
                        {PRODUCT_SUBCATEGORIES[selectedCategories[0] as keyof typeof PRODUCT_SUBCATEGORIES]?.map(subcategory => (
                            <div key={subcategory} className="flex items-center space-x-2">
                                <Checkbox
                                    id={subcategory}
                                    checked={selectedSubcategories.includes(subcategory)}
                                    onCheckedChange={() => toggleSubcategory(subcategory)}
                                    className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                                />
                                <Label
                                    htmlFor={subcategory}
                                    className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal"
                                >
                                    {subcategory}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Publication Status */}
            <div>
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Publication Status</h3>
                <div className="space-y-2">
                    {Object.values(ProductPublicationStatus).filter(v => typeof v === 'number').map(status => (
                        <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                                id={`pub-${status}`}
                                checked={selectedPublicationStatus.includes(status as ProductPublicationStatus)}
                                onCheckedChange={() => togglePublicationStatus(status as ProductPublicationStatus)}
                                className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                            />
                            <Label
                                htmlFor={`pub-${status}`}
                                className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal"
                            >
                                {getStatusText(status as ProductPublicationStatus)}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lifecycle Status */}
            <div>
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Lifecycle Status</h3>
                <div className="space-y-2">
                    {Object.values(ProductLifecycleStatus).filter(v => typeof v === 'number').map(status => (
                        <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                                id={`life-${status}`}
                                checked={selectedLifecycleStatus.includes(status as ProductLifecycleStatus)}
                                onCheckedChange={() => toggleLifecycleStatus(status as ProductLifecycleStatus)}
                                className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                            />
                            <Label
                                htmlFor={`life-${status}`}
                                className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal"
                            >
                                {getLifecycleText(status as ProductLifecycleStatus)}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tags */}
            {availableTags.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Tags</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {availableTags.map(tag => (
                            <div key={tag} className="flex items-center space-x-2">
                                <Checkbox
                                    id={tag}
                                    checked={selectedTags.includes(tag)}
                                    onCheckedChange={() => toggleTag(tag)}
                                    className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                                />
                                <Label
                                    htmlFor={tag}
                                    className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal capitalize"
                                >
                                    {tag}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Price Range */}
            <div>
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                </h3>
                <Slider
                    value={priceRange}
                    onValueChange={(value) => setPriceRange([value[0], value[1]])}
                    min={0}
                    max={100}
                    step={5}
                    className="mt-2"
                />
            </div>

            {/* Stock Filter */}
            <div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="lowStock"
                        checked={lowStock}
                        onCheckedChange={(value) => setLowStock(value as boolean)}
                        className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                    />
                    <Label
                        htmlFor="lowStock"
                        className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal"
                    >
                        Low stock only
                    </Label>
                </div>
            </div>
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#EDECF8]">Products</h1>
                    <p className="text-[#828288] mt-1">Manage your product catalog</p>
                </div>
                <Button
                    onClick={() => router.push('/brand-management/products/create')}
                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Button>
            </div>

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
                        value={`${filters.sortBy}-${filters.sortOrder}`}
                        onValueChange={(value) =>
                        {
                            const [sortBy, sortOrder] = value.split('-') as [BrandProductFilters['sortBy'], 'asc' | 'desc'];
                            setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                        }}
                    >
                        <SelectTrigger className="w-[200px] bg-[#202020] border-[#575757] text-[#EDECF8]">
                            <SlidersHorizontal size={16} className="mr-2" />
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#171717] border-[#575757]">
                            <SelectItem value="updatedAt-desc">Recently Updated</SelectItem>
                            <SelectItem value="createdAt-desc">Newest First</SelectItem>
                            <SelectItem value="name-asc">Name A-Z</SelectItem>
                            <SelectItem value="name-desc">Name Z-A</SelectItem>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                            <SelectItem value="viewCount-desc">Most Viewed</SelectItem>
                            <SelectItem value="stock-asc">Lowest Stock</SelectItem>
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
                                Showing {data?.products.length || 0} of {data?.total || 0} products
                            </p>

                            {/* Products */}
                            <div className={viewMode === 'grid'
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                : "space-y-4"
                            }>
                                {data?.products.map((product) => (
                                    <div
                                        key={product.id}
                                        className={`group relative bg-[#090909] rounded-xl border border-[#202020] hover:border-[#575757] transition-all duration-300 overflow-hidden ${viewMode === 'list' ? 'flex' : ''
                                            }`}
                                    >
                                        {/* Image */}
                                        <Link
                                            href={`/brand-management/products/${product.id}`}
                                            className={viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}
                                        >
                                            <div className={`relative ${viewMode === 'list' ? 'h-full' : 'aspect-square'} bg-[#202020] overflow-hidden`}>
                                                <img
                                                    src={product.primaryImage}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    style={{
                                                        backgroundColor: '#202020',
                                                        backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3e%3cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23575757' stroke-width='0.5'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100' height='100' fill='url(%23grid)'/%3e%3c/svg%3e")`,
                                                    }}
                                                />

                                                {/* Status Badges */}
                                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                    <Badge className={getStatusColor(product.publicationStatus)}>
                                                        {getStatusText(product.publicationStatus)}
                                                    </Badge>
                                                    {product.lifecycleStatus !== ProductLifecycleStatus.Regular && (
                                                        <Badge className="bg-[#202020] text-[#828288] border border-[#575757]">
                                                            {getLifecycleText(product.lifecycleStatus)}
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Low Stock Warning */}
                                                {product.totalStock <= product.lowStockThreshold && (
                                                    <Badge className="absolute top-2 right-2 bg-[#575757] text-[#FFAA6C]">
                                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                                        Low Stock
                                                    </Badge>
                                                )}
                                            </div>
                                        </Link>

                                        {/* Content */}
                                        <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col' : ''}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <Link href={`/brand-management/products/${product.id}`} className="flex-1">
                                                    <h3 className="font-semibold text-[#EDECF8] hover:text-[#D78E59] transition-colors line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="ml-2 hover:bg-[#202020]">
                                                            <MoreHorizontal size={16} className="text-[#575757]" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="bg-[#171717] border-[#575757]">
                                                        <DropdownMenuItem asChild className="cursor-pointer">
                                                            <Link href={`/brand-management/products/${product.id}`}>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild className="cursor-pointer">
                                                            <Link href={`/brand-management/products/${product.id}/edit`}>
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-[#575757]" />
                                                        <DropdownMenuItem
                                                            onClick={() => setDeleteProductId(product.id)}
                                                            className="cursor-pointer text-red-400 focus:text-red-300"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <p className="text-[#575757] text-sm mb-2">{product.category}</p>
                                            <p className="text-[#575757] text-sm mb-2">{product.sku}</p>

                                            {/* Stats */}
                                            <div className="flex items-center gap-4 text-sm text-[#575757] mb-3">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    {product.viewCount}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Heart className="w-3 h-3" />
                                                    {product.creatorInterest}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Package className="w-3 h-3" />
                                                    {product.totalStock}
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            {viewMode === 'list' && (
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {product.tags.slice(0, 3).map(tag => (
                                                        <Badge key={tag} variant="secondary" className="bg-[#202020] text-[#828288] text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Price */}
                                            <div className={`${viewMode === 'list' ? 'mt-auto' : ''} flex items-center justify-between`}>
                                                <span className="text-lg font-bold text-[#EDECF8]">${product.basePrice}</span>
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/brand-management/products/${product.id}/edit`}>
                                                        <Button size="sm" variant="ghost" className="text-[#828288] hover:text-[#D78E59]">
                                                            <Edit size={14} />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/brand-management/products/${product.id}`}>
                                                        <Button size="sm" className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]">
                                                            <BarChart3 size={14} />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {data && data.totalPages > 1 && (
                                <SimplePagination
                                    currentPage={data.page}
                                    totalPages={data.totalPages}
                                    onPageChange={handlePageChange}
                                    className="mt-12"
                                />
                            )}

                            {/* No Results */}
                            {data && data.products.length === 0 && (
                                <div className="text-center py-12">
                                    <Package className="w-16 h-16 text-[#575757] mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-[#EDECF8] mb-2">No products found</h3>
                                    <p className="text-[#828288] mb-6">
                                        {activeFilters.length > 0
                                            ? "Try adjusting your filters or create a new product."
                                            : "Get started by creating your first product."
                                        }
                                    </p>
                                    <Button
                                        onClick={() => router.push('/brand-management/products/create')}
                                        className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Product
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
                <AlertDialogContent className="bg-[#171717] border-[#575757]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[#EDECF8]">Delete Product</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#828288]">
                            Are you sure you want to delete this product? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-[#575757] text-[#828288] hover:bg-[#202020]">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteProduct}
                            disabled={deleteProduct.isPending}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {deleteProduct.isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}