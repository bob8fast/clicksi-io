// app/admin/users/[userId]/page.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useGetUserById } from '@/gen/api/hooks/user_management/users';
import { UpdateUserVerificationRequest, VerificationStatus } from '@/types/admin';
import
    {
        ArrowLeft,
        Calendar,
        CheckCircle,
        Clock,
        Mail,
        Phone,
        Shield,
        User,
        Users,
        XCircle
    } from 'lucide-react';
import Link from 'next/link';
import { useState, use } from 'react';

interface UserDetailsPageProps
{
    params: Promise<{
        userId: string;
    }>;
}

// Helper functions
const getRoleIcon = (role: string) =>
{
    switch (role)
    {
        case 'Admin': return <Shield className="h-5 w-5" />;
        case 'Creator': return <User className="h-5 w-5" />;
        case 'BusinessUser': return <Users className="h-5 w-5" />;
        default: return <User className="h-5 w-5" />;
    }
};

const getRoleBadgeColor = (role: string) =>
{
    switch (role)
    {
        case 'Admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
        case 'Creator': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'BusinessUser': return 'bg-green-500/20 text-green-400 border-green-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
};

const getVerificationIcon = (status: VerificationStatus) =>
{
    switch (status)
    {
        case 'Verified': return <CheckCircle className="h-5 w-5 text-green-400" />;
        case 'Pending': return <Clock className="h-5 w-5 text-yellow-400" />;
        case 'Rejected': return <XCircle className="h-5 w-5 text-red-400" />;
        default: return null;
    }
};

const getVerificationBadgeColor = (status: VerificationStatus) =>
{
    switch (status)
    {
        case 'Verified': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'Rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
};

export default function UserDetailsPage({ params }: UserDetailsPageProps)
{
    const { userId } = use(params);

    // Fetch user data
    const { data: user, isLoading, error } = useGetUserById(
        { userId },
        {
            query: {
                enabled: !!userId,
                staleTime: 2 * 60 * 1000
            }
        }
    );

    // Mutations - placeholder functions for now
    const updateVerificationMutation = {
        mutate: (data: any) => {
            console.log('Update verification:', data);
        },
        isLoading: false
    };
    const resendEmailMutation = {
        mutate: () => {
            console.log('Resend email for user:', userId);
        },
        isLoading: false
    };

    // State for verification dialog
    const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
    const [newVerificationStatus, setNewVerificationStatus] = useState<VerificationStatus>('Pending');
    const [verificationReason, setVerificationReason] = useState('');

    // State for resend email dialog
    const [isResendEmailDialogOpen, setIsResendEmailDialogOpen] = useState(false);

    if (isLoading)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <p className="text-[#828288]">Loading user details...</p>
                </div>
            </div>
        );
    }

    if (error || !response?.success || !user)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <p className="text-red-400">User not found or error loading user details.</p>
                    <Link href="/admin/users">
                        <Button variant="outline" className="mt-4 border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleUpdateVerification = () =>
    {
        if (!user) return;

        const updateData: UpdateUserVerificationRequest = {
            user_id: user.user_id,
            verification_status: newVerificationStatus,
            rejection_reason: verificationReason || undefined,
        };

        updateVerificationMutation.mutate(
            { userId: user.user_id, data: updateData },
            {
                onSuccess: () =>
                {
                    setIsVerificationDialogOpen(false);
                    setVerificationReason('');
                },
            }
        );
    };

    const handleResendEmail = () =>
    {
        if (!user) return;

        resendEmailMutation.mutate(
            { email: user.email },
            {
                onSuccess: () =>
                {
                    setIsResendEmailDialogOpen(false);
                },
            }
        );
    };

    // Can change verification status for Creator and Business users
    const canChangeVerificationStatus = user.role === 'Creator' || user.role === 'BusinessUser';

    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin/users">
                    <Button variant="ghost" className="mb-4 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Users
                    </Button>
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-[#EDECF8] mb-2">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-[#828288]">{user.email}</p>
                    </div>

                    <div className="flex gap-3">
                        {/* Resend Email Button */}
                        <Dialog open={isResendEmailDialogOpen} onOpenChange={setIsResendEmailDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Resend Email
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#171717] border-[#575757]">
                                <DialogHeader>
                                    <DialogTitle className="text-[#EDECF8]">Resend Email</DialogTitle>
                                    <DialogDescription className="text-[#828288]">
                                        Send a verification email to {user.email}?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsResendEmailDialogOpen(false)}
                                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleResendEmail}
                                        disabled={resendEmailMutation.isPending}
                                        className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                    >
                                        {resendEmailMutation.isPending ? 'Sending...' : 'Send Email'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Change Verification Status Button */}
                        {canChangeVerificationStatus && (
                            <Dialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]">
                                        Change Verification Status
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-[#171717] border-[#575757]">
                                    <DialogHeader>
                                        <DialogTitle className="text-[#EDECF8]">Update Verification Status</DialogTitle>
                                        <DialogDescription className="text-[#828288]">
                                            Change the verification status for {user.firstName} {user.lastName}
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="status" className="text-[#EDECF8]">
                                                Verification Status
                                            </Label>
                                            <Select
                                                value={newVerificationStatus}
                                                onValueChange={(value) => setNewVerificationStatus(value as VerificationStatus)}
                                            >
                                                <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#171717] border-[#575757]">
                                                    <SelectItem value="Pending">Pending</SelectItem>
                                                    <SelectItem value="Verified">Verified</SelectItem>
                                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="reason" className="text-[#EDECF8]">
                                                Reason (optional)
                                            </Label>
                                            <Textarea
                                                id="reason"
                                                value={verificationReason}
                                                onChange={(e) => setVerificationReason(e.target.value)}
                                                placeholder="Enter reason for status change..."
                                                className="bg-[#202020] border-[#575757] text-[#EDECF8] placeholder:text-[#575757]"
                                                rows={3}
                                            />
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsVerificationDialogOpen(false)}
                                            className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleUpdateVerification}
                                            disabled={updateVerificationMutation.isPending}
                                            className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                        >
                                            {updateVerificationMutation.isPending ? 'Updating...' : 'Update Status'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </div>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <Card className="bg-[#090909] border-[#202020]">
                    <CardHeader>
                        <CardTitle className="text-[#EDECF8] flex items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-[#202020] border-2 border-[#575757] overflow-hidden">
                                {user.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User className="h-8 w-8 text-[#575757]" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="text-xl font-bold">{user.firstName} {user.lastName}</div>
                                <div className="text-sm text-[#828288] font-normal">{user.email}</div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-[#828288]">Role:</span>
                            <Badge className={`${getRoleBadgeColor(user.role)} border`}>
                                <div className="flex items-center gap-1">
                                    {getRoleIcon(user.role)}
                                    {user.role}
                                </div>
                            </Badge>
                        </div>

                        {canChangeVerificationStatus && (
                            <div className="flex justify-between">
                                <span className="text-[#828288]">Verification:</span>
                                <Badge className={`${getVerificationBadgeColor(user.verificationStatus)} border`}>
                                    <div className="flex items-center gap-1">
                                        {getVerificationIcon(user.verificationStatus)}
                                        {user.verificationStatus}
                                    </div>
                                </Badge>
                            </div>
                        )}

                        {user.businessType && (
                            <div className="flex justify-between">
                                <span className="text-[#828288]">Business Type:</span>
                                <span className="text-[#EDECF8]">{user.businessType}</span>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <span className="text-[#828288]">Status:</span>
                            <Badge className={user.isActive
                                ? 'bg-green-500/20 text-green-400 border-green-500/30 border'
                                : 'bg-gray-500/20 text-gray-400 border-gray-500/30 border'
                            }>
                                {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
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
                                <div className="text-[#EDECF8]">{user.email}</div>
                            </div>
                        </div>

                        {user.phoneNumber && (
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-[#575757]" />
                                <div>
                                    <div className="text-[#828288] text-sm">Phone</div>
                                    <div className="text-[#EDECF8]">{user.phoneNumber}</div>
                                </div>
                            </div>
                        )}

                        {user.dateOfBirth && (
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-[#575757]" />
                                <div>
                                    <div className="text-[#828288] text-sm">Date of Birth</div>
                                    <div className="text-[#EDECF8]">
                                        {new Date(user.dateOfBirth).toLocaleDateString()}
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
                        <div>
                            <div className="text-[#828288] text-sm">Account Created</div>
                            <div className="text-[#EDECF8]">
                                {new Date(user.createdAt).toLocaleDateString()} at{' '}
                                {new Date(user.createdAt).toLocaleTimeString()}
                            </div>
                        </div>

                        <div>
                            <div className="text-[#828288] text-sm">Last Updated</div>
                            <div className="text-[#EDECF8]">
                                {new Date(user.updatedAt).toLocaleDateString()} at{' '}
                                {new Date(user.updatedAt).toLocaleTimeString()}
                            </div>
                        </div>

                        {user.lastLoginAt && (
                            <div>
                                <div className="text-[#828288] text-sm">Last Login</div>
                                <div className="text-[#EDECF8]">
                                    {new Date(user.lastLoginAt).toLocaleDateString()} at{' '}
                                    {new Date(user.lastLoginAt).toLocaleTimeString()}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}