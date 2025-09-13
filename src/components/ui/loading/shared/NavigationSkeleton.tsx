import { Skeleton } from "@/components";

/**
 * Navigation skeleton loader
 */
export function NavigationSkeleton({ items = 4 }: { items?: number })
{
    return (
        <div className="space-y-2">
            {Array.from({ length: items }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
        </div>
    );
}
