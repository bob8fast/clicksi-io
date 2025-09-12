// types/subscription.ts
import { z } from 'zod';
import { BillingCycleEnum, BusinessTypeEnum } from './generated-enums';

// Bitwise permissions enum matching backend exactly
export enum SubscriptionPermissions
{
    None = 0,
    // Analytics & Reporting (1-15)
    BasicAnalytics = 1 << 0,          // 1
    AdvancedAnalytics = 1 << 1,       // 2
    CustomReports = 1 << 2,           // 4
    DataExport = 1 << 3,              // 8
    // Connections & Invitations (16-31)
    BasicConnections = 1 << 4,        // 16
    UnlimitedConnections = 1 << 5,    // 32
    BasicInvites = 1 << 6,            // 64
    UnlimitedInvites = 1 << 7,        // 128
    // Campaign Management (32-47)
    BasicCampaigns = 1 << 8,          // 256
    AdvancedCampaigns = 1 << 9,       // 512
    CampaignAnalytics = 1 << 10,      // 1024
    // Support & Service (48-63)
    BasicSupport = 1 << 11,           // 2048
    PrioritySupport = 1 << 12,        // 4096
    DedicatedManager = 1 << 13,       // 8192
    // Branding & Customization (64-79)
    CustomBranding = 1 << 14,         // 16384
    WhiteLabel = 1 << 15,             // 32768
    CustomDomain = 1 << 16,           // 65536
    // API & Integrations (80-95)
    BasicApiAccess = 1 << 17,         // 131072
    AdvancedApiAccess = 1 << 18,      // 262144
    WebhookSupport = 1 << 19,         // 524288
    ThirdPartyIntegrations = 1 << 20, // 1048576
    // Products & Commerce (96-111)
    BasicProducts = 1 << 21,          // 2097152
    UnlimitedProducts = 1 << 22,      // 4194304
    ProductAnalytics = 1 << 23,       // 8388608
    // Enterprise Features (112-127)
    AdvancedPermissions = 1 << 24,    // 16777216
    AuditLogs = 1 << 25,              // 33554432
    SsoIntegration = 1 << 26,         // 67108864
    CustomContracts = 1 << 27,        // 134217728
    OnPremiseDeployment = 1 << 28     // 268435456
}

// Feature keys used in UI components - maps to permission names in camelCase
export type FeatureKey = 
    // Analytics & Reporting
    | 'basicAnalytics'
    | 'advancedAnalytics'
    | 'customReports'
    | 'dataExport'
    // Connections & Invitations
    | 'basicConnections'
    | 'unlimitedConnections'
    | 'basicInvites'
    | 'unlimitedInvites'
    | 'connections'
    | 'invites'
    | 'maxConnections'
    | 'maxInvites'
    // Campaign Management
    | 'basicCampaigns'
    | 'advancedCampaigns'
    | 'campaignAnalytics'
    // Support & Service
    | 'basicSupport'
    | 'prioritySupport'
    | 'dedicatedManager'
    // Branding & Customization
    | 'customBranding'
    | 'whiteLabel'
    | 'customDomain'
    // API & Integrations
    | 'basicApiAccess'
    | 'advancedApiAccess'
    | 'webhookSupport'
    | 'thirdPartyIntegrations'
    // Products & Commerce
    | 'basicProducts'
    | 'unlimitedProducts'
    | 'productAnalytics'
    // Enterprise Features
    | 'advancedPermissions'
    | 'auditLogs'
    | 'ssoIntegration'
    | 'customContracts'
    | 'onPremiseDeployment';

// ==================== PERMISSIONS ====================

// Helper functions for working with bitwise permissions
export class PermissionUtils
{
    /**
     * Check if a permission is included in the permissions value
     */
    static hasPermission(permissions: number, permission: SubscriptionPermissions): boolean
    {
        return (permissions & permission) === permission;
    }

    /**
     * Add a permission to the permissions value
     */
    static addPermission(permissions: number, permission: SubscriptionPermissions): number
    {
        return permissions | permission;
    }

    /**
     * Remove a permission from the permissions value
     */
    static removePermission(permissions: number, permission: SubscriptionPermissions): number
    {
        return permissions & ~permission;
    }

    /**
     * Get all permissions as an array of permission names
     */
    static getPermissionNames(permissions: number): string[]
    {
        const names: string[] = [];
        Object.entries(SubscriptionPermissions).forEach(([key, value]) =>
        {
            if (typeof value === 'number' && value !== 0 && this.hasPermission(permissions, value))
            {
                names.push(key);
            }
        });
        return names;
    }

    /**
     * Convert permissions to feature flags for UI compatibility
     */
    static toFeatureFlags(permissions: number):
        {
            analytics: boolean;
            advancedAnalytics: boolean;
            customReports: boolean;
            dataExport: boolean;
            basicConnections: boolean;
            unlimitedConnections: boolean;
            basicInvites: boolean;
            unlimitedInvites: boolean;
            basicCampaigns: boolean;
            advancedCampaigns: boolean;
            campaignAnalytics: boolean;
            basicSupport: boolean;
            prioritySupport: boolean;
            dedicatedManager: boolean;
            customBranding: boolean;
            whiteLabel: boolean;
            customDomain: boolean;
            basicApiAccess: boolean;
            advancedApiAccess: boolean;
            webhookSupport: boolean;
            thirdPartyIntegrations: boolean;
            basicProducts: boolean;
            unlimitedProducts: boolean;
            productAnalytics: boolean;
            advancedPermissions: boolean;
            auditLogs: boolean;
            ssoIntegration: boolean;
            customContracts: boolean;
            onPremiseDeployment: boolean;
        }
    {
        return {
            analytics: this.hasPermission(permissions, SubscriptionPermissions.BasicAnalytics),
            advancedAnalytics: this.hasPermission(permissions, SubscriptionPermissions.AdvancedAnalytics),
            customReports: this.hasPermission(permissions, SubscriptionPermissions.CustomReports),
            dataExport: this.hasPermission(permissions, SubscriptionPermissions.DataExport),
            basicConnections: this.hasPermission(permissions, SubscriptionPermissions.BasicConnections),
            unlimitedConnections: this.hasPermission(permissions, SubscriptionPermissions.UnlimitedConnections),
            basicInvites: this.hasPermission(permissions, SubscriptionPermissions.BasicInvites),
            unlimitedInvites: this.hasPermission(permissions, SubscriptionPermissions.UnlimitedInvites),
            basicCampaigns: this.hasPermission(permissions, SubscriptionPermissions.BasicCampaigns),
            advancedCampaigns: this.hasPermission(permissions, SubscriptionPermissions.AdvancedCampaigns),
            campaignAnalytics: this.hasPermission(permissions, SubscriptionPermissions.CampaignAnalytics),
            basicSupport: this.hasPermission(permissions, SubscriptionPermissions.BasicSupport),
            prioritySupport: this.hasPermission(permissions, SubscriptionPermissions.PrioritySupport),
            dedicatedManager: this.hasPermission(permissions, SubscriptionPermissions.DedicatedManager),
            customBranding: this.hasPermission(permissions, SubscriptionPermissions.CustomBranding),
            whiteLabel: this.hasPermission(permissions, SubscriptionPermissions.WhiteLabel),
            customDomain: this.hasPermission(permissions, SubscriptionPermissions.CustomDomain),
            basicApiAccess: this.hasPermission(permissions, SubscriptionPermissions.BasicApiAccess),
            advancedApiAccess: this.hasPermission(permissions, SubscriptionPermissions.AdvancedApiAccess),
            webhookSupport: this.hasPermission(permissions, SubscriptionPermissions.WebhookSupport),
            thirdPartyIntegrations: this.hasPermission(permissions, SubscriptionPermissions.ThirdPartyIntegrations),
            basicProducts: this.hasPermission(permissions, SubscriptionPermissions.BasicProducts),
            unlimitedProducts: this.hasPermission(permissions, SubscriptionPermissions.UnlimitedProducts),
            productAnalytics: this.hasPermission(permissions, SubscriptionPermissions.ProductAnalytics),
            advancedPermissions: this.hasPermission(permissions, SubscriptionPermissions.AdvancedPermissions),
            auditLogs: this.hasPermission(permissions, SubscriptionPermissions.AuditLogs),
            ssoIntegration: this.hasPermission(permissions, SubscriptionPermissions.SsoIntegration),
            customContracts: this.hasPermission(permissions, SubscriptionPermissions.CustomContracts),
            onPremiseDeployment: this.hasPermission(permissions, SubscriptionPermissions.OnPremiseDeployment),
        };
    }
}


export const CreateTrialRequestSchema = z.object({
    user_id: z.string().uuid(),
    requested_plan_id: z.string().uuid(),
    business_type: BusinessTypeEnum,
    reason: z.string().min(10, 'Reason must be at least 10 characters'),
    company_size: z.string().min(1, 'Company size is required'),
    expected_usage: z.string().min(10, 'Expected usage must be at least 10 characters'),
    industry: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    current_solution: z.string().optional(),
});

export const CreateSubscriptionSchema = z.object({
    user_id: z.string().uuid(),
    plan_id: z.string().uuid(),
    billing_cycle: BillingCycleEnum,
    payment_method_id: z.string().min(1, 'Payment method is required'),
    coupon_code: z.string().optional(),
    trial_requested: z.boolean().default(false),
});

export const ReviewTrialRequestSchema = z.object({
    trial_request_id: z.string().uuid(),
    approved: z.boolean(),
    admin_notes: z.string().optional(),
    rejection_reason: z.string().optional(),
    trial_duration: z.number().min(1).max(365).optional(),
    reviewed_by_user_id: z.string().uuid(),
});

// Add missing utility function
export const getBillingCycleEnum = (cycle: string) => {
    return cycle === 'yearly' ? 1 : 0;
};


