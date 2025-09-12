// components/subscription/PermissionGuard.tsx
'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeatureKey } from '@/types/app/subscription';
// import { useSession } from 'next-auth/react'; // Removed auth
import { useSubscriptionHooks } from '@/hooks/api/subscription-hooks';
import type { UserManagementDomainDTOsTeamSubscriptionDto } from '@/gen/api/types/user_management_domain_dt_os_team_subscription_dto';
import
{
    AlertTriangle,
    ArrowRight,
    BarChart3,
    Check,
    Crown,
    Headphones,
    Lock,
    Mail,
    Palette,
    Settings,
    ShieldCheck,
    Star,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface PermissionGuardProps
{
    feature: FeatureKey;
    children: ReactNode;
    fallback?: ReactNode;
    showUpgradePrompt?: boolean;
    upgradeMessage?: string;
    upgradeTitle?: string;
    requirementLevel?: 'soft' | 'hard'; // soft = show warning but allow access, hard = block access
    onUpgrade?: () => void;
}

export function PermissionGuard({
    feature,
    children,
    fallback,
    showUpgradePrompt = true,
    upgradeMessage,
    upgradeTitle,
    requirementLevel = 'hard',
    onUpgrade,
}: PermissionGuardProps)
{
    const router = useRouter();
    const { data: session } = useSession();
    
    const subscriptionHooks = useSubscriptionHooks();
    // For now, use simplified subscription logic without team_id
    // TODO: Implement proper team subscription lookup when team_id is available
    const teamActiveSubscription: UserManagementDomainDTOsTeamSubscriptionDto | null = null;
    const subscription: UserManagementDomainDTOsTeamSubscriptionDto | null = teamActiveSubscription;
    const permissions = {
        hasAccess: true, // For now, allow access - TODO: implement proper permission checking
        currentPlan: subscription && subscription.plan ? subscription.plan.name : 'Basic',
        currentUsage: undefined,
        limit: undefined
    };

    const handleUpgrade = () =>
    {
        if (onUpgrade)
        {
            onUpgrade();
        } else
        {
            router.push('/subscription?upgrade=true');
        }
    };


    const getFeatureDisplayName = (feature: FeatureKey): string =>
    {
        const displayNames: Record<FeatureKey, string> = {
            // Analytics & Reporting
            basicAnalytics: 'Basic Analytics',
            advancedAnalytics: 'Advanced Analytics',
            customReports: 'Custom Reports',
            dataExport: 'Data Export',

            // Connections & Invitations
            basicConnections: 'Basic Connections',
            unlimitedConnections: 'Unlimited Connections',
            basicInvites: 'Basic Invitations',
            unlimitedInvites: 'Unlimited Invitations',
            connections: 'Partner Connections',
            invites: 'Monthly Invitations',
            maxConnections: 'Maximum Connections',
            maxInvites: 'Maximum Invitations',

            // Campaign Management
            basicCampaigns: 'Basic Campaign Management',
            advancedCampaigns: 'Advanced Campaign Management',
            campaignAnalytics: 'Campaign Analytics',

            // Support & Service
            basicSupport: 'Basic Support',
            prioritySupport: 'Priority Support',
            dedicatedManager: 'Dedicated Account Manager',

            // Branding & Customization
            customBranding: 'Custom Branding',
            whiteLabel: 'White Label Solution',
            customDomain: 'Custom Domain',

            // API & Integrations
            basicApiAccess: 'Basic API Access',
            advancedApiAccess: 'Advanced API Access',
            webhookSupport: 'Webhook Support',
            thirdPartyIntegrations: 'Third-party Integrations',

            // Products & Commerce
            basicProducts: 'Basic Product Management',
            unlimitedProducts: 'Unlimited Products',
            productAnalytics: 'Product Analytics',

            // Enterprise Features
            advancedPermissions: 'Advanced Permission Management',
            auditLogs: 'Audit Logs',
            ssoIntegration: 'SSO Integration',
            customContracts: 'Custom Contracts',
            onPremiseDeployment: 'On-Premise Deployment',
        };
        return displayNames[feature] || feature;
    };

    const getFeatureIcon = (feature: string) =>
    {
        const icons: Record<string, any> = {
            maxConnections: Users,
            maxInvites: Mail,
            analytics: BarChart3,
            basicAnalytics: BarChart3,
            advancedAnalytics: BarChart3,
            prioritySupport: Headphones,
            customBranding: Palette,
            basicApiAccess: Zap,
            advancedApiAccess: Zap,
            campaignManagement: TrendingUp,
            basicCampaigns: TrendingUp,
            advancedCampaigns: TrendingUp,
            advancedReporting: Settings,
            unlimitedProducts: Star,
            dedicatedManager: Star,
            whiteLabel: ShieldCheck,
        };
        return icons[feature] || Check;
    };

    // If user has access, render children
    if (permissions.hasAccess)
    {
        return <>{children}</>;
    }

    // For soft requirements, show warning but still render children
    if (requirementLevel === 'soft')
    {
        return (
            <div className="space-y-4">
                <Card className="bg-gradient-to-r from-[#D78E59]/10 to-[#FFAA6C]/10 border-[#D78E59]/30">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-[#D78E59]" />
                            <div className="flex-1">
                                <p className="text-[#EDECF8] font-medium">
                                    {upgradeTitle || `Upgrade to unlock ${getFeatureDisplayName(feature)}`}
                                </p>
                                <p className="text-[#828288] text-sm">
                                    {upgradeMessage || `You're currently on the ${permissions.currentPlan} plan.`}
                                </p>
                            </div>
                            <Button
                                onClick={handleUpgrade}
                                size="sm"
                                className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                            >
                                Upgrade
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                {children}
            </div>
        );
    }

    // If custom fallback is provided, use it
    if (fallback)
    {
        return <>{fallback}</>;
    }

    // If showUpgradePrompt is false, return null (completely hide the feature)
    if (!showUpgradePrompt)
    {
        return null;
    }

    // Default upgrade prompt
    const FeatureIcon = getFeatureIcon(feature);
    const featureName = getFeatureDisplayName(feature);

    return (
        <Card className="bg-[#090909] border-[#575757]">
            <CardHeader>
                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#575757]" />
                    {upgradeTitle || `${featureName} Not Available`}
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
                <div className="w-16 h-16 bg-[#202020] rounded-xl flex items-center justify-center mx-auto mb-6">
                    <FeatureIcon className="w-8 h-8 text-[#575757]" />
                </div>

                <h3 className="text-xl font-semibold text-[#EDECF8] mb-2">
                    Unlock {featureName}
                </h3>

                <p className="text-[#828288] mb-6">
                    {upgradeMessage ||
                        `${featureName} is not included in your current ${permissions.currentPlan} plan. Upgrade to access this feature and unlock your full potential.`}
                </p>

                {permissions.currentUsage !== undefined && permissions.limit !== undefined && (
                    <div className="bg-[#202020] rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-center gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#D78E59]">{permissions.currentUsage}</div>
                                <div className="text-[#828288] text-sm">Used</div>
                            </div>
                            <div className="text-[#575757]">/</div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#575757]">{permissions.limit}</div>
                                <div className="text-[#828288] text-sm">Limit</div>
                            </div>
                        </div>
                        <p className="text-[#575757] text-sm mt-2">
                            You've reached your {featureName.toLowerCase()} limit
                        </p>
                    </div>
                )}

                <Button
                    onClick={handleUpgrade}
                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] font-semibold"
                >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </CardContent>
        </Card>
    );
}

// Specialized components for common use cases
interface FeatureButtonProps
{
    feature: FeatureKey;
    onClick: () => void;
    children: ReactNode;
    className?: string;
    disabled?: boolean;
}

export function FeatureButton({ feature, onClick, children, className, disabled }: FeatureButtonProps)
{
    // Simplified - always allow access for now
    const permissions = { hasAccess: true };

    return (
        <Button
            onClick={permissions.hasAccess ? onClick : undefined}
            disabled={disabled || !permissions.hasAccess}
            className={className}
        >
            {!permissions.hasAccess && <Lock className="w-4 h-4 mr-2" />}
            {children}
        </Button>
    );
}

interface UsageMeterProps
{
    feature: 'connections' | 'invites';
    showUpgradeWhen?: number; // percentage threshold to show upgrade prompt
}

export function UsageMeter({ feature, showUpgradeWhen = 80 }: UsageMeterProps)
{
    const { data: session } = useSession();
    const subscriptionHooks = useSubscriptionHooks();
    // For now, use simplified subscription logic without team_id
    // TODO: Implement proper team subscription lookup when team_id is available
    const teamActiveSubscription: UserManagementDomainDTOsTeamSubscriptionDto | null = null;
    const subscription: UserManagementDomainDTOsTeamSubscriptionDto | null = teamActiveSubscription;
    const currentUsage = feature === 'connections' ? 0 : 0; // TODO: Get actual usage
    const limit = feature === 'connections' ? 
        (subscription && subscription.plan ? subscription.plan.max_connections : undefined) : 
        (subscription && subscription.plan ? subscription.plan.max_invites : undefined);
    
    const permissions = { currentUsage, limit };
    const router = useRouter();

    if (!permissions.currentUsage || !permissions.limit || permissions.limit === -1)
    {
        return null;
    }

    const percentage = Math.min((permissions.currentUsage / permissions.limit) * 100, 100);
    const shouldShowUpgrade = percentage >= showUpgradeWhen;

    return (
        <Card className={`bg-[#090909] border-[#202020] ${shouldShowUpgrade ? 'border-[#D78E59]' : ''}`}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-[#EDECF8] capitalize">{feature}</h4>
                    <span className="text-sm text-[#828288]">
                        {permissions.currentUsage} / {permissions.limit}
                    </span>
                </div>

                <div className="w-full bg-[#202020] rounded-full h-2 mb-3">
                    <div
                        className={`h-2 rounded-full transition-all ${percentage >= 90 ? 'bg-red-500' :
                            percentage >= 80 ? 'bg-[#FFAA6C]' :
                                'bg-[#D78E59]'
                            }`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {shouldShowUpgrade && (
                    <div className="flex items-center justify-between">
                        <p className="text-[#FFAA6C] text-sm">
                            {percentage >= 100 ? 'Limit reached' : 'Approaching limit'}
                        </p>
                        <Button
                            size="sm"
                            onClick={() => router.push('/subscription?upgrade=true')}
                            className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                        >
                            Upgrade
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

interface FeatureTooltipProps
{
    feature: FeatureKey;
    children: ReactNode;
}

export function FeatureTooltip({ feature, children }: FeatureTooltipProps)
{
    // Simplified - always allow access for now
    const permissions = { hasAccess: true, currentPlan: 'Basic' };

    if (permissions.hasAccess)
    {
        return <>{children}</>;
    }

    return (
        <div className="relative group">
            <div className="opacity-50 cursor-not-allowed">
                {children}
            </div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#171717] border border-[#575757] rounded-lg text-sm text-[#EDECF8] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Upgrade to {permissions.currentPlan === 'Basic' ? 'Standard' : 'Premium'} to unlock
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#575757]" />
            </div>
        </div>
    );
}