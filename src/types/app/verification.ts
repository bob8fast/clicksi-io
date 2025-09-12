// types/verification.ts
import { VerificationDocumentType } from '@/gen/api/types';
import { TeamType, VerificationStatus, VerificationStatusHistoryDto } from '@/types';
import memoizee from 'memoizee';
import { z } from 'zod';
import { VerificationStatusEnum } from './generated-enums';

// Form validation schemas using zod
export const CreateVerificationRequestSchema = z.object({
    notes: z.string().optional(),
    documents: z.array(z.instanceof(File)).min(1, 'At least one document is required'),
    document_types: z.array(z.nativeEnum(VerificationDocumentType))
});

export const UpdateVerificationStatusRequestSchema = z.object({
    new_status: VerificationStatusEnum,
    notes: z.string().optional()
});

export const AddDocumentRequestSchema = z.object({
    document_type: z.nativeEnum(VerificationDocumentType),
    file: z.instanceof(File),
    is_required: z.boolean().default(true)
});

export const VerificationFiltersSchema = z.object({
    page: z.number().min(1).default(1),
    page_size: z.number().min(1).max(100).default(10),
    search: z.string().optional(),
    status: VerificationStatusEnum.optional(),
    team_type: z.enum(["Creator", "Brand", "Retailer", "Unknown"]).optional(),
    submitted_date_from: z.string().optional(),
    submitted_date_to: z.string().optional(),
    sort_by: z.enum(['application_date', 'last_status_change_date', 'status', 'team_type']).default('application_date'),
    sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// Type exports for better intellisense
export type CreateVerificationRequestType = z.infer<typeof CreateVerificationRequestSchema>;
export type UpdateVerificationStatusRequestType = z.infer<typeof UpdateVerificationStatusRequestSchema>;
export type AddDocumentRequestType = z.infer<typeof AddDocumentRequestSchema>;
export type VerificationFiltersType = z.infer<typeof VerificationFiltersSchema>;

export const DOCUMENT_REQUIREMENTS: Record<TeamType, {
    required: VerificationDocumentType[];
    optional: VerificationDocumentType[];
}> = {
    ["Creator"]: {
        required: [
            'GovernmentId',
            'PortfolioScreenshot',
            'SocialMediaScreenshot'
        ],
        optional: [
            'ProofOfAddress',
            'AudienceMetrics',
            'PressCoverage',
            'AnalyticsDashboard',
            'ProfessionalCertification'
        ]
    },
    ["Brand"]: {
        required: [
            'BusinessLicense',
            'TaxCertificate',
            'ProofOfAddress'
        ],
        optional: [
            'BankStatement',
            'ProductCatalog',
            'BrandAuthorization',
            'ProfessionalCertification'
        ]
    },
    ["Retailer"]: {
        required: [
            'BusinessLicense',
            'TaxCertificate',
            'ProofOfAddress'
        ],
        optional: [
            'BankStatement',
            'ProductCatalog',
            'ProfessionalCertification'
        ]
    },
    ["Unknown"]: {
        required: [],
        optional: []
    }
};

// Helper function to get required documents based on team type
export function getRequiredDocumentTypes(teamType?: TeamType | null): VerificationDocumentType[]
{
    if (!teamType)
    {
        return [];
    }

    return DOCUMENT_REQUIREMENTS[teamType]?.required || [];
}

export const getRequiredDocumentTypesMemoized = memoizee(getRequiredDocumentTypes);

export function getOptionalDocumentTypes(teamType?: TeamType | null): VerificationDocumentType[]
{
    if (!teamType)
    {
        return [];
    }

    return DOCUMENT_REQUIREMENTS[teamType]?.optional || [];
}

export const getOptionalDocumentTypesMemoized = memoizee(getOptionalDocumentTypes);

// Document type display names
export const DOCUMENT_LABELS: Record<VerificationDocumentType, string> = {
    ['GovernmentId']: 'Government ID',
    ['BusinessLicense']: 'Business License',
    ['TaxCertificate']: 'Tax Certificate',
    ['PortfolioScreenshot']: 'Portfolio Screenshots',
    ['SocialMediaScreenshot']: 'Social Media Screenshots',
    ['BankStatement']: 'Bank Statement',
    ['ProofOfAddress']: 'Proof of Address',
    ['ProductCatalog']: 'Product Catalog',
    ['BrandAuthorization']: 'Brand Authorization',
    ['AudienceMetrics']: 'Audience Metrics',
    ['PressCoverage']: 'Press Coverage',
    ['AnalyticsDashboard']: 'Analytics Dashboard',
    ['ProfessionalCertification']: 'Professional Certification'
};

export const DOCUMENT_DESCRIPTIONS: Record<VerificationDocumentType, string> = {
    ['GovernmentId']: 'Valid government-issued photo ID (passport, driver\'s license, etc.)',
    ['BusinessLicense']: 'Official business registration or license document',
    ['TaxCertificate']: 'Tax registration certificate or VAT certificate',
    ['PortfolioScreenshot']: 'Screenshots of your best content or portfolio',
    ['SocialMediaScreenshot']: 'Screenshots showing your social media presence and follower count',
    ['BankStatement']: 'Recent bank statement for payment verification',
    ['ProofOfAddress']: 'Utility bill or official document showing your address',
    ['ProductCatalog']: 'Product catalog or brand materials',
    ['BrandAuthorization']: 'Authorization letter from brands you represent',
    ['AudienceMetrics']: 'Screenshots or reports showing follower count, engagement rates, and audience demographics',
    ['PressCoverage']: 'Articles, interviews, or media mentions featuring your work or business',
    ['AnalyticsDashboard']: 'Screenshots of analytics from your social media platforms or website',
    ['ProfessionalCertification']: 'Professional certifications, awards, or credentials relevant to your field'
};

// Status display helpers
export const STATUS_LABELS: Record<VerificationStatus, string> = {
    ['Draft']: 'Draft',
    ['UnderReview']: 'Under Review',
    ['NeedMoreInformation']: 'Additional Information Required',
    ['Approved']: 'Approved',
    ['Rejected']: 'Rejected',
    ['Revoked']: 'Revoked'
};

export const STATUS_COLORS: Record<VerificationStatus, string> = {
    ['Draft']: 'gray',
    ['UnderReview']: 'blue',
    ['NeedMoreInformation']: 'yellow',
    ['Approved']: 'green',
    ['Rejected']: 'red',
    ['Revoked']: 'red'
};

// Utility functions
export function formatFileSize(bytes: number): string
{
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function isValidFileType(file: File): boolean
{
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ];
    return allowedTypes.includes(file.type.toLowerCase());
}

export function isValidFileSize(file: File, maxSizeBytes: number = 10 * 1024 * 1024): boolean
{
    return file.size <= maxSizeBytes;
}

export function canTransitionTo(currentStatus: VerificationStatus, newStatus: VerificationStatus): boolean
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
}

export function getStatusSortOrder(status: VerificationStatus): number
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
}

// Error types
export interface ApiError
{
    message: string;
    errors?: Record<string, string[]>;
    status?: number;
}

export class VerificationError extends Error
{
    public status?: number;
    public errors?: Record<string, string[]>;

    constructor(message: string, status?: number, errors?: Record<string, string[]>)
    {
        super(message);
        this.name = 'VerificationError';
        this.status = status;
        this.errors = errors;
    }
}

export interface VerificationStatusInfo
{
    submitted_at?: Date;
    submitted_by?: string;
    approved_at?: Date;
    approved_by?: string;
    approval_notes?: string;
    rejected_at?: Date;
    rejected_by?: string;
    rejection_notes?: string;
    current_status: VerificationStatus;
    last_status_change?: Date;
    last_changed_by?: string;
    total_status_changes: number;
    need_more_info_requests: {
        requested_at: Date;
        requested_by: string;
        notes?: string;
    }[];
}


const processVerificationHistory = memoizee(
    (history: VerificationStatusHistoryDto[]): VerificationStatusInfo =>
    {
        if (!history || history.length === 0)
        {
            throw new Error('Verification status history is empty');
        }

        // Sort by changed_at to ensure chronological order
        const sortedHistory = [...history].sort((a, b) =>
        {
            const aDate = a.changed_at ? new Date(a.changed_at).getTime() : 0;
            const bDate = b.changed_at ? new Date(b.changed_at).getTime() : 0;
            return aDate - bDate;
        });

        // Get the latest entry - this determines most of our info
        const lastEntry = sortedHistory[sortedHistory.length - 1];

        if (!lastEntry.changed_at || !lastEntry.new_status)
        {
            throw new Error('Invalid verification status history: missing required fields');
        }

        const lastChangeDate = new Date(lastEntry.changed_at);

        const result: VerificationStatusInfo = {
            current_status: lastEntry.new_status,
            last_status_change: lastChangeDate,
            last_changed_by: lastEntry.changed_by_user_id,
            total_status_changes: sortedHistory.length,
            need_more_info_requests: []
        };

        // Find submission info (first transition to UnderReview)
        const submissionEntry = sortedHistory.find(entry =>
            entry.new_status === 'UnderReview'
        );

        if (submissionEntry && submissionEntry.changed_at)
        {
            result.submitted_at = new Date(submissionEntry.changed_at);
            result.submitted_by = submissionEntry.changed_by_user_id;
        }

        // Set current status-specific info based on last entry
        switch (lastEntry.new_status)
        {
            case 'Approved':
                result.approved_at = lastChangeDate;
                result.approved_by = lastEntry.changed_by_user_id;
                result.approval_notes = lastEntry.notes || undefined;
                break;

            case 'Rejected':
                result.rejected_at = lastChangeDate;
                result.rejected_by = lastEntry.changed_by_user_id;
                result.rejection_notes = lastEntry.notes || undefined;
                break;
        }

        // Collect all "need more info" requests
        result.need_more_info_requests = sortedHistory
            .filter(entry => entry.new_status === 'NeedMoreInformation' && entry.changed_at)
            .map(entry => ({
                requested_at: new Date(entry.changed_at!),
                requested_by: entry.changed_by_user_id || '',
                notes: entry.notes ?? undefined
            }));

        return result;
    },
    {
        // Memoization options
        max: 100, // Cache up to 100 different history arrays
        maxAge: 1000 * 60 * 5, // Cache for 5 minutes
        // Use JSON.stringify for deep comparison of history arrays
        normalizer: (args) => JSON.stringify(args[0])
    }
);

// Extend Array prototype
declare global
{
    interface Array<_T>
    {
        getVerificationStatusInfo(this: VerificationStatusHistoryDto[]): VerificationStatusInfo;
    }
}

Array.prototype.getVerificationStatusInfo = function (this: VerificationStatusHistoryDto[]): VerificationStatusInfo
{
    return processVerificationHistory(this);
};

// Alternative standalone function approach
export function getVerificationStatusInfo(history: VerificationStatusHistoryDto[]): VerificationStatusInfo
{
    return processVerificationHistory(history);
}