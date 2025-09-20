// app/subscription/manage/page.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import
{
    useCancelSubscription,
    useCurrentUsage,
    useUserActiveSubscription
} from '@/hooks/api/subscription-hooks';
import { CancelSubscriptionRequest, PermissionUtils } from '@/types/app/subscription';
import { getStatusString } from '@/types';
import
{
    AlertTriangle,
    ArrowRight,
    BarChart3,
    Calendar,
    CheckCircle,
    CreditCard,
    Crown,
    Download,
    Edit,
    ExternalLink,
    Mail,
    Settings,
    Shield,
    Trash2,
    Users,
    Zap
} from 'lucide-react';
// import { useSession } from 'next-auth/react'; // Removed auth
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface UsageCardProps
{
    title: string;
    current: number;
    limit: number;
    icon: React.ElementType;
    color: string;
}

function UsageCard({ title, current, limit, icon: Icon, color }: UsageCardProps)
{
    const percentage = limit === -1 ? 0 : Math.min((current / limit) * 100, 100);
    const isUnlimited = limit === -1;
    const isNearLimit = percentage > 80;

    return (
        <Card className="bg-[#090909] border-[#202020]">
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[#EDECF8]">{title}</h3>
                        <div className="text-sm text-[#828288]">
                            {isUnlimited ? (
                                <span className="text-[#D78E59]">Unlimited</span>
                            ) : (
                                `${current} of ${limit} used`
                            )}
                        </div>
                    </div>
                </div>

                {!isUnlimited && (
                    <div className="space-y-2">
                        <Progress
                            value={percentage}
                            className="h-2 bg-[#202020]"
                        />
                        <div className="flex justify-between text-xs">
                            <span className="text-[#575757]">{current}</span>
                            <span className={isNearLimit ? "text-[#FFAA6C]" : "text-[#575757]"}>
                                {limit}
                            </span>
                        </div>
                        {isNearLimit && (
                            <div className="flex items-center gap-1 text-[#FFAA6C] text-xs">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Approaching limit</span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function SubscriptionManagePage()
{
    const router = useRouter();
    // Mock user ID since auth is removed
    const userId = 'mock-user-id';

    const { data: subscription, isLoading } = useUserActiveSubscription(userId);
    const { data: usage } = useCurrentUsage(userId);
    const cancelSubscription = useCancelSubscription();

    const [autoRenew, setAutoRenew] = useState(subscription?.auto_renew ?? true);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    if (isLoading)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-[#202020] rounded w-1/3"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="h-64 bg-[#202020] rounded-xl"></div>
                                <div className="h-48 bg-[#202020] rounded-xl"></div>
                            </div>
                            <div className="space-y-6">
                                <div className="h-32 bg-[#202020] rounded-xl"></div>
                                <div className="h-48 bg-[#202020] rounded-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!subscription)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-[#202020] rounded-full flex items-center justify-center mx-auto mb-6">
                            <CreditCard className="w-10 h-10 text-[#575757]" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#EDECF8] mb-4">No Active Subscription</h1>
                        <p className="text-[#828288] mb-8">
                            You don&apos;t have an active subscription. Choose a plan to get started with Clicksi.
                        </p>
                        <Button
                            onClick={() => router.push('/subscription')}
                            className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                        >
                            View Plans
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const plan = subscription.plan;
    const currentPeriodEnd = new Date(subscription.current_period_end);
    const daysUntilRenewal = Math.ceil((currentPeriodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    const isTrialActive = subscription.trial_end && new Date(subscription.trial_end) > new Date();
    const trialDaysLeft = isTrialActive ? Math.ceil((new Date(subscription.trial_end!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0;

    const statusString = getStatusString(subscription.status);

    const handleCancelSubscription = async () =>
    {
        try
        {
            const cancelRequest: CancelSubscriptionRequest = {
                subscription_id: subscription.id,
                cancellation_reason: 'User requested cancellation',
                immediate: false
            };
            await cancelSubscription.mutateAsync(cancelRequest);
            setShowCancelConfirm(false);
        } catch (_error)
        {
            // Error handling is in the hook
        }
    };

    const handleUpdatePaymentMethod = () =>
    {
        router.push('/subscription/payment-method');
    };

    const handleUpgrade = () =>
    {
        router.push('/subscription?upgrade=true');
    };

    const handleDowngrade = () =>
    {
        router.push('/subscription?downgrade=true');
    };

    // Convert permissions to feature flags if plan exists
    const planFeatures = plan ? PermissionUtils.toFeatureFlags(plan.permissions) : null;

    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#EDECF8] mb-2">Subscription</h1>
                        <p className="text-[#828288]">Manage your plan, billing, and usage</p>
                    </div>
                    <Button
                        onClick={() => router.push('/subscription/payments')}
                        variant="outline"
                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Payment History
                    </Button>
                </div>

                {/* Trial Warning */}
                {isTrialActive && (
                    <Card className="bg-gradient-to-r from-[#D78E59] to-[#FFAA6C] border-0 mb-8">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 text-[#171717]">
                                <Crown className="w-8 h-8" />
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Free Trial Active</h3>
                                    <p className="opacity-90">
                                        You have {trialDaysLeft} days left in your free trial.
                                        Add a payment method to continue after your trial ends.
                                    </p>
                                </div>
                                <Button
                                    onClick={handleUpdatePaymentMethod}
                                    className="bg-[#171717] text-[#D78E59] hover:bg-[#202020] ml-auto"
                                >
                                    Add Payment Method
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Current Plan */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                        <Crown className="w-5 h-5 text-[#D78E59]" />
                                        Current Plan
                                    </CardTitle>
                                    <Badge
                                        className={
                                            statusString === 'active'
                                                ? 'bg-green-500 text-white'
                                                : statusString === 'cancelled'
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-yellow-500 text-black'
                                        }
                                    >
                                        {statusString}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-[#EDECF8] mb-2">
                                            {plan?.name} Plan
                                        </h3>
                                        <p className="text-[#828288] mb-4">{plan?.description}</p>
                                        <div className="flex items-center gap-4 text-sm text-[#575757]">
                                            <div>Business Type: {plan?.business_type}</div>
                                            <div>•</div>
                                            <div>
                                                Next billing: {currentPeriodEnd.toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-[#EDECF8] mb-1">
                                            ${plan?.monthly_price}
                                        </div>
                                        <div className="text-[#575757] text-sm">per month</div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        onClick={handleUpgrade}
                                        className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                    >
                                        Upgrade Plan
                                    </Button>
                                    <Button
                                        onClick={handleDowngrade}
                                        variant="outline"
                                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                    >
                                        Change Plan
                                    </Button>
                                    {statusString === 'active' && (
                                        <Button
                                            onClick={() => setShowCancelConfirm(true)}
                                            variant="outline"
                                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Usage Overview */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" />
                                    Usage This Month
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <UsageCard
                                        title="Connections"
                                        current={usage?.connections || 0}
                                        limit={plan?.max_connections || 0}
                                        icon={Users}
                                        color="bg-[#D78E59] text-[#171717]"
                                    />
                                    <UsageCard
                                        title="Monthly Invites"
                                        current={usage?.invites || 0}
                                        limit={plan?.max_invites || 0}
                                        icon={Mail}
                                        color="bg-[#FFAA6C] text-[#171717]"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    Plan Features
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {planFeatures && Object.entries(planFeatures).map(([key, value]) =>
                                    {
                                        if (typeof value === 'boolean' && ['analytics', 'prioritySupport', 'customBranding', 'basicApiAccess', 'advancedApiAccess', 'basicCampaigns', 'advancedCampaigns', 'unlimitedProducts', 'dedicatedManager', 'whiteLabel'].includes(key))
                                        {
                                            return (
                                                <div key={key} className="flex items-center gap-3">
                                                    {value ? (
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full border-2 border-[#575757]" />
                                                    )}
                                                    <span className={value ? "text-[#EDECF8]" : "text-[#575757]"}>
                                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                    </span>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Billing Info */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Billing
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="text-sm text-[#828288] mb-1">Next payment</div>
                                    <div className="text-[#EDECF8] font-semibold">
                                        {currentPeriodEnd.toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-[#575757]">
                                        in {daysUntilRenewal} days
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-[#828288]">Auto-renewal</div>
                                        <div className="text-[#EDECF8] text-sm">
                                            {autoRenew ? 'Enabled' : 'Disabled'}
                                        </div>
                                    </div>
                                    <Switch
                                        checked={autoRenew}
                                        onCheckedChange={setAutoRenew}
                                    />
                                </div>

                                <Button
                                    onClick={() => router.push('/subscription/billing')}
                                    variant="outline"
                                    className="w-full border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Billing Settings
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Payment Method */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Payment Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center py-4">
                                    <AlertTriangle className="w-8 h-8 text-[#FFAA6C] mx-auto mb-2" />
                                    <div className="text-[#EDECF8] font-medium mb-1">No payment method</div>
                                    <div className="text-[#575757] text-sm">Add a payment method to continue</div>
                                </div>

                                <Button
                                    onClick={handleUpdatePaymentMethod}
                                    variant="outline"
                                    className="w-full border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Add Payment Method
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Support */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Support
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    onClick={() => router.push('/help')}
                                    variant="outline"
                                    className="w-full border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] justify-start"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Help Center
                                </Button>
                                <Button
                                    onClick={() => router.push('/contact')}
                                    variant="outline"
                                    className="w-full border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] justify-start"
                                >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Contact Support
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Cancel Confirmation Modal */}
                {showCancelConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <Card className="bg-[#171717] border-[#575757] max-w-md w-full">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-[#FFAA6C]" />
                                    Cancel Subscription
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-[#828288]">
                                    Are you sure you want to cancel your subscription? You&apos;ll lose access to all premium features
                                    at the end of your current billing period.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleCancelSubscription}
                                        disabled={cancelSubscription.isPending}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                                    >
                                        {cancelSubscription.isPending ? 'Canceling...' : 'Yes, Cancel'}
                                    </Button>
                                    <Button
                                        onClick={() => setShowCancelConfirm(false)}
                                        variant="outline"
                                        className="flex-1 border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                    >
                                        Keep Plan
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}