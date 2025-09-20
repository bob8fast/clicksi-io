// app/subscription/page.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSubscriptionPlans, useUserActiveSubscription } from '@/hooks/api/subscription-hooks';
import { BusinessType } from '@/types/app/registration-schema';
import { PermissionUtils, SubscriptionPlanDto } from '@/types/app/subscription';
import
{
    BarChart3,
    Check,
    Crown,
    Headphones,
    Infinity,
    Mail,
    Palette,
    Settings,
    ShieldCheck,
    Star,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
// import { useSession } from 'next-auth/react'; // Removed auth
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const getFeatureIcon = (feature: string) =>
{
    const icons: Record<string, any> = {
        max_connections: Users,
        max_invites: Mail,
        analytics: BarChart3,
        prioritySupport: Headphones,
        customBranding: Palette,
        apiAccess: Zap,
        campaignManagement: TrendingUp,
        advancedReporting: Settings,
        unlimitedProducts: Infinity,
        dedicatedManager: Star,
        whiteLabel: ShieldCheck,
    };
    return icons[feature] || Check;
};

const formatFeatureValue = (key: string, value: any): string =>
{
    if (key === 'max_connections' || key === 'max_invites')
    {
        return value === -1 ? 'Unlimited' : value.toString();
    }
    return value === true ? 'Included' : value === false ? 'Not included' : value.toString();
};

const getFeatureLabel = (key: string, businessType: BusinessType): string =>
{
    const labels: Record<string, { Brand: string; Retailer: string }> = {
        max_connections: { Brand: 'Retailer Connections', Retailer: 'Brand Connections' },
        max_invites: { Brand: 'Monthly Invites to Retailers', Retailer: 'Monthly Invites to Brands' },
        analytics: { Brand: 'Analytics Dashboard', Retailer: 'Analytics Dashboard' },
        prioritySupport: { Brand: 'Priority Support', Retailer: 'Priority Support' },
        customBranding: { Brand: 'Custom Branding', Retailer: 'Custom Branding' },
        apiAccess: { Brand: 'API Access', Retailer: 'API Access' },
        campaignManagement: { Brand: 'Campaign Management', Retailer: 'Campaign Management' },
        advancedReporting: { Brand: 'Advanced Reporting', Retailer: 'Advanced Reporting' },
        unlimitedProducts: { Brand: 'Unlimited Products', Retailer: 'Unlimited Product Listings' },
        dedicatedManager: { Brand: 'Dedicated Account Manager', Retailer: 'Dedicated Account Manager' },
        whiteLabel: { Brand: 'White Label Solution', Retailer: 'White Label Solution' },
    };
    return labels[key]?.[businessType] || key;
};

interface PlanCardProps
{
    plan: SubscriptionPlanDto;
    isCurrentPlan: boolean;
    billingCycle: 'monthly' | 'yearly';
    onSelectPlan: (planId: string) => void;
}

function PlanCard({ plan, isCurrentPlan, billingCycle, onSelectPlan }: PlanCardProps)
{
    const _price = billingCycle === 'yearly' ? plan.yearly_price : plan.monthly_price;
    const monthlyPrice = billingCycle === 'yearly' ? plan.yearly_price / 12 : plan.monthly_price;
    const savings = billingCycle === 'yearly' ? Math.round(((plan.monthly_price * 12 - plan.yearly_price) / (plan.monthly_price * 12)) * 100) : 0;

    // Convert permissions to feature flags
    const features = PermissionUtils.toFeatureFlags(plan.permissions);

    return (
        <Card className={`relative bg-[#090909] border-2 transition-all duration-300 hover:shadow-xl ${plan.is_popular ? 'border-[#D78E59] shadow-lg' : 'border-[#202020] hover:border-[#575757]'
            }`}>
            {plan.is_popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#D78E59] text-[#171717] font-semibold px-4 py-1">
                        <Crown className="w-4 h-4 mr-1" />
                        Most Popular
                    </Badge>
                </div>
            )}

            <CardHeader className="text-center pb-4">
                <div className="mb-4">
                    <h3 className="text-2xl font-bold text-[#EDECF8] mb-2">{plan.name}</h3>
                    <p className="text-[#828288] text-sm">{plan.description}</p>
                </div>

                <div className="mb-4">
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-bold text-[#EDECF8]">${Math.round(monthlyPrice)}</span>
                        <div className="text-left">
                            <div className="text-[#828288] text-sm">per month</div>
                            {billingCycle === 'yearly' && (
                                <div className="text-[#D78E59] text-xs">billed yearly</div>
                            )}
                        </div>
                    </div>

                    {billingCycle === 'yearly' && savings > 0 && (
                        <div className="mt-2">
                            <Badge variant="outline" className="border-[#D78E59] text-[#D78E59]">
                                Save {savings}%
                            </Badge>
                        </div>
                    )}

                    <div className="text-[#575757] text-sm mt-2">
                        {plan.trial_days}-day free trial
                    </div>
                </div>

                <Button
                    onClick={() => onSelectPlan(plan.id)}
                    disabled={isCurrentPlan}
                    className={`w-full ${isCurrentPlan
                        ? 'bg-[#575757] text-[#828288] cursor-not-allowed'
                        : plan.is_popular
                            ? 'bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]'
                            : 'bg-transparent border-2 border-[#575757] text-[#EDECF8] hover:bg-[#202020] hover:border-[#828288]'
                        }`}
                >
                    {isCurrentPlan ? 'Current Plan' : 'Get Started'}
                </Button>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="space-y-3">
                    {/* Core Limits */}
                    <div className="flex items-center gap-3">
                        <div className="text-[#D78E59]">
                            <Users className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                            <span className="text-[#EDECF8] text-sm">
                                {getFeatureLabel('max_connections', plan.business_type)}
                            </span>
                            <span className="text-[#D78E59] text-sm font-semibold ml-2">
                                {formatFeatureValue('max_connections', plan.max_connections)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-[#D78E59]">
                            <Mail className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                            <span className="text-[#EDECF8] text-sm">
                                {getFeatureLabel('max_invites', plan.business_type)}
                            </span>
                            <span className="text-[#D78E59] text-sm font-semibold ml-2">
                                {formatFeatureValue('max_invites', plan.max_invites)}
                            </span>
                        </div>
                    </div>

                    {/* Feature List */}
                    {Object.entries(features).map(([key, value]) =>
                    {
                        if (typeof value === 'boolean' && ['analytics', 'prioritySupport', 'customBranding', 'basicApiAccess', 'advancedApiAccess', 'basicCampaigns', 'advancedCampaigns', 'unlimitedProducts', 'dedicatedManager', 'whiteLabel'].includes(key))
                        {
                            const Icon = getFeatureIcon(key);
                            return (
                                <div key={key} className="flex items-center gap-3">
                                    <div className={`p-1 rounded ${value ? 'text-[#D78E59]' : 'text-[#575757]'
                                        }`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[#EDECF8] text-sm">
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </span>
                                    </div>
                                    {value === false && (
                                        <span className="text-[#575757] text-xs">Not included</span>
                                    )}
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

export default function SubscriptionPlansPage()
{
    const router = useRouter();
    // Mock session data since auth is removed
    const mockSession = {
        user_info: {
            user_id: 'mock-user-id',
            email: 'user@example.com'
        }
    };
    const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType>('Brand');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const { data: plans, isLoading } = useSubscriptionPlans(selectedBusinessType);
    const { data: userSubscription } = useUserActiveSubscription(mockSession.user_info.user_id);

    const handleSelectPlan = (planId: string) =>
    {
        // Auth check removed - proceed with mock data
        router.push(`/subscription/checkout?plan=${planId}&billing=${billingCycle}`);
    };

    const handleRequestTrial = () =>
    {
        // Auth check removed - proceed with mock data
        router.push('/subscription/trial');
    };

    if (isLoading)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse space-y-8">
                        <div className="text-center space-y-4">
                            <div className="h-8 bg-[#202020] rounded w-1/3 mx-auto"></div>
                            <div className="h-4 bg-[#202020] rounded w-2/3 mx-auto"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-96 bg-[#202020] rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#EDECF8] mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-[#828288] max-w-3xl mx-auto mb-8">
                        Select the perfect subscription plan for your business. Unlock powerful features
                        to grow your brand partnerships and maximize your success.
                    </p>

                    <div className="flex justify-center gap-4 mb-8">
                        <Button
                            onClick={handleRequestTrial}
                            variant="outline"
                            className="border-[#D78E59] text-[#D78E59] hover:bg-[#D78E59] hover:text-[#171717]"
                        >
                            Start Free Trial
                        </Button>
                    </div>
                </div>

                {/* Business Type Tabs */}
                <Tabs value={selectedBusinessType} onValueChange={(value) => setSelectedBusinessType(value as BusinessType)} className="mb-8">
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-[#202020] mb-8">
                        <TabsTrigger value="Brand" className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-[#171717]">
                            For Brands
                        </TabsTrigger>
                        <TabsTrigger value="Retailer" className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-[#171717]">
                            For Retailers
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="Brand" className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[#EDECF8] mb-2">Plans for Beauty Brands</h2>
                            <p className="text-[#828288]">
                                Connect with retailers, manage campaigns, and grow your brand presence
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="Retailer" className="space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[#EDECF8] mb-2">Plans for Retailers</h2>
                            <p className="text-[#828288]">
                                Partner with brands, expand your product portfolio, and increase sales
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="bg-[#202020] rounded-lg p-1 flex">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded transition-all ${billingCycle === 'monthly'
                                ? 'bg-[#D78E59] text-[#171717]'
                                : 'text-[#828288] hover:text-[#EDECF8]'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2 rounded transition-all ${billingCycle === 'yearly'
                                ? 'bg-[#D78E59] text-[#171717]'
                                : 'text-[#828288] hover:text-[#EDECF8]'
                                }`}
                        >
                            Yearly
                            <Badge className="ml-2 bg-[#FFAA6C] text-[#171717] text-xs">Save 17%</Badge>
                        </button>
                    </div>
                </div>

                {/* Plans Grid */}
                {plans && plans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                isCurrentPlan={userSubscription?.plan_id === plan.id}
                                billingCycle={billingCycle}
                                onSelectPlan={handleSelectPlan}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="bg-[#090909] border-[#202020]">
                        <CardContent className="p-12 text-center">
                            <div className="w-20 h-20 bg-[#202020] rounded-full flex items-center justify-center mx-auto mb-6">
                                <Crown className="w-10 h-10 text-[#575757]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#EDECF8] mb-4">
                                No Plans Available
                            </h3>
                            <p className="text-[#828288] mb-6 max-w-md mx-auto">
                                We&apos;re currently setting up subscription plans for {selectedBusinessType === 'Brand' ? 'beauty brands' : 'retailers'}.
                                Please check back soon or contact our team for early access.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    onClick={handleRequestTrial}
                                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                >
                                    Request Early Access
                                </Button>
                                <Button
                                    onClick={() => router.push('/contact')}
                                    variant="outline"
                                    className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                >
                                    Contact Sales
                                </Button>
                            </div>
                            {selectedBusinessType === 'Brand' ? (
                                <Button
                                    onClick={() => setSelectedBusinessType('Retailer')}
                                    variant="ghost"
                                    className="mt-4 text-[#828288] hover:text-[#EDECF8]"
                                >
                                    View Retailer Plans Instead
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setSelectedBusinessType('Brand')}
                                    variant="ghost"
                                    className="mt-4 text-[#828288] hover:text-[#EDECF8]"
                                >
                                    View Brand Plans Instead
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* FAQ Section */}
                <div className="mt-16 text-center">
                    <h3 className="text-2xl font-bold text-[#EDECF8] mb-4">Questions?</h3>
                    <p className="text-[#828288] mb-6">
                        Need help choosing the right plan? Our team is here to help.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button
                            variant="outline"
                            className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                            onClick={() => router.push('/contact')}
                        >
                            Contact Sales
                        </Button>
                        <Button
                            variant="outline"
                            className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                            onClick={() => router.push('/help')}
                        >
                            View FAQ
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}