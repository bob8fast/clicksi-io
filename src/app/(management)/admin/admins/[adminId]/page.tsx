// app/admin/admins/[adminId]/page.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAdminHooks } from '@/hooks/api/admin-hooks';
import { AdminAccessLevel, AdminPermission, PERMISSION_DEFINITIONS, getDefaultPermissions, getPermissionNames } from '@/types/app/admin';
import
{
    ArrowLeft,
    Calendar,
    CheckCircle,
    Edit,
    Mail,
    Save,
    Settings,
    Shield,
    TrendingUp,
    User,
    UserCheck,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useState, use } from 'react';

interface AdminDetailsPageProps
{
    params: Promise<{
        adminId: string;
    }>;
}

// Helper functions
const getAccessLevelBadgeColor = (level: AdminAccessLevel) =>
{
    switch (level)
    {
        case 'SuperAdmin': return 'bg-red-500/20 text-red-400 border-red-500/30';
        case 'Elevated': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'Standard': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
};

const getAccessLevelIcon = (level: AdminAccessLevel) =>
{
    switch (level)
    {
        case 'SuperAdmin': return <Shield className="h-5 w-5" />;
        case 'Elevated': return <UserCheck className="h-5 w-5" />;
        case 'Standard': return <User className="h-5 w-5" />;
        default: return <User className="h-5 w-5" />;
    }
};

export default function AdminDetailsPage({ params }: AdminDetailsPageProps)
{
    const { adminId } = use(params);
    const adminHooks = useAdminHooks();

    // Fetch admin data
    const { data: admin, isLoading, error } = adminHooks.getById(adminId);

    // Mutations
    const grantPermissionsMutation = adminHooks.grantPermissions();
    const revokePermissionsMutation = adminHooks.revokePermissions(); 
    const promoteAdminMutation = adminHooks.promoteAdmin();

    // State for permission editing
    const [isEditingPermissions, setIsEditingPermissions] = useState(false);
    const [tempPermissions, setTempPermissions] = useState<Set<AdminPermission>>(new Set());

    // State for promotion dialog
    const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
    const [newAccessLevel, setNewAccessLevel] = useState<AdminAccessLevel>('Standard');
    const [preserveCustomPermissions, setPreserveCustomPermissions] = useState(true);

    // Initialize temp permissions when admin data loads or editing starts
    const initializeTempPermissions = () =>
    {
        if (!admin) return;

        const currentPermissions = new Set<AdminPermission>();
        // Use permission_names array from API since permissions is string-based
        admin.permission_names.forEach(permName =>
        {
            const permDef = PERMISSION_DEFINITIONS.find(def => def.name === permName);
            if (permDef)
            {
                currentPermissions.add(permDef.flag);
            }
        });
        setTempPermissions(currentPermissions);
    };

    const handleStartEditing = () =>
    {
        setIsEditingPermissions(true);
        initializeTempPermissions();
    };

    const handleCancelEditing = () =>
    {
        setIsEditingPermissions(false);
        setTempPermissions(new Set());
    };

    const handleSavePermissions = () =>
    {
        if (!admin) return;

        const newPermissionsValue = Array.from(tempPermissions).reduce((acc, perm) => acc | perm, 0);

        grantPermissionsMutation.mutate(
            { pathParams: { adminId: admin.user_id }, data: { user_id: admin.user_id, permissions_to_grant: newPermissionsValue as any } },
            {
                onSuccess: () =>
                {
                    setIsEditingPermissions(false);
                    setTempPermissions(new Set());
                },
            }
        );
    };

    const handleTogglePermission = (permission: AdminPermission) =>
    {
        setTempPermissions(prev =>
        {
            const newSet = new Set(prev);
            if (newSet.has(permission))
            {
                newSet.delete(permission);
            } else
            {
                newSet.add(permission);
            }
            return newSet;
        });
    };

    const handlePromoteAdmin = () =>
    {
        if (!admin) return;

        promoteAdminMutation.mutate(
            {
                pathParams: { adminId: admin.user_id },
                data: {
                    user_id: admin.user_id,
                    new_access_level: newAccessLevel,
                    preserve_custom_permissions: preserveCustomPermissions,
                }
            },
            {
                onSuccess: () =>
                {
                    setIsPromoteDialogOpen(false);
                },
            }
        );
    };

    const handleToggleStatus = () =>
    {
        if (!admin) return;
        // Note: Admin status toggle API not available yet
        console.log('Toggle admin status:', admin.user_id);
    };

    if (isLoading)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <p className="text-[#828288]">Loading administrator details...</p>
                </div>
            </div>
        );
    }

    if (error || !admin)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <p className="text-red-400">Administrator not found or error loading details.</p>
                    <Link href="/admin/admins">
                        <Button variant="outline" className="mt-4 border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Admins
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Get permissions for display
    const currentPermissionNames = admin.permission_names;
    const defaultPermissions = getDefaultPermissions(admin.access_level);
    const defaultPermissionNames = getPermissionNames(defaultPermissions);
    // Convert permission names to flags for comparison
    const currentPermissionFlags = admin.permission_names.reduce((acc, permName) => {
        const permDef = PERMISSION_DEFINITIONS.find(def => def.name === permName);
        return permDef ? acc | permDef.flag : acc;
    }, 0);
    const hasCustomPermissions = currentPermissionFlags !== defaultPermissions;

    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin/admins">
                    <Button variant="ghost" className="mb-4 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Admins
                    </Button>
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#EDECF8] mb-2">
                            {admin.first_name} {admin.last_name}
                        </h1>
                        <p className="text-[#828288]">{admin.email}</p>
                    </div>

                    <div className="flex gap-3">
                        {/* Toggle Status */}
                        <div className="flex items-center gap-2">
                            <Label htmlFor="status-toggle" className="text-[#828288]">
                                {admin.user_status === 'Active' ? 'Active' : 'Inactive'}
                            </Label>
                            <Switch
                                id="status-toggle"
                                checked={admin.user_status === 'Active'}
                                onCheckedChange={handleToggleStatus}
                                disabled={false}
                            />
                        </div>

                        {/* Promote Admin Button */}
                        <Dialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]">
                                    <TrendingUp className="mr-2 h-4 w-4" />
                                    Promote
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#171717] border-[#575757]">
                                <DialogHeader>
                                    <DialogTitle className="text-[#EDECF8]">Promote Administrator</DialogTitle>
                                    <DialogDescription className="text-[#828288]">
                                        Promote {admin.first_name} {admin.last_name} to a higher access level
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="newAccessLevel" className="text-[#EDECF8]">
                                            New Access Level
                                        </Label>
                                        <Select
                                            value={newAccessLevel}
                                            onValueChange={(value) => setNewAccessLevel(value as AdminAccessLevel)}
                                        >
                                            <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#171717] border-[#575757]">
                                                {admin.access_level !== 'Elevated' && (
                                                    <SelectItem value="Elevated">Elevated Admin</SelectItem>
                                                )}
                                                {admin.access_level !== 'SuperAdmin' && (
                                                    <SelectItem value="SuperAdmin">Super Admin</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="preserve-permissions"
                                            checked={preserveCustomPermissions}
                                            onCheckedChange={(checked) => setPreserveCustomPermissions(Boolean(checked))}
                                            className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                                        />
                                        <Label htmlFor="preserve-permissions" className="text-[#EDECF8]">
                                            Preserve custom permissions
                                        </Label>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsPromoteDialogOpen(false)}
                                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handlePromoteAdmin}
                                        disabled={promoteAdminMutation.isPending}
                                        className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                    >
                                        {promoteAdminMutation.isPending ? 'Promoting...' : 'Promote'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* Admin Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Profile Card */}
                <Card className="bg-[#090909] border-[#202020]">
                    <CardHeader>
                        <CardTitle className="text-[#EDECF8] flex items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-[#202020] border-2 border-[#575757] overflow-hidden">
                                {false ? (
                                    <img
                                        src=""
                                        alt={`${admin?.first_name} ${admin?.last_name}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Shield className="h-8 w-8 text-[#575757]" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="text-xl font-bold">{admin.first_name} {admin.last_name}</div>
                                <div className="text-sm text-[#828288] font-normal">{admin.email}</div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-[#828288]">Access Level:</span>
                            <Badge className={`${getAccessLevelBadgeColor(admin.access_level)} border`}>
                                <div className="flex items-center gap-1">
                                    {getAccessLevelIcon(admin.access_level)}
                                    {admin.access_level === 'SuperAdmin' ? 'Super Admin' : admin.access_level}
                                </div>
                            </Badge>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-[#828288]">Status:</span>
                            <Badge className={admin.user_status === 'Active'
                                ? 'bg-green-500/20 text-green-400 border-green-500/30 border'
                                : 'bg-gray-500/20 text-gray-400 border-gray-500/30 border'
                            }>
                                {admin.user_status === 'Active' ? (
                                    <>
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Active
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Inactive
                                    </>
                                )}
                            </Badge>
                        </div>

                        {hasCustomPermissions && (
                            <div className="flex justify-between">
                                <span className="text-[#828288]">Custom Permissions:</span>
                                <Badge className="bg-[#D78E59]/20 text-[#FFAA6C] border-[#D78E59]/30 border">
                                    Yes
                                </Badge>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="bg-[#090909] border-[#202020]">
                    <CardHeader>
                        <CardTitle className="text-[#EDECF8]">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-[#575757]" />
                            <div>
                                <div className="text-[#828288] text-sm">Email</div>
                                <div className="text-[#EDECF8]">{admin.email}</div>
                            </div>
                        </div>

                        {admin.granted_by_user_id && (
                            <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-[#575757]" />
                                <div>
                                    <div className="text-[#828288] text-sm">Created By</div>
                                    <div className="text-[#EDECF8]">
                                        {admin.granted_by_user_id === 'system' ? 'System' : 'Administrator'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Account Activity */}
                <Card className="bg-[#090909] border-[#202020]">
                    <CardHeader>
                        <CardTitle className="text-[#EDECF8]">Account Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-[#575757]" />
                            <div>
                                <div className="text-[#828288] text-sm">Created</div>
                                <div className="text-[#EDECF8]">
                                    {new Date(admin.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Settings className="h-5 w-5 text-[#575757]" />
                            <div>
                                <div className="text-[#828288] text-sm">Last Updated</div>
                                <div className="text-[#EDECF8]">
                                    {new Date(admin.modified_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {false && (
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-[#575757]" />
                                <div>
                                    <div className="text-[#828288] text-sm">Last Login</div>
                                    <div className="text-[#EDECF8]">
                                        {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Permissions Management */}
            <Card className="bg-[#090909] border-[#202020]">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-[#EDECF8]">Permissions Management</CardTitle>
                        {!isEditingPermissions ? (
                            <Button
                                onClick={handleStartEditing}
                                variant="outline"
                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Permissions
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleCancelEditing}
                                    variant="outline"
                                    className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSavePermissions}
                                    disabled={grantPermissionsMutation.isPending}
                                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {grantPermissionsMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Default Permissions */}
                    <div>
                        <h4 className="text-lg font-semibold text-[#EDECF8] mb-3">
                            Default Permissions ({admin.access_level})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {defaultPermissionNames.map((permissionName) => (
                                <div key={permissionName} className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span className="text-[#828288]">{permissionName}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator className="bg-[#575757]" />

                    {/* Current Permissions */}
                    <div>
                        <h4 className="text-lg font-semibold text-[#EDECF8] mb-3">
                            {isEditingPermissions ? 'Edit Permissions' : 'Current Permissions'}
                        </h4>

                        {isEditingPermissions ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {PERMISSION_DEFINITIONS.map(perm => (
                                    <div key={perm.flag} className="flex items-start space-x-3 p-3 bg-[#202020] rounded-lg">
                                        <Checkbox
                                            id={`perm-${perm.flag}`}
                                            checked={tempPermissions.has(perm.flag)}
                                            onCheckedChange={() => handleTogglePermission(perm.flag)}
                                            className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59] mt-1"
                                        />
                                        <div className="flex-1">
                                            <Label
                                                htmlFor={`perm-${perm.flag}`}
                                                className="text-[#EDECF8] cursor-pointer font-medium"
                                            >
                                                {perm.name}
                                            </Label>
                                            <p className="text-sm text-[#828288] mt-1">
                                                {perm.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {currentPermissionNames.map((permissionName) => (
                                    <div key={permissionName} className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span className="text-[#EDECF8]">{permissionName}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Custom Permissions Note */}
                    {hasCustomPermissions && !isEditingPermissions && (
                        <>
                            <Separator className="bg-[#575757]" />
                            <div className="bg-[#D78E59]/10 border border-[#D78E59]/30 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Settings className="h-5 w-5 text-[#FFAA6C]" />
                                    <span className="font-semibold text-[#FFAA6C]">Custom Permissions Applied</span>
                                </div>
                                <p className="text-sm text-[#828288]">
                                    This administrator has custom permissions that differ from the default {admin.access_level} level.
                                </p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}