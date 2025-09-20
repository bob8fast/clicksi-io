'use client';

import { useState } from 'react';
// import { useSession } from 'next-auth/react'; // Removed auth
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePermissionHooks } from '@/hooks/api/permission-hooks';
import { useAdminHooks } from '@/hooks/api/admin-hooks';
import { ClicksiDataContractsCommonEnumsSubscriptionPermissions } from '@/gen/api/types';
import { Search, User, Shield, AlertCircle } from 'lucide-react';

// Permission categories for better organization
const PERMISSION_CATEGORIES = {
  analytics: {
    label: 'Analytics & Reports',
    permissions: [
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.BasicAnalytics,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.AdvancedAnalytics,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.CustomReports,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.DataExport
    ]
  },
  connections: {
    label: 'Connections & Network',
    permissions: [
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.BasicConnections,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.UnlimitedConnections,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.BasicInvites,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.UnlimitedInvites
    ]
  },
  campaigns: {
    label: 'Campaign Management',
    permissions: [
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.BasicCampaigns,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.AdvancedCampaigns,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.CampaignAnalytics
    ]
  },
  support: {
    label: 'Support & Services',
    permissions: [
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.BasicSupport,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.PrioritySupport,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.DedicatedManager
    ]
  },
  branding: {
    label: 'Branding & Customization',
    permissions: [
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.CustomBranding,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.WhiteLabel,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.CustomDomain
    ]
  },
  api: {
    label: 'API & Integrations',
    permissions: [
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.BasicApiAccess,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.AdvancedApiAccess,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.WebhookSupport,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.ThirdPartyIntegrations
    ]
  },
  products: {
    label: 'Product Management',
    permissions: [
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.BasicProducts,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.UnlimitedProducts,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.ProductAnalytics
    ]
  },
  security: {
    label: 'Security & Compliance',
    permissions: [
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.AdvancedPermissions,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.AuditLogs,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.SsoIntegration
    ]
  },
  enterprise: {
    label: 'Enterprise Features',
    permissions: [
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.CustomContracts,
      ClicksiDataContractsCommonEnumsSubscriptionPermissions.OnPremiseDeployment
    ]
  }
};

export default function PermissionsPage() {
  // const { data: session } = useSession(); // Removed auth
  const session = null; // Mock session - auth removed
  const [searchUserId, setSearchUserId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const permissionHooks = usePermissionHooks();
  const adminHooks = useAdminHooks();
  
  // Get user permissions when a user is selected
  const { data: userPermissions, isLoading: permissionsLoading, error: permissionsError } = 
    permissionHooks.getUserPermissions(selectedUserId || '');
  
  // Get all users for search suggestions
  const { data: allUsers, isLoading: usersLoading } = adminHooks.getAll({});

  const handleSearchUser = () => {
    if (searchUserId.trim()) {
      setSelectedUserId(searchUserId.trim());
    }
  };

  const handleUserSelect = (userId: string) => {
    setSearchUserId(userId);
    setSelectedUserId(userId);
  };

  // Helper to format permission names
  const formatPermissionName = (permission: string) => {
    return permission.replace(/([A-Z])/g, ' $1').trim();
  };

  // Helper to get permission status
  const hasPermission = (permission: string) => {
    if (!userPermissions?.effective_permissions) return false;
    // Check if the permission is included in the effective permissions
    return userPermissions.effective_permissions.includes(permission as any);
  };

  // Helper to get permission source
  const getPermissionSource = (permission: string) => {
    const hasSubscription = userPermissions?.subscription_permissions?.includes(permission as any);
    const hasInvited = userPermissions?.invited_permissions?.includes(permission as any);
    
    if (hasSubscription && hasInvited) return 'Both Subscription & Invitation';
    if (hasSubscription) return 'Subscription';
    if (hasInvited) return 'Team Invitation';
    return 'None';
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Permission Management</h1>
          <p className="text-gray-600 mt-2">
            View and analyze user permissions and subscription details
          </p>
        </div>
      </div>

      {/* User Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            User Search
          </CardTitle>
          <CardDescription>
            Enter a user ID to view their permissions and subscription details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="user-search">User ID</Label>
              <Input
                id="user-search"
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                placeholder="Enter user ID..."
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearchUser} disabled={!searchUserId.trim()}>
                Search
              </Button>
            </div>
          </div>

          {/* Quick user selection from admin users */}
          {allUsers?.results && allUsers.results.length > 0 && (
            <div>
              <Label>Quick Select (Recent Users)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {allUsers.results.slice(0, 5).map((user: any) => (
                  <Button
                    key={user.user_id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleUserSelect(user.user_id)}
                    className="text-xs"
                  >
                    {user.first_name} {user.last_name} ({user.user_id.substring(0, 8)}...)
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Permissions Display */}
      {selectedUserId && (
        <div className="space-y-6">
          {permissionsLoading ? (
            <Card>
              <CardContent className="py-6">
                <div className="text-center">Loading user permissions...</div>
              </CardContent>
            </Card>
          ) : permissionsError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load permissions for user {selectedUserId}. 
                User may not exist or you may not have permission to view their data.
              </AlertDescription>
            </Alert>
          ) : userPermissions ? (
            <>
              {/* User Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Overview: {selectedUserId}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Can Invite Others</Label>
                      <div className="mt-1">
                        <Badge variant={userPermissions.can_invite_others ? "default" : "secondary"}>
                          {userPermissions.can_invite_others ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Max Connections</Label>
                      <div className="mt-1 text-lg font-semibold">
                        {userPermissions.max_connections === -1 ? "Unlimited" : userPermissions.max_connections}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Max Invites</Label>
                      <div className="mt-1 text-lg font-semibold">
                        {userPermissions.max_invites === -1 ? "Unlimited" : userPermissions.max_invites}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Max Products</Label>
                      <div className="mt-1 text-lg font-semibold">
                        {userPermissions.max_products === -1 ? "Unlimited" : userPermissions.max_products}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium text-gray-600">API Calls Per Month</Label>
                    <div className="mt-1 text-lg font-semibold">
                      {userPermissions.api_calls_per_month === -1 ? "Unlimited" : userPermissions.api_calls_per_month.toLocaleString()}
                    </div>
                  </div>

                  {/* Subscription Info */}
                  {userPermissions.subscription && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium text-gray-600">Active Subscription</Label>
                      <div className="mt-2 p-3 bg-blue-50 rounded-lg border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div><strong>Team ID:</strong> {userPermissions.subscription.team_id}</div>
                          <div><strong>Plan:</strong> {userPermissions.subscription.plan?.name || 'N/A'}</div>
                          <div><strong>Status:</strong> <Badge variant="default">{userPermissions.subscription.status}</Badge></div>
                          {userPermissions.subscription.trial_end && (
                            <div><strong>Trial Ends:</strong> {new Date(userPermissions.subscription.trial_end).toLocaleDateString()}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Invitation Info */}
                  {userPermissions.accepted_invitation && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium text-gray-600">Team Invitation</Label>
                      <div className="mt-2 p-3 bg-green-50 rounded-lg border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div><strong>Team ID:</strong> {userPermissions.accepted_invitation.receiver_team_id}</div>
                          <div><strong>Business Type:</strong> <Badge variant="outline">{userPermissions.accepted_invitation.invited_busineess_type}</Badge></div>
                          <div><strong>Accepted:</strong> {new Date(userPermissions.accepted_invitation.accepted_at || '').toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Permissions Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Permissions Breakdown
                  </CardTitle>
                  <CardDescription>
                    Detailed view of all permissions categorized by functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(PERMISSION_CATEGORIES).map(([categoryKey, category]) => (
                      <div key={categoryKey}>
                        <h3 className="text-lg font-semibold mb-3">{category.label}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {category.permissions.map((permission) => {
                            const hasAccess = hasPermission(permission);
                            const source = getPermissionSource(permission);
                            
                            return (
                              <div 
                                key={permission}
                                className={`p-3 rounded-lg border ${
                                  hasAccess ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">
                                      {formatPermissionName(permission)}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">
                                      Source: {source}
                                    </div>
                                  </div>
                                  <Badge 
                                    variant={hasAccess ? "default" : "secondary"}
                                    className="ml-2"
                                  >
                                    {hasAccess ? "Granted" : "Not Available"}
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Usage Limits */}
              {userPermissions.usage_limits && userPermissions.usage_limits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Limits</CardTitle>
                    <CardDescription>
                      Current usage limits and restrictions for this user
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {userPermissions.usage_limits.map((limit: any, index: number) => (
                        <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            <div><strong>Type:</strong> {limit.limit_type}</div>
                            <div><strong>Current:</strong> {limit.current_usage || 0}</div>
                            <div><strong>Limit:</strong> {limit.limit_value === -1 ? "Unlimited" : limit.limit_value}</div>
                          </div>
                          {limit.reset_date && (
                            <div className="text-xs text-gray-600 mt-2">
                              Resets: {new Date(limit.reset_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}