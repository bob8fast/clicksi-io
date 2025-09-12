// Zod integration layer for generated enum types
// This file provides utilities to create Zod schemas from generated enum objects
// and re-exports common enum validations to avoid duplication

import { z } from 'zod';

// Import generated enum objects (not types)
import
{
    AuthServiceDomainMfaProviderType,
    ClicksiDataContractsCommonEnumsAdminAccessLevel,
    ClicksiDataContractsCommonEnumsBillingCycle,
    ClicksiDataContractsCommonEnumsBrandDistributionModel,
    ClicksiDataContractsCommonEnumsBusinessType,
    ClicksiDataContractsCommonEnumsCategoryType,
    ClicksiDataContractsCommonEnumsContentFormatType,
    ClicksiDataContractsCommonEnumsContentPublishCategory,
    ClicksiDataContractsCommonEnumsModerationActionType,
    ClicksiDataContractsCommonEnumsProductLifecycleStatus,
    ClicksiDataContractsCommonEnumsProductPublicationStatus,
    ClicksiDataContractsCommonEnumsReportReason,
    ClicksiDataContractsCommonEnumsRetailerProductStatus,
    ClicksiDataContractsCommonEnumsSocialPlatform,
    ClicksiDataContractsCommonEnumsSubscriptionStatus,
    ClicksiDataContractsCommonEnumsTeamRole,
    ClicksiDataContractsCommonEnumsUserRole,
    ClicksiDataContractsCommonEnumsVerificationStatus,
    UserManagementDomainEnumsRetailerType,
} from '@/gen/api/types';

/**
 * Utility function to create a Zod enum schema from a generated enum object
 * @param enumObject - The generated enum const object 
 * @returns Zod enum schema
 */
function createEnumFromGenerated<const T extends Record<string, string>>(enumObject: T) {
    const values = Object.values(enumObject) as [T[keyof T], ...T[keyof T][]];
    return z.enum(values);
}

export const MfaProviderTypeEnum = createEnumFromGenerated(AuthServiceDomainMfaProviderType);
export const BillingCycleEnum = createEnumFromGenerated(ClicksiDataContractsCommonEnumsBillingCycle);
export const UserRoleEnum = createEnumFromGenerated(ClicksiDataContractsCommonEnumsUserRole);
export const BusinessTypeEnum = createEnumFromGenerated(ClicksiDataContractsCommonEnumsBusinessType);
export const BrandDistributionModelEnum = createEnumFromGenerated(ClicksiDataContractsCommonEnumsBrandDistributionModel);
export const ContentFormatTypeEnum = createEnumFromGenerated(ClicksiDataContractsCommonEnumsContentFormatType);
export const RetailerTypeEnum = createEnumFromGenerated(UserManagementDomainEnumsRetailerType);
export const SocialPlatformEnum = createEnumFromGenerated(ClicksiDataContractsCommonEnumsSocialPlatform);

// export const VerificationStatusEnum = z.enum(['Pending', 'Verified', 'Rejected', 'NotRequired']);
export const AdminAccessLevelEnum = createEnumFromGenerated(ClicksiDataContractsCommonEnumsAdminAccessLevel);

export const VerificationStatusEnum = createEnumFromGenerated(ClicksiDataContractsCommonEnumsVerificationStatus);
export const SubscriptionStatusEnum = createEnumFromGenerated(ClicksiDataContractsCommonEnumsSubscriptionStatus);
export const TeamRoleEnum = createEnumFromGenerated(ClicksiDataContractsCommonEnumsTeamRole);
export const CategoryTypeEnum = createEnumFromGenerated(ClicksiDataContractsCommonEnumsCategoryType);

// Product-related enum schemas
export const ProductLifecycleStatusEnum = createEnumFromGenerated(ClicksiDataContractsCommonEnumsProductLifecycleStatus);
export const ProductPublicationStatusEnum = createEnumFromGenerated(ClicksiDataContractsCommonEnumsProductPublicationStatus);
export const RetailerProductStatusEnum = createEnumFromGenerated(ClicksiDataContractsCommonEnumsRetailerProductStatus);

// Content moderation enum schemas
export const ModerationActionTypeEnum = createEnumFromGenerated(ClicksiDataContractsCommonEnumsModerationActionType);
export const ReportReasonEnum = createEnumFromGenerated(ClicksiDataContractsCommonEnumsReportReason);
export const ContentPublishCategoryEnum = createEnumFromGenerated(ClicksiDataContractsCommonEnumsContentPublishCategory);

// Special versions for stricter validation
export const BusinessTypeEnumStrict = BusinessTypeEnum.refine(
    (val) => val !== 'None',
    { message: 'Business type must be specified' }
);

// Custom enum schemas for frontend-specific use cases
export const AudienceSizeEnum = z.enum(['micro', 'small', 'medium', 'large', 'xlarge', 'macro'] as const);
export const AgeGroupEnum = z.enum(['under18', '18-24', '25-34', '35-44', '45-54', '55plus'] as const);

// Export the utility function for creating more Zod enums from generated types
export { createEnumFromGenerated };

export type AudienceSizeType = z.infer<typeof AudienceSizeEnum>;
export type AgeGroupType = z.infer<typeof AgeGroupEnum>;