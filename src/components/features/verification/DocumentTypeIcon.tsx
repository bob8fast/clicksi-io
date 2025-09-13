// components/verification/DocumentTypeIcon.tsx
'use client'

import { VerificationDocumentType } from '@/types';
import
{
    AcademicCapIcon,
    BanknotesIcon,
    BuildingOfficeIcon,
    CameraIcon,
    ChartBarIcon,
    DocumentIcon,
    DocumentTextIcon,
    HomeIcon,
    IdentificationIcon,
    NewspaperIcon,
    PresentationChartLineIcon,
    TagIcon
} from '@heroicons/react/24/outline';

interface DocumentTypeIconProps
{
    type: VerificationDocumentType;
    className?: string;
}

export function DocumentTypeIcon({ type, className = 'w-5 h-5' }: DocumentTypeIconProps)
{
    const IconComponent = {
        ['GovernmentId']: IdentificationIcon,
        ['BusinessLicense']: BuildingOfficeIcon,
        ['TaxCertificate']: DocumentTextIcon,
        ['PortfolioScreenshot']: CameraIcon,
        ['SocialMediaScreenshot']: CameraIcon,
        ['BankStatement']: BanknotesIcon,
        ['ProofOfAddress']: HomeIcon,
        ['ProductCatalog']: TagIcon,
        ['BrandAuthorization']: DocumentIcon,
        ['AudienceMetrics']: ChartBarIcon,
        ['PressCoverage']: NewspaperIcon,
        ['AnalyticsDashboard']: PresentationChartLineIcon,
        ['ProfessionalCertification']: AcademicCapIcon
    }[type];

    return <IconComponent className={`text-[#D78E59] ${className}`} />;
}