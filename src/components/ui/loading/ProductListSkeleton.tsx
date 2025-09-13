import { Skeleton } from '@/components/ui/skeleton';
import { GridSkeleton } from './shared';

export function ProductListSkeleton() {
    return (
        <div className="flex gap-8">
            {/* Sidebar Skeleton */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="bg-[#090909] rounded-xl p-6 border border-[#202020]">
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i}>
                                <Skeleton className="h-6 w-3/4 mb-3" />
                                <div className="space-y-2">
                                    {[1, 2, 3, 4].map(j => (
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
                    itemCount={12}
                    columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    itemComponent={ProductCardSkeleton}
                />
            </div>
        </div>
    );
}

// Product Card Skeleton Component
function ProductCardSkeleton() {
    return (
        <div className="bg-[#090909] rounded-xl border border-[#202020] overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        </div>
    );
}
