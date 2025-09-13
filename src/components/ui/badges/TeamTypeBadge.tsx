// components/shared/badges/TeamTypeBadge.tsx
'use client'

import { Badge } from "@/components/ui/badge";
import { TeamType } from '@/types';
import { Building2, ShoppingCart, Star, User } from 'lucide-react';

interface TeamTypeBadgeProps
{
    teamType: TeamType;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
    className?: string;
    variant?: 'default' | 'outline' | 'secondary';
}

export function TeamTypeBadge({
    teamType,
    size = 'md',
    showIcon = true,
    className = '',
    variant = 'outline'
}: TeamTypeBadgeProps)
{
    const getTeamTypeConfig = (teamType: TeamType) =>
    {
        switch (teamType)
        {
            case "Creator":
                return {
                    color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                    icon: Star,
                    label: 'Creator'
                };
            case "Brand":
                return {
                    color: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
                    icon: Building2,
                    label: 'Brand'
                };
            case "Retailer":
                return {
                    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                    icon: ShoppingCart,
                    label: 'Retailer'
                };
            case "Unknown":
            default:
                return {
                    color: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
                    icon: User,
                    label: 'Unknown'
                };
        }
    };

    const config = getTeamTypeConfig(teamType);
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