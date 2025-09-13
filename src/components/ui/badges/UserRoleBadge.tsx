// components/shared/badges/UserRoleBadge.tsx
'use client'

import { Badge } from "@/components/ui/badge";
import { BusinessType, UserRole } from '@/types';
import { Building2, Star, User, Users } from 'lucide-react';

interface UserRoleBadgeProps
{
    role: UserRole;
    businessType?: BusinessType;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
    className?: string;
    variant?: 'default' | 'outline' | 'secondary';
}

export function UserRoleBadge({
    role,
    businessType,
    size = 'md',
    showIcon = true,
    className = '',
    variant = 'outline'
}: UserRoleBadgeProps)
{
    const getRoleConfig = (role: UserRole, businessType?: BusinessType) =>
    {
        switch (role)
        {
            case "Creator":
                return {
                    color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                    icon: Star,
                    label: 'Creator'
                };
            case "BusinessUser":
                return {
                    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                    icon: Building2,
                    label: businessType ? `${businessType}` : 'BusinessUser'
                };
            case "Consumer":
                return {
                    color: 'bg-green-500/20 text-green-300 border-green-500/30',
                    icon: User,
                    label: 'Consumer'
                };
            case "Admin":
                return {
                    color: 'bg-red-500/20 text-red-300 border-red-500/30',
                    icon: Users,
                    label: 'Admin'
                };
            default:
                return {
                    color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
                    icon: User,
                    label: 'Unknown'
                };
        }
    };

    const config = getRoleConfig(role, businessType);
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
            variant={variant}
            className={`
            ${config.color} 
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