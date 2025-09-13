// components/ui/loading/shared/HeaderSkeleton.tsx - Reusable Header Skeleton

import { Skeleton } from '@/components/ui/skeleton';

interface HeaderSkeletonProps {
  showActions?: boolean;
  showSubtitle?: boolean;
  showBadges?: boolean;
  className?: string;
}

export function HeaderSkeleton({ 
  showActions = true,
  showSubtitle = true,
  showBadges = false,
  className 
}: HeaderSkeletonProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className || ''}`}>
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        {showSubtitle && <Skeleton className="h-4 w-96" />}
        {showBadges && (
          <div className="flex items-center gap-2 mt-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        )}
      </div>
      
      {showActions && (
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
      )}
    </div>
  );
}