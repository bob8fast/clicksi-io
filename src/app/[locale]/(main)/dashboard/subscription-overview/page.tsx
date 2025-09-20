// app/dashboard/subscription-overview/page.tsx
'use client'

import
{
    FeatureButton,
    FeatureTooltip,
    PermissionGuard,
    UsageMeter
} from '@/components/features/subscription/PermissionGuard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import
{
    useCurrentUsage,
    useSubscriptionPermissions,
    useUserSubscription
} from '@/hooks/api/subscription-hooks';
import { SubscriptionUtils } from '@/lib/subscription-utils';
import
{
    ArrowRight,
    BarChart3,
    CheckCircle,
    Crown,
    Gift,
    Mail,
    Settings,
    Shield,
    Star,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
// import { useSession } from 'next-auth/react'; // Removed auth
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';


interface FeatureCardProps
{
    icon: React.ElementType;
    title: string;
    description: string;
    feature: string;
    available: boolean;
    comingSoon?: boolean;
}

function FeatureCard({ icon: Icon, title, description, feature: _feature, available, comingSoon }: FeatureCardProps)
{
    const router = useRouter();

    return (
        <Card className={`bg-[#090909] border-2 transition-all ${available ? 'border-[#D78E59]' : 'border-[#202020]'
            }`}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${available ? 'bg-[#D78E59]' : 'bg-[#202020]'
                            }`}>
                            <Icon className={`w-5 h-5 ${available ? 'text-[#171717]' : 'text-[#575757]'
                                }`} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#EDECF8] mb-1">{title}</h3>
                            <p className="text-[#828288] text-sm">{description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {comingSoon && (
                            <Badge className="bg-blue-500 text-white text-xs">
                                Coming Soon
                            </Badge>
                        )}
                        {available ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-[#575757]" />
                        )}
                    </div>
                </div>

                {!available && !comingSoon && (
                    <Button
                        onClick={() => router.push('/subscription?upgrade=true')}
                        size="sm"
                        className="w-full bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                    >
                        Upgrade to Unlock
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

export default function SubscriptionOverviewPage()
{
    const router = useRouter();
    // Mock user ID since auth is removed
    const userId = 'mock-user-id';

    const { data: subscription } = useUserSubscription(userId);
    const { data: _usage } = useCurrentUsage(userId);
    const analyticsPermissions = useSubscriptionPermissions('analytics');
    const apiPermissions = useSubscriptionPermissions('apiAccess');
    const customBrandingPermissions = useSubscriptionPermissions('customBranding');

    const subscriptionData = useMemo(() =>
    {
        if (!subscription) return null;

        const isInTrial = SubscriptionUtils.isInTrial(subscription);
        const trialDaysLeft = SubscriptionUtils.getTrialDaysRemaining(subscription);
        const daysUntilBilling = SubscriptionUtils.getDaysUntilNextBilling(subscription);

        return {
            ...subscription,
            isInTrial,
            trialDaysLeft,
            daysUntilBilling,
        };
    }, [subscription]);

    if (!subscription)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="w-20 h-20 bg-[#202020] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Crown className="w-10 h-10 text-[#575757]" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#EDECF8] mb-4">No Active Subscription</h1>
                    <p className="text-[#828288] mb-8">
                        Subscribe to a plan to unlock powerful features and grow your business.
                    </p>
                    <Button
                        onClick={() => router.push('/subscription')}
                        className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                    >
                        Choose a Plan
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        );
    }

    const plan = subscription.plan;

    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#EDECF8] mb-2">Subscription Overview</h1>
                        <p className="text-[#828288]">
                            Manage your plan, track usage, and explore available features
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push('/subscription/manage')}
                        variant="outline"
                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Plan
                    </Button>
                </div>

                {/* Trial Alert */}
                {subscriptionData?.isInTrial && (
                    <Card className="bg-gradient-to-r from-[#D78E59] to-[#FFAA6C] border-0">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 text-[#171717]">
                                <Gift className="w-8 h-8" />
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Free Trial Active</h3>
                                    <p className="opacity-90">
                                        You have {subscriptionData.trialDaysLeft} days left in your free trial.
                                        Enjoy full access to all {plan.name} features!
                                    </p>
                                </div>
                                <Button
                                    onClick={() => router.push('/subscription/manage')}
                                    className="bg-[#171717] text-[#D78E59] hover:bg-[#202020] ml-auto"
                                >
                                    Manage Trial
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Current Plan */}
                <Card className="bg-[#090909] border-[#D78E59]">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                <Crown className="w-5 h-5 text-[#D78E59]" />
                                Current Plan: {plan.name}
                            </CardTitle>
                            <Badge className="bg-[#D78E59] text-[#171717]">
                                {plan.businessType}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#EDECF8] mb-1">
                                    ${plan.price.monthly}
                                </div>
                                <div className="text-[#828288] text-sm">per month</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#EDECF8] mb-1">
                                    {subscriptionData?.daysUntilBilling || 0}
                                </div>
                                <div className="text-[#828288] text-sm">days until renewal</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#EDECF8] mb-1">
                                    {plan.trialDays}
                                </div>
                                <div className="text-[#828288] text-sm">trial days included</div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-[#575757]">
                            <p className="text-[#828288] text-center mb-4">{plan.description}</p>
                            <div className="flex justify-center gap-4">
                                <Button
                                    onClick={() => router.push('/subscription?upgrade=true')}
                                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                >
                                    Upgrade Plan
                                </Button>
                                <Button
                                    onClick={() => router.push('/subscription/payments')}
                                    variant="outline"
                                    className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                >
                                    View Billing
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Usage Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UsageMeter feature="connections" showUpgradeWhen={80} />
                    <UsageMeter feature="invites" showUpgradeWhen={80} />
                </div>

                {/* Quick Actions */}
                <Card className="bg-[#090909] border-[#202020]">
                    <CardHeader>
                        <CardTitle className="text-[#EDECF8]">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FeatureButton
                                feature="connections"
                                onClick={() => router.push('/partners')}
                                className="w-full bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] justify-start"
                            >
                                <Users className="w-4 h-4 mr-2" />
                                Find Partners
                            </FeatureButton>

                            <FeatureButton
                                feature="invites"
                                onClick={() => router.push('/invitations')}
                                className="w-full bg-[#FFAA6C] hover:bg-[#D78E59] text-[#171717] justify-start"
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                Send Invitations
                            </FeatureButton>

                            <FeatureButton
                                feature="analytics"
                                onClick={() => router.push('/analytics')}
                                className="w-full bg-[#575757] hover:bg-[#828288] text-[#EDECF8] justify-start"
                            >
                                <BarChart3 className="w-4 h-4 mr-2" />
                                View Analytics
                            </FeatureButton>
                        </div>
                    </CardContent>
                </Card>

                {/* Feature Availability */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Available Features */}
                    <Card className="bg-[#090909] border-[#202020]">
                        <CardHeader>
                            <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Available Features
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FeatureCard
                                icon={BarChart3}
                                title="Analytics Dashboard"
                                description="Track performance and engagement metrics"
                                feature="analytics"
                                available={analyticsPermissions.hasAccess}
                            />
                            <FeatureCard
                                icon={Users}
                                title="Partner Network"
                                description="Connect with brands and retailers"
                                feature="connections"
                                available={true}
                            />
                            <FeatureCard
                                icon={Mail}
                                title="Invitation System"
                                description="Send collaboration invitations"
                                feature="invites"
                                available={true}
                            />
                        </CardContent>
                    </Card>

                    {/* Premium Features */}
                    <Card className="bg-[#090909] border-[#202020]">
                        <CardHeader>
                            <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                <Crown className="w-5 h-5 text-[#D78E59]" />
                                Premium Features
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FeatureCard
                                icon={Zap}
                                title="API Access"
                                description="Integrate with external tools and platforms"
                                feature="apiAccess"
                                available={apiPermissions.hasAccess}
                            />
                            <FeatureCard
                                icon={Star}
                                title="Custom Branding"
                                description="White-label the platform with your brand"
                                feature="customBranding"
                                available={customBrandingPermissions.hasAccess}
                            />
                            <FeatureCard
                                icon={Shield}
                                title="Dedicated Support"
                                description="Priority customer support channel"
                                feature="prioritySupport"
                                available={plan.features.prioritySupport}
                                comingSoon={!plan.features.prioritySupport}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Analytics with Permission Guard */}
                <PermissionGuard
                    feature="analytics"
                    upgradeTitle="Unlock Advanced Analytics"
                    upgradeMessage="Get detailed insights into your partnerships, campaign performance, and growth metrics."
                >
                    <Card className="bg-[#090909] border-[#202020]">
                        <CardHeader>
                            <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-[#D78E59]" />
                                Performance Analytics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#EDECF8] mb-1">156%</div>
                                    <div className="text-[#828288] text-sm">Growth Rate</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#EDECF8] mb-1">89</div>
                                    <div className="text-[#828288] text-sm">Active Partnerships</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#EDECF8] mb-1">$24.5K</div>
                                    <div className="text-[#828288] text-sm">Revenue This Month</div>
                                </div>
                            </div>

                            <div className="h-32 bg-[#202020] rounded-lg flex items-center justify-center mb-4">
                                <div className="text-center">
                                    <TrendingUp className="w-8 h-8 text-[#575757] mx-auto mb-2" />
                                    <p className="text-[#575757] text-sm">Interactive charts would appear here</p>
                                </div>
                            </div>

                            <Button
                                onClick={() => router.push('/analytics')}
                                className="w-full bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                            >
                                View Full Analytics Dashboard
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </PermissionGuard>

                {/* Soft Permission Guard Example */}
                <PermissionGuard
                    feature="apiAccess"
                    requirementLevel="soft"
                    upgradeTitle="Enhanced API Features Available"
                    upgradeMessage="Unlock advanced API endpoints, webhooks, and rate limiting with a higher tier plan."
                >
                    <Card className="bg-[#090909] border-[#202020]">
                        <CardHeader>
                            <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                <Zap className="w-5 h-5 text-[#FFAA6C]" />
                                API Integration
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-[#828288] mb-4">
                                Connect Clicksi with your existing tools and workflows using our REST API.
                            </p>
                            <div className="bg-[#202020] rounded p-3 font-mono text-sm text-[#EDECF8] mb-4">
                                <div>GET /api/v1/partnerships</div>
                                <div>POST /api/v1/invitations</div>
                                <div>GET /api/v1/analytics</div>
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => window.open('/docs/api', '_blank')}
                                    variant="outline"
                                    className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                >
                                    View Documentation
                                </Button>
                                <Button
                                    onClick={() => router.push('/settings/api')}
                                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                >
                                    Generate API Key
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </PermissionGuard>
            </div>
        </div>
    );
}