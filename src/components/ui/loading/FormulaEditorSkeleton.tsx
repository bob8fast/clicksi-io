// components/ui/loading/FormulaEditorSkeleton.tsx - Formula Editor Loading Skeleton

import { Skeleton } from '@/components/ui/skeleton';
import { CardSkeleton, FormSkeleton } from './shared';

interface FormulaEditorSkeletonProps {
  showTestRunner?: boolean;
  showKeywordsHelper?: boolean;
  className?: string;
}

export function FormulaEditorSkeleton({ 
  showTestRunner = true, 
  showKeywordsHelper = true,
  className 
}: FormulaEditorSkeletonProps) {
  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Formula Editor Card */}
      <div className="bg-[#171717] border border-[#202020] rounded-2xl">
        <div className="p-6 border-b border-[#202020]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-32" />
            </div>
            {showKeywordsHelper && (
              <Skeleton className="h-8 w-8" />
            )}
          </div>
          <Skeleton className="h-4 w-80 mt-2" />
        </div>
        <div className="p-6 space-y-4">
          {/* Formula Expression */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-8 w-20 ml-auto" />
            </div>
            <Skeleton className="h-10 w-full" />
            {/* Validation feedback area */}
            <Skeleton className="h-16 w-full bg-[#202020]/20" />
          </div>

          {/* Separator */}
          <div className="h-px bg-[#202020]"></div>

          {/* Formula Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Separator */}
          <div className="h-px bg-[#202020]"></div>

          {/* Variables Management */}
          <div className="space-y-3">
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

            {/* Variable Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
          </div>

          {/* Security Information */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-4 w-4 mt-0.5 bg-red-200" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32 bg-red-200" />
                <div className="space-y-1">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-3 w-full bg-red-200" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formula Test Runner */}
      {showTestRunner && <FormulaTestRunnerSkeleton />}

      {/* Formula Examples */}
      <FormulaExamplesSkeleton />
    </div>
  );
}

// Formula Test Runner Skeleton
function FormulaTestRunnerSkeleton() {
  return (
    <div className="bg-[#171717] border border-[#202020] rounded-2xl">
      <div className="p-6 border-b border-[#202020]">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-4 w-80 mt-2" />
      </div>
      <div className="p-6 space-y-4">
        {/* Test Data Inputs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-28" />
          </div>
          
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Formula Expression Display */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <div className="bg-[#202020]/30 rounded-lg p-3 border">
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        {/* Test Controls */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>

        {/* Test Results */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-4 w-4 mt-0.5 bg-green-200" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32 bg-green-200" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24 bg-green-200" />
                  <Skeleton className="h-3 w-20 bg-green-200" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-32 bg-green-200" />
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-5 w-16 bg-green-200" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Formula Examples Skeleton
function FormulaExamplesSkeleton() {
  return (
    <div className="bg-[#171717] border border-[#202020] rounded-2xl">
      <div className="p-6 border-b border-[#202020]">
        <Skeleton className="h-5 w-36" />
      </div>
      <div className="p-6">
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Simple Formula Validator Skeleton
export function FormulaValidatorSkeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className || ''}`}>
      <div className="flex items-start gap-3">
        <Skeleton className="h-4 w-4 mt-0.5 bg-green-200" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32 bg-green-200" />
          <Skeleton className="h-4 w-full bg-green-200" />
          <Skeleton className="h-4 w-2/3 bg-green-200" />
        </div>
      </div>
    </div>
  );
}

// Keywords Helper Skeleton
export function FormulaKeywordsHelperSkeleton({ className }: { className?: string }) {
  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-3 w-80" />
      </div>

      {/* Search */}
      <Skeleton className="h-8 w-full" />

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Skeleton className="h-4 w-4 mt-0.5 bg-blue-200" />
          <Skeleton className="h-3 flex-1 bg-blue-200" />
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-3">
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24" />
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#171717] border border-[#202020] rounded-lg p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-4 w-32 bg-[#202020]/30" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}