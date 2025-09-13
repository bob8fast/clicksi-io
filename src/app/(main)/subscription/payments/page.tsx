// app/subscription/payments/page.tsx
'use client'

export const dynamic = 'force-dynamic';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePaymentHistory } from '@/hooks/api/subscription-hooks';
import { PaymentHistory } from '@/types/app/subscription';
import
{
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    FileText,
    Filter,
    RefreshCw,
    RotateCcw,
    Search,
    TrendingUp,
    XCircle
} from 'lucide-react';
// import { useSession } from 'next-auth/react'; // Removed auth
import { useMemo, useState } from 'react';

interface PaymentFilters
{
    search: string;
    type: 'all' | 'subscription' | 'campaign_funding' | 'campaign_payout';
    status: 'all' | 'completed' | 'pending' | 'failed' | 'refunded';
    dateRange: 'all' | '30days' | '90days' | '1year';
}

const getStatusIcon = (status: string) =>
{
    switch (status)
    {
        case 'completed': return CheckCircle;
        case 'pending': return Clock;
        case 'failed': return XCircle;
        case 'refunded': return RotateCcw;
        default: return Clock;
    }
};

const getStatusColor = (status: string) =>
{
    switch (status)
    {
        case 'completed': return 'text-green-500';
        case 'pending': return 'text-yellow-500';
        case 'failed': return 'text-red-500';
        case 'refunded': return 'text-blue-500';
        default: return 'text-[#575757]';
    }
};

const getTypeIcon = (type: string) =>
{
    switch (type)
    {
        case 'subscription': return RefreshCw;
        case 'campaign_funding': return TrendingUp;
        case 'campaign_payout': return DollarSign;
        default: return CreditCard;
    }
};

const getTypeLabel = (type: string) =>
{
    switch (type)
    {
        case 'subscription': return 'Subscription';
        case 'campaign_funding': return 'Campaign Funding';
        case 'campaign_payout': return 'Campaign Payout';
        default: return 'Payment';
    }
};

const getTypeColor = (type: string) =>
{
    switch (type)
    {
        case 'subscription': return 'bg-[#D78E59] text-[#171717]';
        case 'campaign_funding': return 'bg-[#575757] text-[#EDECF8]';
        case 'campaign_payout': return 'bg-[#FFAA6C] text-[#171717]';
        default: return 'bg-[#202020] text-[#828288]';
    }
};

function PaymentCard({ payment }: { payment: PaymentHistory })
{
    const StatusIcon = getStatusIcon(payment.status);
    const TypeIcon = getTypeIcon(payment.type);

    // Convert createdAt to Date if it's a string
    const createdAtDate = typeof payment.createdAt === 'string' ? new Date(payment.createdAt) : payment.createdAt;

    return (
        <Card className="bg-[#090909] border-[#202020] hover:border-[#575757] transition-colors">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#202020] rounded-xl flex items-center justify-center">
                            <TypeIcon className="w-6 h-6 text-[#575757]" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#EDECF8] mb-1">{payment.description}</h3>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className={getTypeColor(payment.type)}>
                                    {getTypeLabel(payment.type)}
                                </Badge>
                                <div className={`flex items-center gap-1 ${getStatusColor(payment.status)}`}>
                                    <StatusIcon className="w-4 h-4" />
                                    <span className="text-sm capitalize">{payment.status}</span>
                                </div>
                            </div>
                            <div className="text-sm text-[#828288]">
                                {createdAtDate.toLocaleDateString()} • {payment.paymentMethod}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-[#EDECF8] mb-1">
                            {payment.type === 'campaign_payout' ? '+' : '-'}${payment.amount}
                        </div>
                        <div className="text-sm text-[#575757]">{payment.currency}</div>
                    </div>
                </div>

                {payment.invoice && (
                    <div className="flex items-center justify-between pt-4 border-t border-[#575757]">
                        <div className="text-sm text-[#828288]">
                            Invoice #{payment.invoice.number}
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                            onClick={() => window.open(payment.invoice?.url, '_blank')}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            View Invoice
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function PaymentSummary({ payments }: { payments: PaymentHistory[] })
{
    const summary = useMemo(() =>
    {
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const recent = payments.filter(p =>
        {
            const paymentDate = typeof p.createdAt === 'string' ? new Date(p.createdAt) : p.createdAt;
            return paymentDate >= last30Days;
        });

        const subscriptionTotal = payments
            .filter(p => p.type === 'subscription' && p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);
        const campaignSpent = payments
            .filter(p => p.type === 'campaign_funding' && p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);
        const campaignEarned = payments
            .filter(p => p.type === 'campaign_payout' && p.status === 'completed')
            .reduce((sum, p) => sum + p.amount, 0);

        return {
            totalSpent: subscriptionTotal + campaignSpent,
            totalEarned: campaignEarned,
            recentCount: recent.length,
            pendingCount: payments.filter(p => p.status === 'pending').length,
        };
    }, [payments]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#090909] border-[#202020]">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#D78E59] rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-[#171717]" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#EDECF8]">${summary.totalSpent}</div>
                            <div className="text-[#828288] text-sm">Total Spent</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-[#090909] border-[#202020]">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#FFAA6C] rounded-xl flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-[#171717]" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#EDECF8]">${summary.totalEarned}</div>
                            <div className="text-[#828288] text-sm">Total Earned</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-[#090909] border-[#202020]">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#575757] rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-[#EDECF8]" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#EDECF8]">{summary.recentCount}</div>
                            <div className="text-[#828288] text-sm">Last 30 Days</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-[#090909] border-[#202020]">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#202020] rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-[#828288]" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-[#EDECF8]">{summary.pendingCount}</div>
                            <div className="text-[#828288] text-sm">Pending</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function PaymentHistoryPage()
{
    // Mock session data since auth is removed
    const mockSession = { user_info: { user_id: 'mock-user-id' } };
    const { data: payments = [], isLoading } = usePaymentHistory(mockSession.user_info.user_id);

    const [filters, setFilters] = useState<PaymentFilters>({
        search: '',
        type: 'all',
        status: 'all',
        dateRange: 'all',
    });

    const filteredPayments = useMemo(() =>
    {
        return payments.filter(payment =>
        {
            // Search filter
            if (filters.search && !payment.description.toLowerCase().includes(filters.search.toLowerCase()))
            {
                return false;
            }

            // Type filter
            if (filters.type !== 'all' && payment.type !== filters.type)
            {
                return false;
            }

            // Status filter
            if (filters.status !== 'all' && payment.status !== filters.status)
            {
                return false;
            }

            // Date range filter
            if (filters.dateRange !== 'all')
            {
                const now = new Date();
                const filterDate = new Date();
                const paymentDate = typeof payment.createdAt === 'string' ? new Date(payment.createdAt) : payment.createdAt;

                switch (filters.dateRange)
                {
                    case '30days':
                        filterDate.setDate(now.getDate() - 30);
                        break;
                    case '90days':
                        filterDate.setDate(now.getDate() - 90);
                        break;
                    case '1year':
                        filterDate.setFullYear(now.getFullYear() - 1);
                        break;
                }

                if (paymentDate < filterDate)
                {
                    return false;
                }
            }

            return true;
        });
    }, [payments, filters]);

    const exportPayments = () =>
    {
        const csvContent = [
            ['Date', 'Description', 'Type', 'Amount', 'Status', 'Payment Method'].join(','),
            ...filteredPayments.map(payment =>
            {
                const paymentDate = typeof payment.createdAt === 'string' ? new Date(payment.createdAt) : payment.createdAt;
                return [
                    paymentDate.toLocaleDateString(),
                    `"${payment.description}"`,
                    payment.type,
                    payment.amount,
                    payment.status,
                    `"${payment.paymentMethod}"`
                ].join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
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
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#EDECF8] mb-2">Payment History</h1>
                        <p className="text-[#828288]">
                            View and manage all your subscription and campaign payments
                        </p>
                    </div>
                    <Button
                        onClick={exportPayments}
                        variant="outline"
                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>

                {/* Summary Cards */}
                <PaymentSummary payments={payments} />

                {/* Filters */}
                <Card className="bg-[#090909] border-[#202020] mb-8">
                    <CardHeader>
                        <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-[#575757]" />
                                <Input
                                    placeholder="Search payments..."
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                    className="pl-10 bg-[#202020] border-[#575757] text-[#EDECF8]"
                                />
                            </div>

                            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value as any }))}>
                                <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#171717] border-[#575757]">
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="subscription">Subscription</SelectItem>
                                    <SelectItem value="campaign_funding">Campaign Funding</SelectItem>
                                    <SelectItem value="campaign_payout">Campaign Payout</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as any }))}>
                                <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#171717] border-[#575757]">
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                    <SelectItem value="refunded">Refunded</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value as any }))}>
                                <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                    <SelectValue placeholder="All Time" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#171717] border-[#575757]">
                                    <SelectItem value="all">All Time</SelectItem>
                                    <SelectItem value="30days">Last 30 Days</SelectItem>
                                    <SelectItem value="90days">Last 90 Days</SelectItem>
                                    <SelectItem value="1year">Last Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Tabs */}
                <Tabs defaultValue="all" className="space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-3 bg-[#202020]">
                        <TabsTrigger value="all" className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-[#171717]">
                            All Payments
                        </TabsTrigger>
                        <TabsTrigger value="subscriptions" className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-[#171717]">
                            Subscriptions
                        </TabsTrigger>
                        <TabsTrigger value="campaigns" className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-[#171717]">
                            Campaigns
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        {filteredPayments.length > 0 ? (
                            <div className="space-y-4">
                                {filteredPayments.map((payment) => (
                                    <PaymentCard key={payment.id} payment={payment} />
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardContent className="p-12 text-center">
                                    <CreditCard className="w-12 h-12 text-[#575757] mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-[#EDECF8] mb-2">No payments found</h3>
                                    <p className="text-[#828288]">
                                        {filters.search || filters.type !== 'all' || filters.status !== 'all' || filters.dateRange !== 'all'
                                            ? 'Try adjusting your filters to see more results.'
                                            : 'Your payment history will appear here once you make your first payment.'
                                        }
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="subscriptions" className="space-y-4">
                        {filteredPayments.filter(p => p.type === 'subscription').length > 0 ? (
                            <div className="space-y-4">
                                {filteredPayments.filter(p => p.type === 'subscription').map((payment) => (
                                    <PaymentCard key={payment.id} payment={payment} />
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardContent className="p-12 text-center">
                                    <RefreshCw className="w-12 h-12 text-[#575757] mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-[#EDECF8] mb-2">No subscription payments</h3>
                                    <p className="text-[#828288]">Your subscription payment history will appear here.</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="campaigns" className="space-y-4">
                        {filteredPayments.filter(p => p.type.includes('campaign')).length > 0 ? (
                            <div className="space-y-4">
                                {filteredPayments.filter(p => p.type.includes('campaign')).map((payment) => (
                                    <PaymentCard key={payment.id} payment={payment} />
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardContent className="p-12 text-center">
                                    <TrendingUp className="w-12 h-12 text-[#575757] mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-[#EDECF8] mb-2">No campaign payments</h3>
                                    <p className="text-[#828288]">Your campaign funding and payout history will appear here.</p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}