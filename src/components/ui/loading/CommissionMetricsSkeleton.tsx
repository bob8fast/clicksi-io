// components/ui/loading/CommissionMetricsSkeleton.tsx - Commission Metrics Loading Skeleton

import { Skeleton } from '@/components/ui/skeleton';
import { HeaderSkeleton, CardSkeleton, GridSkeleton } from './shared';

interface CommissionMetricsSkeletonProps {
  compact?: boolean;
  className?: string;
}

export function CommissionMetricsSkeleton({ compact = false, className }: CommissionMetricsSkeletonProps) {
  if (compact) {
    return (
      <GridSkeleton 
        itemCount={4}
        columns="md:grid-cols-2 lg:grid-cols-4"
        itemComponent={CompactMetricCardSkeleton}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-20" />
      </div>

      {/* Key Metrics Grid */}
      <GridSkeleton 
        itemCount={4}
        columns="md:grid-cols-2 lg:grid-cols-4"
        itemComponent={MetricCardSkeleton}
      />

      {/* Top Performing Rule */}
      <TopPerformingRuleSkeleton />

      {/* Quick Summary */}
      <QuickSummarySkeleton />
    </div>
  );
}

// Compact Metric Card for compact mode
function CompactMetricCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-[#171717] border border-[#202020] rounded-2xl p-6 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-1 mt-2">
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

// Individual Metric Card Skeleton
export function MetricCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-[#171717] border border-[#202020] rounded-2xl p-6 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-24" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </div>
  );
}

// Top Performing Rule Card Skeleton
function TopPerformingRuleSkeleton() {
  return (
    <div className="bg-[#171717] border border-[#202020] rounded-2xl">
      <div className="p-6 border-b border-[#202020]">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      </div>
    </div>
  );
}

// Quick Summary Card Skeleton
function QuickSummarySkeleton() {
  return (
    <div className="bg-[#171717] border border-[#202020] rounded-2xl">
      <div className="p-6 border-b border-[#202020]">
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Simple metrics grid skeleton  
export function SimpleMetricsGridSkeleton({ 
  columns = 4, 
  className 
}: { 
  columns?: number; 
  className?: string; 
}) {
  const columnMap = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3', 
    4: 'md:grid-cols-2 lg:grid-cols-4',
    5: 'md:grid-cols-3 lg:grid-cols-5',
    6: 'md:grid-cols-3 lg:grid-cols-6'
  };

  return (
    <GridSkeleton 
      itemCount={columns}
      columns={columnMap[columns] || columnMap[4]}
      itemComponent={MetricCardSkeleton}
      className={className}
    />
  );
}