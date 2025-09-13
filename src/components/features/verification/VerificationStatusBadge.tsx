// components/verification/VerificationStatusBadge.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { VerificationStatus } from '@/types';
import { AlertCircle, CheckCircle, Clock, FileText, X } from 'lucide-react';

interface VerificationStatusBadgeProps
{
    status: VerificationStatus;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
    className?: string;
}

export function VerificationStatusBadge({
    status,
    size = 'md',
    showIcon = true,
    className = ''
}: VerificationStatusBadgeProps)
{
    const getStatusConfig = (status: VerificationStatus) =>
    {
        switch (status)
        {
            case 'Draft':
                return {
                    color: 'bg-gray-500 hover:bg-gray-600',
                    icon: FileText,
                    label: 'Draft'
                };
            case 'UnderReview':
                return {
                    color: 'bg-blue-500 hover:bg-blue-600',
                    icon: AlertCircle,
                    label: 'Under Review'
                };
            case 'Approved':
                return {
                    color: 'bg-green-500 hover:bg-green-600',
                    icon: CheckCircle,
                    label: 'Approved'
                };
            case 'Rejected':
                return {
                    color: 'bg-red-500 hover:bg-red-600',
                    icon: X,
                    label: 'Rejected'
                };
            case 'NeedMoreInformation':
                return {
                    color: 'bg-orange-500 hover:bg-orange-600',
                    icon: AlertCircle,
                    label: 'Additional Info Required'
                };
            default:
                return {
                    color: 'bg-gray-500 hover:bg-gray-600',
                    icon: Clock,
                    label: 'Unknown'
                };
        }
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-2'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    return (
        <Badge
            className={`
        ${config.color} 
        text-white 
        border-0 
        ${sizeClasses[size]}
        ${showIcon ? 'flex items-center gap-1' : ''}
        ${className}
      `}
        >
            {showIcon && <Icon className={iconSizes[size]} />}
            {config.label}
        </Badge>
    );
}