// config/entities/admin.config.ts - Admin Panel Configuration

import { 
  BarChart3, 
  Users, 
  Settings, 
  Home,
  Shield,
  CreditCard,
  FileCheck,
  Tag,
  UserCheck,
  AlertTriangle,
  Database,
  Bell,
  Lock,
  Search,
  UserPlus,
  Building,
  Store,
  MessageCircle,
  Headphones
} from 'lucide-react';
import { EntityConfig } from '@/types/management';

export const adminConfig: EntityConfig = {
  entityType: 'admin',
  entityLabel: 'Admin',
  portalName: 'Admin Panel',
  
  navigationItems: [
    {
      key: 'dashboard',
      href: '/admin',
      label: 'Dashboard',
      icon: Home,
      requiredPermissions: ['dashboard.view'],
      permissionBehavior: 'hide'
    },
    {
      key: 'user-management',
      href: '/admin/users',
      label: 'User Management',
      icon: Users,
      requiredPermissions: ['admin.users'],
      permissionBehavior: 'hide',
      children: [
        {
          key: 'users-all',
          href: '/admin/users',
          label: 'All Users',
          icon: Users,
          requiredPermissions: ['admin.users'],
          permissionBehavior: 'hide'
        },
        {
          key: 'users-creators',
          href: '/admin/users/creators',
          label: 'Creators',
          icon: UserPlus,
          requiredPermissions: ['admin.users'],
          permissionBehavior: 'hide'
        },
        {
          key: 'users-brands',
          href: '/admin/users/brands',
          label: 'Brands',
          icon: Building,
          requiredPermissions: ['admin.users'],
          permissionBehavior: 'hide'
        },
        {
          key: 'users-retailers',
          href: '/admin/users/retailers',
          label: 'Retailers',
          icon: Store,
          requiredPermissions: ['admin.users'],
          permissionBehavior: 'hide'
        }
      ]
    },
    {
      key: 'admin-management',
      href: '/admin/admins',
      label: 'Admin Management',
      icon: Shield,
      requiredPermissions: ['admin.system'],
      permissionBehavior: 'hide',
      children: [
        {
          key: 'admins-all',
          href: '/admin/admins',
          label: 'All Admins',
          icon: Shield,
          requiredPermissions: ['admin.system'],
          permissionBehavior: 'hide'
        },
        {
          key: 'admins-create',
          href: '/admin/admins/create',
          label: 'Create Admin',
          icon: UserCheck,
          requiredPermissions: ['admin.system'],
          permissionBehavior: 'disable'
        },
        {
          key: 'admins-permissions',
          href: '/admin/admins/permissions',
          label: 'Permissions',
          icon: Lock,
          requiredPermissions: ['admin.system'],
          permissionBehavior: 'disable'
        }
      ]
    },
    {
      key: 'verification',
      href: '/admin/verification',
      label: 'Verification Management',
      icon: FileCheck,
      requiredPermissions: ['admin.users'],
      permissionBehavior: 'hide',
      children: [
        {
          key: 'verification-pending',
          href: '/admin/verification',
          label: 'Pending Requests',
          icon: AlertTriangle,
          requiredPermissions: ['admin.users'],
          permissionBehavior: 'hide',
          badge: {
            type: 'counter',
            value: 5,
            queryKey: ['admin-verification', 'pending-count']
          }
        },
        {
          key: 'verification-approved',
          href: '/admin/verification/approved',
          label: 'Approved',
          icon: FileCheck,
          requiredPermissions: ['admin.users'],
          permissionBehavior: 'hide'
        },
        {
          key: 'verification-rejected',
          href: '/admin/verification/rejected',
          label: 'Rejected',
          icon: AlertTriangle,
          requiredPermissions: ['admin.users'],
          permissionBehavior: 'hide'
        }
      ]
    },
    {
      key: 'subscriptions',
      href: '/admin/subscriptions',
      label: 'Subscription Management',
      icon: CreditCard,
      requiredPermissions: ['admin.system'],
      permissionBehavior: 'hide',
      children: [
        {
          key: 'subscriptions-active',
          href: '/admin/subscriptions/active',
          label: 'Active Subscriptions',
          icon: CreditCard,
          requiredPermissions: ['admin.system'],
          permissionBehavior: 'hide'
        },
        {
          key: 'subscriptions-trial',
          href: '/admin/trial-requests',
          label: 'Trial Requests',
          icon: Bell,
          requiredPermissions: ['admin.system'],
          permissionBehavior: 'hide',
          badge: {
            type: 'counter',
            value: 2,
            queryKey: ['admin-trials', 'pending-count']
          }
        }
      ]
    },
    {
      key: 'content-management',
      href: '/admin/content',
      label: 'Content Management',
      icon: Database,
      requiredPermissions: ['admin.content'],
      permissionBehavior: 'hide',
      children: [
        {
          key: 'categories',
          href: '/admin/categories',
          label: 'Categories',
          icon: Tag,
          requiredPermissions: ['admin.content'],
          permissionBehavior: 'hide'
        },
        {
          key: 'content-moderation',
          href: '/admin/content/moderation',
          label: 'Content Moderation',
          icon: Search,
          requiredPermissions: ['admin.content'],
          permissionBehavior: 'hide',
          badge: {
            type: 'dynamic',
            fetchValue: async () => {
              // This would fetch pending content moderation count
              return 12;
            }
          }
        }
      ]
    },
    {
      key: 'analytics',
      href: '/admin/analytics',
      label: 'System Analytics',
      icon: BarChart3,
      requiredPermissions: ['admin.system'],
      permissionBehavior: 'hide',
      children: [
        {
          key: 'analytics-platform',
          href: '/admin/analytics/platform',
          label: 'Platform Metrics',
          icon: BarChart3,
          requiredPermissions: ['admin.system'],
          permissionBehavior: 'hide'
        },
        {
          key: 'analytics-users',
          href: '/admin/analytics/users',
          label: 'User Analytics',
          icon: Users,
          requiredPermissions: ['admin.system'],
          permissionBehavior: 'hide'
        }
      ]
    },
    {
      key: 'messaging',
      href: '/messaging',
      label: 'Messaging',
      icon: MessageCircle,
      requiredPermissions: ['messaging.view'],
      permissionBehavior: 'hide',
      children: [
        {
          key: 'messaging-all',
          href: '/messaging',
          label: 'All Messages',
          icon: MessageCircle,
          requiredPermissions: ['messaging.view'],
          permissionBehavior: 'hide'
        },
        {
          key: 'messaging-support',
          href: '/messaging/support',
          label: 'Support Requests',
          icon: Headphones,
          requiredPermissions: ['messaging.view'],
          permissionBehavior: 'hide',
          badge: {
            type: 'counter',
            value: 0,
            queryKey: ['support-conversations', 'unread-count']
          }
        }
      ]
    },
    {
      key: 'settings',
      href: '/admin/settings',
      label: 'System Settings',
      icon: Settings,
      requiredPermissions: ['admin.system'],
      permissionBehavior: 'hide'
    }
  ],
  
  accessControl: {
    requiredRole: 'Admin',
    teamBased: false
  },
  
  branding: {
    primaryColor: '#DC2626',
    accentColor: '#EF4444',
    portalIcon: Shield
  },
  
  layoutOptions: {
    defaultSidebarCollapsed: false
  }
};