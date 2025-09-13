// app/admin/users/page.tsx
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
import ResponsiveModal from '@/components/ui/responsive-modal';
import { useSearchUsers, useGetUserById } from '@/gen/api/hooks/user_management/users';
import { BusinessType, UserRole } from '@/types';
import { UserFilters, VerificationStatus } from '@/types/admin';
import
    {
        CheckCircle,
        Clock,
        Filter,
        Search,
        Shield,
        SlidersHorizontal,
        User,
        Users,
        XCircle
    } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// Helper functions
const getRoleIcon = (role: UserRole) =>
{
    switch (role)
    {
        case 'Admin': return <Shield className="h-4 w-4" />;
        case 'Creator': return <User className="h-4 w-4" />;
        case 'BusinessUser': return <Users className="h-4 w-4" />;
        default: return <User className="h-4 w-4" />;
    }
};

const getRoleBadgeColor = (role: UserRole) =>
{
    switch (role)
    {
        case 'Admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
        case 'Creator': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'BusinessUser': return 'bg-green-500/20 text-green-400 border-green-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
};

const getVerificationIcon = (status: VerificationStatus) =>
{
    switch (status)
    {
        case 'Verified': return <CheckCircle className="h-4 w-4 text-green-400" />;
        case 'Pending': return <Clock className="h-4 w-4 text-yellow-400" />;
        case 'Rejected': return <XCircle className="h-4 w-4 text-red-400" />;
        default: return null;
    }
};

const getVerificationBadgeColor = (status: VerificationStatus) =>
{
    switch (status)
    {
        case 'Verified': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'Rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
};

export default function UsersListPage()
{
    const router = useRouter();
    const searchParams = useSearchParams();

    // Parse search params into filters
    const [filters, setFilters] = useState<UserFilters>({
        search: searchParams.get('search') || '',
        role: (searchParams.get('role') as UserRole) || undefined,
        verificationStatus: (searchParams.get('verificationStatus') as VerificationStatus) || undefined,
        businessType: (searchParams.get('businessType') as BusinessType) || undefined,
        isActive: searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined,
        sortBy: (searchParams.get('sortBy') as UserFilters['sortBy']) || 'createdAt',
        sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // State for user modal
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    // Fetch users
    const { data, isLoading, error } = useSearchUsers(filters, {
        query: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false
        }
    });

    // Fetch user details for modal
    const { data: selectedUser, isLoading: isUserLoading } = useGetUserById(
        { userId: selectedUserId! },
        {
            query: {
                enabled: !!selectedUserId,
                staleTime: 2 * 60 * 1000
            }
        }
    );

    // Handle user selection for modal
    const handleUserClick = (userId: string) => {
        setSelectedUserId(userId);
        setIsUserModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsUserModalOpen(false);
        setSelectedUserId(null);
    };

    // Handle impersonation placeholder
    const handleImpersonateUser = (userId: string) => {
        // Placeholder - does nothing for now as requested
        console.log('Impersonate user:', userId);
    };

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

        if (filters.role)
        {
            activeFilters.push({
                key: 'role',
                value: filters.role,
                label: 'Role',
            });
        }

        if (filters.verificationStatus)
        {
            activeFilters.push({
                key: 'verificationStatus',
                value: filters.verificationStatus,
                label: 'Verification',
            });
        }

        if (filters.businessType)
        {
            activeFilters.push({
                key: 'businessType',
                value: filters.businessType,
                label: 'Business Type',
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

        router.push(`/admin/users?${params.toString()}`);
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

    const handleFilterChange = (key: keyof UserFilters, value: any) =>
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
            case 'role':
                handleFilterChange('role', undefined);
                break;
            case 'verificationStatus':
                handleFilterChange('verificationStatus', undefined);
                break;
            case 'businessType':
                handleFilterChange('businessType', undefined);
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
            role: undefined,
            verificationStatus: undefined,
            businessType: undefined,
            isActive: undefined,
            sortBy: 'createdAt',
            sortOrder: 'desc',
            page: 1,
            limit: 20,
        });
    };

    const FilterSidebar = () => (
        <div className="space-y-6">
            {/* Role Filter */}
            <div>
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Role</h3>
                <div className="space-y-2">
                    {(['Consumer', 'Creator', 'BusinessUser', 'Admin'] as UserRole[]).map(role => (
                        <div key={role} className="flex items-center space-x-2">
                            <Checkbox
                                id={role}
                                checked={filters.role === role}
                                onCheckedChange={(checked) =>
                                    handleFilterChange('role', checked ? role : undefined)
                                }
                                className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                            />
                            <Label
                                htmlFor={role}
                                className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal flex items-center gap-2"
                            >
                                {getRoleIcon(role)}
                                {role}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Verification Status Filter */}
            <div>
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Verification Status</h3>
                <div className="space-y-2">
                    {(['Pending', 'Verified', 'Rejected', 'NotRequired'] as VerificationStatus[]).map(status => (
                        <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                                id={status}
                                checked={filters.verificationStatus === status}
                                onCheckedChange={(checked) =>
                                    handleFilterChange('verificationStatus', checked ? status : undefined)
                                }
                                className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                            />
                            <Label
                                htmlFor={status}
                                className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal flex items-center gap-2"
                            >
                                {getVerificationIcon(status)}
                                {status === 'NotRequired' ? 'Not Required' : status}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Business Type Filter */}
            <div>
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Business Type</h3>
                <div className="space-y-2">
                    {(['Brand', 'Retailer'] as BusinessType[]).map(type => (
                        <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                                id={type}
                                checked={filters.businessType === type}
                                onCheckedChange={(checked) =>
                                    handleFilterChange('businessType', checked ? type : undefined)
                                }
                                className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                            />
                            <Label
                                htmlFor={type}
                                className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal"
                            >
                                {type}
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#EDECF8] mb-2">User Management</h1>
                <p className="text-[#828288]">Manage and monitor all platform users</p>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#575757] h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Search users by name or email..."
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
                            const [sortBy, sortOrder] = value.split('-') as [UserFilters['sortBy'], 'asc' | 'desc'];
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

                {/* Users List */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-[#828288]">Loading users...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-400">Error loading users. Please try again.</p>
                        </div>
                    ) : (
                        <>
                            {/* Results Count */}
                            <p className="text-[#828288] mb-4">
                                Showing {data?.results.length || 0} of {data?.total || 0} users
                            </p>

                            {/* Users Grid */}
                            <div className="space-y-4">
                                {data?.results.map((user: any) => (
                                    <div 
                                        key={user.user_id} 
                                        className="bg-[#090909] border border-[#202020] rounded-xl p-6 hover:border-[#575757] transition-all duration-200 hover:bg-[#171717] cursor-pointer"
                                        onClick={() => handleUserClick(user.user_id)}
                                    >
                                        <div className="flex items-start gap-4">
                                                {/* Avatar */}
                                                <div className="w-16 h-16 rounded-full bg-[#202020] border-2 border-[#575757] overflow-hidden flex-shrink-0">
                                                    {user.profile_image_url ? (
                                                        <img
                                                            src={user.profile_image_url}
                                                            alt={`${user.first_name} ${user.last_name}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <User className="h-8 w-8 text-[#575757]" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* User Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-[#EDECF8] truncate">
                                                                {user.first_name} {user.last_name}
                                                            </h3>
                                                            <p className="text-[#828288] truncate">{user.email}</p>
                                                        </div>

                                                        <div className="flex flex-col items-end gap-2">
                                                            <div className="flex gap-2">
                                                                <Badge className={`${getRoleBadgeColor(user.user_role)} border`}>
                                                                    <div className="flex items-center gap-1">
                                                                        {getRoleIcon(user.user_role)}
                                                                        {user.user_role}
                                                                    </div>
                                                                </Badge>

                                                                {user.is_business_user_verified !== null && (
                                                                    <Badge className={`${getVerificationBadgeColor(user.is_business_user_verified ? 'Verified' : 'Pending')} border`}>
                                                                        <div className="flex items-center gap-1">
                                                                            {getVerificationIcon(user.is_business_user_verified ? 'Verified' : 'Pending')}
                                                                            {user.is_business_user_verified ? 'Verified' : 'Pending'}
                                                                        </div>
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            {user.user_status !== 'Active' && (
                                                                <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30 border">
                                                                    Inactive
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between text-sm text-[#575757]">
                                                        <div className="flex gap-4">
                                                            {user.business_type && (
                                                                <span>Business: {user.business_type}</span>
                                                            )}
                                                            <span>
                                                                Joined: {new Date().toLocaleDateString()}
                                                            </span>
                                                        </div>

                                                        {false && (
                                                            <span>
                                                                Last login: {new Date().toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                ))}
                            </div>

                            {/* User Details Modal */}
                            <ResponsiveModal
                                isOpen={isUserModalOpen}
                                onClose={handleCloseModal}
                                title="User Details"
                                description="View and manage user information"
                            >
                                {isUserLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D78E59]"></div>
                                    </div>
                                ) : selectedUser ? (
                                    <div className="space-y-6">
                                        {/* User Basic Info */}
                                        <div className="flex items-start gap-4">
                                            <div className="w-16 h-16 rounded-full bg-[#202020] border-2 border-[#575757] overflow-hidden flex-shrink-0">
                                                {selectedUser.profile_image_url ? (
                                                    <img
                                                        src={selectedUser.profile_image_url}
                                                        alt={`${selectedUser.first_name} ${selectedUser.last_name}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User className="h-8 w-8 text-[#575757]" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-[#EDECF8]">
                                                    {selectedUser.first_name} {selectedUser.last_name}
                                                </h3>
                                                <p className="text-[#828288]">{selectedUser.email}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <Badge className={`${getRoleBadgeColor(selectedUser.user_role)} border`}>
                                                        <div className="flex items-center gap-1">
                                                            {getRoleIcon(selectedUser.user_role)}
                                                            {selectedUser.user_role}
                                                        </div>
                                                    </Badge>
                                                    <Badge className={`${getVerificationBadgeColor(selectedUser.is_business_user_verified ? 'Verified' : 'Pending')} border`}>
                                                        <div className="flex items-center gap-1">
                                                            {getVerificationIcon(selectedUser.is_business_user_verified ? 'Verified' : 'Pending')}
                                                            {selectedUser.is_business_user_verified ? 'Verified' : 'Pending'}
                                                        </div>
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        {/* User Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-[#828288]">Phone Number</Label>
                                                <p className="text-[#EDECF8]">{'Not provided'}</p>
                                            </div>
                                            <div>
                                                <Label className="text-[#828288]">Date of Birth</Label>
                                                <p className="text-[#EDECF8]">
                                                    {'Not provided'}
                                                </p>
                                            </div>
                                            <div>
                                                <Label className="text-[#828288]">Registration Date</Label>
                                                <p className="text-[#EDECF8]">{new Date().toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <Label className="text-[#828288]">Last Login</Label>
                                                <p className="text-[#EDECF8]">
                                                    {'Never'}
                                                </p>
                                            </div>
                                            {selectedUser.business_type && (
                                                <div>
                                                    <Label className="text-[#828288]">Business Type</Label>
                                                    <p className="text-[#EDECF8]">{selectedUser.business_type}</p>
                                                </div>
                                            )}
                                            <div>
                                                <Label className="text-[#828288]">Account Status</Label>
                                                <p className="text-[#EDECF8]">{selectedUser.user_status}</p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-4 border-t border-[#202020]">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleImpersonateUser(selectedUser.user_id)}
                                                className="flex-1"
                                            >
                                                <User className="mr-2 h-4 w-4" />
                                                Impersonate User
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={handleCloseModal}
                                                className="flex-1"
                                            >
                                                Close
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-[#828288]">
                                        User not found
                                    </div>
                                )}
                            </ResponsiveModal>

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