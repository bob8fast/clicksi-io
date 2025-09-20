// app/verification/page.tsx
'use client'

export const dynamic = 'force-dynamic';

import { DocumentDownloadButton, DocumentViewer, FileUpload, VerificationProgress, VerificationStatusBadge } from '@/components/features/verification';
import { useDocumentDownload } from '@/components/features/verification/hooks';
import { TeamTypeBadge } from '@/components/ui/badges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useVerificationHooks } from '@/hooks/api';
import { getTimeAgo } from '@/lib/verification-utils';
import
    {
        TeamType,
        VerificationDocumentDto,
        VerificationDocumentType,
        VerificationFileProperties
    } from '@/types';
import { getOptionalDocumentTypesMemoized, getRequiredDocumentTypesMemoized } from '@/types/app/verification';
import
    {
        AlertCircle,
        Building2,
        CheckCircle,
        Clock,
        FileUp,
        Lock,
        PlusCircle,
        RefreshCw,
        Save,
        Send,
        Shield,
        Star
    } from 'lucide-react';
// import { useSession } from 'next-auth/react'; // Removed auth
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface DocumentUpload
{
    type: VerificationDocumentType;
    file: File;
}

export default function EnhancedVerificationPage()
{
    // Mock session data since auth is removed
    const _mockSession = { user_info: { user_id: 'mock-user-id' } };
    const router = useRouter();

    // Use the new verification hooks
    const verificationHooks = useVerificationHooks();
    const { data: existingVerification, isLoading: isLoadingVerification, error: verificationError } = verificationHooks.getMyApplication();

    // On first access, take team_type from session, further if application was created, we can load it from team
    const teamType = existingVerification ? existingVerification.team?.team_type as TeamType : session?.user_info?.business_type as TeamType;
    const userRole = session?.user_info?.user_role;

    // Get required and optional documents based on team type  
    const requiredDocs = getRequiredDocumentTypesMemoized(teamType || 'Unknown');
    const optionalDocs = getOptionalDocumentTypesMemoized(teamType || 'Unknown');

    const { downloadDocument, isDownloading } = useDocumentDownload();

    // Use hooks from the verification hook group
    const createVerification = verificationHooks.createApplication;
    const addDocument = verificationHooks.addDocument;
    const submitVerification = verificationHooks.submitApplication;
    const updateVerification = verificationHooks.updateApplication;
    const deleteDocument = verificationHooks.deleteDocument;

    const [documentUploads, setDocumentUploads] = useState<DocumentUpload[]>([]);
    const [removedDocumentIds, setRemovedDocumentIds] = useState<string[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<VerificationDocumentDto | null>(null);
    const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
    const [userNotes, setUserNotes] = useState<string>('');

    // Check if modifications are allowed
    const canModify = !existingVerification ||
        existingVerification.status === 'Draft' ||
        existingVerification.status === 'NeedMoreInformation';

    // Check if application is in a final state
    const isFinalized = existingVerification?.status === 'Approved' ||
        existingVerification?.status === 'Rejected';

    // Check if application is under review
    const isUnderReview = existingVerification?.status === 'UnderReview';

    // Check if any processing operations are in progress
    const isProcessing = createVerification.isPending ||
        addDocument.isPending ||
        submitVerification.isPending ||
        updateVerification.isPending ||
        deleteDocument.isPending ||
        isDownloading;

    // Memoized checks for performance
    const hasChanges = useMemo(() =>
    {
        return documentUploads.length > 0 ||
            removedDocumentIds.length > 0 ||
            (existingVerification?.notes !== userNotes && userNotes.trim() !== '');
    }, [documentUploads.length, removedDocumentIds.length, existingVerification?.notes, userNotes]);

    const hasRequiredDocuments = useMemo(() =>
    {
        if (!existingVerification)
        {
            // For new applications, check uploaded files
            return requiredDocs.every(docType =>
                documentUploads.some(upload => upload.type === docType)
            );
        }

        // For existing applications, check current documents minus removed ones plus new uploads
        const currentDocs = (existingVerification.documents || [])
            .filter(doc => !removedDocumentIds.includes(doc.id!))
            .map(doc => doc.document_type);

        const newDocs = documentUploads.map(upload => upload.type);
        const allDocs = [...new Set([...currentDocs, ...newDocs])];

        return requiredDocs.every(docType => allDocs.includes(docType));
    }, [existingVerification, documentUploads, removedDocumentIds, requiredDocs]);

    // Redirect Admin or Consumer users to home page
    useEffect(() =>
    {
        if (userRole === 'Admin' || userRole === 'Consumer')
        {
            router.push('/');
            toast.info('Verification is not required for your account type.');
            return;
        }
    }, [userRole, router]);

    // Initialize notes from existing verification
    useEffect(() =>
    {
        if (existingVerification?.notes && !userNotes)
        {
            setUserNotes(existingVerification.notes);
        }
    }, [existingVerification, userNotes]);

    // Reset state when verification changes or component mounts
    useEffect(() =>
    {
        // Clear removed documents list when verification changes
        // This prevents stale document IDs from previous sessions
        setRemovedDocumentIds([]);
        setDocumentUploads([]);
    }, [existingVerification?.id]);

    // Redirect if user is already verified
    useEffect(() =>
    {
        if (existingVerification?.status === 'Approved')
        {
            router.push('/');
            toast.success('You are already verified!');
        }
    }, [existingVerification, router]);

    const handleFileSelect = useCallback((documentType: VerificationDocumentType, file: File) =>
    {
        if (!canModify) return;

        setDocumentUploads(prev => [
            ...prev.filter(upload => upload.type !== documentType),
            { type: documentType, file }
        ]);
    }, [canModify]);

    const handleFileRemove = useCallback((documentType: VerificationDocumentType, existingDocumentId?: string) =>
    {
        if (!canModify) return;

        // Remove any uploaded file for this document type
        setDocumentUploads(prev => prev.filter(upload => upload.type !== documentType));

        // If there's an existing document ID, mark it for deletion
        if (existingDocumentId)
        {
            setRemovedDocumentIds(prev => [...prev.filter(id => id !== existingDocumentId), existingDocumentId]);
        }
    }, [canModify]);

    const handleDocumentView = useCallback((document: VerificationDocumentDto) =>
    {
        setSelectedDocument(document);
        setIsDocumentViewerOpen(true);
    }, []);

    const handleDocumentDownload = useCallback(async (document: VerificationDocumentDto) =>
    {
        try
        {
            await downloadDocument(document);
        } catch (error)
        {
            console.error('Download failed:', error);
        }
    }, [downloadDocument]);

    const _renderDocumentDownloadButton = useCallback((document: VerificationDocumentDto) => (
        <DocumentDownloadButton
            document={document}
            variant="outline"
            size="sm"
            className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
        />
    ), []);

    const handleCreateApplication = async () =>
    {
        // Validate required documents for creation
        if (!hasRequiredDocuments)
        {
            toast.error(`Please upload all required documents before creating the application`);
            return;
        }

        try
        {
            const verification_file_properties: VerificationFileProperties[] = [];

            let index = 0;
            for (const upload of documentUploads)
            {
                verification_file_properties.push({
                    document_type: upload.type,
                    is_required: requiredDocs.includes(upload.type),
                    document_file_index: index,
                    document_name: upload.file.name

                });
                index++;
            }

            await createVerification.mutateAsync({
                data: {
                    documents: documentUploads.map(x => x.file),
                    json: {

                        verification_file_properties: verification_file_properties,
                        notes: userNotes.trim() || 'Initial verification submission'
                    }
                }
            });

            // Clear uploaded documents after successful creation
            setDocumentUploads([]);
            toast.success('Application created successfully!');
        } catch (error)
        {
            console.error('Create application failed:', error);
        }
    };

    const handleSubmitApplication = async () =>
    {
        if (!existingVerification) return;

        try
        {
            // Step 1: Delete any removed documents first
            if (removedDocumentIds.length > 0)
            {
                for (const documentId of removedDocumentIds)
                {
                    await deleteDocument.mutateAsync({
                        pathParams: {
                            id: existingVerification.id,
                            documentId: documentId
                        }
                    });
                }
            }

            // Step 2: Add any new documents
            if (documentUploads.length > 0)
            {
                let fileIndex = 0;

                for (const upload of documentUploads)
                {
                    await addDocument.mutateAsync({
                        pathParams: {
                            id: existingVerification.id,
                        },
                        data: {

                            document: upload.file,
                            json: {
                                document_type: upload.type,
                                document_name: upload.file.name,
                                document_file_index: fileIndex,
                                is_required: requiredDocs.includes(upload.type)
                            }
                        }
                    });

                    fileIndex++;
                }
            }

            // Step 3: Submit the application for review
            await submitVerification.mutateAsync({
                pathParams: {
                    id: existingVerification.id,
                },
                data: {
                    notes: userNotes?.trim()
                }
            });

            // Clear state after successful submission
            setDocumentUploads([]);
            setRemovedDocumentIds([]);

            toast.success('Application submitted for review!');
        } catch (error)
        {
            console.error('Submit application failed:', error);
        }
    };

    const handleUpdateApplication = async () =>
    {
        if (!existingVerification) return;

        try
        {
            // Step 1: Delete any removed documents first
            if (removedDocumentIds.length > 0)
            {
                for (const documentId of removedDocumentIds)
                {
                    await deleteDocument.mutateAsync({
                        pathParams: {
                            id: existingVerification.id,
                            documentId: documentId
                        }
                    });
                }
            }

            // Step 2: Add any new documents
            if (documentUploads.length > 0)
            {
                let fileIndex = 0;

                for (const upload of documentUploads)
                {
                    await addDocument.mutateAsync({
                        pathParams: {
                            id: existingVerification.id,
                        },
                        data: {
                            document: upload.file,
                            json: {
                                document_type: upload.type,
                                document_name: upload.file.name,
                                document_file_index: fileIndex,
                                is_required: requiredDocs.includes(upload.type)
                            }
                        }
                    });

                    fileIndex++;
                }
            }

            // Step 3: Update the application with new notes
            await updateVerification.mutateAsync({
                pathParams: {
                    id: existingVerification.id,
                },
                data: {
                    notes: userNotes?.trim()
                }
            });

            // Clear state after successful update
            setDocumentUploads([]);
            setRemovedDocumentIds([]);

            toast.success('Application updated successfully!');
        } catch (error)
        {
            console.error('Update application failed:', error);
        }
    };

    // Get account type display information
    const getAccountTypeInfo = () =>
    {
        if (userRole === 'Creator')
        {
            return {
                icon: Star,
                title: 'Content Creator Account',
                description: 'Influencers, bloggers, and content creators who collaborate with brands'
            };
        } else if (userRole === 'BusinessUser')
        {
            return {
                icon: Building2,
                title: 'Business Account',
                description: 'Brands, retailers, and companies looking to collaborate with creators'
            };
        }
        return null;
    };

    // Get the appropriate action buttons configuration
    const getActionButtons = () =>
    {
        if (!existingVerification)
        {
            // No application exists - show Create Application button
            return [{
                key: 'create',
                text: 'Create Application',
                icon: PlusCircle,
                onClick: handleCreateApplication,
                disabled: !hasRequiredDocuments || isProcessing,
                variant: 'default' as const,
                loadingText: 'Creating...'
            }];
        }

        const buttons = [];

        if (existingVerification.status === 'Draft')
        {
            // Draft status - show both Update and Submit buttons
            if (hasChanges)
            {
                buttons.push({
                    key: 'update',
                    text: 'Update Application',
                    icon: Save,
                    onClick: handleUpdateApplication,
                    disabled: isProcessing,
                    variant: 'outline' as const,
                    loadingText: 'Updating...'
                });
            }

            buttons.push({
                key: 'submit',
                text: 'Submit Application',
                icon: Send,
                onClick: handleSubmitApplication,
                disabled: !hasRequiredDocuments || isProcessing,
                variant: 'default' as const,
                loadingText: 'Submitting...'
            });
        }
        else if (existingVerification.status === 'NeedMoreInformation')
        {
            // Need more info - show Update and Resubmit buttons
            if (hasChanges)
            {
                buttons.push({
                    key: 'update',
                    text: 'Update Application',
                    icon: Save,
                    onClick: handleUpdateApplication,
                    disabled: isProcessing,
                    variant: 'outline' as const,
                    loadingText: 'Updating...'
                });
            }

            buttons.push({
                key: 'resubmit',
                text: 'Resubmit Application',
                icon: RefreshCw,
                onClick: handleSubmitApplication,
                disabled: !hasRequiredDocuments || isProcessing,
                variant: 'default' as const,
                loadingText: 'Resubmitting...'
            });
        }

        return buttons;
    };

    if (!session)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-[#EDECF8] mb-4">Access Denied</h1>
                    <p className="text-[#828288] mb-6">You must be logged in to access the verification page.</p>
                    <Button onClick={() => router.push('/sign-in')} className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]">
                        Sign In
                    </Button>
                </div>
            </div>
        );
    }

    if (isLoadingVerification)
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

    if (verificationError)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-[#EDECF8] mb-4">Error Loading Verification</h1>
                    <p className="text-[#828288] mb-6">
                        {verificationError?.message || 'Failed to load verification information'}
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    const accountTypeInfo = getAccountTypeInfo();
    const actionButtons = getActionButtons();

    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#EDECF8] mb-4 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-[#D78E59]" />
                        Account Verification
                    </h1>
                    <p className="text-[#828288] text-lg">
                        Complete your verification to access all platform features and build trust with partners.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Status Card (if existing verification) */}
                        {existingVerification && (
                            <Card className="bg-[#090909] border-[#202020] mb-8">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-3">
                                                    {existingVerification.status === 'Draft' && <Clock className="w-6 h-6 text-[#FFAA6C]" />}
                                                    {existingVerification.status === 'UnderReview' && <AlertCircle className="w-6 h-6 text-[#D78E59]" />}
                                                    {existingVerification.status === 'NeedMoreInformation' && <AlertCircle className="w-6 h-6 text-[#FFAA6C]" />}
                                                    {existingVerification.status === 'Rejected' && <AlertCircle className="w-6 h-6 text-red-500" />}
                                                    {existingVerification.status === 'Approved' && <CheckCircle className="w-6 h-6 text-green-500" />}

                                                    <div>
                                                        <h3 className="text-lg font-semibold text-[#EDECF8]">
                                                            {existingVerification.status === 'Draft' && 'Verification Draft'}
                                                            {existingVerification.status === 'UnderReview' && 'Under Review'}
                                                            {existingVerification.status === 'NeedMoreInformation' && 'Additional Information Required'}
                                                            {existingVerification.status === 'Rejected' && 'Verification Rejected'}
                                                            {existingVerification.status === 'Approved' && 'Verification Approved'}
                                                        </h3>
                                                        <p className="text-[#828288]">
                                                            Submitted {getTimeAgo(existingVerification.application_date!)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <VerificationStatusBadge status={existingVerification.status!} size="sm" />
                                                    <TeamTypeBadge
                                                        teamType={existingVerification.team?.team_type || 'Unknown'}
                                                        size="sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status-specific messages */}
                                    {isUnderReview && (
                                        <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                                            <p className="text-sm text-blue-300">
                                                Your application is currently under review. We&apos;ll notify you once the review is complete.
                                            </p>
                                        </div>
                                    )}

                                    {isFinalized && (
                                        <div className={`mt-4 p-4 rounded-lg border ${existingVerification.status === 'Approved'
                                            ? 'bg-green-500/10 border-green-500/30'
                                            : 'bg-red-500/10 border-red-500/30'
                                            }`}>
                                            <p className={`text-sm ${existingVerification.status === 'Approved'
                                                ? 'text-green-300'
                                                : 'text-red-300'
                                                }`}>
                                                {existingVerification.status === 'Approved'
                                                    ? 'Congratulations! Your account has been successfully verified.'
                                                    : 'Your verification application has been rejected. Please contact support for more information.'
                                                }
                                            </p>
                                        </div>
                                    )}

                                    {existingVerification.status === 'NeedMoreInformation' && (
                                        <div className="mt-4 p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
                                            <p className="text-sm text-orange-300">
                                                Additional information is required. Please review the feedback below and upload any missing documents.
                                            </p>
                                        </div>
                                    )}

                                    {existingVerification.notes && (
                                        <div className="mt-4 p-4 bg-[#202020] rounded-lg border border-[#575757]">
                                            <h4 className="text-sm font-semibold text-[#D78E59] mb-2">Notes:</h4>
                                            <p className="text-sm text-[#828288]">{existingVerification.notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Account Type Display (Read-only) */}
                        {accountTypeInfo && (
                            <Card className="bg-[#090909] border-[#202020] mb-8">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8]">Account Type</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-6 border-2 border-[#D78E59] bg-[#D78E59]/10 rounded-lg">
                                        <div className="flex items-center gap-3 mb-3">
                                            <accountTypeInfo.icon className="w-6 h-6 text-[#D78E59]" />
                                            <h3 className="text-lg font-semibold text-[#EDECF8]">{accountTypeInfo.title}</h3>
                                        </div>
                                        <p className="text-sm text-[#828288]">
                                            {accountTypeInfo.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Document Upload */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <FileUp className="w-5 h-5" />
                                    Document Upload
                                    {!canModify && (
                                        <span className="text-xs bg-[#575757] text-[#EDECF8] px-2 py-1 rounded flex items-center gap-1">
                                            <Lock className="w-3 h-3" />
                                            {isFinalized ? 'Finalized' : 'Read Only'}
                                        </span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Required Documents */}
                                <div>
                                    <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Required Documents</h3>
                                    <div className="space-y-4">
                                        {requiredDocs.map((docType) =>
                                        {
                                            const existingDoc = existingVerification?.documents?.find(d => d.document_type === docType);
                                            const isDocumentRemoved = existingDoc && removedDocumentIds.includes(existingDoc.id!);

                                            return (
                                                <FileUpload
                                                    key={docType}
                                                    documentType={docType}
                                                    isRequired={true}
                                                    existingDocument={isDocumentRemoved ? undefined : existingDoc}
                                                    uploadedFile={documentUploads.find(d => d.type === docType)?.file}
                                                    onFileSelect={(file) => handleFileSelect(docType, file)}
                                                    onFileRemove={() => handleFileRemove(docType, existingDoc?.id)}
                                                    onDocumentView={handleDocumentView}
                                                    onDocumentDownload={handleDocumentDownload}
                                                    disabled={!canModify}
                                                    isProcessing={isProcessing}
                                                    isStatusReadonly={!canModify}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Optional Documents */}
                                {optionalDocs.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#EDECF8] mb-4">Optional Documents</h3>
                                        <div className="space-y-4">
                                            {optionalDocs.map((docType) =>
                                            {
                                                const existingDoc = existingVerification?.documents?.find(d => d.document_type === docType);
                                                const isDocumentRemoved = existingDoc && removedDocumentIds.includes(existingDoc.id!);

                                                return (
                                                    <FileUpload
                                                        key={docType}
                                                        documentType={docType}
                                                        isRequired={false}
                                                        existingDocument={isDocumentRemoved ? undefined : existingDoc}
                                                        uploadedFile={documentUploads.find(d => d.type === docType)?.file}
                                                        onFileSelect={(file) => handleFileSelect(docType, file)}
                                                        onFileRemove={() => handleFileRemove(docType, existingDoc?.id)}
                                                        onDocumentView={handleDocumentView}
                                                        onDocumentDownload={handleDocumentDownload}
                                                        disabled={!canModify}
                                                        isProcessing={isProcessing}
                                                        isStatusReadonly={!canModify}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Notes Section */}
                        <Card className="bg-[#090909] border-[#202020] mt-8">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    Additional Notes (Optional)
                                    {!canModify && (
                                        <span className="text-xs bg-[#575757] text-[#EDECF8] px-2 py-1 rounded flex items-center gap-1">
                                            <Lock className="w-3 h-3" />
                                            {isFinalized ? 'Finalized' : 'Read Only'}
                                        </span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <p className="text-sm text-[#828288]">
                                        {canModify
                                            ? "Provide any additional information that might help with your verification process."
                                            : "These notes cannot be modified in the current verification status."
                                        }
                                    </p>
                                    <Textarea
                                        placeholder={canModify
                                            ? "Enter any additional notes, comments, or information about your verification request..."
                                            : "No additional notes can be added in current status"
                                        }
                                        value={userNotes}
                                        onChange={(e) => setUserNotes(e.target.value)}
                                        className={`bg-[#202020] border-[#575757] text-[#EDECF8] placeholder-[#575757] min-h-[100px] resize-none focus:border-[#D78E59] focus:ring-1 focus:ring-[#D78E59] ${!canModify ? 'opacity-60 cursor-not-allowed' : ''}`}
                                        maxLength={1000}
                                        disabled={!canModify || isProcessing}
                                    />
                                    <div className="flex justify-between items-center text-xs text-[#575757]">
                                        <span>
                                            {canModify
                                                ? "This information will be visible to the verification team"
                                                : "Notes are read-only due to current verification status"
                                            }
                                        </span>
                                        <span>{userNotes.length}/1000</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-8">
                            {actionButtons.map((button) => (
                                <Button
                                    key={button.key}
                                    onClick={button.onClick}
                                    variant={button.variant}
                                    className={button.variant === 'default'
                                        ? "bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                        : "border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                    }
                                    disabled={button.disabled}
                                >
                                    <button.icon className="w-4 h-4 mr-2" />
                                    {button.disabled && isProcessing
                                        ? button.loadingText
                                        : button.text
                                    }
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                onClick={() => router.push('/dashboard')}
                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                            >
                                {isFinalized ? 'Back to Dashboard' : 'Cancel'}
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Progress Card */}
                        {existingVerification && (
                            <VerificationProgress
                                verification={existingVerification}
                                totalOptionalDocs={optionalDocs.length}
                                totalRequiredDocs={requiredDocs.length}
                            />
                        )}

                        {/* Help Card */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] text-lg">Need Help?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm text-[#828288] space-y-2">
                                    <p>
                                        • Verification typically takes 2-3 business days
                                    </p>
                                    <p>
                                        • All documents must be clear and readable
                                    </p>
                                    <p>
                                        • For images with transparency, ensure content is visible
                                    </p>
                                    <p>
                                        • Contact support if you need assistance
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                >
                                    Contact Support
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Document Viewer */}
                <DocumentViewer
                    verificationDocument={selectedDocument}
                    isOpen={isDocumentViewerOpen}
                    onClose={() => setIsDocumentViewerOpen(false)}
                    onDownload={handleDocumentDownload}
                />
            </div>
        </div>
    );
}