// components/subscription/FeatureNotIncluded.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import
{
    ArrowRight,
    Check,
    Crown,
    Lock,
    Star,
    TrendingUp,
    Zap
} from 'lucide-react';
// import { useSession } from 'next-auth/react'; // Removed auth
import { useRouter } from 'next/navigation';
import { useSubscriptionHooks } from '@/hooks/api/subscription-hooks';
import type { UserManagementDomainDTOsSubscriptionPlanDto } from '@/gen/api/types/user_management_domain_dt_os_subscription_plan_dto';
import type { UserManagementDomainDTOsTeamSubscriptionDto } from '@/gen/api/types/user_management_domain_dt_os_team_subscription_dto';

interface FeatureNotIncludedProps
{
    feature: string;
    featureTitle: string;
    featureDescription: string;
    currentUsage?: number;
    limit?: number;
    requiredPlans?: string[];
}

export default function FeatureNotIncluded({
    feature,
    featureTitle,
    featureDescription,
    currentUsage,
    limit,
    requiredPlans = []
}: FeatureNotIncludedProps)
{
    // const { data: session } = useSession(); // Removed auth
    const session = null; // Mock session - auth removed
    const router = useRouter();
    const subscriptionHooks = useSubscriptionHooks();
    const { data: allPlans } = subscriptionHooks.getAllPlans({});
    // For now, use simplified subscription logic without team_id
    // TODO: Implement proper team subscription lookup when team_id is available
    const teamActiveSubscription: UserManagementDomainDTOsTeamSubscriptionDto | null = null;
    
    const userSubscription: UserManagementDomainDTOsTeamSubscriptionDto | null = teamActiveSubscription;
    const plans: UserManagementDomainDTOsSubscriptionPlanDto[] = allPlans?.results || [];

    const currentPlan = userSubscription && userSubscription.plan ? userSubscription.plan : null;

    // Find the next plan that includes this feature
    const availablePlans = plans.filter(plan =>
    {
        const currentMaxConnections = currentPlan?.max_connections || 0;
        const currentMaxInvites = currentPlan?.max_invites || 0;
        const currentPrice = currentPlan?.monthly_price || 0;
        
        if (feature === 'connections' || feature === 'maxConnections') {
            return plan.max_connections > currentMaxConnections;
        }
        if (feature === 'invites' || feature === 'maxInvites') {
            return plan.max_invites > currentMaxInvites;
        }
        // For other features, assume higher priced plans include more features
        return plan.monthly_price > currentPrice;
    });

    const recommendedPlan = availablePlans.find(plan => plan.is_popular) || availablePlans[0];

    const handleUpgrade = () =>
    {
        if (recommendedPlan)
        {
            router.push(`/subscription/checkout?plan=${recommendedPlan.id}&upgrade=true`);
        } else
        {
            router.push('/subscription');
        }
    };

    const handleContactSales = () =>
    {
        router.push('/contact?subject=enterprise-upgrade');
    };

    const getFeatureIcon = () =>
    {
        switch (feature)
        {
            case 'analytics': return TrendingUp;
            case 'apiAccess': return Zap;
            case 'customBranding': return Star;
            default: return Lock;
        }
    };

    const FeatureIcon = getFeatureIcon();

    const isUsageLimitReached = currentUsage !== undefined && limit !== undefined && currentUsage >= limit;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#171717] to-[#090909] flex items-center justify-center p-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-[#202020] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#575757]">
                        <FeatureIcon className="w-10 h-10 text-[#575757]" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-[#EDECF8] mb-4">
                        {isUsageLimitReached ? 'Usage Limit Reached' : 'Feature Not Available'}
                    </h1>

                    <p className="text-xl text-[#828288] max-w-2xl mx-auto mb-2">
                        {isUsageLimitReached
                            ? `You've reached your ${featureTitle.toLowerCase()} limit`
                            : `${featureTitle} is not included in your current plan`
                        }
                    </p>

                    {currentPlan && (
                        <Badge variant="outline" className="border-[#575757] text-[#828288]">
                            Current: {currentPlan.name} Plan
                        </Badge>
                    )}
                </div>

                {/* Current Usage Display */}
                {isUsageLimitReached && currentUsage !== undefined && limit !== undefined && (
                    <Card className="bg-[#090909] border-[#575757] mb-8">
                        <CardContent className="p-6 text-center">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#D78E59]">{currentUsage}</div>
                                    <div className="text-[#828288] text-sm">Used</div>
                                </div>
                                <div className="text-[#575757]">/</div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#575757]">{limit}</div>
                                    <div className="text-[#828288] text-sm">Limit</div>
                                </div>
                            </div>
                            <p className="text-[#828288]">
                                {featureDescription}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Feature Description */}
                {!isUsageLimitReached && (
                    <Card className="bg-[#090909] border-[#575757] mb-8">
                        <CardContent className="p-6 text-center">
                            <h3 className="text-xl font-semibold text-[#EDECF8] mb-3">{featureTitle}</h3>
                            <p className="text-[#828288] leading-relaxed">
                                {featureDescription}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Recommended Plan */}
                {recommendedPlan && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Current Plan */}
                        {currentPlan && (
                            <Card className="bg-[#090909] border-[#575757]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                        <Lock className="w-5 h-5 text-[#575757]" />
                                        Current: {currentPlan.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#828288]">Price</span>
                                            <span className="text-[#EDECF8] font-semibold">
                                                ${currentPlan.monthly_price}/month
                                            </span>
                                        </div>

                                        {feature === 'connections' && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-[#828288]">Connections</span>
                                                <span className="text-[#575757]">
                                                    {currentPlan.max_connections === -1 ? 'Unlimited' : currentPlan.max_connections}
                                                </span>
                                            </div>
                                        )}

                                        {feature === 'invites' && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-[#828288]">Monthly Invites</span>
                                                <span className="text-[#575757]">
                                                    {currentPlan.max_invites === -1 ? 'Unlimited' : currentPlan.max_invites}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <span className="text-[#828288]">{featureTitle}</span>
                                            <span className="text-[#575757]">Not included</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Recommended Plan */}
                        <Card className="bg-[#090909] border-[#D78E59] relative">
                            {recommendedPlan.is_popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-[#D78E59] text-[#171717] font-semibold px-4 py-1">
                                        <Crown className="w-4 h-4 mr-1" />
                                        Recommended
                                    </Badge>
                                </div>
                            )}

                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <Check className="w-5 h-5 text-[#D78E59]" />
                                    Upgrade to {recommendedPlan.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[#828288]">Price</span>
                                        <span className="text-[#EDECF8] font-semibold">
                                            ${recommendedPlan.monthly_price}/month
                                        </span>
                                    </div>

                                    {feature === 'connections' && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#828288]">Connections</span>
                                            <span className="text-[#D78E59] font-semibold">
                                                {recommendedPlan.max_connections === -1 ? 'Unlimited' : recommendedPlan.max_connections}
                                            </span>
                                        </div>
                                    )}

                                    {feature === 'invites' && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#828288]">Monthly Invites</span>
                                            <span className="text-[#D78E59] font-semibold">
                                                {recommendedPlan.max_invites === -1 ? 'Unlimited' : recommendedPlan.max_invites}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-[#828288]">{featureTitle}</span>
                                        <Check className="w-5 h-5 text-[#D78E59]" />
                                    </div>
                                </div>

                                <Button
                                    onClick={handleUpgrade}
                                    className="w-full bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                >
                                    Upgrade Now
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {recommendedPlan ? (
                        <>
                            <Button
                                onClick={handleUpgrade}
                                size="lg"
                                className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                            >
                                Upgrade to {recommendedPlan.name}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                            <Button
                                onClick={() => router.push('/subscription')}
                                variant="outline"
                                size="lg"
                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                            >
                                View All Plans
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                onClick={handleContactSales}
                                size="lg"
                                className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                            >
                                Contact Sales
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                            <Button
                                onClick={() => router.push('/subscription')}
                                variant="outline"
                                size="lg"
                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                            >
                                View Plans
                            </Button>
                        </>
                    )}
                </div>

                {/* Help Text */}
                <div className="text-center mt-8">
                    <p className="text-[#575757] text-sm">
                        Need help choosing the right plan?{' '}
                        <button
                            onClick={() => router.push('/contact')}
                            className="text-[#D78E59] hover:text-[#FFAA6C] underline"
                        >
                            Contact our team
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}