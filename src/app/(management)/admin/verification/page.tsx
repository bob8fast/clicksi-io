// app/admin/verification/page.tsx
'use client'

export const dynamic = 'force-dynamic';

import { ActiveFilter, ActiveFilters } from '@/components/ui/active-filters';
import { Badge } from '@/components/ui/badge';
import { TeamTypeBadge } from '@/components/ui/badges';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { SimplePagination } from '@/components/ui/custom/simple-paginations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useVerificationHooks } from '@/hooks/api';
import
    {
        getStatusBadgeIcon,
        getStatusFilterIcon,
        getTeamTypeIcon,
        statusOptions
    } from '@/lib/verification-utils';
import { TeamType, VerificationApplicationDto, VerificationStatus } from '@/types';
import { getRequiredDocumentTypesMemoized, VerificationFiltersType } from '@/types/app/verification';
import
    {
        AlertCircle,
        Calendar,
        CheckCircle,
        Clock,
        Eye,
        Filter,
        Search,
        Shield,
        SlidersHorizontal,
        X
    } from 'lucide-react';
// import { useSession } from 'next-auth/react'; // Removed auth
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const teamTypeOptions: { value: TeamType; label: string }[] = [
    { value: "Creator", label: 'Creator' },
    { value: "Brand", label: 'Brand' },
    { value: "Retailer", label: 'Retailer' },
];

const sortOptions = [
    { value: 'application_date', label: 'Application Date' },
    { value: 'last_status_change_date', label: 'Last Status Change' },
    { value: 'status', label: 'Status' },
    { value: 'team_type', label: 'Team Type' },
];

export default function AdminVerificationListPage()
{
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Parse URL parameters
    const [filters, setFilters] = useState<VerificationFiltersType>({
        search: searchParams.get('search') || '',
        status: (searchParams.get('status') as VerificationStatus) || undefined,
        team_type: (searchParams.get('team_type') as TeamType) || undefined,
        submitted_date_from: searchParams.get('submitted_date_from') || '',
        submitted_date_to: searchParams.get('submitted_date_to') || '',
        sort_by: (searchParams.get('sort_by') as any) || 'application_date',
        sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc',
        page: parseInt(searchParams.get('page') || '1'),
        page_size: parseInt(searchParams.get('page_size') || '10'),
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Use the new verification hooks
    const verificationHooks = useVerificationHooks();
    const { data, isLoading, error } = verificationHooks.getApplications(filters, {
        query: {
            staleTime: 2 * 60 * 1000, // 2 minutes
            gcTime: 5 * 60 * 1000,    // 5 minutes
            refetchOnWindowFocus: false
        }
    });

    // Check admin access
    useEffect(() =>
    {
        if (session && session.user_info?.user_role !== 'Admin')
        {
            router.push('/');
        }
    }, [session, router]);

    // Build active filters for display
    const activeFilters: ActiveFilter[] = useMemo(() =>
    {
        const active: ActiveFilter[] = [];

        if (filters.search)
        {
            active.push({
                key: 'search',
                value: filters.search,
                label: 'Search',
            });
        }

        if (filters.status)
        {
            active.push({
                key: 'status',
                value: statusOptions.find(s => s.value === filters.status)?.label || filters.status,
                label: 'Status',
            });
        }

        if (filters.team_type)
        {
            active.push({
                key: 'team_type',
                value: teamTypeOptions.find(t => t.value === filters.team_type)?.label || filters.team_type,
                label: 'Team Type',
            });
        }

        if (filters.submitted_date_from)
        {
            active.push({
                key: 'submitted_date_from',
                value: new Date(filters.submitted_date_from).toLocaleDateString(),
                label: 'From Date',
            });
        }

        if (filters.submitted_date_to)
        {
            active.push({
                key: 'submitted_date_to',
                value: new Date(filters.submitted_date_to).toLocaleDateString(),
                label: 'To Date',
            });
        }

        return active;
    }, [filters]);

    // Update URL when filters change
    const updateURL = () =>
    {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) =>
        {
            if (value && value !== '' && value !== 'application_date' && value !== 'desc' && value !== 1 && value !== 10)
            {
                params.set(key, value.toString());
            }
        });

        router.push(`/admin/verification?${params.toString()}`);
    };

    useEffect(() =>
    {
        const timeoutId = setTimeout(updateURL, 500);
        return () => clearTimeout(timeoutId);
    }, [filters]);

    const handleFilterChange = (key: keyof VerificationFiltersType, value: any) =>
    {
        setFilters(prev =>
        {
            const newFilters = {
                ...prev,
                [key]: value,
                page: 1, // Reset to first page when filters change
            };

            return newFilters;
        });
    };

    const handleRemoveFilter = (filterKey: string) =>
    {
        const newFilters = { ...filters };
        switch (filterKey)
        {
            case 'search':
                newFilters.search = '';
                break;
            case 'status':
                newFilters.status = undefined;
                break;
            case 'team_type':
                newFilters.team_type = undefined;
                break;
            case 'submitted_date_from':
                newFilters.submitted_date_from = '';
                break;
            case 'submitted_date_to':
                newFilters.submitted_date_to = '';
                break;
        }
        setFilters(newFilters);
    };

    const handleClearAllFilters = () =>
    {
        setFilters({
            search: '',
            status: undefined,
            team_type: undefined,
            submitted_date_from: '',
            submitted_date_to: '',
            sort_by: 'application_date',
            sort_order: 'desc',
            page: 1,
            page_size: 10,
        });
    };

    const handlePageChange = (page: number) =>
    {
        setFilters(prev => ({ ...prev, page }));
    };

    const FilterSidebar = () => (
        <div className="space-y-6">
            {/* Status Filter */}
            <div>
                <Label className="text-[#EDECF8] mb-3 block">Status</Label>
                <div className="space-y-2">
                    {statusOptions.map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={option.value}
                                checked={filters.status === option.value}
                                onCheckedChange={(checked) =>
                                {
                                    handleFilterChange('status', checked ? option.value : undefined);
                                }}
                                className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                            />
                            <Label
                                htmlFor={option.value}
                                className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal flex items-center gap-2"
                            >
                                {getStatusFilterIcon(option.value)}
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Type Filter */}
            <div>
                <Label className="text-[#EDECF8] mb-3 block">Team Type</Label>
                <div className="space-y-2">
                    {teamTypeOptions.map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={option.value}
                                checked={filters.team_type === option.value}
                                onCheckedChange={(checked) =>
                                {
                                    handleFilterChange('team_type', checked ? option.value : undefined);
                                }}
                                className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                            />
                            <Label
                                htmlFor={option.value}
                                className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal flex items-center gap-2"
                            >
                                {getTeamTypeIcon(option.value)}
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Date Range Filter */}
            <div>
                <Label className="text-[#EDECF8] mb-3 block">Submission Date</Label>
                <div className="space-y-3">
                    <div>
                        <Label className="text-[#828288] text-sm">From</Label>
                        <Input
                            type="date"
                            value={filters.submitted_date_from}
                            onChange={(e) => handleFilterChange('submitted_date_from', e.target.value)}
                            className="bg-[#202020] border-[#575757] text-[#EDECF8] mt-1"
                        />
                    </div>
                    <div>
                        <Label className="text-[#828288] text-sm">To</Label>
                        <Input
                            type="date"
                            value={filters.submitted_date_to}
                            onChange={(e) => handleFilterChange('submitted_date_to', e.target.value)}
                            className="bg-[#202020] border-[#575757] text-[#EDECF8] mt-1"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    if (!session || session.user_info?.user_role !== 'Admin')
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-[#EDECF8] mb-4">Access Denied</h1>
                    <p className="text-[#828288] mb-6">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#EDECF8] mb-4 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-[#D78E59]" />
                        Verification Requests
                    </h1>
                    <p className="text-[#828288] text-lg">
                        Review and manage user verification requests
                    </p>
                </div>

                {/* Search and Controls */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#575757] h-5 w-5" />
                        <Input
                            type="text"
                            placeholder="Search by name, email, or business..."
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
                                <div className="mt-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                                    <FilterSidebar />
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Sort */}
                        <Select
                            value={`${filters.sort_by}-${filters.sort_order}`}
                            onValueChange={(value) =>
                            {
                                const [sortBy, sortOrder] = value.split('-');
                                handleFilterChange('sort_by', sortBy);
                                handleFilterChange('sort_order', sortOrder);
                            }}
                        >
                            <SelectTrigger className="w-[200px] bg-[#202020] border-[#575757] text-[#EDECF8]">
                                <SlidersHorizontal size={16} className="mr-2" />
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#171717] border-[#575757]">
                                {sortOptions.map(option => (
                                    <div key={option.value}>
                                        <SelectItem value={`${option.value}-desc`}>
                                            {option.label} (Newest)
                                        </SelectItem>
                                        <SelectItem value={`${option.value}-asc`}>
                                            {option.label} (Oldest)
                                        </SelectItem>
                                    </div>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Results per page */}
                        <Select
                            value={filters.page_size?.toString()}
                            onValueChange={(value) => handleFilterChange('page_size', parseInt(value))}
                        >
                            <SelectTrigger className="w-[120px] bg-[#202020] border-[#575757] text-[#EDECF8]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#171717] border-[#575757]">
                                <SelectItem value="10">10 per page</SelectItem>
                                <SelectItem value="25">25 per page</SelectItem>
                                <SelectItem value="50">50 per page</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Desktop Sidebar - Fixed position */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-[#090909] rounded-xl p-6 border border-[#202020] sticky top-24">
                            <FilterSidebar />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Active Filters - Moved inside main content area */}
                        <ActiveFilters
                            filters={activeFilters}
                            onRemoveFilter={handleRemoveFilter}
                            onClearAll={handleClearAllFilters}
                        />

                        {isLoading ? (
                            <div className="text-center py-12">
                                <p className="text-[#828288]">Loading verification requests...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-500">Error loading verification requests</p>
                            </div>
                        ) : (
                            <>
                                {/* Results Summary */}
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-[#828288]">
                                        Showing {data?.verifications?.length || 0} of {data?.total || 0} requests
                                    </p>
                                </div>

                                {/* Verification List */}
                                <div className="space-y-4">
                                    {data?.verifications && data.verifications.map((verification) => (
                                        <VerificationCard key={verification.id} verification={verification} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {data && data.total_pages! > 1 && (
                                    <SimplePagination
                                        currentPage={data.page!}
                                        totalPages={data.total_pages!}
                                        onPageChange={handlePageChange}
                                        className="mt-12"
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Verification Card Component
interface VerificationCardProps
{
    verification: VerificationApplicationDto;
}

function VerificationCard({ verification }: VerificationCardProps)
{
    const verificationDocuments = verification.documents || [];
    const requiredDocs = getRequiredDocumentTypesMemoized(
        verification?.team?.team_type || 'Unknown'
    );

    const getStatusIcon = (status: VerificationStatus) =>
    {
        switch (status)
        {
            case 'Draft':
                return <Clock className="w-5 h-5 text-[#FFAA6C]" />;
            case 'UnderReview':
                return <AlertCircle className="w-5 h-5 text-[#D78E59]" />;
            case 'Approved':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Rejected':
                return <X className="w-5 h-5 text-red-500" />;
            case 'NeedMoreInformation':
                return <AlertCircle className="w-5 h-5 text-[#FFAA6C]" />;
            default:
                return <Clock className="w-5 h-5 text-[#FFAA6C]" />;
        }
    };

    const getStatusColor = (status: VerificationStatus) =>
    {
        switch (status)
        {
            case 'Draft':
                return 'bg-gray-500';
            case 'UnderReview':
                return 'bg-blue-500';
            case 'Approved':
                return 'bg-green-500';
            case 'Rejected':
                return 'bg-red-500';
            case 'NeedMoreInformation':
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <Card className="bg-[#090909] border-[#202020] hover:border-[#575757] transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-5 h-5 flex items-center justify-center text-[#575757]">
                                {getTeamTypeIcon(verification.team?.team_type)}
                            </div>
                            <h3 className="text-lg font-semibold text-[#EDECF8]">
                                {verification.team?.name || 'Unknown Team'}
                            </h3>
                            <Badge
                                variant="secondary"
                                className={`${getStatusColor(verification.status!)} text-white flex items-center gap-1`}
                            >
                                {getStatusBadgeIcon(verification.status!)}
                                {verification.status}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-[#575757]">Team Owner</p>
                                <div>
                                    <p className="text-[#828288] font-medium">{verification.team?.owner_user?.full_name || 'N/A'}</p>
                                    <p className="text-[#575757] text-xs">{verification.team?.owner_user?.email || ''}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-[#575757]">Team Type</p>
                                <div className="flex items-center gap-2">
                                    <TeamTypeBadge
                                        teamType={verification.team?.team_type || 'Unknown'}
                                        size="sm"
                                        showIcon={true}
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-[#575757]">Submitted</p>
                                <p className="text-[#828288] flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {verification.application_date && new Date(verification.application_date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-[#575757]">
                            <div className="flex items-center gap-4">
                                <span>{verificationDocuments.length} documents uploaded</span>
                                <span>
                                    {verificationDocuments.filter(d => d.is_required).length}/
                                    {requiredDocs.length} required documents
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span>{verification.team?.member_count || 0} members</span>
                                <div className={`w-2 h-2 rounded-full ${verification.team?.is_active ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                        <Button
                            asChild
                            size="sm"
                            className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                        >
                            <Link href={`/admin/verification/${verification.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Review
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}