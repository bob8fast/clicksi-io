// app/admin/trial-requests/page.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useSubscriptionHooks } from '@/hooks/api/subscription-hooks';
import { BusinessType } from '@/types/app/registration-schema';
import { TrialRequestDto } from '@/types';
import { UserManagementDomainEnumsTrialRequestStatus } from '@/gen/api/types/user_management_domain_enums_trial_request_status';
import { UserManagementDomainDTOsReviewTrialRequestRequest } from '@/gen/api/types/user_management_domain_dt_os_review_trial_request_request';
import { getTrialRequestStatusString } from '@/lib/subscription-utils';
import
{
    Building,
    Calendar,
    CheckCircle,
    Clock,
    Eye,
    Filter,
    MessageSquare,
    Play,
    Search,
    UserCheck,
    UserX,
    Users,
    XCircle
} from 'lucide-react';
// import { useSession } from 'next-auth/react'; // Removed auth
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface ReviewModalProps
{
    request: TrialRequestDto;
    isOpen: boolean;
    onClose: () => void;
    onReview: (requestId: string, approved: boolean, notes?: string, rejectionReason?: string) => void;
    onStartTrial: (requestId: string) => void;
}

function ReviewModal({ request, isOpen, onClose, onReview, onStartTrial }: ReviewModalProps)
{
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);
    const [notes, setNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () =>
    {
        if (action === 'approve')
        {
            onReview(request.id, true, notes || undefined);
        } else if (action === 'reject')
        {
            if (!rejectionReason.trim())
            {
                toast.error('Please provide a reason for rejection');
                return;
            }
            onReview(request.id, false, notes || undefined, rejectionReason);
        }
        onClose();
        setAction(null);
        setNotes('');
        setRejectionReason('');
    };

    const getStatusColor = (status: UserManagementDomainEnumsTrialRequestStatus) =>
    {
        const statusString = getTrialRequestStatusString(status);
        switch (statusString)
        {
            case 'pending': return 'bg-yellow-500 text-black';
            case 'approved': return 'bg-green-500 text-white';
            case 'rejected': return 'bg-red-500 text-white';
            default: return 'bg-[#575757] text-[#EDECF8]';
        }
    };

    const statusString = getTrialRequestStatusString(request.status);
    const createdAt = new Date(request.created_at);
    const reviewedAt = request.reviewed_at ? new Date(request.reviewed_at) : null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="bg-[#171717] border-[#575757] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            Trial Request Details
                        </CardTitle>
                        <Badge className={getStatusColor(request.status)}>
                            {statusString}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* User Info */}
                    <div className="bg-[#090909] rounded-lg p-4 border border-[#202020]">
                        <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">User Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-[#828288] text-sm">User ID</Label>
                                <div className="text-[#EDECF8] font-medium">{request.user_id}</div>
                            </div>
                            <div>
                                <Label className="text-[#828288] text-sm">User Details</Label>
                                <div className="text-[#EDECF8] font-medium">
                                    {request.user ? `${request.user.full_name} (${request.user.email})` : 'User details not loaded'}
                                </div>
                            </div>
                            <div>
                                <Label className="text-[#828288] text-sm">Business Type</Label>
                                <div className="text-[#EDECF8] font-medium">{request.business_type}</div>
                            </div>
                            <div>
                                <Label className="text-[#828288] text-sm">Company Size</Label>
                                <div className="text-[#EDECF8] font-medium">{request.company_size}</div>
                            </div>
                        </div>
                    </div>

                    {/* Request Details */}
                    <div className="bg-[#090909] rounded-lg p-4 border border-[#202020]">
                        <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Request Details</h3>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-[#828288] text-sm">Requested Plan</Label>
                                <div className="text-[#EDECF8] font-medium">
                                    {request.requested_plan?.name || request.requested_plan_id}
                                </div>
                            </div>
                            {request.industry && (
                                <div>
                                    <Label className="text-[#828288] text-sm">Industry</Label>
                                    <div className="text-[#EDECF8] font-medium">{request.industry}</div>
                                </div>
                            )}
                            {request.website && (
                                <div>
                                    <Label className="text-[#828288] text-sm">Website</Label>
                                    <div className="text-[#EDECF8] font-medium">
                                        <a href={request.website} target="_blank" rel="noopener noreferrer" className="text-[#D78E59] hover:underline">
                                            {request.website}
                                        </a>
                                    </div>
                                </div>
                            )}
                            <div>
                                <Label className="text-[#828288] text-sm">Reason for Trial</Label>
                                <div className="text-[#EDECF8] whitespace-pre-wrap bg-[#202020] p-3 rounded border border-[#575757]">
                                    {request.reason}
                                </div>
                            </div>
                            <div>
                                <Label className="text-[#828288] text-sm">Expected Usage</Label>
                                <div className="text-[#EDECF8] whitespace-pre-wrap bg-[#202020] p-3 rounded border border-[#575757]">
                                    {request.expected_usage}
                                </div>
                            </div>
                            {request.current_solution && (
                                <div>
                                    <Label className="text-[#828288] text-sm">Current Solution</Label>
                                    <div className="text-[#EDECF8] whitespace-pre-wrap bg-[#202020] p-3 rounded border border-[#575757]">
                                        {request.current_solution}
                                    </div>
                                </div>
                            )}
                            <div>
                                <Label className="text-[#828288] text-sm">Submitted</Label>
                                <div className="text-[#EDECF8] font-medium">
                                    {createdAt.toLocaleDateString()} at {createdAt.toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Review History */}
                    {statusString !== 'pending' && (
                        <div className="bg-[#090909] rounded-lg p-4 border border-[#202020]">
                            <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Review History</h3>
                            <div className="space-y-2">
                                <div>
                                    <Label className="text-[#828288] text-sm">Reviewed By</Label>
                                    <div className="text-[#EDECF8] font-medium">{request.reviewed_by_user_id || 'Unknown'}</div>
                                </div>
                                {reviewedAt && (
                                    <div>
                                        <Label className="text-[#828288] text-sm">Reviewed At</Label>
                                        <div className="text-[#EDECF8] font-medium">
                                            {reviewedAt.toLocaleDateString()} at {reviewedAt.toLocaleTimeString()}
                                        </div>
                                    </div>
                                )}
                                {request.admin_notes && (
                                    <div>
                                        <Label className="text-[#828288] text-sm">Admin Notes</Label>
                                        <div className="text-[#EDECF8] whitespace-pre-wrap bg-[#202020] p-3 rounded border border-[#575757]">
                                            {request.admin_notes}
                                        </div>
                                    </div>
                                )}
                                {request.rejection_reason && (
                                    <div>
                                        <Label className="text-[#828288] text-sm">Rejection Reason</Label>
                                        <div className="text-[#EDECF8] whitespace-pre-wrap bg-[#202020] p-3 rounded border border-[#575757]">
                                            {request.rejection_reason}
                                        </div>
                                    </div>
                                )}
                                {request.trial_start_date && (
                                    <div>
                                        <Label className="text-[#828288] text-sm">Trial Started</Label>
                                        <div className="text-[#EDECF8] font-medium">
                                            {new Date(request.trial_start_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Review Actions */}
                    {statusString === 'pending' && (
                        <div className="bg-[#090909] rounded-lg p-4 border border-[#202020]">
                            <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Review Action</h3>
                            <div className="space-y-4">
                                <Select value={action || ''} onValueChange={(value) => setAction(value as 'approve' | 'reject')}>
                                    <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                        <SelectValue placeholder="Choose action" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#171717] border-[#575757]">
                                        <SelectItem value="approve">Approve Trial Request</SelectItem>
                                        <SelectItem value="reject">Reject Trial Request</SelectItem>
                                    </SelectContent>
                                </Select>

                                {action === 'reject' && (
                                    <div>
                                        <Label className="text-[#EDECF8]">Rejection Reason (Required)</Label>
                                        <Textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Please provide a clear reason for rejection..."
                                            className="bg-[#202020] border-[#575757] text-[#EDECF8] mt-2"
                                            rows={3}
                                        />
                                    </div>
                                )}

                                <div>
                                    <Label className="text-[#EDECF8]">Admin Notes (Optional)</Label>
                                    <Textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add any notes about this decision..."
                                        className="bg-[#202020] border-[#575757] text-[#EDECF8] mt-2"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Start Trial Action for Approved Requests */}
                    {statusString === 'approved' && !request.trial_start_date && (
                        <div className="bg-[#090909] rounded-lg p-4 border border-[#202020]">
                            <h3 className="text-lg font-semibold text-[#EDECF8] mb-3">Start Trial</h3>
                            <p className="text-[#828288] mb-4">
                                This request has been approved but the trial hasn&apos;t been started yet. Click below to activate the trial.
                            </p>
                            <Button
                                onClick={() => onStartTrial(request.id)}
                                className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                            >
                                <Play className="w-4 h-4 mr-2" />
                                Start Trial
                            </Button>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-[#575757]">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="flex-1 border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                        >
                            Close
                        </Button>
                        {statusString === 'pending' && action && (
                            <Button
                                onClick={handleSubmit}
                                className={`flex-1 ${action === 'approve'
                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                    : 'bg-red-500 hover:bg-red-600 text-white'
                                    }`}
                            >
                                {action === 'approve' ? 'Approve Request' : 'Reject Request'}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function TrialRequestCard({ request, onReview }: { request: TrialRequestDto; onReview: (request: TrialRequestDto) => void })
{
    const getStatusIcon = (status: UserManagementDomainEnumsTrialRequestStatus) =>
    {
        const statusString = getTrialRequestStatusString(status);
        switch (statusString)
        {
            case 'pending': return Clock;
            case 'approved': return CheckCircle;
            case 'rejected': return XCircle;
            default: return Clock;
        }
    };

    const getStatusColor = (status: UserManagementDomainEnumsTrialRequestStatus) =>
    {
        const statusString = getTrialRequestStatusString(status);
        switch (statusString)
        {
            case 'pending': return 'bg-yellow-500 text-black';
            case 'approved': return 'bg-green-500 text-white';
            case 'rejected': return 'bg-red-500 text-white';
            default: return 'bg-[#575757] text-[#EDECF8]';
        }
    };

    const StatusIcon = getStatusIcon(request.status);
    const statusString = getTrialRequestStatusString(request.status);
    const createdAt = new Date(request.created_at);

    return (
        <Card className="bg-[#090909] border-[#202020] hover:border-[#575757] transition-colors">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#202020] rounded-xl flex items-center justify-center">
                            <Building className="w-6 h-6 text-[#575757]" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#EDECF8] mb-1">
                                {request.user ? request.user.full_name : `User ${request.user_id}`}
                            </h3>
                            <div className="text-sm text-[#828288] mb-2">
                                {request.user?.email || 'Email not available'}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-[#D78E59] text-[#171717]">
                                    {request.business_type}
                                </Badge>
                                <Badge className={getStatusColor(request.status)}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusString}
                                </Badge>
                            </div>
                            <div className="text-sm text-[#575757]">
                                Requested: {request.requested_plan?.name || 'Plan details not available'}
                            </div>
                        </div>
                    </div>
                    <div className="text-right text-sm text-[#575757]">
                        <div>{createdAt.toLocaleDateString()}</div>
                        <div>{createdAt.toLocaleTimeString()}</div>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-[#828288] text-sm line-clamp-2">
                        {request.reason}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-[#575757]">
                        <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {request.company_size}
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {Math.ceil((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))} days ago
                        </div>
                        {request.industry && (
                            <div className="flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                {request.industry}
                            </div>
                        )}
                    </div>
                    <Button
                        size="sm"
                        onClick={() => onReview(request)}
                        className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminTrialRequestsPage()
{
    // const { data: session } = useSession(); // Removed auth
    const session = null; // Mock session - auth removed
    const subscriptionHooks = useSubscriptionHooks();
    const { data: requests = [], isLoading } = subscriptionHooks.getTrialRequests();
    const reviewRequest = subscriptionHooks.reviewTrialRequest();
    const startTrial = subscriptionHooks.startTrial();

    const [selectedRequest, setSelectedRequest] = useState<TrialRequestDto | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [businessTypeFilter, setBusinessTypeFilter] = useState<'all' | BusinessType>('all');

    const filteredRequests = useMemo(() =>
    {
        return requests.filter(request =>
        {
            const userName = request.user?.full_name || request.user?.user_name || '';
            const userEmail = request.user?.email || '';

            const matchesSearch =
                userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                request.reason.toLowerCase().includes(searchQuery.toLowerCase());

            const statusString = getTrialRequestStatusString(request.status);
            const matchesStatus = statusFilter === 'all' || statusString === statusFilter;
            const matchesBusinessType = businessTypeFilter === 'all' || request.business_type === businessTypeFilter;

            return matchesSearch && matchesStatus && matchesBusinessType;
        });
    }, [requests, searchQuery, statusFilter, businessTypeFilter]);

    const stats = useMemo(() =>
    {
        return {
            total: requests.length,
            pending: requests.filter(r => getTrialRequestStatusString(r.status) === 'pending').length,
            approved: requests.filter(r => getTrialRequestStatusString(r.status) === 'approved').length,
            rejected: requests.filter(r => getTrialRequestStatusString(r.status) === 'rejected').length,
        };
    }, [requests]);

    const handleReview = async (requestId: string, approved: boolean, notes?: string, rejectionReason?: string) =>
    {
        if (!session?.user_info?.user_id)
        {
            toast.error('You must be logged in to review requests');
            return;
        }

        try
        {
            const reviewData: Omit<UserManagementDomainDTOsReviewTrialRequestRequest, 'trial_request_id' | 'reviewed_by_user_id'> = {
                approved,
                admin_notes: notes,
                rejection_reason: rejectionReason,
                trial_duration: approved ? 14 : undefined, // Default 14 days trial
            };

            await reviewRequest.mutateAsync({ requestId, data: reviewData });
            setSelectedRequest(null);
        } catch (_error)
        {
            // Error handling is in the hook
        }
    };

    const handleStartTrial = async (requestId: string) =>
    {
        try
        {
            await startTrial.mutateAsync(requestId);
            setSelectedRequest(null);
        } catch (_error)
        {
            // Error handling is in the hook
        }
    };

    if (isLoading)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-[#202020] rounded w-1/3"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-24 bg-[#202020] rounded"></div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-32 bg-[#202020] rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#EDECF8] mb-2">Trial Requests</h1>
                    <p className="text-[#828288]">
                        Review and manage trial requests from potential customers
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-[#090909] border-[#202020]">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#D78E59] rounded-xl flex items-center justify-center">
                                    <MessageSquare className="w-6 h-6 text-[#171717]" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[#EDECF8]">{stats.total}</div>
                                    <div className="text-[#828288] text-sm">Total Requests</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#090909] border-[#202020]">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[#EDECF8]">{stats.pending}</div>
                                    <div className="text-[#828288] text-sm">Pending Review</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#090909] border-[#202020]">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                                    <UserCheck className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[#EDECF8]">{stats.approved}</div>
                                    <div className="text-[#828288] text-sm">Approved</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#090909] border-[#202020]">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                                    <UserX className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[#EDECF8]">{stats.rejected}</div>
                                    <div className="text-[#828288] text-sm">Rejected</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="bg-[#090909] border-[#202020] mb-8">
                    <CardHeader>
                        <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-[#575757]" />
                                <Input
                                    placeholder="Search by name, email, or reason..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-[#202020] border-[#575757] text-[#EDECF8]"
                                />
                            </div>

                            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                                <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#171717] border-[#575757]">
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={businessTypeFilter} onValueChange={(value) => setBusinessTypeFilter(value as any)}>
                                <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                    <SelectValue placeholder="All Business Types" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#171717] border-[#575757]">
                                    <SelectItem value="all">All Business Types</SelectItem>
                                    <SelectItem value="Brand">Brands</SelectItem>
                                    <SelectItem value="Retailer">Retailers</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Requests Tabs */}
                <Tabs defaultValue="all" className="space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-3 bg-[#202020]">
                        <TabsTrigger value="all" className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-[#171717]">
                            All Requests
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-[#171717]">
                            Pending ({stats.pending})
                        </TabsTrigger>
                        <TabsTrigger value="reviewed" className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-[#171717]">
                            Reviewed
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        {filteredRequests.length > 0 ? (
                            <div className="space-y-4">
                                {filteredRequests.map((request) => (
                                    <TrialRequestCard
                                        key={request.id}
                                        request={request}
                                        onReview={setSelectedRequest}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardContent className="p-12 text-center">
                                    <MessageSquare className="w-12 h-12 text-[#575757] mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-[#EDECF8] mb-2">No requests found</h3>
                                    <p className="text-[#828288]">
                                        {searchQuery || statusFilter !== 'all' || businessTypeFilter !== 'all'
                                            ? 'Try adjusting your filters to see more results.'
                                            : 'No trial requests have been submitted yet.'
                                        }
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="pending" className="space-y-4">
                        {filteredRequests.filter(r => getTrialRequestStatusString(r.status) === 'pending').length > 0 ? (
                            <div className="space-y-4">
                                {filteredRequests.filter(r => getTrialRequestStatusString(r.status) === 'pending').map((request) => (
                                    <TrialRequestCard
                                        key={request.id}
                                        request={request}
                                        onReview={setSelectedRequest}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardContent className="p-12 text-center">
                                    <Clock className="w-12 h-12 text-[#575757] mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-[#EDECF8] mb-2">No pending requests</h3>
                                    <p className="text-[#828288]">All trial requests have been reviewed.</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="reviewed" className="space-y-4">
                        {filteredRequests.filter(r => getTrialRequestStatusString(r.status) !== 'pending').length > 0 ? (
                            <div className="space-y-4">
                                {filteredRequests.filter(r => getTrialRequestStatusString(r.status) !== 'pending').map((request) => (
                                    <TrialRequestCard
                                        key={request.id}
                                        request={request}
                                        onReview={setSelectedRequest}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardContent className="p-12 text-center">
                                    <CheckCircle className="w-12 h-12 text-[#575757] mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-[#EDECF8] mb-2">No reviewed requests</h3>
                                    <p className="text-[#828288]">Reviewed trial requests will appear here.</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Review Modal */}
                {selectedRequest && (
                    <ReviewModal
                        request={selectedRequest}
                        isOpen={!!selectedRequest}
                        onClose={() => setSelectedRequest(null)}
                        onReview={handleReview}
                        onStartTrial={handleStartTrial}
                    />
                )}
            </div>
        </div>
    );
}