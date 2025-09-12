// components/layout/management/sidebar/NavigationItem.tsx - Individual Navigation Item

'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NavigationItem as NavigationItemType } from '@/types/management';
import { useManagementLayout } from '../ManagementLayoutProvider';
import { NavigationBadge } from './NavigationBadge';

interface NavigationItemProps {
  item: NavigationItemType & { disabled?: boolean };
  pathname: string;
  isSubItem?: boolean;
}

export function NavigationItem({ item, pathname, isSubItem = false }: NavigationItemProps) {
  const { sidebarCollapsed, setActiveNavItem } = useManagementLayout();
  
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
  const hasChildren = item.children && item.children.length > 0;
  const showChildren = hasChildren && isActive && !sidebarCollapsed;

  const handleClick = () => {
    setActiveNavItem(item.key);
  };

  const ItemContent = () => (
    <>
      <item.icon className={cn(
        "flex-shrink-0",
        isSubItem ? "w-3 h-3" : "w-5 h-5"
      )} />
      
      {!sidebarCollapsed && (
        <>
          <span className={cn(
            "truncate",
            isSubItem ? "text-xs" : "text-sm",
            "ml-3"
          )}>
            {item.label}
          </span>
          
          {item.badge && (
            <NavigationBadge
              badge={item.badge}
              isActive={isActive}
            />
          )}
        </>
      )}
    </>
  );

  const itemClasses = cn(
    "flex items-center px-3 py-2 rounded-lg font-medium transition-colors relative z-10 group",
    isSubItem ? "ml-8 text-xs" : "text-sm",
    item.disabled 
      ? "opacity-50 cursor-not-allowed"
      : isActive
        ? "bg-[var(--primary-color)] text-[#171717]"
        : "text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
  );

  return (
    <div>
      {item.disabled ? (
        <div className={itemClasses}>
          <ItemContent />
        </div>
      ) : (
        <Link
          href={item.href}
          className={itemClasses}
          onClick={handleClick}
        >
          <ItemContent />
        </Link>
      )}

      {/* Sub-navigation */}
      {showChildren && (
        <div className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <NavigationItem
              key={child.key}
              item={child}
              pathname={pathname}
              isSubItem={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}