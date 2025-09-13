import { Skeleton } from '@/components/ui/skeleton';

export function CreatorPageSkeleton() {
    return (
        <>
            {/* Cover Skeleton */}
            <Skeleton className="h-64 sm:h-80 w-full" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative -mt-20 sm:-mt-24 mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                        <Skeleton className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#171717]" />

                        <div className="flex-1 space-y-4">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-5 w-32" />
                            <div className="flex gap-3">
                                {[1, 2, 3].map(i => (
                                    <Skeleton key={i} className="h-10 w-24" />
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#090909] rounded-xl p-6 border border-[#202020] min-w-[280px]">
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="text-center">
                                        <Skeleton className="h-7 w-16 mx-auto mb-1" />
                                        <Skeleton className="h-3 w-12 mx-auto" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio Skeleton */}
                <div className="mb-8 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                </div>

                {/* Collections Skeleton */}
                <div className="mb-8">
                    <Skeleton className="h-6 w-48 mb-4" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <Skeleton key={i} className="aspect-square rounded-xl" />
                        ))}
                    </div>
                </div>

                {/* Posts Skeleton */}
                <div className="space-y-6">
                    {[1, 2].map(i => (
                        <CreatorPostSkeleton key={i} />
                    ))}
                </div>
            </div>
        </>
    );
}

// Creator Post Skeleton Component
function CreatorPostSkeleton() {
    return (
        <div className="bg-[#090909] rounded-xl border border-[#202020] overflow-hidden">
            <div className="p-4 flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    );
}