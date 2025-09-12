import { Skeleton } from '@/components/ui/skeleton';
import { GridSkeleton } from './shared';

export function CreatorListSkeleton() {
    return (
      <div className="flex gap-8">
        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-[#090909] rounded-xl p-6 border border-[#202020]">
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i}>
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <div className="space-y-2">
                    {[1, 2, 3].map(j => (
                      <Skeleton key={j} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
  
        {/* Grid Skeleton */}
        <div className="flex-1">
          <Skeleton className="h-4 w-48 mb-4" />
          <GridSkeleton 
            itemCount={9}
            columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            itemComponent={CreatorCardSkeleton}
          />
        </div>
      </div>
    );
  }

// Creator Card Skeleton Component
function CreatorCardSkeleton() {
  return (
    <div className="bg-[#090909] rounded-xl border border-[#202020] overflow-hidden">
      <Skeleton className="h-32 w-full" />
      <div className="p-6">
        <div className="flex items-start gap-4 -mt-12 mb-4">
          <Skeleton className="w-20 h-20 rounded-full border-4 border-[#090909]" />
          <div className="flex-1 pt-4 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3].map(j => (
            <div key={j} className="text-center">
              <Skeleton className="h-5 w-12 mx-auto mb-1" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
  