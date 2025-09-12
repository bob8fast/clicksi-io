// AuthErrorCodes moved locally since next-auth types are removed
type AuthErrorCodes = 'invalid_credentials' | 'user_not_found' | 'invalid_token' | 'expired_token' | 'network_error' | 'unknown_error';

// Re-export generated API enums with better names
export type {
    ClicksiDataContractsCommonEnumsAdminAccessLevel as AdminAccessLevel,
    ClicksiDataContractsCommonEnumsAdminPermission as AdminPermission,
    ClicksiDataContractsCommonEnumsBillingCycle as BillingCycle,
    ClicksiDataContractsCommonEnumsBrandDistributionModel as BrandDistributionModel,
    ClicksiDataContractsCommonEnumsBusinessType as BusinessType,
    ClicksiDataContractsCommonEnumsCategoryType as CategoryType,
    ClicksiDataContractsCommonEnumsContentFormatType as ContentFormatType,
    ClicksiDataContractsCommonEnumsContentPublishCategory as ContentPublishCategory,
    ClicksiDataContractsCommonEnumsInvitationStatus as InvitationStatus,
    AuthServiceDomainMfaProviderType as MfaProviderType,
    ClicksiDataContractsCommonEnumsModerationActionType as ModerationActionType,
    ClicksiDataContractsCommonEnumsProductLifecycleStatus as ProductLifecycleStatus,
    ClicksiDataContractsCommonEnumsProductPublicationStatus as ProductPublicationStatus,
    ClicksiDataContractsCommonEnumsReportReason as ReportReason,
    ClicksiDataContractsCommonEnumsRetailerProductStatus as RetailerProductStatus,
    UserManagementDomainEnumsRetailerType as RetailerType,
    ClicksiDataContractsCommonEnumsSocialPlatform as SocialPlatform,
    ClicksiDataContractsCommonEnumsSubscriptionPermissions as SubscriptionPermissions,
    ClicksiDataContractsCommonEnumsSubscriptionStatus as SubscriptionStatus,
    ClicksiDataContractsCommonEnumsTeamRole as TeamRole,
    ClicksiDataContractsCommonEnumsTeamType as TeamType,
    ClicksiDataContractsCommonEnumsTrialRequestStatus as TrialRequestStatus,
    ClicksiDataContractsCommonEnumsUserRole as UserRole,
    VerificationDocumentType,
    ClicksiDataContractsCommonEnumsVerificationStatus as VerificationStatus
} from '@/gen/api/types';

// Re-export auth service types with better names
export type {
    AuthServiceAPIModelsRequestsChangePasswordRequest as ChangePasswordRequest,
    AuthServiceAPIModelsRequestsCompleteMfaSetupRequest as CompleteMfaSetupRequest,
    AuthServiceAPIModelsRequestsDisableMfaProviderRequest as DisableMfaProviderRequest,
    AuthServiceDomainModelsForgotPasswordRequest as ForgotPasswordRequest,
    AuthServiceAPIModelsRequestsGenerateMfaChallengeRequest as GenerateMfaChallengeRequest,
    AuthServiceDomainMfaChallenge as MfaChallengeResponse,
    AuthServiceAPIModelsResponsesMfaOperationResponse as MfaOperationResponse,
    AuthServiceAPIModelsResponsesMfaSetupResponse as MfaSetupResponse,
    AuthServiceDomainMfaStatusResponse as MfaStatusResponse,
    AuthServiceAPIModelsResponsesRecoveryCodesResponse as RecoveryCodesResponse,
    AuthServiceAPIModelsRequestsRegisterAccountRequest as RegisterAccountRequest,
    AuthServiceDomainModelsResetPasswordRequest as ResetPasswordRequest,
    AuthServiceAPIModelsRequestsSetPreferredMfaProviderRequest as SetPreferredMfaProviderRequest,
    AuthServiceAPIModelsRequestsSetupMfaProviderRequest as SetupMfaProviderRequest
} from '@/gen/api/types';

// Re-export generated API DTOs with better names
export type {
    UserManagementDomainDTOsBrandDto as BrandDto,
    UserManagementDomainDTOsBrandListDto as BrandListDto,
    UserManagementDomainDTOsCreatorDto as CreatorDto,
    UserManagementDomainDTOsCreatorListDto as CreatorListDto,
    UserManagementDomainDTOsPartnerConnectionDto as PartnerConnectionDto,
    UserManagementDomainDTOsRetailerDto as RetailerDto,
    UserManagementDomainDTOsRetailerListDto as RetailerListDto,
    UserManagementDomainDTOsSubscriptionInvitationDto as SubscriptionInvitationDto,
    UserManagementDomainDTOsSubscriptionPlanDto as SubscriptionPlanDto,
    UserManagementDomainDTOsTeamDto as TeamDto,
    UserManagementDomainDTOsTeamMemberDto as TeamMemberDto,
    UserManagementDomainDTOsTeamSubscriptionDto as TeamSubscriptionDto,
    UserManagementDomainDTOsTrialRequestDto as TrialRequestDto,
    UserManagementDomainDTOsUsageLimitDto as UsageLimitDto,
    UserManagementDomainDTOsUserPermissionsDto as UserPermissionsDto,
    UserManagementDomainDTOsUserProfileDto as UserProfileDto,
    UserManagementDomainDTOsVerificationApplicationDto as VerificationApplicationDto,
    UserManagementDomainDTOsVerificationDocumentDto as VerificationDocumentDto,
    UserManagementDomainDTOsVerificationListDto as VerificationListDto,
    UserManagementDomainDTOsVerificationStatusHistoryDto as VerificationStatusHistoryDto,
    UserManagementAPIControllersVerificationFileProperties as VerificationFileProperties
} from '@/gen/api/types';

// Re-export generated product catalog types with better names
export type {
    ProductCatalogDomainDTOsCategoryDto as CategoryDto,
    ProductCatalogDomainDTOsCategoryLocalizationDto as CategoryLocalizationDto,
    ProductCatalogDomainDTOsCategoryUpdateDto as CategoryUpdateDto,
    ProductCatalogDomainDTOsCategoryTreeHistoryDto as CategoryTreeHistoryDto,
    ProductCatalogDomainDTOsCategoryTreeHistoryDetailDto as CategoryTreeHistoryDetailDto,
    ProductCatalogDomainDTOsCategoryOperationResponse as CategoryOperationResponse,
    ProductCatalogDomainDTOsCategoryImageUrlsResponse as CategoryImageUrlsResponse,
    ProductCatalogDomainDTOsCategoryImageUpdateResponse as CategoryImageUpdateResponse,
    ProductCatalogDomainDTOsCategorySearchRequest as CategorySearchRequest,
    ProductCatalogDomainDTOsGetCategoryHistoryRequest as GetCategoryHistoryRequest,
    ProductCatalogDomainDTOsGetCategoryImageUrlsRequest as GetCategoryImageUrlsRequest,
    ProductCatalogDomainDTOsRecoverToHistoricalStateRequest as RecoverToHistoricalStateRequest,
    ProductCatalogDomainDTOsRecoveryResult as RecoveryResult,
    ProductCatalogDomainDTOsDashboardStatsDto as DashboardStatsDto,
    ProductCatalogDomainDTOsProductCategoryDto as ProductCategoryDto,
    ProductCatalogDomainDTOsProductDimensionsDto as ProductDimensionsDto,
    ProductCatalogDomainDTOsProductDto as ProductDto,
    ProductCatalogDomainDTOsProductIngredientDto as ProductIngredientDto,
    ProductCatalogDomainDTOsProductListDto as ProductListDto,
    ProductCatalogDomainDTOsProductsResponse as ProductsResponse,
    ProductCatalogDomainDTOsRetailerProductDto as RetailerProductDto,
    ProductCatalogDomainDTOsRetailerRequestDto as RetailerRequestDto,
    ProductCatalogDomainDTOsTopPerformingProductDto as TopPerformingProductDto,
    BulkUpdateCategoriesBody,
    
    // Product creation/update request types with user-friendly names
    ProductCatalogDomainDTOsCreateProductRequest as CreateProductRequest,
    ProductCatalogDomainDTOsUpdateProductRequest as UpdateProductRequest,
    ProductCatalogAPIModelsResponsesProductImageUploadResponse as ProductImageUploadResponse,
    UploadCategoryImageBody,
    
    // Retailer management types with user-friendly names
    UserManagementAPIModelsRequestsCreateBrandSelfDistributedRetailerRequest as CreateBrandSelfDistributedRetailerRequest,
    UserManagementAPIModelsRequestsUpdateRetailerRequest as UpdateRetailerRequest
} from '@/gen/api/types';

// Re-export generated content management types with better names
export type {
    ContentManagementAPIModelsCollectionResponse as CollectionResponse,
    ContentManagementAPIModelsCommentResponse as CommentResponse,
    ContentManagementAPIModelsContentReportResponse as ContentReportResponse,
    ContentManagementAPIModelsContentResponse as ContentResponse,
    ContentManagementAPIModelsCreatorResponse as CreatorResponse,
    ContentManagementAPIModelsMediaUploadResponse as MediaUploadResponse,
    ContentManagementAPIModelsModerationActionResponse as ModerationActionResponse,
    ContentManagementAPIModelsProductTagResponse as ProductTagResponse,
    ContentManagementAPIModelsSocialAccountResponse as SocialAccountResponse,
    ContentManagementAPIModelsSocialContentResponse as SocialContentResponse
} from '@/gen/api/types';

// Re-export generated API response types
export type {
    ClicksiDataContractsCommonDtoApiResponse as ApiResponse,
    ClicksiDataContractsCommonModelsResponsesPagedResponse1UserManagementDomainAdminHelpersAdminDto as PagedAdminResponse,
    ClicksiDataContractsCommonModelsResponsesPagedResponse1UserManagementDomainDTOsPartnerConnectionDto as PagedPartnerConnectionResponse,
    ClicksiDataContractsCommonModelsResponsesPagedResponse1UserManagementDomainDTOsUserProfileDto as PagedUserProfileResponse,
    ClicksiDataContractsCommonDtoPageInfo as PageInfo,
    ClicksiDataContractsProblemDetailsRootProblemDetailsDto as ProblemDetails
} from '@/gen/api/types';

// Messaging types
export * from './app/messaging-types';

// Integration types
export * from './app/integration-types';

// Add missing string type aliases
export type BillingCycleString = 'monthly' | 'yearly';
export type SubscriptionStatusString = 'active' | 'trial' | 'cancelled' | 'expired' | 'pending' | 'suspended';
export type TrialRequestStatusString = 'pending' | 'approved' | 'rejected';

// Add utility functions for enum conversion
export const getBillingCycleString = (cycle: BillingCycle): BillingCycleString => {
    return cycle === 0 ? 'monthly' : 'yearly';
};

export const getStatusString = (status: SubscriptionStatus): SubscriptionStatusString => {
    const statusMap: Record<SubscriptionStatus, SubscriptionStatusString> = {
        0: 'pending',
        1: 'active', 
        2: 'cancelled',
        3: 'expired',
        4: 'trial',
        5: 'suspended'
    };
    return statusMap[status] || 'pending';
};

export const getTrialRequestStatusString = (status: TrialRequestStatus): TrialRequestStatusString => {
    const statusMap: Record<TrialRequestStatus, TrialRequestStatusString> = {
        0: 'pending',
        1: 'approved',
        2: 'rejected'
    };
    return statusMap[status] || 'pending';
};

// Re-export subscription types with better names
export type SubscriptionPlan = SubscriptionPlanDto;
export type UserSubscription = TeamSubscriptionDto;

// Export subscription-related types from the subscription file
export * from './app/subscription';

export class ClicksiAuthError extends Error
{
    code: AuthErrorCodes

    constructor(message: string, code: AuthErrorCodes = 'invalid_credentials')
    {
        super(message) // Call parent constructor
        this.name = 'ClicksiAuthError'
        this.code = code

        // Maintains proper stack trace (V8 only)
        if (Error.captureStackTrace)
        {
            Error.captureStackTrace(this, ClicksiAuthError)
        }
    }
}