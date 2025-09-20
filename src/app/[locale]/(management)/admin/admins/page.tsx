// app/admin/admins/page.tsx
'use client'

import { ActiveFilter, ActiveFilters } from '@/components/ui/active-filters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SimplePagination } from '@/components/ui/custom/simple-paginations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAdminHooks } from '@/hooks/api/admin-hooks';
import { AdminAccessLevel, AdminFilters } from '@/types/app/admin';
import
{
    Filter,
    Search,
    Shield,
    SlidersHorizontal,
    User,
    UserCheck,
    UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// Helper functions
const getAccessLevelBadgeColor = (level: AdminAccessLevel) =>
{
    switch (level)
    {
        case 'SuperAdmin': return 'bg-red-500/20 text-red-400 border-red-500/30';
        case 'Elevated': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'Standard': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
};

const getAccessLevelIcon = (level: AdminAccessLevel) =>
{
    switch (level)
    {
        case 'SuperAdmin': return <Shield className="h-4 w-4" />;
        case 'Elevated': return <UserCheck className="h-4 w-4" />;
        case 'Standard': return <User className="h-4 w-4" />;
        default: return <User className="h-4 w-4" />;
    }
};

export default function AdminListPage()
{
    const router = useRouter();
    const searchParams = useSearchParams();

    // Parse search params into filters
    const [filters, setFilters] = useState<AdminFilters>({
        search: searchParams.get('search') || '',
        accessLevel: (searchParams.get('accessLevel') as AdminAccessLevel) || undefined,
        isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
        sortBy: (searchParams.get('sortBy') as AdminFilters['sortBy']) || 'createdAt',
        sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const adminHooks = useAdminHooks();

    // Fetch admins
    const { data, isLoading, error } = adminHooks.getAll(filters);

    // Build active filters for display
    const activeFilters: ActiveFilter[] = useMemo(() =>
    {
        const activeFilters: ActiveFilter[] = [];

        if (filters.search)
        {
            activeFilters.push({
                key: 'search',
                value: filters.search,
                label: 'Search',
            });
        }

        if (filters.accessLevel)
        {
            activeFilters.push({
                key: 'accessLevel',
                value: filters.accessLevel,
                label: 'Access Level',
            });
        }

        if (filters.isActive !== undefined)
        {
            activeFilters.push({
                key: 'isActive',
                value: filters.isActive ? 'Active' : 'Inactive',
                label: 'Status',
            });
        }

        return activeFilters;
    }, [filters]);

    // Update URL when filters change
    const updateURL = () =>
    {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) =>
        {
            if (value !== undefined && value !== '' && value !== 1 && value !== 20 &&
                !(key === 'sortBy' && value === 'createdAt') &&
                !(key === 'sortOrder' && value === 'desc'))
            {
                params.set(key, String(value));
            }
        });

        router.push(`/admin/admins?${params.toString()}`);
    };

    // Update URL when filters change (debounced)
    useEffect(() =>
    {
        const timeoutId = setTimeout(() =>
        {
            updateURL();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [filters]);

    const handleFilterChange = (key: keyof AdminFilters, value: any) =>
    {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (page: number) =>
    {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleRemoveFilter = (filterKey: string) =>
    {
        switch (filterKey)
        {
            case 'search':
                handleFilterChange('search', '');
                break;
            case 'accessLevel':
                handleFilterChange('accessLevel', undefined);
                break;
            case 'isActive':
                handleFilterChange('isActive', undefined);
                break;
        }
    };

    const handleClearAllFilters = () =>
    {
        setFilters({
            search: '',
            accessLevel: undefined,
            isActive: undefined,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            page: 1,
            limit: 20,
        });
    };

    const FilterSidebar = () => (
        <div className="space-y-6">
            {/* Access Level Filter */}
            <div>
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Access Level</h3>
                <div className="space-y-2">
                    {(['Standard', 'Elevated', 'SuperAdmin'] as AdminAccessLevel[]).map(level => (
                        <div key={level} className="flex items-center space-x-2">
                            <Checkbox
                                id={level}
                                checked={filters.accessLevel === level}
                                onCheckedChange={(checked) =>
                                    handleFilterChange('accessLevel', checked ? level : undefined)
                                }
                                className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                            />
                            <Label
                                htmlFor={level}
                                className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal flex items-center gap-2"
                            >
                                {getAccessLevelIcon(level)}
                                {level === 'SuperAdmin' ? 'Super Admin' : level}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Status Filter */}
            <div>
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Account Status</h3>
                <div className="space-y-2">
                    {[
                        { value: true, label: 'Active' },
                        { value: false, label: 'Inactive' }
                    ].map(({ value, label }) => (
                        <div key={String(value)} className="flex items-center space-x-2">
                            <Checkbox
                                id={String(value)}
                                checked={filters.isActive === value}
                                onCheckedChange={(checked) =>
                                    handleFilterChange('isActive', checked ? value : undefined)
                                }
                                className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                            />
                            <Label
                                htmlFor={String(value)}
                                className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal"
                            >
                                {label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#EDECF8] mb-2">Admin Management</h1>
                    <p className="text-[#828288]">Manage administrator accounts and permissions</p>
                </div>

                <Link href="/admin/admins/create">
                    <Button className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Admin
                    </Button>
                </Link>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#575757] h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Search admins by name or email..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
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
                            <div className="mt-6">
                                <FilterSidebar />
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Sort */}
                    <Select
                        value={`${filters.sortBy}-${filters.sortOrder}`}
                        onValueChange={(value) =>
                        {
                            const [sortBy, sortOrder] = value.split('-') as [AdminFilters['sortBy'], 'asc' | 'desc'];
                            setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                        }}
                    >
                        <SelectTrigger className="w-[200px] bg-[#202020] border-[#575757] text-[#EDECF8]">
                            <SlidersHorizontal size={16} className="mr-2" />
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#171717] border-[#575757]">
                            <SelectItem value="createdAt-desc">Newest First</SelectItem>
                            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                            <SelectItem value="firstName-asc">Name A-Z</SelectItem>
                            <SelectItem value="firstName-desc">Name Z-A</SelectItem>
                            <SelectItem value="email-asc">Email A-Z</SelectItem>
                            <SelectItem value="lastLoginAt-desc">Last Login</SelectItem>
                        </SelectContent>
                    </Select>
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
                    <div className="bg-[#090909] rounded-xl p-6 border border-[#202020] sticky top-24">
                        <FilterSidebar />
                    </div>
                </aside>

                {/* Admins List */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-[#828288]">Loading administrators...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-400">Error loading administrators. Please try again.</p>
                        </div>
                    ) : (
                        <>
                            {/* Results Count */}
                            <p className="text-[#828288] mb-4">
                                Showing {data?.results.length || 0} of {data?.total || 0} administrators
                            </p>

                            {/* Admins Grid */}
                            <div className="space-y-4">
                                {data?.results.map((admin: any) => (
                                    <Link key={admin.user_id} href={`/admin/admins/${admin.user_id}`}>
                                        <div className="bg-[#090909] border border-[#202020] rounded-xl p-6 hover:border-[#575757] transition-all duration-200 hover:bg-[#171717] cursor-pointer">
                                            <div className="flex items-start gap-4">
                                                {/* Avatar */}
                                                <div className="w-16 h-16 rounded-full bg-[#202020] border-2 border-[#575757] overflow-hidden flex-shrink-0">
                                                    {admin.profileImage ? (
                                                        <img
                                                            src={admin.profileImage}
                                                            alt={`${admin.firstName} ${admin.lastName}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Shield className="h-8 w-8 text-[#575757]" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Admin Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-[#EDECF8] truncate">
                                                                {admin.firstName} {admin.lastName}
                                                            </h3>
                                                            <p className="text-[#828288] truncate">{admin.email}</p>
                                                        </div>

                                                        <div className="flex flex-col items-end gap-2">
                                                            <Badge className={`${getAccessLevelBadgeColor(admin.access_level)} border`}>
                                                                <div className="flex items-center gap-1">
                                                                    {getAccessLevelIcon(admin.access_level)}
                                                                    {admin.access_level === 'SuperAdmin' ? 'Super Admin' : admin.access_level}
                                                                </div>
                                                            </Badge>

                                                            {admin.user_status !== 'Active' && (
                                                                <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 border">
                                                                    Inactive
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Permissions Preview */}
                                                    <div className="mb-3">
                                                        <p className="text-sm text-[#575757] mb-1">Permissions:</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {admin.permission_names.slice(0, 3).map((permission: any) => (
                                                                <Badge
                                                                    key={permission}
                                                                    variant="outline"
                                                                    className="text-xs bg-[#202020] text-[#828288] border-[#575757]"
                                                                >
                                                                    {permission}
                                                                </Badge>
                                                            ))}
                                                            {admin.permission_names.length > 3 && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs bg-[#202020] text-[#828288] border-[#575757]"
                                                                >
                                                                    +{admin.permission_names.length - 3} more
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between text-sm text-[#575757]">
                                                        <div className="flex gap-4">
                                                            <span>
                                                                Created: {new Date(admin.createdAt).toLocaleDateString()}
                                                            </span>
                                                            {admin.createdBy && admin.createdBy !== 'system' && (
                                                                <span>by Admin</span>
                                                            )}
                                                        </div>

                                                        {admin.lastLoginAt && (
                                                            <span>
                                                                Last login: {new Date(admin.lastLoginAt).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {data && data.totalPages > 1 && (
                                <SimplePagination
                                    currentPage={data.page}
                                    totalPages={data.totalPages}
                                    onPageChange={handlePageChange}
                                    className="mt-8"
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}