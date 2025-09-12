// components/ui/loading/CommissionRuleDetailSkeleton.tsx - Commission Rule Details Loading Skeleton

import { Skeleton } from '@/components/ui/skeleton';
import { HeaderSkeleton, CardSkeleton } from './shared';

interface CommissionRuleDetailSkeletonProps {
  className?: string;
}

interface DetailCardProps {
  title: string;
  fields: Array<{ labelWidth: string; valueWidth: string; }>;
  gridLayout?: boolean;
}

function DetailCard({ title, fields, gridLayout = false }: DetailCardProps) {
  return (
    <div className="bg-[#171717] border border-[#202020] rounded-2xl">
      <div className="p-6 border-b border-[#202020]">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className={`h-6 ${title === 'Basic Information' ? 'w-28' : title === 'Effective Period' ? 'w-32' : title === 'Commission Limits' ? 'w-40' : 'w-28'}`} />
        </div>
      </div>
      <div className="p-6">
        <div className={gridLayout ? "grid gap-4 md:grid-cols-2" : "space-y-4"}>
          {fields.map((field, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className={`h-3 ${field.labelWidth}`} />
              <Skeleton className={`h-${gridLayout ? '6' : '4'} ${field.valueWidth}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CommissionRuleDetailSkeleton({ className }: CommissionRuleDetailSkeletonProps) {
  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className || ''}`}>
      {/* Header Section */}
      <HeaderSkeleton showActions={true} showSubtitle={true} showBadges={true} />

      {/* Expiring Alert */}
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

      {/* Commission Formula Card */}
      <div className="bg-[#171717] border border-[#202020] rounded-2xl">
        <div className="p-6 border-b border-[#202020]">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-[#202020]/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8" />
            </div>
            <Skeleton className="h-6 w-48 mb-2" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-16" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rule Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information Card */}
        <DetailCard title="Basic Information" fields={[
          { labelWidth: 'w-16', valueWidth: 'w-32' },
          { labelWidth: 'w-16', valueWidth: 'w-32' },
          { labelWidth: 'w-16', valueWidth: 'w-32' },
        ]} />

        {/* Effective Period Card */}
        <DetailCard title="Effective Period" fields={[
          { labelWidth: 'w-12', valueWidth: 'w-28' },
          { labelWidth: 'w-12', valueWidth: 'w-28' },
        ]} />
      </div>

      {/* Commission Limits Card */}
      <DetailCard title="Commission Limits" gridLayout={true} fields={[
        { labelWidth: 'w-32', valueWidth: 'w-20' },
        { labelWidth: 'w-32', valueWidth: 'w-20' },
      ]} />

      {/* Restrictions Card */}
      <div className="bg-[#171717] border border-[#202020] rounded-2xl">
        <div className="p-6 border-b border-[#202020]">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <div className="space-y-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Skeleton className="h-1 w-1 rounded-full mt-2" />
                  <Skeleton className="h-3 flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metadata Card */}
      <DetailCard title="Metadata" gridLayout={true} fields={[
        { labelWidth: 'w-16', valueWidth: 'w-48' },
        { labelWidth: 'w-24', valueWidth: 'w-48' },
        { labelWidth: 'w-12', valueWidth: 'w-32' },
      ]} />
    </div>
  );
}