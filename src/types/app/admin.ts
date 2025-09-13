// types/admin.ts
import { z } from 'zod';
import { AdminAccessLevelEnum, BusinessTypeEnum, UserRoleEnum, VerificationStatusEnum } from './generated-enums';
import { AdminAccessLevel } from '@/types';

// Re-export AdminAccessLevel for convenience
export type { AdminAccessLevel } from '@/types';

// Enums


// Admin Permission Flags (based on your API model)
export enum AdminPermission
{
    /// <summary>
    /// No permissions
    /// </summary>
    None = 0,

    /// <summary>
    /// View user data
    /// </summary>
    ViewUsers = 1 << 0,

    /// <summary>
    /// Modify user data
    /// </summary>
    ModifyUsers = 1 << 1,

    /// <summary>
    /// View content
    /// </summary>
    ViewContent = 1 << 2,

    /// <summary>
    /// Modify/moderate content
    /// </summary>
    ModerateContent = 1 << 3,

    /// <summary>
    /// View system settings
    /// </summary>
    ViewSettings = 1 << 4,

    /// <summary>
    /// Modify system settings
    /// </summary>
    ModifySettings = 1 << 5,

    /// <summary>
    /// View billing data
    /// </summary>
    ViewBilling = 1 << 6,

    /// <summary>
    /// Modify billing data
    /// </summary>
    ModifyBilling = 1 << 7,

    /// <summary>
    /// Access to analytics
    /// </summary>
    ViewAnalytics = 1 << 8,

    /// <summary>
    /// Manage Admins
    /// </summary>
    ManageAdmins = 1 << 9,

    /// <summary>
    /// All permissions combined
    /// </summary>
    All = ~0

    // All = (1 << 10) - 1          // All permissions
}

// User Profile Schema
export const UserProfileSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    role: UserRoleEnum,
    verificationStatus: VerificationStatusEnum,
    businessType: BusinessTypeEnum.optional(),
    profileImage: z.string().url().optional(),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    lastLoginAt: z.string().optional(),
    isActive: z.boolean(),
});

// Admin Profile Schema
export const AdminProfileSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    role: z.literal('Admin'),
    accessLevel: AdminAccessLevelEnum,
    permissions: z.number(), // Bitwise permissions
    profileImage: z.string().url().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    lastLoginAt: z.string().optional(),
    isActive: z.boolean(),
    createdBy: z.string().optional(),
});

// Request Schemas
export const CreateAdminSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    accessLevel: AdminAccessLevelEnum.default('Standard'),
    additionalPermissions: z.number().default(AdminPermission.None),
    restrictedPermissions: z.number().default(AdminPermission.None),
});

export const UpdateUserVerificationSchema = z.object({
    status: VerificationStatusEnum,
    reason: z.string().optional(),
});

export const UpdateAdminPermissionsSchema = z.object({
    permissions: z.number(),
});

export const ResendEmailSchema = z.object({
    email: z.string().email(),
});

// Filter Schemas
export const UserFiltersSchema = z.object({
    search: z.string().optional(),
    role: UserRoleEnum.optional(),
    verificationStatus: VerificationStatusEnum.optional(),
    businessType: BusinessTypeEnum.optional(),
    isActive: z.boolean().optional(),
    sortBy: z.enum(['createdAt', 'lastLoginAt', 'firstName', 'email']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
});

export const AdminFiltersSchema = z.object({
    search: z.string().optional(),
    accessLevel: AdminAccessLevelEnum.optional(),
    isActive: z.boolean().optional(),
    sortBy: z.enum(['createdAt', 'lastLoginAt', 'firstName', 'email']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
});

// Type exports
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type AdminProfile = z.infer<typeof AdminProfileSchema>;
export type CreateAdminRequest = z.infer<typeof CreateAdminSchema>;
export type UpdateUserVerificationRequest = z.infer<typeof UpdateUserVerificationSchema>;
export type UpdateAdminPermissionsRequest = z.infer<typeof UpdateAdminPermissionsSchema>;
export type ResendEmailRequest = z.infer<typeof ResendEmailSchema>;
export type UserFilters = z.infer<typeof UserFiltersSchema>;
export type AdminFilters = z.infer<typeof AdminFiltersSchema>;


// Permission Helper Types
export interface PermissionInfo
{
    name: string;
    description: string;
    flag: AdminPermission;
}

export const PERMISSION_DEFINITIONS: PermissionInfo[] = [
    { name: 'View Users', description: 'Can view user profiles and lists', flag: AdminPermission.ViewUsers },
    { name: 'Modify Users', description: 'Can modify user profiles and settings', flag: AdminPermission.ModifyUsers },
    { name: 'View Content', description: 'Can view all content on the platform', flag: AdminPermission.ViewContent },
    { name: 'Moderate Content', description: 'Can moderate and manage content', flag: AdminPermission.ModerateContent },
    { name: 'View Settings', description: 'Can view system settings', flag: AdminPermission.ViewSettings },
    { name: 'Modify Settings', description: 'Can modify system settings', flag: AdminPermission.ModifySettings },
    { name: 'View Billing', description: 'Can view billing information', flag: AdminPermission.ViewBilling },
    { name: 'Modify Billing', description: 'Can modify billing settings', flag: AdminPermission.ModifyBilling },
    { name: 'View Analytics', description: 'Can view analytics and reports', flag: AdminPermission.ViewAnalytics },
    { name: 'Manage Admins', description: 'Can manage other administrators', flag: AdminPermission.ManageAdmins },
];

// Helper functions
export function hasPermission(userPermissions: number, requiredPermission: AdminPermission): boolean
{
    return (userPermissions & requiredPermission) === requiredPermission;
}

export function getPermissionNames(permissions: number): string[]
{
    return PERMISSION_DEFINITIONS
        .filter(perm => hasPermission(permissions, perm.flag))
        .map(perm => perm.name);
}

export function getDefaultPermissions(accessLevel: AdminAccessLevel): number
{
    switch (accessLevel)
    {
        case 'Standard':
            return AdminPermission.ViewUsers | AdminPermission.ViewContent | AdminPermission.ViewSettings | AdminPermission.ViewAnalytics;
        case 'Elevated':
            return AdminPermission.ViewUsers | AdminPermission.ModifyUsers | AdminPermission.ViewContent |
                AdminPermission.ModerateContent | AdminPermission.ViewSettings | AdminPermission.ViewBilling |
                AdminPermission.ViewAnalytics;
        case 'SuperAdmin':
            return AdminPermission.All;
        default:
            return AdminPermission.ViewUsers | AdminPermission.ViewContent;
    }
}