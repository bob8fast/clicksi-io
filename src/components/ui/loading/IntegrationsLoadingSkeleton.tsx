// components/features/integrations/IntegrationsLoadingSkeleton.tsx - Loading skeleton for integrations

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { HeaderSkeleton, CardSkeleton, GridSkeleton } from './shared';

export const IntegrationsLoadingSkeleton = () => (
  <div className="space-y-6">
    {/* Header skeleton */}
    <HeaderSkeleton 
      showActions={false}
      showSubtitle={true}
    />
    
    {/* Connected accounts section skeleton */}
    <div>
      <Skeleton className="h-6 w-40 mb-4" />
      <GridSkeleton 
        itemCount={2}
        columns="md:grid-cols-2"
        itemComponent={ConnectedAccountSkeleton}
      />
    </div>
    
    {/* Available platforms section skeleton */}
    <div>
      <Skeleton className="h-6 w-36 mb-4" />
      <GridSkeleton 
        itemCount={4}
        columns="md:grid-cols-2 lg:grid-cols-4"
        itemComponent={PlatformCardSkeleton}
      />
    </div>
  </div>
);

// Connected Account Card Skeleton
function ConnectedAccountSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-28" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Platform Card Skeleton
function PlatformCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="text-center space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}