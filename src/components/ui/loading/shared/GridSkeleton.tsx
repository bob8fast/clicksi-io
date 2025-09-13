// components/ui/loading/shared/GridSkeleton.tsx - Reusable Grid Layout Skeleton

import React from 'react';
import { CardSkeleton } from './CardSkeleton';

interface GridSkeletonProps {
  itemCount?: number;
  columns?: 'auto' | '1' | '2' | '3' | '4' | '5' | '6' | string;
  itemComponent?: React.ComponentType<any>;
  itemProps?: Record<string, any>;
  showPagination?: boolean;
  className?: string;
}

export function GridSkeleton({ 
  itemCount = 6, 
  columns = 'auto',
  itemComponent,
  itemProps = {},
  showPagination = false,
  className 
}: GridSkeletonProps) {
  const ItemComponent = itemComponent || CardSkeleton;
  
  const getGridClasses = () => {
    if (typeof columns === 'string' && columns !== 'auto') {
      return columns; // Custom grid classes
    }
    
    const columnMap = {
      'auto': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      '1': 'grid-cols-1',
      '2': 'grid-cols-1 md:grid-cols-2',
      '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      '5': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      '6': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
    };
    
    return columnMap[columns] || columnMap['auto'];
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Grid */}
      <div className={`grid gap-4 ${getGridClasses()}`}>
        {Array.from({ length: itemCount }).map((_, i) => (
          <ItemComponent key={i} {...itemProps} />
        ))}
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-8" />
            <Skeleton className="h-10 w-8" />
            <Skeleton className="h-10 w-8" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized grid skeletons
export function ListSkeleton(props: Omit<GridSkeletonProps, 'columns'>) {
  return <GridSkeleton {...props} columns="1" />;
}

export function CardGridSkeleton(props: Omit<GridSkeletonProps, 'columns' | 'itemComponent'>) {
  return (
    <GridSkeleton 
      {...props} 
      columns="auto"
      itemComponent={CardSkeleton}
    />
  );
}

export function CompactGridSkeleton(props: Omit<GridSkeletonProps, 'columns' | 'itemProps'>) {
  return (
    <GridSkeleton 
      {...props} 
      columns="4"
      itemProps={{ 
        showHeader: false, 
        showFooter: false, 
        contentLines: 2 
      }}
    />
  );
}