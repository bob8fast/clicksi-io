// utils/subscription-utils.ts
import
{
    BusinessType,
    BillingCycle,
    FeatureKey,
    SubscriptionPlan,
    SubscriptionStatus,
    SubscriptionStatusString,
    TrialRequestStatus,
    TrialRequestStatusString,
    UserSubscription,
    getBillingCycleString,
    getStatusString,
    getTrialRequestStatusString
} from '@/types';

export class SubscriptionUtils
{
    /**
     * Check if a feature is available in a specific plan
     */
    static hasFeature(plan: SubscriptionPlan, feature: FeatureKey): boolean
    {
        if (!plan?.features) return false;

        switch (feature)
        {
            // New permission-based features
            case 'basicAnalytics':
                return plan.features.analytics || false;
            case 'advancedAnalytics':
                return plan.features.advancedReporting || false;
            case 'customReports':
                return plan.features.advancedReporting || false;
            case 'dataExport':
                return plan.features.advancedReporting || false;
            case 'basicConnections':
            case 'connections':
                return (plan.features.maxConnections && plan.features.maxConnections > 0) || plan.features.maxConnections === -1;
            case 'unlimitedConnections':
                return plan.features.maxConnections === -1;
            case 'basicInvites':
            case 'invites':
                return (plan.features.maxInvites && plan.features.maxInvites > 0) || plan.features.maxInvites === -1;
            case 'unlimitedInvites':
                return plan.features.maxInvites === -1;
            case 'basicCampaigns':
                return plan.features.campaignManagement || false;
            case 'advancedCampaigns':
                return plan.features.campaignManagement && plan.features.advancedReporting || false;
            case 'campaignAnalytics':
                return plan.features.advancedReporting || false;
            case 'basicSupport':
                return true; // Basic support is always available
            case 'prioritySupport':
                return plan.features.prioritySupport || false;
            case 'dedicatedManager':
                return plan.features.dedicatedManager || false;
            case 'customBranding':
                return plan.features.customBranding || false;
            case 'whiteLabel':
                return plan.features.whiteLabel || false;
            case 'customDomain':
                return plan.features.whiteLabel || false; // Assume custom domain comes with white label
            case 'basicApiAccess':
                return plan.features.apiAccess || false;
            case 'advancedApiAccess':
                return plan.features.apiAccess && plan.features.advancedReporting || false;
            case 'webhookSupport':
                return plan.features.apiAccess || false;
            case 'thirdPartyIntegrations':
                return plan.features.apiAccess || false;
            case 'basicProducts':
                return true; // Basic products always available
            case 'unlimitedProducts':
                return plan.features.unlimitedProducts || false;
            case 'productAnalytics':
                return plan.features.advancedReporting || false;
            case 'advancedPermissions':
                return plan.features.dedicatedManager || false; // Enterprise feature
            case 'auditLogs':
                return plan.features.dedicatedManager || false; // Enterprise feature
            case 'ssoIntegration':
                return plan.features.dedicatedManager || false; // Enterprise feature
            case 'customContracts':
                return plan.features.dedicatedManager || false; // Enterprise feature
            case 'onPremiseDeployment':
                return plan.features.dedicatedManager || false; // Enterprise feature
            // Legacy compatibility
            case 'maxConnections':
                return (plan.features.maxConnections && plan.features.maxConnections > 0) || plan.features.maxConnections === -1;
            case 'maxInvites':
                return (plan.features.maxInvites && plan.features.maxInvites > 0) || plan.features.maxInvites === -1;
            default:
                return false;
        }
    }

    /**
     * Get the minimum plan level required for a feature
     */
    static getMinimumPlanForFeature(feature: FeatureKey, businessType: BusinessType): string
    {
        // This would typically come from your plan configuration
        const featureRequirements: Record<FeatureKey, Record<BusinessType, string>> = {
            // Analytics & Reporting
            basicAnalytics: { Brand: 'Basic', Retailer: 'Basic' },
            advancedAnalytics: { Brand: 'Standard', Retailer: 'Standard' },
            customReports: { Brand: 'Premium', Retailer: 'Premium' },
            dataExport: { Brand: 'Premium', Retailer: 'Premium' },

            // Connections & Invitations
            basicConnections: { Brand: 'Basic', Retailer: 'Basic' },
            unlimitedConnections: { Brand: 'Premium', Retailer: 'Premium' },
            basicInvites: { Brand: 'Basic', Retailer: 'Basic' },
            unlimitedInvites: { Brand: 'Premium', Retailer: 'Premium' },
            connections: { Brand: 'Basic', Retailer: 'Basic' },
            invites: { Brand: 'Basic', Retailer: 'Basic' },
            maxConnections: { Brand: 'Basic', Retailer: 'Basic' },
            maxInvites: { Brand: 'Basic', Retailer: 'Basic' },

            // Campaign Management
            basicCampaigns: { Brand: 'Basic', Retailer: 'Basic' },
            advancedCampaigns: { Brand: 'Standard', Retailer: 'Standard' },
            campaignAnalytics: { Brand: 'Standard', Retailer: 'Standard' },

            // Support & Service
            basicSupport: { Brand: 'Basic', Retailer: 'Basic' },
            prioritySupport: { Brand: 'Standard', Retailer: 'Standard' },
            dedicatedManager: { Brand: 'Enterprise', Retailer: 'Enterprise' },

            // Branding & Customization
            customBranding: { Brand: 'Standard', Retailer: 'Standard' },
            whiteLabel: { Brand: 'Enterprise', Retailer: 'Enterprise' },
            customDomain: { Brand: 'Enterprise', Retailer: 'Enterprise' },

            // API & Integrations
            basicApiAccess: { Brand: 'Premium', Retailer: 'Premium' },
            advancedApiAccess: { Brand: 'Enterprise', Retailer: 'Enterprise' },
            webhookSupport: { Brand: 'Premium', Retailer: 'Premium' },
            thirdPartyIntegrations: { Brand: 'Enterprise', Retailer: 'Enterprise' },

            // Products & Commerce
            basicProducts: { Brand: 'Basic', Retailer: 'Basic' },
            unlimitedProducts: { Brand: 'Premium', Retailer: 'Premium' },
            productAnalytics: { Brand: 'Standard', Retailer: 'Standard' },

            // Enterprise Features
            advancedPermissions: { Brand: 'Enterprise', Retailer: 'Enterprise' },
            auditLogs: { Brand: 'Enterprise', Retailer: 'Enterprise' },
            ssoIntegration: { Brand: 'Enterprise', Retailer: 'Enterprise' },
            customContracts: { Brand: 'Enterprise', Retailer: 'Enterprise' },
            onPremiseDeployment: { Brand: 'Enterprise', Retailer: 'Enterprise' },
        };

        return featureRequirements[feature]?.[businessType] || 'Standard';
    }

    /**
     * Calculate usage percentage
     */
    static calculateUsagePercentage(current: number, limit: number): number
    {
        if (limit === -1) return 0; // Unlimited
        if (limit === 0) return 100; // No limit means 100% used
        return Math.min((current / limit) * 100, 100);
    }

    /**
     * Check if usage is approaching limit
     */
    static isApproachingLimit(current: number, limit: number, threshold = 80): boolean
    {
        if (limit === -1) return false; // Unlimited
        return this.calculateUsagePercentage(current, limit) >= threshold;
    }

    /**
     * Check if usage limit is exceeded
     */
    static isLimitExceeded(current: number, limit: number): boolean
    {
        if (limit === -1) return false; // Unlimited
        return current >= limit;
    }

    /**
     * Get subscription status color for UI
     */
    static getStatusColor(status: SubscriptionStatus | SubscriptionStatusString | string): string
    {
        // Handle both enum values and string values
        const statusString = typeof status === 'string' ? status : getStatusString(status as SubscriptionStatus);

        switch (statusString)
        {
            case 'active':
                return 'text-green-500';
            case 'trial':
                return 'text-blue-500';
            case 'cancelled':
                return 'text-red-500';
            case 'expired':
                return 'text-red-500';
            case 'pending':
                return 'text-yellow-500';
            case 'suspended':
                return 'text-orange-500';
            default:
                return 'text-[#575757]';
        }
    }

    /**
     * Get trial request status color for UI
     */
    static getTrialRequestStatusColor(status: TrialRequestStatus | TrialRequestStatusString | string): string
    {
        // Handle both enum values and string values
        const statusString = typeof status === 'string' ? status : getTrialRequestStatusString(status as TrialRequestStatus);

        switch (statusString)
        {
            case 'pending':
                return 'text-yellow-500';
            case 'approved':
                return 'text-green-500';
            case 'rejected':
                return 'text-red-500';
            default:
                return 'text-[#575757]';
        }
    }

    /**
     * Format price for display
     */
    static formatPrice(amount: number, currency = 'USD'): string
    {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
        }).format(amount);
    }

    /**
     * Calculate savings for annual billing
     */
    static calculateAnnualSavings(monthlyPrice: number, yearlyPrice: number): number
    {
        const annualMonthly = monthlyPrice * 12;
        if (annualMonthly <= yearlyPrice) return 0;
        return Math.round(((annualMonthly - yearlyPrice) / annualMonthly) * 100);
    }

    /**
     * Get effective monthly price based on billing cycle
     */
    static getEffectiveMonthlyPrice(plan: SubscriptionPlan, billingCycle: BillingCycle | BillingCycleString): number
    {
        const cycleString = typeof billingCycle === 'string' ? billingCycle : getBillingCycleString(billingCycle);

        if (cycleString === 'yearly')
        {
            return plan.price.yearly / 12;
        }
        return plan.price.monthly;
    }

    /**
     * Get total price based on billing cycle
     */
    static getTotalPrice(plan: SubscriptionPlan, billingCycle: BillingCycle | BillingCycleString): number
    {
        const cycleString = typeof billingCycle === 'string' ? billingCycle : getBillingCycleString(billingCycle);
        return cycleString === 'yearly' ? plan.price.yearly : plan.price.monthly;
    }

    /**
     * Check if subscription is in trial period
     */
    static isInTrial(subscription: UserSubscription): boolean
    {
        if (!subscription.trialEnd) return false;

        const trialEndDate = typeof subscription.trialEnd === 'string' ? new Date(subscription.trialEnd) : subscription.trialEnd;
        return trialEndDate > new Date();
    }

    /**
     * Get days remaining in trial
     */
    static getTrialDaysRemaining(subscription: UserSubscription): number
    {
        if (!this.isInTrial(subscription)) return 0;

        if (!subscription.trialEnd) return 0;

        const now = new Date();
        const trialEndDate = typeof subscription.trialEnd === 'string' ? new Date(subscription.trialEnd) : subscription.trialEnd;
        const diffTime = trialEndDate.getTime() - now.getTime();
        return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    /**
     * Get days until next billing
     */
    static getDaysUntilNextBilling(subscription: UserSubscription): number
    {
        const now = new Date();
        const nextBilling = typeof subscription.currentPeriodEnd === 'string' ? new Date(subscription.currentPeriodEnd) : subscription.currentPeriodEnd;
        const diffTime = nextBilling.getTime() - now.getTime();
        return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    /**
     * Check if subscription is active and not cancelled
     */
    static isSubscriptionActive(subscription: UserSubscription): boolean
    {
        const statusString = typeof subscription.status === 'string' ? subscription.status : getStatusString(subscription.status as SubscriptionStatus);
        return statusString === 'active';
    }

    /**
     * Check if subscription is cancelled but still active until period end
     */
    static isSubscriptionCancelledButActive(subscription: UserSubscription): boolean
    {
        // Check if subscription has been cancelled but is still active until period end
        const statusString = typeof subscription.status === 'string' ? subscription.status : getStatusString(subscription.status as SubscriptionStatus);
        if (statusString !== 'cancelled') return false;

        const now = new Date();
        const periodEndDate = typeof subscription.currentPeriodEnd === 'string' ? new Date(subscription.currentPeriodEnd) : subscription.currentPeriodEnd;

        return periodEndDate > now;
    }

    /**
     * Determine if user should see upgrade prompt
     */
    static shouldShowUpgradePrompt(
        subscription: UserSubscription | null,
        feature: FeatureKey,
        currentUsage?: number
    ): boolean
    {
        if (!subscription || !subscription.plan) return true;

        // Show upgrade prompt if feature is not available in current plan
        if (!this.hasFeature(subscription.plan, feature))
        {
            return true;
        }

        // Show upgrade prompt if approaching usage limits
        if ((feature === 'connections' || feature === 'invites') && currentUsage !== undefined)
        {
            const limit = feature === 'connections'
                ? subscription.plan.features.maxConnections
                : subscription.plan.features.maxInvites;

            if (limit && limit !== -1)
            {
                return this.isApproachingLimit(currentUsage, limit);
            }
        }

        return false;
    }

    /**
     * Get next recommended plan for upgrade
     */
    static getNextRecommendedPlan(
        currentPlan: SubscriptionPlan,
        allPlans: SubscriptionPlan[],
        feature?: FeatureKey
    ): SubscriptionPlan | null
    {
        const sameBusinneTypePlans = allPlans
            .filter(plan => plan.businessType === currentPlan.businessType)
            .sort((a, b) => a.price.monthly - b.price.monthly);

        const currentIndex = sameBusinneTypePlans.findIndex(plan => plan.id === currentPlan.id);

        if (currentIndex === -1) return null;

        // If a specific feature is requested, find the first plan that includes it
        if (feature)
        {
            for (let i = currentIndex + 1; i < sameBusinneTypePlans.length; i++)
            {
                if (this.hasFeature(sameBusinneTypePlans[i], feature))
                {
                    return sameBusinneTypePlans[i];
                }
            }
        }

        // Otherwise, return the next plan in the sequence
        return sameBusinneTypePlans[currentIndex + 1] || null;
    }

    /**
     * Compare two plans and return differences
     */
    static comparePlans(
        planA: SubscriptionPlan,
        planB: SubscriptionPlan
    ):
        {
            priceMonthlyDiff: number;
            priceYearlyDiff: number;
            features: {
                added: string[];
                removed: string[];
                improved: string[];
            };
        }
    {
        const priceMonthlyDiff = planB.price.monthly - planA.price.monthly;
        const priceYearlyDiff = planB.price.yearly - planA.price.yearly;

        const featuresA = planA.features;
        const featuresB = planB.features;

        const added: string[] = [];
        const removed: string[] = [];
        const improved: string[] = [];

        // Compare boolean features
        const booleanFeatures = ['analytics', 'prioritySupport', 'customBranding', 'apiAccess', 'campaignManagement', 'advancedReporting', 'unlimitedProducts', 'dedicatedManager', 'whiteLabel'];

        booleanFeatures.forEach(feature =>
        {
            const valueA = featuresA[feature as keyof typeof featuresA];
            const valueB = featuresB[feature as keyof typeof featuresB];

            if (!valueA && valueB)
            {
                added.push(feature);
            } else if (valueA && !valueB)
            {
                removed.push(feature);
            }
        });

        // Compare numeric features
        if (featuresA.maxConnections < featuresB.maxConnections)
        {
            improved.push('maxConnections');
        } else if (featuresA.maxConnections > featuresB.maxConnections)
        {
            removed.push('maxConnections');
        }

        if (featuresA.maxInvites < featuresB.maxInvites)
        {
            improved.push('maxInvites');
        } else if (featuresA.maxInvites > featuresB.maxInvites)
        {
            removed.push('maxInvites');
        }

        return {
            priceMonthlyDiff,
            priceYearlyDiff,
            features: {
                added,
                removed,
                improved
            }
        };
    }

    /**
     * Validate subscription creation data
     */
    static validateSubscriptionData(data: any): { isValid: boolean; errors: string[] }
    {
        const errors: string[] = [];

        if (!data.user_id)
        {
            errors.push('User ID is required');
        }

        if (!data.plan_id)
        {
            errors.push('Plan ID is required');
        }

        if (!data.billing_cycle || !['monthly', 'yearly'].includes(data.billing_cycle))
        {
            errors.push('Valid billing cycle is required (monthly or yearly)');
        }

        if (!data.payment_method_id)
        {
            errors.push('Payment method ID is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate trial request data
     */
    static validateTrialRequestData(data: any): { isValid: boolean; errors: string[] }
    {
        const errors: string[] = [];

        if (!data.user_id)
        {
            errors.push('User ID is required');
        }

        if (!data.requested_plan_id)
        {
            errors.push('Requested plan ID is required');
        }

        if (!data.business_type)
        {
            errors.push('Business type is required');
        }

        if (!data.reason || data.reason.length < 10)
        {
            errors.push('Reason must be at least 10 characters long');
        }

        if (!data.company_size)
        {
            errors.push('Company size is required');
        }

        if (!data.expected_usage)
        {
            errors.push('Expected usage is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Format duration for display
     */
    static formatDuration(duration: string): string
    {
        // Parse ISO 8601 duration or similar format
        const match = duration.match(/(\d+):(\d+):(\d+)/);
        if (match)
        {
            const [, hours, minutes, seconds] = match;
            if (parseInt(hours) > 0)
            {
                return `${hours}h ${minutes}m`;
            }
            if (parseInt(minutes) > 0)
            {
                return `${minutes}m ${seconds}s`;
            }
            return `${seconds}s`;
        }
        return duration;
    }

    /**
     * Generate subscription summary for display
     */
    static getSubscriptionSummary(subscription: UserSubscription):
        {
            status: string;
            statusColor: string;
            daysUntilBilling: number;
            isInTrial: boolean;
            trialDaysRemaining: number;
            isCancelledButActive: boolean;
        }
    {
        const statusString = typeof subscription.status === 'string' ? subscription.status : getStatusString(subscription.status as SubscriptionStatus);

        return {
            status: statusString,
            statusColor: this.getStatusColor(subscription.status),
            daysUntilBilling: this.getDaysUntilNextBilling(subscription),
            isInTrial: this.isInTrial(subscription),
            trialDaysRemaining: this.getTrialDaysRemaining(subscription),
            isCancelledButActive: this.isSubscriptionCancelledButActive(subscription),
        };
    }

    /**
     * Get feature display name
     */
    getFeatureDisplayName = (feature: FeatureKey): string =>
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
}

// Export the class and utility functions
export default SubscriptionUtils;

// Export individual utility functions for easier imports
export const hasFeature = SubscriptionUtils.hasFeature;
export const getMinimumPlanForFeature = SubscriptionUtils.getMinimumPlanForFeature;
export const calculateUsagePercentage = SubscriptionUtils.calculateUsagePercentage;
export const isApproachingLimit = SubscriptionUtils.isApproachingLimit;
export const isLimitExceeded = SubscriptionUtils.isLimitExceeded;
export const getStatusColor = SubscriptionUtils.getStatusColor;
export const getTrialRequestStatusColor = SubscriptionUtils.getTrialRequestStatusColor;
export const formatPrice = SubscriptionUtils.formatPrice;
export const calculateAnnualSavings = SubscriptionUtils.calculateAnnualSavings;
export const getEffectiveMonthlyPrice = SubscriptionUtils.getEffectiveMonthlyPrice;
export const getTotalPrice = SubscriptionUtils.getTotalPrice;
export const isInTrial = SubscriptionUtils.isInTrial;
export const getTrialDaysRemaining = SubscriptionUtils.getTrialDaysRemaining;
export const getDaysUntilNextBilling = SubscriptionUtils.getDaysUntilNextBilling;
export const isSubscriptionActive = SubscriptionUtils.isSubscriptionActive;
export const isSubscriptionCancelledButActive = SubscriptionUtils.isSubscriptionCancelledButActive;
export const shouldShowUpgradePrompt = SubscriptionUtils.shouldShowUpgradePrompt;
export const getNextRecommendedPlan = SubscriptionUtils.getNextRecommendedPlan;
export const comparePlans = SubscriptionUtils.comparePlans;
export const validateSubscriptionData = SubscriptionUtils.validateSubscriptionData;
export const validateTrialRequestData = SubscriptionUtils.validateTrialRequestData;
export const formatDuration = SubscriptionUtils.formatDuration;
export const getSubscriptionSummary = SubscriptionUtils.getSubscriptionSummary;
export const getTrialRequestStatusString = SubscriptionUtils.getTrialRequestStatusColor;