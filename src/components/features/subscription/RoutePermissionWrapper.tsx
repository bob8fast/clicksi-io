// components/subscription/RoutePermissionWrapper.tsx
'use client'

import { UserRole } from '@/types/app/registration-schema';
import { FeatureKey } from '@/types/app/subscription';
// import { useSession } from 'next-auth/react'; // Removed auth
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useSubscriptionHooks } from '@/hooks/api/subscription-hooks';
import type { UserManagementDomainDTOsTeamSubscriptionDto } from '@/gen/api/types/user_management_domain_dt_os_team_subscription_dto';
import FeatureNotIncluded from './FeatureNotIncluded';

interface RoutePermissionWrapperProps
{
    children: ReactNode;
    requiredFeature?: FeatureKey;
    requiredRole?: UserRole;
    requiredPlan?: string;
    redirectTo?: string;
    showUpgradePage?: boolean;
    customFallback?: ReactNode;
}

export default function RoutePermissionWrapper({
    children,
    requiredFeature,
    requiredRole,
    requiredPlan,
    redirectTo = '/subscription',
    showUpgradePage = true,
    customFallback,
}: RoutePermissionWrapperProps)
{
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const subscriptionHooks = useSubscriptionHooks();
    // For now, use simplified subscription logic without team_id
    // TODO: Implement proper team subscription lookup when team_id is available
    
    const teamActiveSubscription: UserManagementDomainDTOsTeamSubscriptionDto | null = null;
    const subscription: UserManagementDomainDTOsTeamSubscriptionDto | null = teamActiveSubscription;
    const featurePermissions = { hasAccess: true, currentUsage: undefined, limit: undefined };

    useEffect(() =>
    {
        // Wait for session to load
        if (status === 'loading') return;

        // Check authentication first
        if (!session)
        {
            router.push('/sign-in?returnTo=' + encodeURIComponent(window.location.pathname));
            return;
        }

        // Check role requirement
        if (requiredRole && session.user_info?.user_role !== requiredRole)
        {
            router.push('/unauthorized');
            return;
        }

        // Check subscription requirement
        if (requiredPlan && (subscription && subscription.plan ? subscription.plan.name : null) !== requiredPlan)
        {
            if (!showUpgradePage)
            {
                router.push(redirectTo);
            }
            return;
        }

        // Check feature requirement
        if (requiredFeature && !featurePermissions.hasAccess)
        {
            if (!showUpgradePage)
            {
                router.push(redirectTo);
            }
            return;
        }
    }, [session, status, requiredRole, requiredPlan, requiredFeature, redirectTo, showUpgradePage, router]);

    // Loading state
    if (status === 'loading')
    {
        return (
            <div className="min-h-screen bg-[#171717] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D78E59]"></div>
            </div>
        );
    }

    // Not authenticated
    if (!session)
    {
        return null; // Will redirect in useEffect
    }

    // Role check failed
    if (requiredRole && session.user_info?.user_role !== requiredRole)
    {
        if (customFallback) return <>{customFallback}</>;
        return (
            <div className="min-h-screen bg-[#171717] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#EDECF8] mb-4">Access Denied</h1>
                    <p className="text-[#828288]">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    // Plan requirement check
    if (requiredPlan && (subscription && subscription.plan ? subscription.plan.name : null) !== requiredPlan)
    {
        if (customFallback) return <>{customFallback}</>;
        if (!showUpgradePage) return null; // Will redirect in useEffect

        return (
            <FeatureNotIncluded
                feature="subscription"
                featureTitle={`${requiredPlan} Plan Required`}
                featureDescription={`This page is only available for ${requiredPlan} plan subscribers.`}
            />
        );
    }

    // Feature requirement check
    if (requiredFeature && !featurePermissions.hasAccess)
    {
        if (customFallback) return <>{customFallback}</>;
        if (!showUpgradePage) return null; // Will redirect in useEffect

        const featureDisplayNames: Record<FeatureKey, string> = {
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

        return (
            <FeatureNotIncluded
                feature={requiredFeature}
                featureTitle={featureDisplayNames[requiredFeature]}
                featureDescription={`${featureDisplayNames[requiredFeature]} is not included in your current plan. Upgrade to access this feature.`}
                currentUsage={featurePermissions.currentUsage}
                limit={featurePermissions.limit}
            />
        );
    }

    // All checks passed, render children
    return <>{children}</>;
}

// Higher-order component for easier usage
export function withSubscriptionPermission<P extends object>(
    Component: React.ComponentType<P>,
    permissions: {
        requiredFeature?: FeatureKey;
        requiredRole?: UserRole;
        requiredPlan?: string;
        redirectTo?: string;
        showUpgradePage?: boolean;
    }
)
{
    return function WrappedComponent(props: P)
    {
        return (
            <RoutePermissionWrapper {...permissions}>
                <Component {...props} />
            </RoutePermissionWrapper>
        );
    };
}

// Specific wrappers for common use cases
export function AdminRoute({ children }: { children: ReactNode })
{
    return (
        <RoutePermissionWrapper
            requiredRole="Admin"
            showUpgradePage={false}
            redirectTo="/unauthorized"
        >
            {children}
        </RoutePermissionWrapper>
    );
}

export function PremiumRoute({ children }: { children: ReactNode })
{
    return (
        <RoutePermissionWrapper
            requiredFeature="unlimitedProducts" // Typically premium feature
            showUpgradePage={true}
        >
            {children}
        </RoutePermissionWrapper>
    );
}

export function EnterpriseRoute({ children }: { children: ReactNode })
{
    return (
        <RoutePermissionWrapper
            requiredPlan="Enterprise"
            showUpgradePage={true}
        >
            {children}
        </RoutePermissionWrapper>
    );
}