// config/entities/retailer.config.ts - Retailer Hub Configuration

import { 
  BarChart3, 
  Users, 
  Package, 
  Settings, 
  Home,
  Truck,
  Handshake,
  Store,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  MapPin,
  MessageCircle,
  Link,
  Calculator,
  List,
  Plus
} from 'lucide-react';
import { EntityConfig } from '@/types/management';

export const retailerConfig: EntityConfig = {
  entityType: 'retailer',
  entityLabel: 'Retailer',
  portalName: 'Retailer Hub',
  
  navigationItems: [
    {
      key: 'dashboard',
      href: '/retailer-management',
      label: 'Dashboard',
      icon: Home,
      requiredPermissions: ['dashboard.view'],
      permissionBehavior: 'hide'
    },
    {
      key: 'distribution',
      href: '/retailer-management/distribution',
      label: 'Distribution',
      icon: Package,
      requiredPermissions: ['distribution.view'],
      permissionBehavior: 'hide',
      children: [
        {
          key: 'distribution-manage',
          href: '/retailer-management/distribution/manage',
          label: 'Manage Products',
          icon: Package,
          requiredPermissions: ['distribution.manage'],
          permissionBehavior: 'disable'
        }
      ]
    },
    {
      key: 'brands',
      href: '/retailer-management/brands',
      label: 'Brand Partners',
      icon: Handshake,
      requiredPermissions: ['brands.view'],
      permissionBehavior: 'hide',
      children: [
        {
          key: 'brands-connect',
          href: '/retailer-management/brands/connect',
          label: 'Connect with Brands',
          icon: Handshake,
          requiredPermissions: ['brands.connect'],
          permissionBehavior: 'disable',
          badge: {
            type: 'status',
            value: 'new',
            statusMap: {
              'new': { value: '3', color: 'blue' },
              'pending': { value: '!', color: 'yellow' }
            }
          }
        }
      ]
    },
    {
      key: 'analytics',
      href: '/retailer-management/analytics',
      label: 'Analytics', 
      icon: BarChart3,
      requiredPermissions: ['analytics.view'],
      permissionBehavior: 'hide',
      children: [
        {
          key: 'analytics-financial',
          href: '/retailer-management/analytics/financial',
          label: 'Financial Reports',
          icon: DollarSign,
          requiredPermissions: ['analytics.financial'],
          permissionBehavior: 'disable'
        }
      ]
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
      href: '/retailer-management/team',
      label: 'Team',
      icon: Users,
      requiredPermissions: ['team.view'],
      permissionBehavior: 'hide'
    },
    {
      key: 'integrations',
      href: '/retailer-management/integrations',
      label: 'Social Media',
      icon: Link,
      badge: {
        type: 'counter',
        queryKey: ['retailer-social-connections']
      },
      requiredPermissions: ['integrations.view']
    },
    {
      key: 'commission',
      href: '/retailer-management/commission',
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
          href: '/retailer-management/commission',
          label: 'Rules',
          icon: List,
          requiredPermissions: ['commission.view']
        },
        {
          key: 'commission-create',
          href: '/retailer-management/commission/create',
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
    requiredBusinessType: 'Retailer',
    teamBased: true
  },
  
  branding: {
    primaryColor: '#10B981',
    accentColor: '#34D399',
    portalIcon: Store
  },
  
  layoutOptions: {
    defaultSidebarCollapsed: false
  }
};