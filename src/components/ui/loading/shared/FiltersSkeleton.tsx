// components/ui/loading/shared/FiltersSkeleton.tsx - Reusable Filters Section Skeleton

import { Skeleton } from '@/components/ui/skeleton';

interface FiltersSkeletonProps {
  showActiveFilters?: boolean;
  filterCount?: number;
  showCheckboxes?: boolean;
  showSearchBar?: boolean;
  className?: string;
}

export function FiltersSkeleton({ 
  showActiveFilters = true,
  filterCount = 6,
  showCheckboxes = true,
  showSearchBar = true,
  className 
}: FiltersSkeletonProps) {
  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Search Bar */}
      {showSearchBar && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      )}

      {/* Active Filters */}
      {showActiveFilters && (
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
      )}

      {/* Main Filters */}
      <div className="bg-[#090909] rounded-lg p-4 border border-[#202020]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
          
          {/* Filter Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: filterCount }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          
          {/* Checkbox Group */}
          {showCheckboxes && (
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <div className="flex flex-wrap gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Specialized filter skeletons
export function SimpleFiltersSkeleton(props: Omit<FiltersSkeletonProps, 'filterCount' | 'showCheckboxes'>) {
  return (
    <FiltersSkeleton 
      {...props} 
      filterCount={3}
      showCheckboxes={false}
    />
  );
}

export function AdvancedFiltersSkeleton(props: Omit<FiltersSkeletonProps, 'filterCount'>) {
  return (
    <FiltersSkeleton 
      {...props} 
      filterCount={8}
    />
  );
}