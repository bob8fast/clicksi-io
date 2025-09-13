// components/ui/loading/shared/CardSkeleton.tsx - Reusable Card Skeleton

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface CardSkeletonProps {
  showHeader?: boolean;
  showFooter?: boolean;
  contentLines?: number;
  headerLines?: number;
  footerContent?: 'simple' | 'detailed' | 'actions';
  className?: string;
}

export function CardSkeleton({ 
  showHeader = true, 
  showFooter = true,
  contentLines = 3,
  headerLines = 2,
  footerContent = 'simple',
  className 
}: CardSkeletonProps) {
  return (
    <Card className={`${className || ''}`}>
      {showHeader && (
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              {Array.from({ length: headerLines }).map((_, i) => (
                <Skeleton 
                  key={i} 
                  className={i === 0 ? "h-6 w-48" : "h-4 w-full"} 
                />
              ))}
            </div>
            <Skeleton className="h-8 w-8" />
          </div>
          
          {/* Header badges */}
          <div className="flex items-center gap-2 mt-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </CardHeader>
      )}
      
      <CardContent className={showHeader ? "pt-0" : "pt-6"}>
        <div className="space-y-3">
          {/* Main content lines */}
          <div className="space-y-2">
            {Array.from({ length: contentLines }).map((_, i) => (
              <Skeleton 
                key={i} 
                className={
                  i === contentLines - 1 ? "h-4 w-3/4" : "h-4 w-full"
                } 
              />
            ))}
          </div>
          
          {/* Separator */}
          <div className="h-px bg-[#202020]" />
          
          {/* Additional content section */}
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3" />
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
      </CardContent>
      
      {showFooter && (
        <CardFooter className="pt-3 border-t border-[#202020]">
          {footerContent === 'simple' && (
            <div className="flex justify-between items-center w-full">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          )}
          
          {footerContent === 'detailed' && (
            <div className="flex justify-between items-center w-full">
              <div className="space-y-1">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-2 w-24" />
              </div>
              <Skeleton className="h-3 w-20" />
            </div>
          )}
          
          {footerContent === 'actions' && (
            <div className="flex gap-2 ml-auto">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}