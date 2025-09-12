import { cn } from '@/lib/utils';

/**
 * Simple loading spinner component
 */

export function LoadingSpinner({
    className, size = 'medium'
}: {
    className?: string;
    size?: 'small' | 'medium' | 'large';
})
{
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    return (
        <div className={cn('relative', sizeClasses[size], className)}>
            <div className="absolute inset-0 border-2 border-[#202020] rounded-full"></div>
            <div className="absolute inset-0 border-2 border-[#D78E59] rounded-full animate-spin border-t-transparent"></div>
        </div>
    );
}
