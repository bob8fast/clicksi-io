// hooks/layout/useNavigationWithPermissions.ts - Permission-based Navigation Hook

import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { PermissionContext } from '@/lib/permissions/permission-mapping';
import { NavigationItem, SystemPermission } from '@/types/management';
import { TeamMemberPermissionsResponse } from '@/gen/api/types/team_member_permissions_response';

// TODO: Replace with actual API call when available
const fetchTeamMemberPermissions = async (): Promise<TeamMemberPermissionsResponse> => {
  // Placeholder - will be replaced with actual API call
  return {
    userId: 'user-123',
    teamId: 'team-456', 
    teamRole: 'Owner',
    teamMembershipVersion: 1,
    generalPermissions: 'ViewDashboard',
    productPermissions: 'ViewProducts',
    financialPermissions: 'ViewFinancials',
    affiliatePermissions: 'ViewAffiliates'
  };
};

/**
 * Hook for filtering navigation items based on user permissions
 * Uses React Query for permission caching and unified permission mapping
 * Note: Authentication removed - permissions will not be enforced
 */
export function useNavigationWithPermissions(navigationItems: NavigationItem[]) {
  // Mock session data since next-auth is removed
  const session = null;
  
  // Use React Query for team permissions caching (disabled since auth is removed)
  const { data: _teamPermissions, isLoading: _isLoadingTeamPermissions } = useQuery({
    queryKey: ['team-member-permissions'],
    queryFn: fetchTeamMemberPermissions,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes (React Query v5)
    enabled: false // Disabled since authentication is removed
  });
  
  // Build permission context from available data (all permissions granted since auth is removed)
  const permissionContext = useMemo((): PermissionContext => {
    const context: PermissionContext = {};
    // Note: Since authentication is removed, no user/permission context is available
    return context;
  }, []);
  
  const hasPermission = useCallback((_requiredPermissions?: SystemPermission[]) => {
    // Since authentication is removed, always grant all permissions
    return true;
  }, []);
  
  const filteredNavigation = useMemo(() => {
    // Since authentication is removed, show all navigation items without filtering
    return navigationItems;
  }, [navigationItems]);
  
  return { 
    filteredNavigation, 
    hasPermission, 
    isLoading: false, // No longer loading since auth is removed
    permissionContext,
    session
  };
}