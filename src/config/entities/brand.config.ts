// config/entities/brand.config.ts - Brand Portal Configuration

import { EntityConfig } from '@/types/management';
import { 
  Home, 
  Package, 
  BarChart3, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  Plus,
  MessageCircle,
  Link,
  Calculator,
  List
} from 'lucide-react';

export const brandConfig: EntityConfig = {
  entityType: 'brand',
  entityLabel: 'Brand',
  portalName: 'Brand Portal',
  
  navigationItems: [
    // Common items across all entities
    {
      key: 'dashboard',
      href: '/brand-management',
      label: 'Dashboard',
      icon: Home,
      requiredPermissions: ['dashboard.view'],
      permissionBehavior: 'hide'
    },
    {
      key: 'analytics',
      href: '/brand-management/analytics',
      label: 'Analytics',
      icon: BarChart3,
      requiredPermissions: ['analytics.view'],
      permissionBehavior: 'disable'
    },
    {
      key: 'messaging',
      href: '/messaging',
      label: 'Messages',
      icon: MessageCircle,
      requiredPermissions: ['messaging.view'],
      permissionBehavior: 'hide',
      badge: {
        type: 'counter',
        value: 0,
        queryKey: ['conversations', 'unread-count']
      }
    },
    {
      key: 'team',
      href: '/brand-management/team',
      label: 'Team',
      icon: Users,
      requiredPermissions: ['team.view'],
      permissionBehavior: 'hide'
    },
    
    // Brand-specific items
    {
      key: 'products',
      href: '/brand-management/products',
      label: 'Products',
      icon: Package,
      requiredPermissions: ['products.view'],
      permissionBehavior: 'hide',
      children: [
        {
          key: 'all-products',
          href: '/brand-management/products',
          label: 'All Products',
          icon: Package,
          requiredPermissions: ['products.view']
        },
        {
          key: 'add-product',
          href: '/brand-management/products/create',
          label: 'Add Product',
          icon: Plus,
          requiredPermissions: ['products.create'],
          permissionBehavior: 'disable'
        },
      ]
    },
    {
      key: 'retailers',
      href: '/brand-management/retailers',
      label: 'Retailers',
      icon: ShoppingBag,
      requiredPermissions: ['brands.view'],
      badge: {
        type: 'counter',
        value: 3,
        queryKey: ['partner-requests', 'pending']
      }
    },
    {
      key: 'creators',
      href: '/brand-management/creators',
      label: 'Creators',
      icon: Users,
      requiredPermissions: ['brands.connect']
    },
    {
      key: 'integrations',
      href: '/brand-management/integrations',
      label: 'Social Media',
      icon: Link,
      badge: {
        type: 'counter',
        queryKey: ['brand-social-connections']
      },
      requiredPermissions: ['integrations.view']
    },
    {
      key: 'commission',
      href: '/brand-management/commission',
      label: 'Commission',
      icon: Calculator,
      requiredPermissions: ['commission.view'],
      permissionBehavior: 'hide',
      badge: {
        type: 'counter',
        queryKey: ['commission-conflicts', 'count']
      },
      children: [
        {
          key: 'commission-rules',
          href: '/brand-management/commission',
          label: 'Rules',
          icon: List,
          requiredPermissions: ['commission.view']
        },
        {
          key: 'commission-create',
          href: '/brand-management/commission/create',
          label: 'Create Rule',
          icon: Plus,
          requiredPermissions: ['commission.edit'],
          permissionBehavior: 'disable'
        }
      ]
    }
  ],
  
  accessControl: {
    requiredRole: 'BusinessUser',
    requiredBusinessType: 'Brand',
    teamBased: true,
  },
  
  branding: {
    primaryColor: '#D78E59',
    accentColor: '#FFAA6C',
    portalIcon: Package
  },
  
  layoutOptions: {
    defaultSidebarCollapsed: false,
  }
};