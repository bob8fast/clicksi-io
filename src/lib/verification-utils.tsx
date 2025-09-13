// lib/verification-utils.ts
import { TeamType, UserRole, VerificationStatus } from '@/types';
import
{
    AlertCircle,
    CheckCircle,
    Clock,
    Shield,
    ShoppingCart,
    Store,
    User,
    Users,
    XCircle
} from 'lucide-react';

export class VerificationHelpers
{
    // Format dates consistently
    static formatDate(dateString: string): string
    {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    }

    // Format relative time (e.g., "2 hours ago")
    static formatRelativeTime(dateString: string): string
    {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;

        return this.formatDate(dateString);
    }

    // Get next possible status transitions
    static getAvailableStatusTransitions(currentStatus: VerificationStatus): VerificationStatus[]
    {
        switch (currentStatus)
        {
            case 'Draft':
                return ['UnderReview'];

            case 'UnderReview':
                return [
                    'Approved',
                    'Rejected',
                    'NeedMoreInformation'
                ];

            case 'NeedMoreInformation':
                return ['UnderReview', 'Rejected'];

            default:
                return [];
        }
    }
}


export const getTimeAgo = (dateString: string): string =>
{
    return VerificationHelpers.formatRelativeTime(dateString);
};

// Import consolidated utilities  
import { validateVerificationFile } from './file-utils';

export const isValidFileType = (file: File): boolean => {
    const validation = validateVerificationFile(file);
    return !validation.errors.includes('File type not supported');
};

export const isValidFileSize = (file: File, maxSizeBytes: number = 10 * 1024 * 1024): boolean => {
    return file.size <= maxSizeBytes;
};

export const canTransitionTo = (currentStatus: VerificationStatus, newStatus: VerificationStatus): boolean =>
{
    switch (currentStatus)
    {
        case 'Draft':
            return newStatus === 'UnderReview';

        case 'UnderReview':
            return [
                'Approved',
                'Rejected',
                'NeedMoreInformation'
            ].includes(newStatus);

        case 'NeedMoreInformation':
            return [
                'UnderReview',
                'Rejected'
            ].includes(newStatus);

        case 'Approved':
        case 'Rejected':
            return false; // Final states

        default:
            return false;
    }
};

// Additional verification-specific utility functions
export const getStatusPriority = (status: VerificationStatus): number =>
{
    switch (status)
    {
        case 'UnderReview': return 1;
        case 'NeedMoreInformation': return 2;
        case 'Draft': return 3;
        case 'Approved': return 4;
        case 'Rejected': return 5;
        default: return 6;
    }
};
export const getStatusDescription = (status: VerificationStatus): string =>
{
    switch (status)
    {
        case 'Draft':
            return 'Application is being prepared and can be modified';
        case 'UnderReview':
            return 'Application is being reviewed by our team';
        case 'NeedMoreInformation':
            return 'Additional information or documents are required';
        case 'Approved':
            return 'Application has been approved and account is verified';
        case 'Rejected':
            return 'Application has been rejected';
        default:
            return 'Unknown status';
    }
};

// Document validation utilities
// Use consolidated validation function
export const validateUploadedFile = validateVerificationFile;

// Progress calculation utilities
export const calculateVerificationProgress = (
    totalRequiredDocs: number,
    uploadedRequiredDocs: number,
    status: VerificationStatus
): number =>
{
    let progress = 0;

    // Step 1: Document upload (60% of progress)
    if (totalRequiredDocs > 0)
    {
        progress += (uploadedRequiredDocs / totalRequiredDocs) * 60;
    }

    // Step 2: Submission (20% of progress)
    if (status !== 'Draft')
    {
        progress += 20;
    }

    // Step 3: Completion (20% of progress)
    if (status === 'Approved')
    {
        progress += 20;
    }

    return Math.min(Math.round(progress), 100);
};

// Time and date utilities specific to verification
export const formatVerificationDate = (dateString: string): string =>
{
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    }).format(date);
};

export const getDaysSinceSubmission = (submissionDate: string): number =>
{
    const submission = new Date(submissionDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - submission.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Document type utilities
export const groupDocumentsByType = (documents: any[]) =>
{
    return documents.reduce((groups, doc) =>
    {
        const type = doc.document_type;
        if (!groups[type])
        {
            groups[type] = [];
        }
        groups[type].push(doc);
        return groups;
    }, {} as Record<string, any[]>);
};

// Error handling utilities
export const getVerificationErrorMessage = (error: any): string =>
{
    if (typeof error === 'string') return error;

    if (error?.message) return error.message;

    if (error?.response?.data?.message) return error.response.data.message;

    if (error?.response?.data?.error) return error.response.data.error;

    return 'An unexpected error occurred';
};

// Status transition utilities
export const canUserModifyVerification = (status: VerificationStatus): boolean =>
{
    return status === 'Draft' || status === 'NeedMoreInformation';
};

export const isVerificationFinal = (status: VerificationStatus): boolean =>
{
    return status === 'Approved' || status === 'Rejected';
};

export const getNextStepMessage = (status: VerificationStatus, hasRequiredDocs: boolean): string =>
{
    switch (status)
    {
        case 'Draft':
            if (!hasRequiredDocs)
            {
                return 'Upload all required documents to proceed';
            }
            return 'Ready to submit for review';

        case 'UnderReview':
            return 'Your application is under review. We\'ll notify you of any updates.';

        case 'NeedMoreInformation':
            return 'Please provide the additional information requested and resubmit.';

        case 'Approved':
            return 'Congratulations! Your account is now verified.';

        case 'Rejected':
            return 'Your application was rejected. Contact support for more information.';

        default:
            return 'Status unknown';
    }
};






/**
 * Get status icon for verification status - large size (w-5 h-5)
 * @param status - Verification status
 * @returns JSX element with status icon
 */
export const getStatusIcon = (status: VerificationStatus): React.ReactElement =>
{
    switch (status)
    {
        case 'Draft':
            return <Clock className="w-5 h-5 text-[#FFAA6C]" />;
        case 'UnderReview':
            return <AlertCircle className="w-5 h-5 text-[#D78E59]" />;
        case 'Approved':
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'Rejected':
            return <XCircle className="w-5 h-5 text-red-500" />;
        case 'NeedMoreInformation':
            return <AlertCircle className="w-5 h-5 text-[#FFAA6C]" />;
        default:
            return <Clock className="w-5 h-5 text-[#FFAA6C]" />;
    }
};

/**
 * Get status badge color for verification status
 * @param status - Verification status
 * @returns CSS class string for badge background
 */
export const getStatusColor = (status: VerificationStatus): string =>
{
    switch (status)
    {
        case 'Draft':
            return 'bg-gray-500';
        case 'UnderReview':
            return 'bg-blue-500';
        case 'Approved':
            return 'bg-green-500';
        case 'Rejected':
            return 'bg-red-500';
        case 'NeedMoreInformation':
            return 'bg-orange-500';
        default:
            return 'bg-gray-500';
    }
};

/**
 * Get status icon for filters - small size (w-3 h-3) with colors
 * @param status - Verification status
 * @returns JSX element with small colored status icon
 */
export const getStatusFilterIcon = (status: VerificationStatus): React.ReactElement =>
{
    switch (status)
    {
        case 'Draft':
            return <Clock className="w-3 h-3 text-[#FFAA6C]" />;
        case 'UnderReview':
            return <AlertCircle className="w-3 h-3 text-[#D78E59]" />;
        case 'Approved':
            return <CheckCircle className="w-3 h-3 text-green-500" />;
        case 'Rejected':
            return <XCircle className="w-3 h-3 text-red-500" />;
        case 'NeedMoreInformation':
            return <AlertCircle className="w-3 h-3 text-[#FFAA6C]" />;
        default:
            return <Clock className="w-3 h-3 text-[#FFAA6C]" />;
    }
};

/**
 * Get status icon for badge - small size (w-3 h-3)
 * @param status - Verification status
 * @returns JSX element with small status icon
 */
export const getStatusBadgeIcon = (status: VerificationStatus): React.ReactElement =>
{
    switch (status)
    {
        case 'Draft':
            return <Clock className="w-3 h-3" />;
        case 'UnderReview':
            return <AlertCircle className="w-3 h-3" />;
        case 'Approved':
            return <CheckCircle className="w-3 h-3" />;
        case 'Rejected':
            return <XCircle className="w-3 h-3" />;
        case 'NeedMoreInformation':
            return <AlertCircle className="w-3 h-3" />;
        default:
            return <Clock className="w-3 h-3" />;
    }
};

/**
 * Get role icon for user role - small size (w-4 h-4)
 * @param role - User role
 * @returns JSX element with role icon
 */
export const getRoleIcon = (role: UserRole): React.ReactElement =>
{
    switch (role)
    {
        case 'Admin':
            return <Shield className="h-4 w-4" />;
        case 'Creator':
            return <User className="h-4 w-4" />;
        case 'BusinessUser':
            return <Users className="h-4 w-4" />;
        default:
            return <User className="h-4 w-4" />;
    }
};

/**
 * Get role badge color classes for user role
 * @param role - User role
 * @returns CSS class string for role badge styling
 */
export const getRoleBadgeColor = (role: UserRole): string =>
{
    switch (role)
    {
        case 'Admin':
            return 'bg-red-500/20 text-red-400 border-red-500/30';
        case 'Creator':
            return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'BusinessUser':
            return 'bg-green-500/20 text-green-400 border-green-500/30';
        default:
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
};

/**
 * Get verification badge color classes for verification status
 * @param status - Verification status
 * @returns CSS class string for verification badge styling
 */
export const getVerificationBadgeColor = (status: VerificationStatus): string =>
{
    switch (status)
    {
        case 'Approved':
            return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'UnderReview':
            return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'Rejected':
            return 'bg-red-500/20 text-red-400 border-red-500/30';
        default:
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
};

/**
 * Get business type icon - small size (w-4 h-4)
 * @param teamType - Business type
 * @returns JSX element with business type icon
 */
export const getTeamTypeIcon = (teamType?: TeamType | null): React.ReactElement =>
{
    switch (teamType)
    {
        case "Brand":
            return <Store className="h-4 w-4" />;
        case "Retailer":
            return <ShoppingCart className="h-4 w-4" />;
        default:
            return <User className="h-4 w-4" />;;
    }
};

/**
 * Get business type badge styling classes
 * @param teamType - Business type (Brand or Retailer)
 * @returns CSS class string for badge styling
 */
export const getTeamTypeBadgeStyles = (teamType?: TeamType | null): string =>
{
    switch (teamType)
    {
        case "Brand":
            return "border-[#D78E59] text-[#D78E59] bg-[#D78E59]/10";
        case "Retailer":
            return "border-[#FFAA6C] text-[#FFAA6C] bg-[#FFAA6C]/10";
        case 'Creator':
            return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        default:
            return "border-[#575757] text-[#575757]";
    }
};

/**
 * Transform user role value to display label
 * @param role - User role value
 * @returns Human-readable role label
 */
export const getUserRoleDisplayLabel = (role: UserRole): string =>
{
    switch (role)
    {
        case 'BusinessUser':
            return 'Business User';
        case 'Creator':
            return 'Creator';
        case 'Admin':
            return 'Admin';
        case 'Consumer':
            return 'Consumer';
        default:
            return role;
    }
};

/**
 * Status options for dropdown/selection components
 */
export const statusOptions: Array<{ value: VerificationStatus; label: string; color: string }> = [
    { value: 'Draft', label: 'Draft', color: 'bg-gray-500' },
    { value: 'UnderReview', label: 'Under Review', color: 'bg-blue-500' },
    { value: 'Approved', label: 'Approved', color: 'bg-green-500' },
    { value: 'Rejected', label: 'Rejected', color: 'bg-red-500' },
    { value: 'NeedMoreInformation', label: 'Additional Info Required', color: 'bg-orange-500' },
];

/**
 * Get human-readable status label
 * @param status - Verification status
 * @returns Human-readable status label
 */
export const getStatusLabel = (status: VerificationStatus): string =>
{
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption?.label || status;
};

/**
 * Format verification progress percentage with safety checks
 * @param requiredDocsUploaded - Number of required documents uploaded
 * @param totalRequiredDocs - Total number of required documents
 * @returns Progress percentage capped at 100%
 */
export const calculateProgressPercentage = (
    requiredDocsUploaded: number,
    totalRequiredDocs: number
): number =>
{
    if (totalRequiredDocs === 0) return 0;
    return Math.min(100, (requiredDocsUploaded / totalRequiredDocs) * 100);
};