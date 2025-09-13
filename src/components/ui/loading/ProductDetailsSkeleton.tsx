import { Skeleton } from '@/components/ui/skeleton';

export function ProductDetailsSkeleton() {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Skeleton */}
        <Skeleton className="h-4 w-64 mb-6" />
  
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>
  
          {/* Info Skeleton */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
  
            <div>
              <Skeleton className="h-8 w-3/4 mb-3" />
              <Skeleton className="h-5 w-48" />
            </div>
  
            <div className="bg-[#090909] rounded-xl p-6 border border-[#202020]">
              <Skeleton className="h-8 w-32 mb-4" />
              <div className="flex gap-3 mb-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
  
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }