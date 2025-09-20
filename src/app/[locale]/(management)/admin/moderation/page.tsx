// app/admin/moderation/page.tsx
'use client'

export const dynamic = 'force-dynamic';

import { ActiveFilter, ActiveFilters } from '@/components/ui/active-filters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ResponsiveModal from '@/components/ui/responsive-modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SimplePagination } from '@/components/ui/custom/simple-paginations';
import { Textarea } from '@/components/ui/textarea';
import { useModerationHooks } from '@/hooks/api/moderation-hooks';
import { ClicksiDataContractsCommonEnumsModerationActionType } from '@/gen/api/types';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Eye,
    Filter,
    Flag,
    MessageSquare,
    Search,
    Shield,
    XCircle
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// Types for moderation filters
interface ModerationFilters {
    search: string;
    status: 'pending' | 'resolved' | undefined;
    sortBy: 'reportedAt' | 'reason';
    sortOrder: 'asc' | 'desc';
    page: number;
    limit: number;
}

// Helper functions
const getReportStatusBadgeColor = (isResolved: boolean) => {
    return isResolved 
        ? 'bg-green-500/20 text-green-400 border-green-500/30'
        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
};

const getReportStatusIcon = (isResolved: boolean) => {
    return isResolved ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />;
};

const getModerationActionColor = (action: ClicksiDataContractsCommonEnumsModerationActionType) => {
    switch (action) {
        case 'approve': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'reject': return 'bg-red-500/20 text-red-400 border-red-500/30';
        case 'hide': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        case 'flag': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
        case 'warn': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'remove': return 'bg-red-600/20 text-red-500 border-red-600/30';
        default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
};

export default function ModerationPage() {
    const searchParams = useSearchParams();
    
    // Parse search params into filters
    const [filters, setFilters] = useState<ModerationFilters>({
        search: searchParams.get('search') || '',
        status: (searchParams.get('status') as 'pending' | 'resolved') || undefined,
        sortBy: (searchParams.get('sortBy') as 'reportedAt' | 'reason') || 'reportedAt',
        sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
        page: parseInt(searchParams.get('page') || '1'),
        limit: parseInt(searchParams.get('limit') || '20'),
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isModerationDialogOpen, setIsModerationDialogOpen] = useState(false);
    const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
    const [moderationAction, setModerationAction] = useState<ClicksiDataContractsCommonEnumsModerationActionType>('approve');
    const [moderationReason, setModerationReason] = useState('');

    const moderationHooks = useModerationHooks();

    // Fetch moderation queue
    const { data: queueData, isLoading: isQueueLoading, error: queueError } = moderationHooks.getModerationQueue(filters);
    
    // Fetch selected report details
    const { data: selectedReport, isLoading: isReportLoading } = moderationHooks.getReport(selectedReportId || '');

    // Mutations
    const moderateContentMutation = moderationHooks.moderateContent();
    const resolveReportMutation = moderationHooks.resolveReport();

    // Build active filters for display
    const activeFilters: ActiveFilter[] = useMemo(() => {
        const activeFilters: ActiveFilter[] = [];

        if (filters.search) {
            activeFilters.push({
                key: 'search',
                value: filters.search,
                label: 'Search',
            });
        }

        if (filters.status) {
            activeFilters.push({
                key: 'status',
                value: filters.status === 'pending' ? 'Pending' : 'Resolved',
                label: 'Status',
            });
        }

        return activeFilters;
    }, [filters]);

    const handleFilterChange = (key: keyof ModerationFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleRemoveFilter = (filterKey: string) => {
        switch (filterKey) {
            case 'search':
                handleFilterChange('search', '');
                break;
            case 'status':
                handleFilterChange('status', undefined);
                break;
        }
    };

    const handleClearAllFilters = () => {
        setFilters({
            search: '',
            status: undefined,
            sortBy: 'reportedAt',
            sortOrder: 'desc',
            page: 1,
            limit: 20,
        });
    };

    const handleReportClick = (reportId: string) => {
        setSelectedReportId(reportId);
        setIsReportModalOpen(true);
    };

    const handleCloseReportModal = () => {
        setIsReportModalOpen(false);
        setSelectedReportId(null);
    };

    const handleModerateContent = (contentId: string) => {
        setSelectedContentId(contentId);
        setIsModerationDialogOpen(true);
    };

    const handleSubmitModeration = () => {
        if (!selectedContentId) return;

        moderateContentMutation.mutate({
            pathParams: { contentId: selectedContentId },
            data: {
                action: moderationAction,
                reason: moderationReason || null
            }
        }, {
            onSuccess: () => {
                setIsModerationDialogOpen(false);
                setSelectedContentId(null);
                setModerationAction('approve');
                setModerationReason('');
            }
        });
    };

    const handleResolveReport = (reportId: string, action?: ClicksiDataContractsCommonEnumsModerationActionType) => {
        resolveReportMutation.mutate({
            pathParams: { reportId },
            data: {
                action: action || null
            }
        }, {
            onSuccess: () => {
                handleCloseReportModal();
            }
        });
    };

    const FilterSidebar = () => (
        <div className="space-y-6">
            {/* Status Filter */}
            <div>
                <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Report Status</h3>
                <div className="space-y-2">
                    {[
                        { value: 'pending', label: 'Pending' },
                        { value: 'resolved', label: 'Resolved' }
                    ].map(({ value, label }) => (
                        <div key={value} className="flex items-center space-x-2">
                            <Checkbox
                                id={value}
                                checked={filters.status === value}
                                onCheckedChange={(checked) =>
                                    handleFilterChange('status', checked ? value : undefined)
                                }
                                className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                            />
                            <Label
                                htmlFor={value}
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
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-8 w-8 text-[#D78E59]" />
                    <h1 className="text-3xl font-bold text-[#EDECF8]">Content Moderation</h1>
                </div>
                <p className="text-[#828288]">Review and moderate reported content</p>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#575757] h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Search reports by content ID or reason..."
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
                        onValueChange={(value) => {
                            const [sortBy, sortOrder] = value.split('-') as [ModerationFilters['sortBy'], 'asc' | 'desc'];
                            setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                        }}
                    >
                        <SelectTrigger className="w-[200px] bg-[#202020] border-[#575757] text-[#EDECF8]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#171717] border-[#575757]">
                            <SelectItem value="reportedAt-desc">Newest First</SelectItem>
                            <SelectItem value="reportedAt-asc">Oldest First</SelectItem>
                            <SelectItem value="reason-asc">Reason A-Z</SelectItem>
                            <SelectItem value="reason-desc">Reason Z-A</SelectItem>
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

                {/* Reports List */}
                <div className="flex-1">
                    {isQueueLoading ? (
                        <div className="text-center py-12">
                            <p className="text-[#828288]">Loading reports...</p>
                        </div>
                    ) : queueError ? (
                        <div className="text-center py-12">
                            <p className="text-red-400">Error loading reports. Please try again.</p>
                        </div>
                    ) : (
                        <>
                            {/* Results Count */}
                            <p className="text-[#828288] mb-4">
                                Showing {queueData?.items.length || 0} of {queueData?.totalCount || 0} reports
                            </p>

                            {/* Reports Grid */}
                            <div className="space-y-4">
                                {queueData?.items.map((report: any) => (
                                    <Card key={report.id} className="bg-[#090909] border-[#202020] hover:border-[#575757] transition-all duration-200">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Flag className="h-5 w-5 text-[#D78E59]" />
                                                        <h3 className="text-lg font-semibold text-[#EDECF8]">
                                                            {report.reason}
                                                        </h3>
                                                        <Badge className={`${getReportStatusBadgeColor(report.isResolved)} border`}>
                                                            <div className="flex items-center gap-1">
                                                                {getReportStatusIcon(report.isResolved)}
                                                                {report.isResolved ? 'Resolved' : 'Pending'}
                                                            </div>
                                                        </Badge>
                                                    </div>
                                                    
                                                    <p className="text-[#828288] mb-2">Content ID: {report.contentId}</p>
                                                    
                                                    {report.details && (
                                                        <p className="text-[#828288] text-sm mb-3">
                                                            {report.details.length > 100 
                                                                ? `${report.details.substring(0, 100)}...` 
                                                                : report.details
                                                            }
                                                        </p>
                                                    )}
                                                    
                                                    <div className="flex items-center gap-4 text-sm text-[#575757]">
                                                        <span>Reported: {new Date(report.reportedAt).toLocaleDateString()}</span>
                                                        {report.resolvedAt && (
                                                            <span>Resolved: {new Date(report.resolvedAt).toLocaleDateString()}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleReportClick(report.id)}
                                                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </Button>
                                                    
                                                    {!report.isResolved && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleModerateContent(report.contentId)}
                                                            className="border-[#D78E59] text-[#D78E59] hover:bg-[#D78E59] hover:text-[#171717]"
                                                        >
                                                            <Shield className="mr-2 h-4 w-4" />
                                                            Moderate
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {queueData && queueData.totalPages > 1 && (
                                <SimplePagination
                                    currentPage={queueData.page}
                                    totalPages={queueData.totalPages}
                                    onPageChange={handlePageChange}
                                    className="mt-8"
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Report Details Modal */}
            <ResponsiveModal
                isOpen={isReportModalOpen}
                onClose={handleCloseReportModal}
                title="Report Details"
                description="Detailed information about the content report"
            >
                {isReportLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D78E59]"></div>
                    </div>
                ) : selectedReport ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-[#828288]">Report ID</Label>
                                <p className="text-[#EDECF8] font-mono">{selectedReport.id}</p>
                            </div>
                            <div>
                                <Label className="text-[#828288]">Content ID</Label>
                                <p className="text-[#EDECF8] font-mono">{selectedReport.contentId}</p>
                            </div>
                            <div>
                                <Label className="text-[#828288]">Reason</Label>
                                <p className="text-[#EDECF8]">{selectedReport.reason}</p>
                            </div>
                            <div>
                                <Label className="text-[#828288]">Status</Label>
                                <Badge className={`${getReportStatusBadgeColor(selectedReport.isResolved)} border mt-1`}>
                                    {selectedReport.isResolved ? 'Resolved' : 'Pending'}
                                </Badge>
                            </div>
                        </div>

                        {selectedReport.details && (
                            <div>
                                <Label className="text-[#828288]">Details</Label>
                                <p className="text-[#EDECF8] mt-1 p-3 bg-[#202020] rounded-lg border border-[#575757]">
                                    {selectedReport.details}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-[#828288]">Reported At</Label>
                                <p className="text-[#EDECF8]">{new Date(selectedReport.reportedAt).toLocaleString()}</p>
                            </div>
                            {selectedReport.resolvedAt && (
                                <div>
                                    <Label className="text-[#828288]">Resolved At</Label>
                                    <p className="text-[#EDECF8]">{new Date(selectedReport.resolvedAt).toLocaleString()}</p>
                                </div>
                            )}
                        </div>

                        {!selectedReport.isResolved && (
                            <div className="flex gap-2 pt-4 border-t border-[#575757]">
                                <Button
                                    onClick={() => handleModerateContent(selectedReport.contentId)}
                                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                >
                                    <Shield className="mr-2 h-4 w-4" />
                                    Moderate Content
                                </Button>
                                <Button
                                    onClick={() => handleResolveReport(selectedReport.id, 'approve')}
                                    variant="outline"
                                    className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark Resolved
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-8 text-center text-[#828288]">
                        Report not found
                    </div>
                )}
            </ResponsiveModal>

            {/* Moderation Action Dialog */}
            <Dialog open={isModerationDialogOpen} onOpenChange={setIsModerationDialogOpen}>
                <DialogContent className="bg-[#171717] border-[#575757]">
                    <DialogHeader>
                        <DialogTitle className="text-[#EDECF8]">Moderate Content</DialogTitle>
                        <DialogDescription className="text-[#828288]">
                            Choose a moderation action for the reported content
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="action" className="text-[#EDECF8]">
                                Moderation Action
                            </Label>
                            <Select
                                value={moderationAction}
                                onValueChange={(value) => setModerationAction(value as ClicksiDataContractsCommonEnumsModerationActionType)}
                            >
                                <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#171717] border-[#575757]">
                                    <SelectItem value="approve">✅ Approve</SelectItem>
                                    <SelectItem value="reject">❌ Reject</SelectItem>
                                    <SelectItem value="hide">👁️ Hide</SelectItem>
                                    <SelectItem value="flag">🚩 Flag</SelectItem>
                                    <SelectItem value="warn">⚠️ Warn</SelectItem>
                                    <SelectItem value="remove">🗑️ Remove</SelectItem>
                                    <SelectItem value="request_changes">✏️ Request Changes</SelectItem>
                                    <SelectItem value="remove_product_tag">🏷️ Remove Product Tag</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="reason" className="text-[#EDECF8]">
                                Reason (Optional)
                            </Label>
                            <Textarea
                                id="reason"
                                value={moderationReason}
                                onChange={(e) => setModerationReason(e.target.value)}
                                placeholder="Provide additional details for this moderation action..."
                                className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                rows={3}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsModerationDialogOpen(false)}
                            className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitModeration}
                            disabled={moderateContentMutation.isPending}
                            className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                        >
                            {moderateContentMutation.isPending ? 'Processing...' : 'Apply Action'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}