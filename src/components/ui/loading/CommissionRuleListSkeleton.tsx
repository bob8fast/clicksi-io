// components/ui/loading/CommissionRuleListSkeleton.tsx - Commission Rules List Loading Skeleton

import { Skeleton } from '@/components/ui/skeleton';
import { HeaderSkeleton, FiltersSkeleton, CardSkeleton, GridSkeleton } from './shared';

interface CommissionRuleListSkeletonProps {
  itemCount?: number;
  showFilters?: boolean;
  className?: string;
}

export function CommissionRuleListSkeleton({ 
  itemCount = 6, 
  showFilters = true,
  className 
}: CommissionRuleListSkeletonProps) {
  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header Section */}
      <HeaderSkeleton showActions={true} showSubtitle={true} />

      {/* Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <FiltersSkeleton 
          showActiveFilters={false}
          filterCount={6}
          showCheckboxes={true}
          showSearchBar={false}
        />
      )}

      {/* Active Filters */}
      <div className="bg-[#090909] rounded-lg p-4 border border-[#202020]">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-7 w-20" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-24" />
          ))}
        </div>
      </div>

      {/* Conflicts Alert */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-4 w-4 mt-0.5 bg-red-200" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48 bg-red-200" />
            <Skeleton className="h-4 w-full bg-red-200" />
            <Skeleton className="h-4 w-3/4 bg-red-200" />
          </div>
          <Skeleton className="h-8 w-8 bg-red-200" />
        </div>
      </div>

      {/* Rules Grid */}
      <GridSkeleton 
        itemCount={itemCount}
        columns="md:grid-cols-2 xl:grid-cols-3"
        itemComponent={CommissionRuleCardSkeleton}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-8" />
          <Skeleton className="h-10 w-8" />
          <Skeleton className="h-10 w-8" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
}

// Individual Commission Rule Card Skeleton
export function CommissionRuleCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-[#171717] border border-[#202020] rounded-2xl p-6 ${className || ''}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Formula Preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="bg-[#202020]/30 rounded p-2">
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-3 w-full" />
        </div>

        {/* Rule Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Restrictions */}
        <div className="space-y-1 pt-2 border-t border-[#202020]">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-[#202020]">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}