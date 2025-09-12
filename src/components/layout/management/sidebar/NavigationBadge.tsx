// components/layout/management/sidebar/NavigationBadge.tsx - Badge Component for Navigation

'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { BadgeConfig } from '@/types/management';

interface NavigationBadgeProps {
  badge: BadgeConfig;
  isActive: boolean;
  className?: string;
}

export function NavigationBadge({ badge, isActive, className }: NavigationBadgeProps) {
  const [badgeValue, setBadgeValue] = useState<string | number>(badge.value || '');

  // Counter badge - watch React Query cache
  const { data: counterData } = useQuery<string | number>({
    queryKey: badge.queryKey || ['placeholder'],
    enabled: badge.type === 'counter' && !!badge.queryKey,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });

  // Dynamic badge - fetch value when needed
  const { data: dynamicData, isLoading } = useQuery<string | number>({
    queryKey: ['dynamic-badge', JSON.stringify(badge)],
    queryFn: badge.fetchValue,
    enabled: badge.type === 'dynamic' && !!badge.fetchValue,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Update badge value based on type
  useEffect(() => {
    switch (badge.type) {
      case 'static':
        if (badge.value !== undefined) {
          setBadgeValue(badge.value);
        }
        break;
        
      case 'counter':
        if (counterData !== undefined && counterData !== null) {
          setBadgeValue(counterData);
        } else if (badge.value !== undefined) {
          setBadgeValue(badge.value);
        }
        break;
        
      case 'status':
        if (badge.value && badge.statusMap) {
          const statusConfig = badge.statusMap[String(badge.value)];
          if (statusConfig) {
            setBadgeValue(statusConfig.value);
          }
        }
        break;
        
      case 'dynamic':
        if (dynamicData !== undefined) {
          setBadgeValue(dynamicData);
        } else if (badge.value !== undefined) {
          setBadgeValue(badge.value);
        }
        break;
    }
  }, [badge, counterData, dynamicData]);

  // Get badge color for status badges
  const getBadgeColor = () => {
    if (badge.type === 'status' && badge.value && badge.statusMap) {
      const statusConfig = badge.statusMap[String(badge.value)];
      if (statusConfig?.color) {
        const colorMap: Record<string, string> = {
          'red': 'bg-red-500 text-white',
          'yellow': 'bg-yellow-500 text-black',
          'green': 'bg-green-500 text-white',
          'blue': 'bg-blue-500 text-white',
          'gray': 'bg-gray-500 text-white',
        };
        return colorMap[statusConfig.color] || colorMap['gray'];
      }
    }
    
    // Default colors
    return isActive
      ? "bg-[#171717] text-[var(--primary-color)]"
      : "bg-[#575757] text-[#EDECF8]";
  };

  // Don't render if no value or loading dynamic badge
  if (!badgeValue && badgeValue !== 0) {
    return null;
  }

  if (badge.type === 'dynamic' && isLoading) {
    return null;
  }

  // Don't render if value is 0 for counter badges
  if (badge.type === 'counter' && badgeValue === 0) {
    return null;
  }

  return (
    <Badge className={cn(
      "ml-auto text-xs transition-colors",
      getBadgeColor(),
      className
    )}>
      {badgeValue}
    </Badge>
  );
}