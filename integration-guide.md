# Route Configuration Integration Guide

This guide explains how to use the centralized route configuration system to manage protected routes in your Next.js application.

## Overview

The route configuration system provides a single source of truth for all routes in your application, making it easier to:

1. Define which routes require authentication
2. Specify which user roles can access specific routes
3. Generate navigation menus dynamically based on user permissions
4. Enforce route protection at multiple levels (middleware, client-side)
5. Document your route structure

## Files and Components

Here's what each file does:

1. **`config/routes.ts`**: Central route configuration that defines all routes and their protection status
2. **`types/auth.ts`**: Type definitions for authentication-related data
3. **`middleware.ts`**: Next.js middleware that protects routes at the server level
4. **`components/route-guard.tsx`**: Client-side component that provides an additional layer of protection
5. **`components/navigation.tsx`**: Navigation component that dynamically shows links based on permissions

## Integration Steps

### 1. Install the Type Definitions

First, ensure your `tsconfig.json` is set up to recognize your custom types:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 2. Update Your Root Layout

Replace your existing `app/layout.tsx` with the updated version that includes the `RouteGuard` component:

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';
import AuthProvider from './providers/auth-provider';
import RouteGuard from '@/components/route-guard';
import Navigation from '@/components/navigation';  // Import the Navigation component
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LTK Clone',
  description: 'A clone of the LTK platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navigation />  {/* Add the Navigation component */}
          <RouteGuard>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </RouteGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 3. Replace Your Middleware

Replace your existing `middleware.ts` file with the updated version that uses the route configuration:

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getFlattenedRoutes, canAccessRoute } from "./config/routes";

export default withAuth(
  function middleware(req) {
    // Middleware logic using route configuration
    // ...
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Import helper function to generate the matcher patterns
import { getProtectedPathPatterns } from "./config/routes";

// Generate matcher patterns from our route configuration
export const config = {
  matcher: getProtectedPathPatterns(),
};
```

### 4. Add a Navigation Component to Display Routes

Add the navigation component to your layout to show the dynamically generated navigation links:

```typescript
// app/layout.tsx
import Navigation from '@/components/navigation';

// Inside your layout function:
<Navigation />
```

## How to Use the Route Configuration

### Adding a New Route

To add a new route to your application:

1. Open `config/routes.ts`
2. Add a new entry to the `routes` object:

```typescript
myNewRoute: {
  path: '/my-new-route',
  label: 'My New Route',
  protected: true,  // Set to true if authentication is required
  roles: ['Admin', 'Creator'],  // Optional: specify which roles can access
  showInNav: true,  // Whether to show in navigation
  icon: 'chart',  // Optional icon for navigation
  description: 'Description of the route'
}
```

3. Create the corresponding page in your Next.js app

### Adding Nested Routes

For nested routes:

```typescript
parentRoute: {
  path: '/parent',
  label: 'Parent Route',
  protected: true,
  roles: ['Admin'],
  showInNav: true,
  children: {
    childRoute: {
      path: '/parent/child',
      label: 'Child Route',
      protected: true,
      roles: ['Admin'],
      showInNav: true
    }
  }
}
```

### Programmatically Checking Access

You can check if a user has access to a route in your components:

```typescript
import { canAccessRoute, routes } from '@/config/routes';

// Inside your component:
const userRole = session?.user.role;
const canAccess = canAccessRoute(routes.admin.children.dashboard, userRole);

if (canAccess) {
  // Show admin functionality
}
```

### Generating Navigation Links

The navigation component automatically generates links based on user permissions:

```typescript
// This will get only the routes that the user has access to
const navItems = getNavItems(session?.user?.role);

// You can map over these to create custom navigation
navItems.map(({ key, route }) => (
  <Link key={key} href={route.path}>
    {route.label}
  </Link>
))
```

## Customizing Protection Behavior

### Middleware-Only Protection

If you prefer to only use middleware for route protection:

1. Remove the `RouteGuard` component from your layout
2. Use the middleware for all route protection

### Client-Side Only Protection

For client-side only protection (useful for static export):

1. Disable the middleware by setting its config to an empty array
2. Keep the `RouteGuard` component for client-side protection

## Advanced Use Cases

### Dynamic Role-Based Content

You can use the route configuration to show/hide elements based on permissions:

```jsx
import { canAccessRoute, routes } from '@/config/routes';

function MyComponent() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  
  return (
    <div>
      {canAccessRoute(routes.admin, userRole) && (
        <AdminPanel />
      )}
      
      {canAccessRoute(routes.creator, userRole) && (
        <CreatorTools />
      )}
    </div>
  );
}
```

### Custom Route Documentation

Generate documentation for your routes:

```typescript
import { getFlattenedRoutes } from '@/config/routes';

function generateRouteDocs() {
  const allRoutes = getFlattenedRoutes();
  
  return Object.entries(allRoutes).map(([key, route]) => ({
    key,
    path: route.path,
    protected: route.protected,
    roles: route.roles?.join(', ') || 'Any authenticated user',
    description: route.description || 'No description provided'
  }));
}
```

### Breadcrumb Navigation

Create breadcrumbs using the route hierarchy:

```typescript
import { getFlattenedRoutes } from '@/config/routes';

function getBreadcrumbs(path: string) {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = [];
  
  let currentPath = '';
  const allRoutes = getFlattenedRoutes();
  
  // Add home
  breadcrumbs.push({
    label: 'Home',
    path: '/'
  });
  
  // Add path segments
  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`;
    
    // Find matching route for this path
    const matchingRoute = Object.values(allRoutes)
      .find(route => route.path === currentPath);
      
    if (matchingRoute) {
      breadcrumbs.push({
        label: matchingRoute.label,
        path: matchingRoute.path
      });
    }
  }
  
  return breadcrumbs;
}
```

## Conclusion

This centralized route configuration system provides a robust way to manage protected routes in your Next.js application. By defining all routes in a single place, you get consistent protection behavior, dynamic navigation based on user permissions, and better documentation of your application structure.

Remember to update the route configuration when adding new pages to your application to ensure they are properly protected and accessible to the right users.
