# Entity Configuration Guide

This directory contains configuration files for the management system entities. Each entity (Brand, Creator, Retailer, Admin) has its own configuration file that defines navigation structure, permissions, branding, and behavior.

## 📁 File Structure

```
src/config/entities/
├── README.md           # This documentation
├── index.ts           # Entity registry and utilities
├── brand.config.ts    # Brand Portal configuration
├── creator.config.ts  # Creator Studio configuration
├── retailer.config.ts # Retailer Hub configuration
└── admin.config.ts    # Admin Panel configuration
```

## 🏗️ Creating a New Entity Configuration

### 1. Basic Structure

```typescript
import { EntityConfig } from '@/types/management';
import { Home, Settings, /* other icons */ } from 'lucide-react';

export const yourEntityConfig: EntityConfig = {
  entityType: 'your-entity',      // Must match EntityType
  entityLabel: 'Your Entity',     // Display name
  portalName: 'Your Portal',      // Portal title
  
  navigationItems: [
    // Navigation structure (see below)
  ],
  
  accessControl: {
    // Access control configuration (see below)
  },
  
  branding: {
    // Visual branding (see below)
  },
  
  layoutOptions: {
    // Layout preferences (see below)
  }
};
```

### 2. Access Control Configuration

#### For Team-Based Entities (Creator, BusinessUser):
```typescript
accessControl: {
  requiredRole: 'Creator',           // Single UserRole
  teamBased: true                    // Enables team functionality
}

// OR for BusinessUser entities:
accessControl: {
  requiredRole: 'BusinessUser',      // BusinessUser role
  requiredBusinessType: 'Brand',     // Brand or Retailer
  teamBased: true
}
```

#### For Non-Team Entities (Admin):
```typescript
accessControl: {
  requiredRole: 'Admin',             // Admin role
  teamBased: false                   // No team functionality
}
```

### 3. Branding Configuration

```typescript
branding: {
  portalName: 'Your Portal',         // Portal name
  entityLabel: 'Your Entity',        // Entity label
  primaryColor: '#3B82F6',           // Main theme color
  accentColor: '#60A5FA',            // Accent color
  portalIcon: Home                   // Lucide React icon
}
```

## 🧭 Navigation Items

### Basic Navigation Item

```typescript
{
  key: 'unique-key',                 // Unique identifier
  href: '/your-route',               // Route path
  label: 'Display Name',             // Menu label
  icon: Home,                        // Lucide React icon
  requiredPermissions: ['dashboard.view'], // SystemPermission[]
  permissionBehavior: 'hide'         // 'hide' | 'disable'
}
```

### Navigation with Children

```typescript
{
  key: 'parent-key',
  href: '/parent-route',
  label: 'Parent Item',
  icon: Settings,
  requiredPermissions: ['parent.view'],
  permissionBehavior: 'hide',
  children: [
    {
      key: 'child-key',
      href: '/parent-route/child',
      label: 'Child Item',
      icon: Plus,
      requiredPermissions: ['child.create'],
      permissionBehavior: 'disable'
    }
  ]
}
```

## 🏷️ Badge Configuration

Badges provide dynamic visual indicators for navigation items. There are 4 types available:

### 1. Static Badge
Simple, unchanging display value.

```typescript
badge: {
  type: 'static',
  value: 'NEW'                       // String or number
}
```

### 2. Counter Badge
Updates based on React Query cache invalidation.

```typescript
badge: {
  type: 'counter',
  value: 5,                          // Initial/fallback value
  queryKey: ['notifications', 'pending'] // React Query key to watch
}
```

**Usage**: When the query with this key updates, the badge automatically refreshes.

### 3. Status Badge
Maps different statuses to different badge appearances.

```typescript
badge: {
  type: 'status',
  value: 'pending',                  // Current status key
  statusMap: {
    'pending': { value: '!', color: 'yellow' },
    'error': { value: 'X', color: 'red' },
    'success': { value: '✓', color: 'green' }
  }
}
```

### 4. Dynamic Badge
Fetches value asynchronously when needed.

```typescript
badge: {
  type: 'dynamic',
  fetchValue: async () => {
    // API call or complex calculation
    const response = await fetch('/api/count');
    const data = await response.json();
    return data.count;
  }
}
```

## 🔐 System Permissions

Use these predefined SystemPermission values in `requiredPermissions`:

### Common Permissions
- `'dashboard.view'` - Dashboard access
- `'analytics.view'` - Basic analytics
- `'analytics.financial'` - Financial analytics (requires Manager+ TeamRole)
- `'team.view'` - View team members
- `'team.manage'` - Manage team (requires Admin+ TeamRole)
- `'team.invite'` - Invite team members (requires Admin+ TeamRole)

### Product Permissions (Brand)
- `'products.view'` - View products
- `'products.create'` - Create products
- `'products.edit'` - Edit products
- `'products.delete'` - Delete products (requires Admin+ TeamRole)

### Content Permissions (Creator)
- `'content.view'` - View content
- `'content.create'` - Create content
- `'content.edit'` - Edit content

### Link Permissions (Creator)
- `'links.view'` - View affiliate links
- `'links.create'` - Create links
- `'links.manage'` - Manage links

### Distribution Permissions (Retailer)
- `'distribution.view'` - View distribution
- `'distribution.manage'` - Manage product inventory

### Brand Connection Permissions
- `'brands.view'` - View brand partnerships
- `'brands.connect'` - Connect with brands

### Admin Permissions (Admin only)
- `'admin.users'` - User management
- `'admin.content'` - Content management
- `'admin.system'` - System management

## 🎨 Permission Behavior

### `permissionBehavior: 'hide'`
Navigation item is completely hidden if user lacks permissions.

### `permissionBehavior: 'disable'`
Navigation item is visible but disabled/grayed out if user lacks permissions.

## 💡 Best Practices

### 1. Navigation Structure
- Keep navigation hierarchy logical and shallow (max 2-3 levels)
- Use clear, descriptive labels
- Group related functionality together

### 2. Permissions
- Use specific permissions rather than broad ones
- Consider TeamRole restrictions for sensitive operations
- Always provide fallback behavior for insufficient permissions

### 3. Badge Usage
- Use counters for actionable items (pending requests, notifications)
- Use status badges for state indication (online/offline, active/inactive)
- Use dynamic badges sparingly (performance impact)
- Provide fallback values for all badge types

### 4. Icons
- Import only needed icons from 'lucide-react'
- Use consistent icon styles across the entity
- Choose icons that clearly represent the functionality

## 🔄 Adding to Registry

After creating a new entity config, add it to `index.ts`:

```typescript
// In src/config/entities/index.ts
import { yourEntityConfig } from './your-entity.config';

export const entityConfigs: Partial<Record<EntityType, EntityConfig>> = {
  brand: brandConfig,
  creator: creatorConfig,
  retailer: retailerConfig,
  admin: adminConfig,
  yourEntity: yourEntityConfig, // Add your config here
};
```

## 🧪 Testing Your Configuration

1. **Type Safety**: Run TypeScript check
   ```bash
   npx tsc --noEmit --project .
   ```

2. **Permission Logic**: Test with different user roles and team roles

3. **Badge Functionality**: Verify badge updates work as expected

4. **Navigation Flow**: Test all navigation paths and permission behaviors

## 📋 Examples

See the existing configuration files for complete examples:
- `brand.config.ts` - Team-based BusinessUser with product management
- `creator.config.ts` - Team-based Creator with content and links
- `retailer.config.ts` - Team-based BusinessUser with distribution
- `admin.config.ts` - Non-team Admin with system management

Each file demonstrates different badge types, permission patterns, and navigation structures.