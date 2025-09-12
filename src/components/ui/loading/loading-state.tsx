// components/ui/loading-state.tsx - Reusable loading components

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingStateProps
{
    className?: string;
    size?: 'small' | 'medium' | 'large';
    message?: string;
    description?: string;
    fullScreen?: boolean;
}

/**
 * Main loading state component with dark theme design
 */
export function LoadingState({
    className,
    size = 'large',
    message = 'Loading your experience',
    description = "This won't take long...",
    fullScreen = true
}: LoadingStateProps)
{
    const sizeClasses = {
        small: 'w-8 h-8',
        medium: 'w-16 h-16',
        large: 'w-24 h-24'
    };

    const containerClasses = fullScreen
        ? 'min-h-screen flex items-center justify-center bg-[#171717]'
        : 'flex items-center justify-center p-8';

    return (
        <div className={cn(containerClasses, className)}>
            <div className="flex flex-col items-center">
                {/* Animated loading icon */}
                <div className={cn('relative mb-6', sizeClasses[size])}>
                    <div className="absolute inset-0 border-4 border-[#202020] rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#D78E59] rounded-full animate-spin border-t-transparent"></div>
                    <div className="absolute inset-2 border-2 border-[#FFAA6C] rounded-full animate-ping opacity-20"></div>
                </div>

                {/* Loading text */}
                {(message || description) && (
                    <div className="text-center">
                        {message && (
                            <h2 className="text-[#EDECF8] text-xl font-semibold mb-2">{message}</h2>
                        )}
                        {description && (
                            <p className="text-[#828288] text-sm">{description}</p>
                        )}
                    </div>
                )}

                {/* Progress indicator for large size */}
                {size === 'large' && (
                    <div className="mt-8 w-48">
                        <div className="h-1 bg-[#202020] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#D78E59] to-[#FFAA6C] rounded-full animate-pulse"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}