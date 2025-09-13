// types/management/index.ts - Management layout types

import { ComponentType } from 'react';
import { BusinessType, UserRole } from '../index';

// Mock UserInfo type to replace next-auth dependency
interface UserInfo {
    user_role: UserRole;
    business_type?: BusinessType;
}

export type EntityType = 'creator' | 'brand' | 'retailer' | 'admin';

export const getEntityType = (userInfo: UserInfo | undefined): EntityType =>
{
    if (!userInfo)
    {
        throw new Error("Invalid user info");
    }

    if (userInfo.user_role == 'Admin')
    {
        return 'admin';
    }
    else if (userInfo.user_role == 'Creator')
    {
        return 'creator';
    }
    else if (userInfo.user_role == 'BusinessUser')
    {
        if (userInfo.business_type == 'Brand')
        {
            return 'brand';
        }
        else if (userInfo.business_type == 'Retailer')
        {
            return 'retailer';
        }
    }

    throw new Error("Invalid user info");
}

// Split SystemPermission into organized categories
export type CommonSystemPermission =
    | 'dashboard.view'
    | 'analytics.view' | 'analytics.financial'
    | 'team.view' | 'team.manage' | 'team.invite'
    | 'messaging.view' | 'messaging.send';

export type ProductSystemPermission =
    | 'products.view' | 'products.create' | 'products.edit' | 'products.delete';

export type ContentSystemPermission =
    | 'content.view' | 'content.create' | 'content.edit';

export type LinkSystemPermission =
    | 'links.view' | 'links.create' | 'links.manage';

export type DistributionSystemPermission =
    | 'distribution.view' | 'distribution.manage';

export type BrandSystemPermission =
    | 'brands.view' | 'brands.connect';

export type AdminSystemPermission =
    | 'admin.users' | 'admin.content' | 'admin.system';

export type IntegrationSystemPermission =
    | 'integrations.view' | 'integrations.connect' | 'integrations.manage';

export type CommissionSystemPermission =
    | 'commission.view' | 'commission.edit';

// Union type of all system permissions
export type SystemPermission =
    | CommonSystemPermission | ProductSystemPermission | ContentSystemPermission
    | LinkSystemPermission | DistributionSystemPermission | BrandSystemPermission
    | AdminSystemPermission | IntegrationSystemPermission | CommissionSystemPermission;

// Runtime badge update system
export interface BadgeConfig
{
    type: 'static' | 'counter' | 'status' | 'dynamic';
    value?: string | number;
    // For dynamic badges - functions to fetch current value
    fetchValue?: () => Promise<string | number>;
    // For counter badges - query key to watch for updates
    queryKey?: string[];
    // For status badges - status mapping
    statusMap?: Record<string, { value: string | number; color?: string }>;
}

export interface NavigationItem
{
    key: string;
    href: string;
    label: string;
    icon: ComponentType<{ className?: string }>;
    badge?: BadgeConfig; // Runtime updatable badge system
    children?: NavigationItem[];
    requiredPermissions?: SystemPermission[];
    permissionBehavior?: 'hide' | 'disable';
}

export interface AccessControlConfig
{
    requiredRole: UserRole; // Single role per user
    requiredBusinessType?: BusinessType; // Single business type per user
    teamBased: boolean;
    customAccessCheck?: (session: any) => boolean;
}

export interface EntityBranding
{
    // Colors - can be completely different or palette variations
    primaryColor?: string;        // Main brand color
    accentColor?: string;         // Secondary accent color
    backgroundColor?: string;     // Custom background variations

    // Visual Elements
    portalIcon?: ComponentType; // Different icons per entity
    logoVariant?: string;        // Different logo treatments
}

export interface LayoutOptions
{
    defaultSidebarCollapsed?: boolean;
}

export interface EntityConfig
{
    entityType: EntityType;
    portalName: string;          // 'Brand Portal', 'Creator Studio', 'Retailer Hub', 'Admin Panel'
    entityLabel: string;         // 'Brand', 'Creator', 'Retailer', 'Admin'
    navigationItems: NavigationItem[];
    accessControl: AccessControlConfig;
    branding?: EntityBranding;
    layoutOptions?: LayoutOptions;
}

export interface BreadcrumbItem
{
    label: string;
    href?: string;
    isActive?: boolean;
}

// Badge update system interfaces
export interface BadgeUpdatePayload
{
    navigationKey: string;
    entityType: EntityType;
    badge: BadgeConfig;
}

export interface BadgeManager
{
    updateBadge: (payload: BadgeUpdatePayload) => void;
    getBadgeValue: (navigationKey: string, entityType: EntityType) => Promise<string | number | undefined>;
    subscribeToBadgeUpdates: (navigationKey: string, entityType: EntityType, callback: (value: string | number) => void) => () => void;
}

// Zustand store interface
export interface ManagementState
{
    // UI State (persisted to localStorage)
    sidebarCollapsed: boolean;
    mobileSidebarOpen: boolean;

    // Entity Context (persisted to localStorage)
    currentEntityType: EntityType;
    lastActiveNavItem: Record<EntityType, string>;

    // Runtime State (not persisted)
    entityConfig: EntityConfig | null;

    // Navigation State (not persisted, consistent breadcrumbs across entities)
    activeNavItem: string;
    breadcrumbs: BreadcrumbItem[];

    // Actions
    setSidebarCollapsed: (collapsed: boolean) => void;
    setMobileSidebarOpen: (open: boolean) => void;
    setEntityConfig: (config: EntityConfig) => void;
    setActiveNavItem: (item: string) => void;
    updateBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
}