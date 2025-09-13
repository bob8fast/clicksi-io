// config/entities/creator.config.ts - Creator Studio Configuration

import { 
  BarChart3, 
  Users, 
  Link, 
  FileText, 
  Settings, 
  Home,
  Video,
  Camera,
  TrendingUp,
  UserPlus,
  Play,
  Image,
  Plus,
  MessageCircle
} from 'lucide-react';
import { EntityConfig } from '@/types/management';

export const creatorConfig: EntityConfig = {
  entityType: 'creator',
  entityLabel: 'Creator',
  portalName: 'Creator Studio',
  
  navigationItems: [
    {
      key: 'dashboard',
      href: '/creator-management',
      label: 'Dashboard',
      icon: Home,
      requiredPermissions: ['dashboard.view'],
      permissionBehavior: 'hide'
    },
    {
      key: 'content',
      href: '/creator-management/content',
      label: 'Content',
      icon: FileText,
      requiredPermissions: ['content.view'],
      permissionBehavior: 'hide',
      children: [
        {
          key: 'content-create',
          href: '/creator-management/content/create',
          label: 'Create Content',
          icon: Plus,
          requiredPermissions: ['content.create'],
          permissionBehavior: 'disable'
        },
        {
          key: 'content-manage',
          href: '/creator-management/content/manage',
          label: 'Manage Content',
          icon: FileText,
          requiredPermissions: ['content.edit'],
          permissionBehavior: 'hide'
        }
      ]
    },
    {
      key: 'links',
      href: '/creator-management/links',
      label: 'Affiliate Links',
      icon: Link,
      requiredPermissions: ['links.view'],
      permissionBehavior: 'hide',
      badge: {
        type: 'counter',
        value: 12,
        queryKey: ['creator-links', 'active-count']
      },
      children: [
        {
          key: 'links-create',
          href: '/creator-management/links/create',
          label: 'Create Link',
          icon: Plus,
          requiredPermissions: ['links.create'],
          permissionBehavior: 'disable'
        },
        {
          key: 'links-manage',
          href: '/creator-management/links/manage',
          label: 'Manage Links',
          icon: Link,
          requiredPermissions: ['links.manage'],
          permissionBehavior: 'hide'
        }
      ]
    },
    {
      key: 'analytics',
      href: '/creator-management/analytics',
      label: 'Analytics',
      icon: BarChart3,
      requiredPermissions: ['analytics.view'],
      permissionBehavior: 'hide',
      children: [
        {
          key: 'analytics-financial',
          href: '/creator-management/analytics/financial',
          label: 'Earnings',
          icon: BarChart3,
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
      href: '/creator-management/team',
      label: 'Team',
      icon: Users,
      requiredPermissions: ['team.view'],
      permissionBehavior: 'hide'
    },
    {
      key: 'integrations',
      href: '/creator-management/integrations',
      label: 'Social Media',
      icon: Link,
      badge: {
        type: 'counter',
        queryKey: ['creator-social-connections']
      },
      requiredPermissions: ['integrations.view']
    }
  ],
  
  accessControl: {
    requiredRole: 'Creator',
    teamBased: true
  },
  
  branding: {
    primaryColor: '#8B5CF6',
    accentColor: '#A78BFA',
    portalIcon: Video
  },
  
  layoutOptions: {
    defaultSidebarCollapsed: false
  }
};