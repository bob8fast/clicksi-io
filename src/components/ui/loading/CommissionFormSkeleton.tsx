// components/ui/loading/CommissionFormSkeleton.tsx - Commission Rule Form Loading Skeleton

import { Skeleton } from '@/components/ui/skeleton';
import { FormSkeleton, HeaderSkeleton } from './shared';

interface CommissionFormSkeletonProps {
  mode?: 'create' | 'edit';
  className?: string;
}

export function CommissionFormSkeleton({ mode = 'create', className }: CommissionFormSkeletonProps) {
  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className || ''}`}>
      {/* Header */}
      <HeaderSkeleton 
        showActions={false} 
        showSubtitle={true}
        showBadges={mode === 'edit'}
      />

      {/* Active Rule Warning (for edit mode) */}
      {mode === 'edit' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-4 w-4 mt-0.5 bg-amber-200" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40 bg-amber-200" />
              <Skeleton className="h-4 w-full bg-amber-200" />
              <Skeleton className="h-4 w-2/3 bg-amber-200" />
            </div>
          </div>
        </div>
      )}

      {/* Basic Information Card */}
      <FormSkeleton 
        title="Basic Information"
        description={true}
        fields={[
          { type: 'grid', label: true },
          { type: 'textarea', label: true },
          { type: 'select', label: true }
        ]}
        showActions={false}
      />

      {/* Formula Configuration Card */}
      <div className="bg-[#171717] border border-[#202020] rounded-2xl">
        <div className="p-6 border-b border-[#202020]">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>
        <div className="p-6 space-y-4">
          {/* Suggested Formulas */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="grid gap-2 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>

          {/* Formula Expression */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-8 w-20 ml-auto" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Variables */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-28" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Commission Limits Card */}
      <FormSkeleton 
        title="Commission Limits"
        description={true}
        fields={[
          { type: 'grid', label: true }
        ]}
        showActions={false}
      />

      {/* Effective Period Card */}
      <FormSkeleton 
        title="Effective Period"
        description={true}
        fields={[
          { type: 'date', label: true }
        ]}
        showActions={false}
      />

      {/* Restrictions Card */}
      <FormSkeleton 
        title="Restrictions"
        description={true}
        fields={[
          { type: 'textarea', label: true, help: true }
        ]}
        showActions={false}
      />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-20" />
        </div>
        
        {mode === 'edit' && (
          <Skeleton className="h-4 w-40" />
        )}
      </div>
    </div>
  );
}