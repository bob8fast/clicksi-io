import { VerificationApplicationDto, VerificationStatus } from "@/types";


// Check if user can perform actions on verification
export function useVerificationPermissions(totalRequiredVerificationDocuments: number, verification?: VerificationApplicationDto | null)
{
    const canEdit = verification?.status === 'Draft' ||
        verification?.status === 'NeedMoreInformation';

    const canSubmit = verification ?
        canSubmitApplication(verification, totalRequiredVerificationDocuments) : false;

    const canAddDocuments = canEdit;
    const canDeleteDocuments = canEdit;

    return {
        canEdit,
        canSubmit,
        canAddDocuments,
        canDeleteDocuments,
        isFinalized: verification?.status === 'Approved' ||
            verification?.status === 'Rejected'
    };
}

// Validation hook for file uploads
export function useFileValidation()
{
    const validateMultipleFiles = (files: File[]) =>
    {
        const results = files.map(file => ({
            file,
            validation: validateFile(file)
        }));

        const allValid = results.every(result => result.validation.isValid);
        const errors = results
            .filter(result => !result.validation.isValid)
            .map(result => `${result.file.name}: ${result.validation.errors.join(', ')}`);

        return {
            isValid: allValid,
            results,
            errors
        };
    };

    return {
        validateFile,
        validateMultipleFiles
    };
}

// Progress tracking hook
export function useVerificationProgress(verification?: VerificationApplicationDto | null)
{
    if (!verification)
    {
        return {
            progress: 0,
            currentStep: 'create',
            steps: []
        };
    }

    const steps = [
        {
            key: 'create',
            label: 'Create Application',
            completed: true,
            current: verification.status === 'Draft' && verification.documents?.length === 0
        },
        {
            key: 'documents',
            label: 'Upload Documents',
            completed: verification.documents?.length > 0,
            current: verification.status === 'Draft' && verification.documents?.length === 0
        },
        {
            key: 'submit',
            label: 'Submit for Review',
            completed: verification.status !== 'Draft',
            current: verification.status === 'Draft' && verification.documents?.length > 0
        },
        {
            key: 'review',
            label: 'Under Review',
            completed: verification.status === 'Approved',
            current: verification.status === 'UnderReview' ||
                verification.status === 'NeedMoreInformation'
        },
        {
            key: 'complete',
            label: 'Complete',
            completed: verification.status === 'Approved',
            current: verification.status === 'Approved'
        }
    ];

    const progress = getApplicationProgress(verification);
    const currentStep = steps.find(step => step.current)?.key || 'create';

    return {
        progress,
        currentStep,
        steps
    };
}


// Check if application can be submitted
    function canSubmitApplication(application: VerificationApplicationDto, totalRequiredVerificationDocuments: number): boolean
    {
        return application.status === 'Draft' &&
            application.documents?.length > 0 &&
            (application.documents?.length >= totalRequiredVerificationDocuments);
    }

    // Check if status can be updated
    function canUpdateStatus(currentStatus: VerificationStatus, newStatus: VerificationStatus): boolean
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

    // Validate file before upload
    function validateFile(file: File): { isValid: boolean; errors: string[] }
    {
        const errors: string[] = [];
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp'
        ];

        if (file.size > maxSize)
        {
            errors.push(`File size must not exceed ${maxSize / (1024 * 1024)}MB`);
        }

        if (!allowedTypes.includes(file.type.toLowerCase()))
        {
            errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
        }

        if (file.size === 0)
        {
            errors.push('File cannot be empty');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Get application progress percentage
    function getApplicationProgress(application: VerificationApplicationDto): number
    {
        const totalSteps = 3; // 1. Create, 2. Upload documents, 3. Submit
        let completedSteps = 1; // Application is created

        if (application.documents?.length > 0)
        {
            completedSteps++;
        }

        if (application.status !== 'Draft')
        {
            completedSteps++;
        }

        return Math.round((completedSteps / totalSteps) * 100);
    }

    // Format time duration for display
    function formatDuration(duration: string): string
    {
        // Parse ISO 8601 duration or similar format
        // This is a simplified implementation
        const match = duration.match(/(\d+):(\d+):(\d+)/);
        if (match)
        {
            const [, hours, minutes, seconds] = match;
            if (parseInt(hours) > 0)
            {
                return `${hours}h ${minutes}m`;
            }
            if (parseInt(minutes) > 0)
            {
                return `${minutes}m ${seconds}s`;
            }
            return `${seconds}s`;
        }
        return duration;
    }