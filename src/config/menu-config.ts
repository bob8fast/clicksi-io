// config/menu-config.ts
import { Building2, Palette, Store } from 'lucide-react';
import { UserRole, BusinessType } from '@/types';
import memoizee from 'memoizee';

export interface RoleBasedMenuItem {
  href: string;
  label: string;
  icon: any;
}

/**
 * Get role-based menu items for a specific user
 * @param userRole - The user's role
 * @param businessType - The user's business type (if applicable)
 * @returns Array of menu items specific to the user's role
 */
const getRoleBasedMenuItemsInternal = (
  userRole?: UserRole, 
  businessType?: BusinessType
): RoleBasedMenuItem[] => {
  const roleItems: RoleBasedMenuItem[] = [];
  
  if (userRole === 'Creator') {
    roleItems.push({
      href: '/creators/dashboard',
      label: 'Creator Dashboard',
      icon: Palette
    });
  } else if (userRole === 'BusinessUser') {
    if (businessType === 'Brand') {
      roleItems.push({
        href: '/brand-management',
        label: 'Brand Management',
        icon: Building2
      });
    } else if (businessType === 'Retailer') {
      roleItems.push({
        href: '/retailers/dashboard',
        label: 'Retailer Dashboard',
        icon: Store
      });
    }
  }
  
  return roleItems;
};

/**
 * Memoized version of getRoleBasedMenuItems for performance optimization
 * Cache expires after 5 minutes or when arguments change
 */
export const getRoleBasedMenuItems = memoizee(getRoleBasedMenuItemsInternal, {
  maxAge: 5 * 60 * 1000, // 5 minutes
  max: 100, // Maximum 100 cached entries
  normalizer: (args) => JSON.stringify(args) // Custom key generation
});

/**
 * Clear the memoization cache for role-based menu items
 * Useful when user role changes or for cache invalidation
 */
export const clearRoleBasedMenuItemsCache = () => {
  getRoleBasedMenuItems.clear();
};