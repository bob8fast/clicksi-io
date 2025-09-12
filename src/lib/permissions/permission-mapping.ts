// lib/permissions/permission-mapping.ts - System Permission Mapping

import { SystemPermission } from '@/types/management';
import { AdminAccessLevel, AdminPermission, hasPermission } from '@/types/app/admin';
import { TeamRole, UserRole, BusinessType } from '@/types';
import { 
  UserManagementDomainEnumsGeneralTeamPermissions,
  UserManagementDomainEnumsProductPermissions,
  UserManagementDomainEnumsFinancialPermissions,
  UserManagementDomainEnumsAffiliatePermissions
} from '@/gen/api/types';

/**
 * Permission context interface - contains all possible permission sources
 */
export interface PermissionContext {
  // User context
  userRole?: UserRole; // Consumer, Creator, BusinessUser, Admin
  businessType?: BusinessType; // None, Brand, Retailer
  
  // Team context (for BusinessUser + Brand/Retailer, or Creator)
  teamRole?: TeamRole; // Viewer, Contributor, Member, Manager, Admin, Owner
  generalPermissions?: UserManagementDomainEnumsGeneralTeamPermissions;
  productPermissions?: UserManagementDomainEnumsProductPermissions;
  financialPermissions?: UserManagementDomainEnumsFinancialPermissions;
  affiliatePermissions?: UserManagementDomainEnumsAffiliatePermissions;
  
  // Admin context (for Admin user role)
  adminPermissions?: number; // Bitwise AdminPermission flags
  adminAccessLevel?: AdminAccessLevel;
}

/**
 * Unified permission mapper - single method with inline context checking
 * Each permission defines its own validation logic based on available context
 */
export function mapToSystemPermission(
  systemPermission: SystemPermission,
  context: PermissionContext
): boolean {
  // Unified permission mapping with inline context validation
  const permissionMap: Record<SystemPermission, () => boolean> = {
    
    // Dashboard permissions - available to most roles
    'dashboard.view': () => {
      // Admin users
      if (context.userRole === 'Admin' && context.adminPermissions && context.adminAccessLevel) {
        return hasPermission(context.adminPermissions, AdminPermission.ViewUsers);
      }
      // Team-based users (Creator, BusinessUser with Brand/Retailer)
      if ((context.userRole === 'Creator') || 
          (context.userRole === 'BusinessUser' && (context.businessType === 'Brand' || context.businessType === 'Retailer'))) {
        if (context.generalPermissions) {
          return context.generalPermissions.includes('ViewDashboard');
        }
        return true; // Basic fallback for team-based users
      }
      // Consumer
      if (context.userRole === 'Consumer') {
        return true;
      }
      return false;
    },

    // Product permissions - primarily for Brand teams
    'products.view': () => {
      // Admin users
      if (context.userRole === 'Admin' && context.adminPermissions && context.adminAccessLevel) {
        return hasPermission(context.adminPermissions, AdminPermission.ViewContent);
      }
      // Team-based Brand users
      if (context.userRole === 'BusinessUser' && context.businessType === 'Brand') {
        if (context.productPermissions) {
          return context.productPermissions.includes('ViewProducts');
        }
        return true; // Basic fallback for Brand users
      }
      // Retailer teams (for distribution)
      if (context.userRole === 'BusinessUser' && context.businessType === 'Retailer' && context.productPermissions) {
        return context.productPermissions.includes('ViewProducts');
      }
      return false;
    },

    'products.create': () => {
      // Admin users
      if (context.userRole === 'Admin' && context.adminPermissions && context.adminAccessLevel) {
        return hasPermission(context.adminPermissions, AdminPermission.ModerateContent);
      }
      // Team-based Brand users
      if (context.userRole === 'BusinessUser' && context.businessType === 'Brand' && context.productPermissions) {
        return context.productPermissions.includes('CreateProducts');
      }
      return false;
    },

    'products.edit': () => {
      // Admin users  
      if (context.userRole === 'Admin' && context.adminPermissions && context.adminAccessLevel) {
        return hasPermission(context.adminPermissions, AdminPermission.ModerateContent);
      }
      // Team-based Brand users
      if (context.userRole === 'BusinessUser' && context.businessType === 'Brand' && context.productPermissions) {
        return context.productPermissions.includes('EditProducts');
      }
      return false;
    },

    'products.delete': () => {
      // Admin users
      if (context.userRole === 'Admin' && context.adminPermissions && context.adminAccessLevel) {
        return hasPermission(context.adminPermissions, AdminPermission.ModerateContent);
      }
      // Team-based Brand users with high-level team role
      if (context.userRole === 'BusinessUser' && context.businessType === 'Brand' && 
          context.teamRole && ['Owner', 'Admin'].includes(context.teamRole) && 
          context.productPermissions) {
        return context.productPermissions.includes('DeleteProducts');
      }
      return false;
    },

    // Analytics permissions
    'analytics.view': () => {
      // Admin users
      if (context.userRole === 'Admin' && context.adminPermissions && context.adminAccessLevel) {
        return hasPermission(context.adminPermissions, AdminPermission.ViewAnalytics);
      }
      // Team-based users
      if ((context.userRole === 'Creator') || 
          (context.userRole === 'BusinessUser' && (context.businessType === 'Brand' || context.businessType === 'Retailer'))) {
        if (context.generalPermissions) {
          return context.generalPermissions.includes('ViewReports');
        }
        return true; // Basic fallback
      }
      return false;
    },

    'analytics.financial': () => {
      // Admin users
      if (context.userRole === 'Admin' && context.adminPermissions && context.adminAccessLevel) {
        return hasPermission(context.adminPermissions, AdminPermission.ViewBilling);
      }
      // Team-based users with Manager+ role
      if ((context.userRole === 'Creator') || 
          (context.userRole === 'BusinessUser' && (context.businessType === 'Brand' || context.businessType === 'Retailer'))) {
        if (context.teamRole && ['Owner', 'Admin', 'Manager'].includes(context.teamRole) && 
            context.financialPermissions) {
          return context.financialPermissions.includes('ViewFinancials');
        }
      }
      return false;
    },

    // Team permissions
    'team.view': () => {
      // Team-based users
      if ((context.userRole === 'Creator') || 
          (context.userRole === 'BusinessUser' && (context.businessType === 'Brand' || context.businessType === 'Retailer'))) {
        if (context.generalPermissions) {
          return context.generalPermissions.includes('ViewMembers');
        }
        return true; // Basic fallback
      }
      return false;
    },

    'team.manage': () => {
      // Team-based users with Admin+ role
      if ((context.userRole === 'Creator') || 
          (context.userRole === 'BusinessUser' && (context.businessType === 'Brand' || context.businessType === 'Retailer'))) {
        if (context.teamRole && ['Owner', 'Admin'].includes(context.teamRole) && 
            context.generalPermissions) {
          return context.generalPermissions.includes('ManageMembers');
        }
      }
      return false;
    },

    'team.invite': () => {
      // Team-based users with Admin+ role
      if ((context.userRole === 'Creator') || 
          (context.userRole === 'BusinessUser' && (context.businessType === 'Brand' || context.businessType === 'Retailer'))) {
        if (context.teamRole && ['Owner', 'Admin'].includes(context.teamRole) && 
            context.generalPermissions) {
          return context.generalPermissions.includes('InviteMembers');
        }
      }
      return false;
    },

    // Content permissions - primarily for Creator
    'content.view': () => {
      // Creator users
      if (context.userRole === 'Creator') {
        if (context.generalPermissions) {
          return context.generalPermissions.includes('ViewDashboard');
        }
        return true; // Basic fallback for Creator
      }
      return false;
    },

    'content.create': () => {
      // Creator users
      if (context.userRole === 'Creator' && context.productPermissions) {
        return context.productPermissions.includes('CreateProducts');
      }
      return false;
    },

    'content.edit': () => {
      // Creator users
      if (context.userRole === 'Creator' && context.productPermissions) {
        return context.productPermissions.includes('EditProducts');
      }
      return false;
    },

    // Link/Affiliate permissions - primarily for Creator
    'links.view': () => {
      // Creator users
      if (context.userRole === 'Creator') {
        if (context.affiliatePermissions) {
          return context.affiliatePermissions.includes('ViewAffiliates');
        }
        return true; // Basic fallback for Creator
      }
      return false;
    },

    'links.create': () => {
      // Creator users
      if (context.userRole === 'Creator' && context.affiliatePermissions) {
        return context.affiliatePermissions.includes('CreateLinks');
      }
      return false;
    },

    'links.manage': () => {
      // Creator users
      if (context.userRole === 'Creator' && context.affiliatePermissions) {
        return context.affiliatePermissions.includes('ManageAffiliates');
      }
      return false;
    },

    // Distribution permissions - primarily for Retailer
    'distribution.view': () => {
      // Retailer users
      if (context.userRole === 'BusinessUser' && context.businessType === 'Retailer') {
        if (context.productPermissions) {
          return context.productPermissions.includes('ViewProducts');
        }
        return true; // Basic fallback for Retailer
      }
      return false;
    },

    'distribution.manage': () => {
      // Retailer users
      if (context.userRole === 'BusinessUser' && context.businessType === 'Retailer' && 
          context.productPermissions) {
        return context.productPermissions.includes('ManageProductInventory');
      }
      return false;
    },

    // Brand connection permissions
    'brands.view': () => {
      // Brand or Retailer users
      if (context.userRole === 'BusinessUser' && (context.businessType === 'Brand' || context.businessType === 'Retailer')) {
        if (context.generalPermissions) {
          return context.generalPermissions.includes('ViewDashboard');
        }
        return true; // Basic fallback
      }
      return false;
    },

    'brands.connect': () => {
      // Retailer users
      if (context.userRole === 'BusinessUser' && context.businessType === 'Retailer' && 
          context.affiliatePermissions) {
        return context.affiliatePermissions.includes('ManageAffiliates');
      }
      return false;
    },

    // Admin-specific permissions
    'admin.users': () => {
      if (context.userRole === 'Admin' && context.adminPermissions && context.adminAccessLevel) {
        return hasPermission(context.adminPermissions, AdminPermission.ViewUsers | AdminPermission.ModifyUsers);
      }
      return false;
    },

    'admin.content': () => {
      if (context.userRole === 'Admin' && context.adminPermissions && context.adminAccessLevel) {
        return hasPermission(context.adminPermissions, AdminPermission.ViewContent | AdminPermission.ModerateContent);
      }
      return false;
    },

    'admin.system': () => {
      if (context.userRole === 'Admin' && context.adminPermissions && context.adminAccessLevel) {
        return hasPermission(context.adminPermissions, AdminPermission.ViewSettings | AdminPermission.ModifySettings);
      }
      return false;
    },
  };

  return permissionMap[systemPermission]?.() || false;
}

/**
 * Checks if user has all required system permissions
 */
export function hasAllSystemPermissions(
  requiredPermissions: SystemPermission[],
  context: PermissionContext
): boolean {
  return requiredPermissions.every(permission => 
    mapToSystemPermission(permission, context)
  );
}

/**
 * Checks if user has any of the required system permissions
 */
export function hasAnySystemPermission(
  requiredPermissions: SystemPermission[],
  context: PermissionContext
): boolean {
  return requiredPermissions.some(permission => 
    mapToSystemPermission(permission, context)
  );
}