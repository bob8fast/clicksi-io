// types/registration-schema.ts
import type {
    BrandDistributionModel,
    BusinessType,
    ContentFormatType,
    RetailerType,
    UserRole
} from '@/types';
import { z } from 'zod';

// Re-export types for convenience
export type { BusinessType, BrandDistributionModel, ContentFormatType, RetailerType, UserRole } from '@/types';

// Import Zod schemas from generated enums to avoid duplication
import
{
    AgeGroupEnum,
    BrandDistributionModelEnum,
    BusinessTypeEnum,
    ContentFormatTypeEnum,
    RetailerTypeEnum,
    UserRoleEnum
} from '@/types/app/generated-enums';

// Social link schema (aligned with new API)
export const SocialLinkSchema = z.object({
    platform: z.string().min(1, 'Platform is required'),
    url: z.string().url('Invalid URL format'),
    handle: z.string().optional(),
    description: z.string().optional(),
});

// Contact info schema
export const ContactInfoSchema = z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    support_email: z.string().email().optional(),
    social_media_links: z.array(SocialLinkSchema).optional().default([]),
});

// Address schema
export const AddressSchema = z.object({
    street1: z.string().min(1, 'Street address is required'),
    street2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postal_code: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
});

// Category settings schemas
export const CreatorCategorySettingsSchema = z.object({
    content_categories: z.array(z.string().uuid()).optional().default([]),
    creator_categories: z.array(z.string().uuid()).optional().default([]),
});

export const BusinessCategorySettingsSchema = z.object({
    company_categories: z.array(z.string().uuid()).optional().default([]),
    product_categories: z.array(z.string().uuid()).optional().default([]),
});

// Location schema
export const LocationSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
});

// Consumer registration fields schema (aligned with new API)
export const ConsumerRegistrationFieldsSchema = z.object({
    date_of_birth: z.string().datetime().optional(),
    country: z.string().min(1, 'Country is required'),
    category_interests: z.array(z.string().uuid()).optional().default([]),
});

// Creator registration fields schema (aligned with new API)
export const CreatorRegistrationFieldsSchema = z.object({
    display_name: z.string().min(1, 'Display name is required'),
    date_of_birth: z.string().datetime().optional(),
    bio: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
    contact_info: ContactInfoSchema.optional(),
    total_audience_size: z.number().int().min(0).optional(),
    primary_age_groups: z.array(AgeGroupEnum).min(1, 'At least one age group is required'),
    primary_audience_languages: z.array(z.string()).min(1, 'At least one audience language is required'),
    audience_interests: z.array(z.string().uuid()).optional().default([]),
    content_formats: z.array(ContentFormatTypeEnum).optional().default([]),
    content_languages: z.array(z.string()).min(1, 'At least one content language is required'),
    creator_category_settings: CreatorCategorySettingsSchema.optional(),
});

// Retailer registration fields schema (aligned with new API)
export const RetailerRegistrationFieldsSchema = z.object({
    service_regions: z.array(z.string()).optional().default([]),
    retailer_type: RetailerTypeEnum.optional(),
});

// Brand registration fields schema (aligned with new API)
export const BrandRegistrationFieldsSchema = z.object({
    distribution_model: BrandDistributionModelEnum.optional(),
    allowed_regions: z.array(z.string()).optional().default([]),
});

// Business registration fields schema (aligned with new API)
export const BusinessRegistrationFieldsSchema = z.object({
    display_name: z.string().min(1, 'Display name is required'),
    website_url: z.string().url().optional().or(z.literal('')),
    description: z.string().optional(),
    contact_info: ContactInfoSchema.optional(),
    legal_name: z.string().min(1, 'Legal name is required'),
    business_category_settings: BusinessCategorySettingsSchema.optional(),
    retailer_registration_fields: RetailerRegistrationFieldsSchema.optional(),
    brand_registration_fields: BrandRegistrationFieldsSchema.optional(),
    address: AddressSchema.optional(),
});

// Base registration schema core (aligned with new API)
const BaseRegistrationSchemaCore = z.object({
    // Common fields
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string().min(8, 'Confirm password must be at least 8 characters'),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    user_role: UserRoleEnum,
    business_type: BusinessTypeEnum.optional(),
    phone_number: z.string().optional(),
    preferred_language: z.string().optional(),
    timezone: z.string().optional(),

    // User type specific fields
    consumer_registration_fields: ConsumerRegistrationFieldsSchema.optional(),
    creator_registration_fields: CreatorRegistrationFieldsSchema.optional(),
    business_registration_fields: BusinessRegistrationFieldsSchema.optional(),
});

// Shared refinement function for role-based validation
const addRoleBasedValidation = <T extends z.ZodTypeAny>(schema: T) =>
{
    return schema.superRefine((data: any, ctx) =>
    {
        // Role-specific validation
        if (data.user_role === 'Consumer')
        {
            if (!data.consumer_registration_fields)
            {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Consumer registration fields are required',
                    path: ['consumer_registration_fields'],
                });
            }
        }

        if (data.user_role === 'Creator')
        {
            if (!data.creator_registration_fields)
            {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Creator registration fields are required',
                    path: ['creator_registration_fields'],
                });
            }
        }

        if (data.user_role === 'BusinessUser')
        {
            if (!data.business_type)
            {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Business type is required',
                    path: ['business_type'],
                });
            }

            if (!data.business_registration_fields)
            {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Business registration fields are required',
                    path: ['business_registration_fields'],
                });
            }
        }
    });
};

// API submission schema (extends base + adds role validation)
export const RegistrationSchema = addRoleBasedValidation(BaseRegistrationSchemaCore);

// Form validation schema for frontend use (with confirmPassword field)
const FormValidationSchemaCore = BaseRegistrationSchemaCore.omit({ confirm_password: true }).extend({
    confirmPassword: z.string().min(1, 'Confirm password is required'),
});

// Form validation schema (extends base + adds confirmPassword + role validation)
export const FormValidationSchema = addRoleBasedValidation(FormValidationSchemaCore).refine((data: any) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export function parseRetailerType(value: string): { success: boolean; data?: RetailerType; error?: string }
{
    try
    {
        const result = RetailerTypeEnum.parse(value) as RetailerType;
        return { success: true, data: result };
    } catch (_error)
    {
        return { success: false, error: 'Invalid retailer type' };
    }
}

export function parseBrandDistributionMethod(value: string): { success: boolean; data?: BrandDistributionModel; error?: string }
{
    try
    {
        const result = BrandDistributionModelEnum.parse(value) as BrandDistributionModel;
        return { success: true, data: result };
    } catch (_error)
    {
        return { success: false, error: 'Invalid brand distribution method' };
    }
}

export function parseContentFormatType(value: string): { success: boolean; data?: ContentFormatType; error?: string }
{
    try
    {
        const result = ContentFormatTypeEnum.parse(value) as ContentFormatType;
        return { success: true, data: result };
    } catch (_error)
    {
        return { success: false, error: 'Invalid content format type' };
    }
}

// Types derived from schemas

// export type BrandDistributionMethod = z.infer<typeof BrandDistributionModelEnum>;
// export type RetailerType = z.infer<typeof RetailerTypeEnum>;
// export type ContentFormatType = z.infer<typeof ContentFormatTypeEnum>;
// export type AudienceSize = z.infer<typeof AudienceSizeEnum>;
// export type AgeGroup = z.infer<typeof AgeGroupEnum>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type CreatorCategorySettings = z.infer<typeof CreatorCategorySettingsSchema>;
export type BusinessCategorySettings = z.infer<typeof BusinessCategorySettingsSchema>;
export type ConsumerRegistrationFields = z.infer<typeof ConsumerRegistrationFieldsSchema>;
export type CreatorRegistrationFields = z.infer<typeof CreatorRegistrationFieldsSchema>;
export type RetailerRegistrationFields = z.infer<typeof RetailerRegistrationFieldsSchema>;
export type BrandRegistrationFields = z.infer<typeof BrandRegistrationFieldsSchema>;
export type BusinessRegistrationFields = z.infer<typeof BusinessRegistrationFieldsSchema>;
export type RegistrationFormData = z.infer<typeof RegistrationSchema>;
export type FormValidationData = z.infer<typeof FormValidationSchema>;

// Form state type (for internal use before submission)
export interface RegistrationFormState
{
    email: string;
    password: string;
    confirmPassword: string;
    first_name: string;
    last_name: string;
    user_role: UserRole;
    business_type?: BusinessType;
    phone_number?: string;
    preferred_language?: string;
    timezone?: string;
    consumer_registration_fields?: ConsumerRegistrationFields;
    creator_registration_fields?: CreatorRegistrationFields;
    business_registration_fields?: BusinessRegistrationFields;
}

// Legacy types for backwards compatibility
export type ConsumerFields = ConsumerRegistrationFields;
export type CreatorFields = CreatorRegistrationFields;
export type BusinessFields = BusinessRegistrationFields;

// Utility function to extract social handle from URL
export function extractSocialHandle(url: string, platform: string): string
{
    try
    {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;

        // Remove leading slash and get the first path segment
        const handle = pathname.split('/').filter(Boolean)[0];

        // Platform-specific handle extraction
        switch (platform.toLowerCase())
        {
            case 'instagram':
            case 'tiktok':
            case 'x':
            case 'twitter':
                return handle || '';
            case 'youtube':
                // Handle both /c/ and /user/ formats
                if (pathname.includes('/c/') || pathname.includes('/user/'))
                {
                    return pathname.split('/').filter(Boolean)[1] || '';
                }
                return handle || '';
            default:
                return handle || '';
        }
    } catch
    {
        return '';
    }
}

// Utility function to transform form data to API format
export function transformToApiFormat(formData: RegistrationFormState): RegistrationFormData
{
    // Transform social links to include handles
    const transformSocialLinks = (links: SocialLink[]): SocialLink[] =>
    {
        return links.map(link => ({
            ...link,
            handle: extractSocialHandle(link.url, link.platform),
        }));
    };

    // Prepare the base data (rename confirmPassword to confirm_password)
    const baseData = {
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        first_name: formData.first_name,
        last_name: formData.last_name,
        user_role: formData.user_role,
        business_type: formData.business_type,
        phone_number: formData.phone_number,
        preferred_language: formData.preferred_language,
        timezone: formData.timezone,
    };

    // Add role-specific fields only if they exist
    const apiData: any = { ...baseData };

    if (formData.consumer_registration_fields && formData.user_role === 'Consumer')
    {
        apiData.consumer_registration_fields = formData.consumer_registration_fields;
    }

    if (formData.creator_registration_fields && formData.user_role === 'Creator')
    {
        const creatorFields = { ...formData.creator_registration_fields };
        if (creatorFields.contact_info?.social_media_links)
        {
            creatorFields.contact_info.social_media_links = transformSocialLinks(creatorFields.contact_info.social_media_links);
        }
        apiData.creator_registration_fields = creatorFields;
    }

    if (formData.business_registration_fields && formData.user_role === 'BusinessUser')
    {
        const businessFields = { ...formData.business_registration_fields };
        if (businessFields.contact_info?.social_media_links)
        {
            businessFields.contact_info.social_media_links = transformSocialLinks(businessFields.contact_info.social_media_links);
        }
        apiData.business_registration_fields = businessFields;
    }

    return apiData as RegistrationFormData;
}