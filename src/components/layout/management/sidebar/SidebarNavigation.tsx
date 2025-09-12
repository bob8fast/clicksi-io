// components/layout/management/sidebar/SidebarNavigation.tsx - Navigation Items

'use client';

import { usePathname } from 'next/navigation';
import { useManagementLayout } from '../ManagementLayoutProvider';
import { NavigationItem } from './NavigationItem';
import { useNavigationWithPermissions } from '@/hooks/layout/useNavigationWithPermissions';
import { NavigationSkeleton } from '@/components/ui/loading/shared';

export function SidebarNavigation() {
  const { config } = useManagementLayout();
  const pathname = usePathname();
  
  // Filter navigation items based on user permissions
  const { filteredNavigation, isLoading } = useNavigationWithPermissions(config.navigationItems);

  return (
    <nav className="flex-1 p-4 overflow-y-auto">
      <div className="space-y-1">
        {isLoading ? (
          <NavigationSkeleton items={config.navigationItems.length || 4} />
        ) : (
          // Render filtered navigation items
          filteredNavigation.map((item) => (
            <NavigationItem
              key={item.key}
              item={item!}
              pathname={pathname}
            />
          ))
        )}
      </div>
    </nav>
  );
}