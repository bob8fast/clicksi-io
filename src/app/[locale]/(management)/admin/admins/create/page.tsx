// app/admin/admins/create/page.tsx
'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAdminHooks } from '@/hooks/api/admin-hooks';
import { AdminAccessLevel, AdminPermission, PERMISSION_DEFINITIONS, getDefaultPermissions } from '@/types/app/admin';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, EyeOff, Shield, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const CreateAdminFormSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Valid email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    accessLevel: z.enum(['Standard', 'Elevated', 'SuperAdmin']),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type CreateAdminFormData = z.infer<typeof CreateAdminFormSchema>;

export default function CreateAdminPage()
{
    const router = useRouter();
    const adminHooks = useAdminHooks();
    const createAdminMutation = adminHooks.createAdminAccount();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedAccessLevel, setSelectedAccessLevel] = useState<AdminAccessLevel>('Standard');
    const [additionalPermissions, setAdditionalPermissions] = useState<Set<AdminPermission>>(new Set());
    const [restrictedPermissions, setRestrictedPermissions] = useState<Set<AdminPermission>>(new Set());

    const form = useForm<CreateAdminFormData>({
        resolver: zodResolver(CreateAdminFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            accessLevel: 'Standard',
        },
    });

    // Get default permissions for the selected access level
    const defaultPermissions = getDefaultPermissions(selectedAccessLevel);
    const defaultPermissionFlags = PERMISSION_DEFINITIONS.filter(perm =>
        (defaultPermissions & perm.flag) === perm.flag
    );

    // Get available permissions that can be added
    const availableAdditionalPermissions = PERMISSION_DEFINITIONS.filter(perm =>
        (defaultPermissions & perm.flag) === 0
    );

    // Calculate final permissions
    const calculateFinalPermissions = (): number =>
    {
        let finalPermissions = defaultPermissions;

        // Add additional permissions
        additionalPermissions.forEach(perm =>
        {
            finalPermissions |= perm;
        });

        // Remove restricted permissions
        restrictedPermissions.forEach(perm =>
        {
            finalPermissions &= ~perm;
        });

        return finalPermissions;
    };

    const handleAccessLevelChange = (newLevel: AdminAccessLevel) =>
    {
        setSelectedAccessLevel(newLevel);
        form.setValue('accessLevel', newLevel);

        // Clear custom permissions when access level changes
        setAdditionalPermissions(new Set());
        setRestrictedPermissions(new Set());
    };

    const toggleAdditionalPermission = (permission: AdminPermission) =>
    {
        setAdditionalPermissions(prev =>
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

    const toggleRestrictedPermission = (permission: AdminPermission) =>
    {
        setRestrictedPermissions(prev =>
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

    const onSubmit = (data: CreateAdminFormData) =>
    {
        const finalPermissions = calculateFinalPermissions();

        const createAdminData = {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            password: data.password,
            is_password_temporary: true,
            access_level: data.accessLevel,
            permissions: finalPermissions === 0 ? null : (finalPermissions as any),
        };

        createAdminMutation.mutate({ data: createAdminData }, {
            onSuccess: (response) =>
            {
                if (response.success)
                {
                    router.push('/admin/admins');
                }
            },
        });
    };

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

                <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-8 w-8 text-[#D78E59]" />
                    <h1 className="text-3xl font-bold text-[#EDECF8]">Create New Administrator</h1>
                </div>
                <p className="text-[#828288]">Add a new administrator with customized permissions</p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Basic Information */}
                    <Card className="bg-[#090909] border-[#202020]">
                        <CardHeader>
                            <CardTitle className="text-[#EDECF8]">Basic Information</CardTitle>
                            <CardDescription className="text-[#828288]">
                                Enter the administrator&apos;s personal details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName" className="text-[#EDECF8]">
                                        First Name *
                                    </Label>
                                    <Input
                                        id="firstName"
                                        {...form.register('firstName')}
                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                        placeholder="Enter first name"
                                    />
                                    {form.formState.errors.firstName && (
                                        <p className="text-red-400 text-sm mt-1">
                                            {form.formState.errors.firstName.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="lastName" className="text-[#EDECF8]">
                                        Last Name *
                                    </Label>
                                    <Input
                                        id="lastName"
                                        {...form.register('lastName')}
                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                        placeholder="Enter last name"
                                    />
                                    {form.formState.errors.lastName && (
                                        <p className="text-red-400 text-sm mt-1">
                                            {form.formState.errors.lastName.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-[#EDECF8]">
                                    Email Address *
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...form.register('email')}
                                    className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                    placeholder="Enter email address"
                                />
                                {form.formState.errors.email && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {form.formState.errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-[#EDECF8]">
                                    Password *
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        {...form.register('password')}
                                        className="bg-[#202020] border-[#575757] text-[#EDECF8] pr-10"
                                        placeholder="Enter password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 text-[#575757] hover:text-[#EDECF8]"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </Button>
                                </div>
                                {form.formState.errors.password && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {form.formState.errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword" className="text-[#EDECF8]">
                                    Confirm Password *
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        {...form.register('confirmPassword')}
                                        className="bg-[#202020] border-[#575757] text-[#EDECF8] pr-10"
                                        placeholder="Confirm password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 text-[#575757] hover:text-[#EDECF8]"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </Button>
                                </div>
                                {form.formState.errors.confirmPassword && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {form.formState.errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Access Level */}
                    <Card className="bg-[#090909] border-[#202020]">
                        <CardHeader>
                            <CardTitle className="text-[#EDECF8]">Access Level</CardTitle>
                            <CardDescription className="text-[#828288]">
                                Choose the administrator&apos;s access level
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Select
                                value={selectedAccessLevel}
                                onValueChange={handleAccessLevelChange}
                            >
                                <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                    <SelectValue placeholder="Select access level" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#171717] border-[#575757]">
                                    <SelectItem value="Standard">
                                        <div className="space-y-1">
                                            <div className="font-medium">Standard Admin</div>
                                            <div className="text-sm text-[#828288]">Basic administrative permissions</div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Elevated">
                                        <div className="space-y-1">
                                            <div className="font-medium">Elevated Admin</div>
                                            <div className="text-sm text-[#828288]">Extended permissions for content and user management</div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="SuperAdmin">
                                        <div className="space-y-1">
                                            <div className="font-medium">Super Admin</div>
                                            <div className="text-sm text-[#828288]">Full administrative access</div>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Default Permissions Preview */}
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold text-[#EDECF8] mb-2">Default Permissions:</h4>
                                <div className="space-y-2">
                                    {defaultPermissionFlags.map(perm => (
                                        <div key={perm.flag} className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#D78E59] rounded-full"></div>
                                            <span className="text-sm text-[#828288]">{perm.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Custom Permissions */}
                <Card className="bg-[#090909] border-[#202020]">
                    <CardHeader>
                        <CardTitle className="text-[#EDECF8]">Custom Permissions</CardTitle>
                        <CardDescription className="text-[#828288]">
                            Customize permissions beyond the default access level
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Additional Permissions */}
                        {availableAdditionalPermissions.length > 0 && (
                            <div>
                                <h4 className="text-lg font-semibold text-[#EDECF8] mb-3">Additional Permissions</h4>
                                <p className="text-sm text-[#828288] mb-4">
                                    Grant additional permissions beyond the default level
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {availableAdditionalPermissions.map(perm => (
                                        <div key={perm.flag} className="flex items-start space-x-3 p-3 bg-[#202020] rounded-lg">
                                            <Checkbox
                                                id={`add-${perm.flag}`}
                                                checked={additionalPermissions.has(perm.flag)}
                                                onCheckedChange={() => toggleAdditionalPermission(perm.flag)}
                                                className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59] mt-1"
                                            />
                                            <div className="flex-1">
                                                <Label
                                                    htmlFor={`add-${perm.flag}`}
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
                            </div>
                        )}

                        {/* Restricted Permissions */}
                        {defaultPermissionFlags.length > 0 && (
                            <>
                                <Separator className="bg-[#575757]" />
                                <div>
                                    <h4 className="text-lg font-semibold text-[#EDECF8] mb-3">Restricted Permissions</h4>
                                    <p className="text-sm text-[#828288] mb-4">
                                        Remove specific permissions from the default level
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {defaultPermissionFlags.map(perm => (
                                            <div key={perm.flag} className="flex items-start space-x-3 p-3 bg-[#202020] rounded-lg">
                                                <Checkbox
                                                    id={`restrict-${perm.flag}`}
                                                    checked={restrictedPermissions.has(perm.flag)}
                                                    onCheckedChange={() => toggleRestrictedPermission(perm.flag)}
                                                    className="border-[#575757] data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500 mt-1"
                                                />
                                                <div className="flex-1">
                                                    <Label
                                                        htmlFor={`restrict-${perm.flag}`}
                                                        className="text-[#EDECF8] cursor-pointer font-medium"
                                                    >
                                                        Remove {perm.name}
                                                    </Label>
                                                    <p className="text-sm text-[#828288] mt-1">
                                                        {perm.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Final Permissions Preview */}
                        <Separator className="bg-[#575757]" />
                        <div>
                            <h4 className="text-lg font-semibold text-[#EDECF8] mb-3">Final Permissions Preview</h4>
                            <div className="bg-[#202020] rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {PERMISSION_DEFINITIONS.map(perm =>
                                    {
                                        const finalPermissions = calculateFinalPermissions();
                                        const hasPermission = (finalPermissions & perm.flag) === perm.flag;

                                        return (
                                            <div
                                                key={perm.flag}
                                                className={`flex items-center gap-2 text-sm ${hasPermission ? 'text-green-400' : 'text-[#575757]'
                                                    }`}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${hasPermission ? 'bg-green-400' : 'bg-[#575757]'
                                                    }`}></div>
                                                {perm.name}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end gap-4">
                    <Link href="/admin/admins">
                        <Button variant="outline" className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]">
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={createAdminMutation.isPending}
                        className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        {createAdminMutation.isPending ? 'Creating...' : 'Create Administrator'}
                    </Button>
                </div>
            </form>
        </div>
    );
}