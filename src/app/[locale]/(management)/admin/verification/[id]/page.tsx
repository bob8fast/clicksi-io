// app/admin/verification/[id]/page.tsx
'use client'

import { DocumentViewer } from '@/components/features/verification';
import { useDocumentDownload } from '@/components/features/verification/hooks';
import { Badge } from '@/components/ui/badge';
import { TeamTypeBadge } from '@/components/ui/badges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useVerificationHooks } from '@/hooks/api';
import { getStatusBadgeIcon, getStatusColor, getStatusIcon } from '@/lib/verification-utils';
import { VerificationDocumentDto } from '@/types';
import { VerificationStatusEnum } from '@/types/app/generated-enums';
import { DOCUMENT_LABELS, getRequiredDocumentTypesMemoized } from '@/types/app/verification';
import { zodResolver } from '@hookform/resolvers/zod';
import
    {
        ArrowLeft,
        Building2,
        Calendar,
        Download,
        Eye,
        FileText,
        Image as ImageIcon,
        Save,
        Shield
    } from 'lucide-react';
// import { useSession } from 'next-auth/react'; // Removed auth
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const statusUpdateSchema = z.object({
    status: VerificationStatusEnum,
    note: z.string().min(1, 'Please provide a note about the status change'),
});

type StatusUpdateFormData = z.infer<typeof statusUpdateSchema>;

export default function AdminVerificationReviewPage()
{
    const params = useParams();
    const router = useRouter();
    // const { data: session } = useSession(); // Removed auth
    const session = null; // Mock session - auth removed
    const verificationId = params.id as string;

    // Use the new verification hooks
    const verificationHooks = useVerificationHooks();
    const { data: verification, isLoading, error } = verificationHooks.getApplication({ id: verificationId });
    const verificationDocuments = verification?.documents || [];

    const requiredDocs = getRequiredDocumentTypesMemoized(
        verification?.team?.team_type || 'Unknown'
    );
    const verificationInfo = verification?.status_history?.getVerificationStatusInfo();
    const updateStatus = verificationHooks.updateStatus;

    const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<VerificationDocumentDto | null>(null);
    const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);

    const form = useForm<StatusUpdateFormData>({
        resolver: zodResolver(statusUpdateSchema),
        defaultValues: {
            status: verification?.status || 'Draft',
            note: '',
        },
    });

    // Check admin access
    if (session && session.user_info?.user_role !== 'Admin')
    {
        router.push('/');
        return null;
    }

    // Calculate progress percentage with safety checks - memoized
    const progressPercentage = useMemo(() =>
    {
        if (!requiredDocs.length || !verification) return 0;

        const requiredDocsUploaded = verificationDocuments.filter(d => d.is_required).length;
        const totalRequiredDocs = requiredDocs.length;

        // Cap the percentage at 100% to prevent overflow
        return Math.min(100, (requiredDocsUploaded / totalRequiredDocs) * 100);
    }, [requiredDocs.length, verification?.documents]);

    // Memoized event handlers
    const handleStatusUpdate = useCallback(async (data: StatusUpdateFormData) =>
    {
        try
        {
            await updateStatus.mutateAsync({
                pathParams: {
                    id: verificationId,
                },
                data: {
                    new_status: data.status,
                    notes: data.note,
                }
            });
            toast.success('Verification status updated successfully');
            setIsStatusUpdateOpen(false);
            form.reset();
        } catch (error)
        {
            toast.error('Failed to update verification status');
        }
    }, [updateStatus, verificationId, form]);

    // Use shared document download hook
    const { downloadDocument, isDownloading } = useDocumentDownload();

    const handleDownloadDocument = useCallback(async (document: any) =>
    {
        try
        {
            await downloadDocument(document);
        } catch (error)
        {
            // Error handling is done in the hook
            console.error('Download failed:', error);
        }
    }, [downloadDocument]);

    const handleViewDocument = useCallback((document: any) =>
    {
        setSelectedDocument(document);
        setIsDocumentViewerOpen(true);
    }, []);

    // Memoized navigation handlers
    const handleBackToList = useCallback(() =>
    {
        router.push('/admin/verification');
    }, [router]);

    const handleCloseStatusModal = useCallback(() =>
    {
        setIsStatusUpdateOpen(false);
    }, []);

    const handleOpenStatusModal = useCallback(() =>
    {
        setIsStatusUpdateOpen(true);
    }, []);



    const handleCloseDocumentViewer = useCallback(() =>
    {
        setIsDocumentViewerOpen(false);
        setSelectedDocument(null);
    }, []);

    // Memoized calculations
    const documentStats = useMemo(() =>
    {
        if (!verification) return { requiredUploaded: 0, totalUploaded: 0 };

        return {
            requiredUploaded: verificationDocuments.filter(d => d.is_required).length,
            totalUploaded: verificationDocuments.length
        };
    }, [verification?.documents]);

    const formattedDates = useMemo(() =>
    {
        if (!verification) return { applicationDate: '', lastUpdateDate: '' };

        return {
            applicationDate: new Date(verification.application_date!).toLocaleDateString(),
            lastUpdateDate: new Date(verification.last_status_change_date!).toLocaleDateString()
        };
    }, [verification?.application_date, verification?.last_status_change_date]);

    if (isLoading)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-[#202020] rounded w-1/3"></div>
                        <div className="h-32 bg-[#202020] rounded"></div>
                        <div className="h-32 bg-[#202020] rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !verification)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-[#EDECF8] mb-4">Verification Not Found</h1>
                    <p className="text-[#828288] mb-6">The verification request you're looking for doesn't exist.</p>
                    <Button onClick={handleBackToList} className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]">
                        Back to List
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        onClick={handleBackToList}
                        className="text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to List
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-[#EDECF8] flex items-center gap-3">
                            <Shield className="w-8 h-8 text-[#D78E59]" />
                            Verification Review
                        </h1>
                        <p className="text-[#828288]">Review and manage verification request</p>
                    </div>
                    <Dialog open={isStatusUpdateOpen} onOpenChange={setIsStatusUpdateOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleOpenStatusModal} className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]">
                                <Save className="w-4 h-4 mr-2" />
                                Update Status
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#171717] border-[#575757]">
                            <DialogHeader>
                                <DialogTitle className="text-[#EDECF8]">Update Verification Status</DialogTitle>
                                <DialogDescription className="text-[#828288]">
                                    Change the verification status and add a note about the change.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleStatusUpdate)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">New Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-[#171717] border-[#575757]">
                                                        <SelectItem value={'Draft'}>Draft</SelectItem>
                                                        <SelectItem value={'UnderReview'}>Under Review</SelectItem>
                                                        <SelectItem value={'Approved'}>Approved</SelectItem>
                                                        <SelectItem value={'Rejected'}>Rejected</SelectItem>
                                                        <SelectItem value={'NeedMoreInformation'}>Need More Information</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="note"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Note</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Add a note about this status change..."
                                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCloseStatusModal}
                                            className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={updateStatus.isPending}
                                            className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                        >
                                            {updateStatus.isPending ? 'Updating...' : 'Update Status'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Status Overview */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {verification.status && getStatusIcon(verification.status)}
                                        <div>
                                            <h3 className="text-xl font-semibold text-[#EDECF8]">
                                                Current Status: {verification.status}
                                            </h3>
                                            <p className="text-[#828288]">
                                                Submitted on {formattedDates.applicationDate}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge className={`${getStatusColor(verification.status!)} text-white flex items-center gap-1`}>
                                        {getStatusBadgeIcon(verification.status!)}
                                        {verification.status}
                                    </Badge>
                                </div>

                                {verificationInfo?.submitted_at && (
                                    <p className="text-sm text-[#575757]">
                                        Last updated on {formattedDates.lastUpdateDate}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Team Information */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <Building2 className="w-5 h-5" />
                                    Team Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-[#575757]">Team Name</p>
                                        <p className="text-[#EDECF8] font-medium">{verification.team?.name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#575757]">Team Type</p>
                                        <div className="flex items-center gap-2">
                                            <TeamTypeBadge
                                                teamType={verification.team?.team_type || 'Unknown'}
                                                size="md"
                                                showIcon={true}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#575757]">Team Status</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${verification.team?.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <p className="text-[#EDECF8]">{verification.team?.is_active ? 'Active' : 'Inactive'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#575757]">Team Owner</p>
                                        <p className="text-[#EDECF8] font-medium">{verification.team?.owner_user?.full_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#575757]">Owner Email</p>
                                        <p className="text-[#EDECF8]">{verification.team?.owner_user?.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#575757]">Owner Username</p>
                                        <p className="text-[#EDECF8]">{verification.team?.owner_user?.user_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#575757]">Owner Role</p>
                                        <p className="text-[#EDECF8]">{verification.team?.owner_user?.user_role || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#575757]">Member Count</p>
                                        <p className="text-[#EDECF8]">{verification.team?.member_count || 0} members</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#575757]">Team Created</p>
                                        <p className="text-[#EDECF8]">
                                            {verification.team?.created_at ? new Date(verification.team.created_at).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                {verification.team?.description && (
                                    <div className="mt-4 p-4 bg-[#202020] rounded-lg border border-[#575757]">
                                        <p className="text-sm font-semibold text-[#D78E59] mb-2">Team Description:</p>
                                        <p className="text-[#828288] text-sm">{verification.team.description}</p>
                                    </div>
                                )}

                                {/* Owner User Details */}
                                {verification.team?.owner_user && (
                                    <div className="mt-4 p-4 bg-[#202020] rounded-lg border border-[#575757]">
                                        <p className="text-sm font-semibold text-[#D78E59] mb-3">Team Owner Details:</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            {verification.team.owner_user.display_name && (
                                                <div>
                                                    <span className="text-[#575757]">Display Name: </span>
                                                    <span className="text-[#EDECF8]">{verification.team.owner_user.display_name}</span>
                                                </div>
                                            )}
                                            {verification.team.owner_user.user_status && (
                                                <div>
                                                    <span className="text-[#575757]">User Status: </span>
                                                    <span className="text-[#EDECF8]">{verification.team.owner_user.user_status}</span>
                                                </div>
                                            )}
                                            {verification.team.owner_user.timezone && (
                                                <div>
                                                    <span className="text-[#575757]">Timezone: </span>
                                                    <span className="text-[#EDECF8]">{verification.team.owner_user.timezone}</span>
                                                </div>
                                            )}
                                            {verification.team.owner_user.preferredLanguage && (
                                                <div>
                                                    <span className="text-[#575757]">Language: </span>
                                                    <span className="text-[#EDECF8]">{verification.team.owner_user.preferredLanguage}</span>
                                                </div>
                                            )}
                                            {verification.team.owner_user.business_type && (
                                                <div>
                                                    <span className="text-[#575757]">Business Type: </span>
                                                    <span className="text-[#EDECF8]">{verification.team.owner_user.business_type}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Documents */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Uploaded Documents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {verificationDocuments.length === 0 ? (
                                        <p className="text-[#828288] text-center py-8">No documents uploaded</p>
                                    ) : (
                                        verificationDocuments.map((document) => (
                                            <div
                                                key={document.id}
                                                className="flex items-center justify-between p-4 bg-[#202020] rounded-lg border border-[#575757]"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {document.mime_type?.startsWith('image/') ? (
                                                        <ImageIcon className="w-6 h-6 text-[#D78E59]" />
                                                    ) : (
                                                        <FileText className="w-6 h-6 text-[#D78E59]" />
                                                    )}
                                                    <div>
                                                        <p className="text-[#EDECF8] font-medium">
                                                            {DOCUMENT_LABELS[document.document_type!]}
                                                            {document.is_required && <span className="text-red-500 ml-1">*</span>}
                                                        </p>
                                                        <p className="text-sm text-[#828288]">
                                                            {document.file_name} • {Math.round((document.file_size || 0) / 1024)} KB
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleViewDocument(document)}
                                                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDownloadDocument(document)}
                                                        disabled={isDownloading}
                                                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Timeline */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-[#D78E59] rounded-full mt-2"></div>
                                        <div>
                                            <p className="text-[#EDECF8] font-medium">Request Submitted</p>
                                            <p className="text-sm text-[#828288]">
                                                {formattedDates.applicationDate}
                                            </p>
                                        </div>
                                    </div>
                                    {verificationInfo?.submitted_at && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-[#FFAA6C] rounded-full mt-2"></div>
                                            <div>
                                                <p className="text-[#EDECF8] font-medium">Review Started</p>
                                                <p className="text-sm text-[#828288]">
                                                    {new Date(verificationInfo?.submitted_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Document Progress */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Document Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#828288]">Required Documents</span>
                                        <span className="text-[#EDECF8]">
                                            {documentStats.requiredUploaded}/{requiredDocs.length}
                                        </span>
                                    </div>
                                    <div className="w-full bg-[#202020] rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-[#D78E59] h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${progressPercentage}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#828288]">Total Documents</span>
                                        <span className="text-[#EDECF8]">{documentStats.totalUploaded}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Document Viewer */}
                <DocumentViewer
                    verificationDocument={selectedDocument}
                    isOpen={isDocumentViewerOpen}
                    onClose={handleCloseDocumentViewer}
                    onDownload={handleDownloadDocument}
                />
            </div>
        </div>
    );
}