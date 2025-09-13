// app/premium-features/page.tsx
/**
 * Complete example showing how to implement subscription features
 * This page demonstrates all subscription components working together
 */
'use client'

import
    {
        FeatureButton,
        FeatureTooltip,
        PermissionGuard,
        UsageMeter
    } from '@/components/features/subscription/PermissionGuard';
import RoutePermissionWrapper from '@/components/features/subscription/RoutePermissionWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import
    {
        useCurrentUsage,
        useSubscriptionPermissions,
        useUserSubscription
    } from '@/hooks/api/subscription-hooks';
import
    {
        BarChart3,
        Crown,
        Download,
        Globe,
        Mail,
        Settings,
        Shield,
        Smartphone,
        Star,
        TrendingUp,
        Users,
        Zap
    } from 'lucide-react';
// import { useSession } from 'next-auth/react'; // Removed auth
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function PremiumFeaturesContent()
{
    const router = useRouter();
    // Mock user data since auth is removed
    const mockUserId = 'mock-user-id';
    const { data: subscription } = useUserSubscription(mockUserId);
    const { data: _usage } = useCurrentUsage(mockUserId);

    // Permission checks for various features
    const _analyticsPermissions = useSubscriptionPermissions('analytics');
    const apiPermissions = useSubscriptionPermissions('apiAccess');
    const _brandingPermissions = useSubscriptionPermissions('customBranding');
    const _connectionsPermissions = useSubscriptionPermissions('connections');

    const handleExportData = () =>
    {
        toast.success('Data export initiated!');
    };

    const handleAPIAccess = () =>
    {
        router.push('/api-docs');
    };

    const handleCustomBranding = () =>
    {
        router.push('/settings/branding');
    };

    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#EDECF8] mb-4 flex items-center justify-center gap-3">
                        <Crown className="w-10 h-10 text-[#D78E59]" />
                        Premium Features
                    </h1>
                    <p className="text-xl text-[#828288] max-w-3xl mx-auto">
                        Unlock the full potential of Clicksi with advanced features designed for growing businesses
                    </p>
                </div>

                {/* Current Plan Overview */}
                {subscription && (
                    <Card className="bg-gradient-to-r from-[#D78E59]/10 to-[#FFAA6C]/10 border-[#D78E59]">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-[#EDECF8] mb-2">
                                        Current Plan: {subscription.plan.name}
                                    </h3>
                                    <p className="text-[#828288]">
                                        {subscription.plan.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-[#D78E59]">
                                        ${subscription.plan.price.monthly}
                                    </div>
                                    <div className="text-[#828288] text-sm">per month</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Usage Meters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UsageMeter feature="connections" showUpgradeWhen={75} />
                    <UsageMeter feature="invites" showUpgradeWhen={80} />
                </div>

                {/* Feature Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Analytics Dashboard - Hard Permission Guard */}
                    <PermissionGuard
                        feature="analytics"
                        upgradeTitle="Advanced Analytics Dashboard"
                        upgradeMessage="Get detailed insights with custom reports, real-time data, and export capabilities."
                    >
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-[#D78E59]" />
                                    Analytics Dashboard
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="h-32 bg-[#202020] rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                        <TrendingUp className="w-8 h-8 text-[#D78E59] mx-auto mb-2" />
                                        <p className="text-[#575757] text-sm">Live Analytics Data</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-lg font-bold text-[#EDECF8]">156%</div>
                                        <div className="text-[#575757] text-xs">Growth</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-[#EDECF8]">89</div>
                                        <div className="text-[#575757] text-xs">Partners</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-[#EDECF8]">$24K</div>
                                        <div className="text-[#575757] text-xs">Revenue</div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <FeatureButton
                                        feature="analytics"
                                        onClick={() => router.push('/analytics')}
                                        className="flex-1 bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                    >
                                        View Dashboard
                                    </FeatureButton>
                                    <FeatureButton
                                        feature="analytics"
                                        onClick={handleExportData}
                                        className="bg-[#575757] hover:bg-[#828288] text-[#EDECF8]"
                                    >
                                        <Download className="w-4 h-4" />
                                    </FeatureButton>
                                </div>
                            </CardContent>
                        </Card>
                    </PermissionGuard>

                    {/* API Access - Soft Permission Guard */}
                    <PermissionGuard
                        feature="apiAccess"
                        requirementLevel="soft"
                        upgradeTitle="Enhanced API Features"
                        upgradeMessage="Get higher rate limits, webhooks, and advanced API endpoints."
                    >
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-[#FFAA6C]" />
                                    API Integration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-[#828288]">
                                    Connect Clicksi with your existing tools and build custom integrations.
                                </p>

                                <div className="bg-[#202020] rounded p-3 font-mono text-sm text-[#EDECF8] space-y-1">
                                    <div className="text-green-400">GET /api/v1/partnerships</div>
                                    <div className="text-blue-400">POST /api/v1/campaigns</div>
                                    <div className="text-yellow-400">GET /api/v1/analytics</div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#828288]">Rate Limit</span>
                                    <span className="text-[#EDECF8]">
                                        {apiPermissions.hasAccess ? '10,000/hour' : '1,000/hour'}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleAPIAccess}
                                        className="flex-1 bg-[#FFAA6C] hover:bg-[#D78E59] text-[#171717]"
                                    >
                                        <Globe className="w-4 h-4 mr-2" />
                                        View Docs
                                    </Button>
                                    <FeatureTooltip feature="apiAccess">
                                        <Button
                                            variant="outline"
                                            className="border-[#575757] text-[#828288]"
                                        >
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </FeatureTooltip>
                                </div>
                            </CardContent>
                        </Card>
                    </PermissionGuard>
                </div>

                {/* Custom Branding Section */}
                <PermissionGuard
                    feature="customBranding"
                    upgradeTitle="White Label & Custom Branding"
                    upgradeMessage="Customize the platform with your brand colors, logo, and domain."
                >
                    <Card className="bg-[#090909] border-[#202020]">
                        <CardHeader>
                            <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                <Star className="w-5 h-5 text-[#D78E59]" />
                                Custom Branding
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-[#202020] rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <Star className="w-8 h-8 text-[#D78E59]" />
                                    </div>
                                    <h3 className="font-semibold text-[#EDECF8] mb-2">Custom Logo</h3>
                                    <p className="text-[#828288] text-sm">Upload your brand logo and customize colors</p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-[#202020] rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <Globe className="w-8 h-8 text-[#FFAA6C]" />
                                    </div>
                                    <h3 className="font-semibold text-[#EDECF8] mb-2">Custom Domain</h3>
                                    <p className="text-[#828288] text-sm">Use your own domain for the platform</p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-[#202020] rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <Smartphone className="w-8 h-8 text-[#575757]" />
                                    </div>
                                    <h3 className="font-semibold text-[#EDECF8] mb-2">Mobile App</h3>
                                    <p className="text-[#828288] text-sm">White-labeled mobile applications</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-[#575757] text-center">
                                <FeatureButton
                                    feature="customBranding"
                                    onClick={handleCustomBranding}
                                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                >
                                    Customize Branding
                                </FeatureButton>
                            </div>
                        </CardContent>
                    </Card>
                </PermissionGuard>

                {/* Action Bar with Mixed Permissions */}
                <Card className="bg-[#090909] border-[#202020]">
                    <CardHeader>
                        <CardTitle className="text-[#EDECF8]">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <FeatureButton
                                feature="connections"
                                onClick={() => router.push('/partners')}
                                className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] justify-start"
                            >
                                <Users className="w-4 h-4 mr-2" />
                                Find Partners
                            </FeatureButton>

                            <FeatureButton
                                feature="invites"
                                onClick={() => router.push('/invites')}
                                className="bg-[#FFAA6C] hover:bg-[#D78E59] text-[#171717] justify-start"
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                Send Invites
                            </FeatureButton>

                            <FeatureTooltip feature="prioritySupport">
                                <Button
                                    disabled={!subscription?.plan.features.prioritySupport}
                                    className="bg-[#575757] hover:bg-[#828288] text-[#EDECF8] justify-start w-full"
                                    onClick={() => router.push('/support')}
                                >
                                    <Shield className="w-4 h-4 mr-2" />
                                    Priority Support
                                </Button>
                            </FeatureTooltip>

                            <FeatureTooltip feature="dedicatedManager">
                                <Button
                                    disabled={!subscription?.plan.features.dedicatedManager}
                                    className="bg-[#202020] text-[#575757] justify-start w-full cursor-not-allowed"
                                >
                                    <Star className="w-4 h-4 mr-2" />
                                    Account Manager
                                </Button>
                            </FeatureTooltip>
                        </div>
                    </CardContent>
                </Card>

                {/* Upgrade Prompt */}
                <Card className="bg-gradient-to-r from-[#202020] to-[#171717] border-[#D78E59]">
                    <CardContent className="p-8 text-center">
                        <Crown className="w-16 h-16 text-[#D78E59] mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-[#EDECF8] mb-2">
                            Ready to Unlock More Features?
                        </h3>
                        <p className="text-[#828288] mb-6 max-w-2xl mx-auto">
                            Upgrade your plan to access advanced analytics, API integration, custom branding,
                            and priority support. Take your business to the next level with Clicksi.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => router.push('/subscription?upgrade=true')}
                                className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] px-8 py-3"
                            >
                                Upgrade Plan
                            </Button>
                            <Button
                                onClick={() => router.push('/subscription/trial')}
                                variant="outline"
                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] px-8 py-3"
                            >
                                Request Trial
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Wrap the entire page with route-level permissions
export default function PremiumFeaturesPage()
{
    return (
        <RoutePermissionWrapper
            requiredRole="Business" // Only business users can access
            customFallback={
                <div className="min-h-screen bg-[#171717] flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-6">
                        <Crown className="w-16 h-16 text-[#575757] mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-[#EDECF8] mb-4">Business Account Required</h1>
                        <p className="text-[#828288] mb-6">
                            Premium features are only available for business accounts.
                            Upgrade your account to access advanced functionality.
                        </p>
                        <Button className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]">
                            Upgrade to Business
                        </Button>
                    </div>
                </div>
            }
        >
            <PremiumFeaturesContent />
        </RoutePermissionWrapper>
    );
}

// Alternative usage with HOC pattern:
// export default withSubscriptionPermission(PremiumFeaturesContent, {
//   requiredRole: 'BusinessUser',
//   showUpgradePage: true
// });