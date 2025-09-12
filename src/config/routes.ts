// config/routes.ts

import { BusinessType, UserRole } from "@/types";
import memoizee from "memoizee";

/**
 * Interface for route configuration
 */
export interface RouteConfig
{
    path: string;
    label: string;
    protected: boolean;
    roles?: UserRole[];
    businessType?: BusinessType[];
    children?: Record<string, RouteConfig>;
    description?: string; // Optional description for documentation
}

/**
 * Type definition for the complete routes object
 */
export type Routes = Record<string, RouteConfig>;

/**
 * The main routes configuration object
 * This defines all routes in the application and their protection status
 */
export const routes: Routes = {
    // Public routes
    home: {
        path: '/',
        label: 'Home',
        protected: false,
        description: 'Landing page accessible to all users'
    },
    about: {
        path: '/about',
        label: 'About',
        protected: false,
        description: 'About page with information about the platform'
    },
    contact: {
        path: '/contact',
        label: 'Contact',
        protected: false,
        description: 'Contact form for inquiries'
    },

    // Authentication routes
    auth: {
        path: '/auth',
        label: 'Authentication',
        protected: false,

        description: 'Authentication related pages',
        children: {
            "sign-in": {
                path: '/sign-in',
                label: 'Sign In',
                protected: false,

                description: 'User sign in page'
            },
            signup: {
                path: '/register',
                label: 'Register',
                protected: false,

                description: 'User registration page'
            },
            "sign-out": {
                path: '/sign-out',
                label: 'Sign Out',
                protected: false,

                description: 'User sign out page'
            },
            forgotPassword: {
                path: '/forgot-password',
                label: 'Forgot Password',
                protected: false,

                description: 'Password recovery request page'
            },
            resetPassword: {
                path: '/reset-password',
                label: 'Reset Password',
                protected: false,

                description: 'Password reset page'
            },
            error: {
                path: '/error',
                label: 'Auth Error',
                protected: false,

                description: 'Authentication error page'
            }
        }
    },

    // User routes - accessible to all authenticated users
    profile: {
        path: '/profile',
        label: 'Profile',
        protected: true,
        description: 'User profile management page'
    },
    settings: {
        path: '/settings',
        label: 'Settings',
        protected: true,
        description: 'User settings page'
    },

    // Consumer-specific routes
    consumer: {
        path: '/consumer',
        label: 'For You',
        protected: true,
        roles: ["Consumer", "Admin"],
        description: 'Consumer dashboard with personalized content',
        children: {
            dashboard: {
                path: '/consumer/dashboard',
                label: 'Dashboard',
                protected: true,
                roles: ["Consumer", "Admin"],

                description: 'Consumer main dashboard'
            },
            collections: {
                path: '/consumer/collections',
                label: 'Collections',
                protected: true,
                roles: ["Consumer", "Admin"],

                description: 'Saved collections for consumers'
            },
            favorites: {
                path: '/consumer/favorites',
                label: 'Favorites',
                protected: true,
                roles: ["Consumer", "Admin"],

                description: 'Favorite items for consumers'
            }
        }
    },

    // Creator-specific routes
    creator: {
        path: '/creator',
        label: 'Creator Studio',
        protected: true,
        roles: ["Creator", "Admin"],
        description: 'Creator dashboard and content management',
        children: {
            dashboard: {
                path: '/creator/dashboard',
                label: 'Dashboard',
                protected: true,
                roles: ["Creator", "Admin"],

                description: 'Creator analytics dashboard'
            },
            content: {
                path: '/creator/content',
                label: 'Content',
                protected: true,
                roles: ["Creator", "Admin"],

                description: 'Content management for creators'
            },
            links: {
                path: '/creator/links',
                label: 'Link Management',
                protected: true,
                roles: ["Creator", "Admin"],

                description: 'Affiliate link management'
            },
            analytics: {
                path: '/creator/analytics',
                label: 'Analytics',
                protected: true,
                roles: ["Creator", "Admin"],

                description: 'Detailed analytics for creators'
            },
            team: {
                path: '/creator/team',
                label: 'Team',
                protected: true,
                roles: ["Creator", "Admin"],

                description: 'Team management for creators'
            },
            integrations: {
                path: '/creator-management/integrations',
                label: 'Social Media',
                protected: true,
                roles: ["Creator", "Admin"],

                description: 'Social media integrations for creators'
            }
        }
    },

    // Brand-specific routes
    brand: {
        path: '/brand',
        label: 'Brand Portal',
        protected: true,
        roles: ["BusinessUser", "Admin"],
        description: 'Brand management and campaign tools',
        children: {
            dashboard: {
                path: '/brand/dashboard',
                label: 'Dashboard',
                protected: true,
                roles: ["BusinessUser", "Admin"],

                description: 'Brand analytics dashboard'
            },
            campaigns: {
                path: '/brand/campaigns',
                label: 'Campaigns',
                protected: true,
                roles: ["BusinessUser", "Admin"],

                description: 'Campaign management for brands'
            },
            products: {
                path: '/brand/products',
                label: 'Products',
                protected: true,
                roles: ["BusinessUser", "Admin"],

                description: 'Product management for brands'
            },
            creators: {
                path: '/brand/creators',
                label: 'Creators',
                protected: true,
                roles: ["BusinessUser", "Admin"],

                description: 'Creator discovery and management for brands'
            },
            team: {
                path: '/brand/team',
                label: 'Team',
                protected: true,
                roles: ["BusinessUser", "Admin"],

                description: 'Team management for brands'
            },
            integrations: {
                path: '/brand-management/integrations',
                label: 'Social Media',
                protected: true,
                roles: ["BusinessUser", "Admin"],

                description: 'Social media integrations for brands'
            }
        }
    },

    // Admin-only routes
    admin: {
        path: '/admin',
        label: 'Admin',
        protected: true,
        roles: ["Admin"],
        description: 'Admin dashboard and management tools',
        children: {
            dashboard: {
                path: '/admin/dashboard',
                label: 'Dashboard',
                protected: true,
                roles: ["Admin"],

                description: 'Admin overview dashboard'
            },
            users: {
                path: '/admin/users',
                label: 'Users',
                protected: true,
                roles: ["Admin"],

                description: 'User management for admins'
            },
            content: {
                path: '/admin/content',
                label: 'Content',
                protected: true,
                roles: ["Admin"],

                description: 'Content moderation for admins'
            },
            moderation: {
                path: '/admin/moderation',
                label: 'Moderation',
                protected: true,
                roles: ["Admin"],

                description: 'Content moderation and report management'
            },
            permissions: {
                path: '/admin/permissions',
                label: 'Permissions',
                protected: true,
                roles: ["Admin"],

                description: 'User permission management'
            },
            admins: {
                path: '/admin/admins',
                label: 'Admins',
                protected: true,
                roles: ["Admin"],

                description: 'Admin account management'
            },
            subscriptions: {
                path: '/admin/subscriptions',
                label: 'Subscriptions',
                protected: true,
                roles: ["Admin"],

                description: 'Subscription management for admins'
            },
            settings: {
                path: '/admin/settings',
                label: 'Settings',
                protected: true,
                roles: ["Admin"],

                description: 'Application settings for admins'
            }
        }
    },

    // Secured example routes
    secured: {
        path: '/secured',
        label: 'Secured',
        protected: true,

        description: 'Secured content example pages',
        children: {
            data: {
                path: '/secured/data',
                label: 'Secured Data',
                protected: true,

                description: 'Example of secured data access'
            }
        }
    },

    // System routes
    unauthorized: {
        path: '/unauthorized',
        label: 'Unauthorized',
        protected: false,

        description: 'Access denied page'
    },
    notFound: {
        path: '/404',
        label: 'Not Found',
        protected: false,

        description: '404 page not found'
    },

    // Integration routes
    integrations: {
        path: '/integrations',
        label: 'Integrations',
        protected: false,
        description: 'Integration callback and utility routes',
        children: {
            callback: {
                path: '/integrations/callback',
                label: 'OAuth Callback',
                protected: false,
                description: 'OAuth callback handler for social media integrations'
            }
        }
    }
};

/**
 * Helper functions to work with routes
 */

/**
 * Flattens the route hierarchy into a single-level object
 * Useful for middleware and route mapping
 */
export function getFlattenedRoutes(): Record<string, RouteConfig>
{
    const flattened: Record<string, RouteConfig> = {};

    const processRoute = (key: string, route: RouteConfig, parentKey?: string) =>
    {
        const routeKey = parentKey ? `${parentKey}.${key}` : key;
        flattened[routeKey] = { ...route };

        if (route.children)
        {
            Object.entries(route.children).forEach(([childKey, childRoute]) =>
            {
                processRoute(childKey, childRoute, routeKey);
            });
        }
    };

    Object.entries(routes).forEach(([key, route]) =>
    {
        processRoute(key, route);
    });

    return flattened;
}

export const getFlattenedRoutesMemoized = memoizee(getFlattenedRoutes);

/**
 * Gets all protected routes as path patterns for middleware
 */
export function getProtectedPathPatterns(): string[]
{
    const flattened = getFlattenedRoutesMemoized();
    const protectedPaths: string[] = [];

    Object.values(flattened).forEach(route =>
    {
        if (route.protected)
        {
            // Convert '/admin/users' to '/admin/:path*' if it's a top-level route with children
            const basePath = route.path.split('/').slice(0, 3).join('/');
            const pattern = route.children ? `${basePath}/:path*` : route.path;

            if (!protectedPaths.includes(pattern))
            {
                protectedPaths.push(pattern);
            }
        }
    });

    return [...new Set(protectedPaths)]; // Remove duplicates
}


export const getProtectedPathPatternsMemoized = memoizee(getProtectedPathPatterns);

/**
 * Check if a user has access to a specific route
 */
export function canAccessRoute(route: RouteConfig, userRole?: string | null): boolean
{
    if (!route.protected)
    {
        return true;
    }

    if (!userRole)
    {
        return false;
    }

    if (!route.roles)
    {
        return true; // Protected but no specific roles means any authenticated user
    }

    return route.roles.includes(userRole as UserRole);
}

/**
 * Generates a documentation object for each route in the application.
 * 
 * Retrieves all routes using a flattened structure and maps each route
 * to an object containing its key, path, protection status, roles allowed,
 * and description. This is useful for generating route documentation
 * or displaying route information in a structured format.
 * 
 * @returns An array of objects, each representing a route with the following properties:
 * - `key`: Unique identifier for the route.
 * - `path`: The URL path of the route.
 * - `protected`: Boolean indicating whether the route requires authentication.
 * - `roles`: Comma-separated string of roles allowed to access the route, or
 *   'Any authenticated user' if no specific roles are defined.
 * - `description`: Description of the route, or 'No description provided' if not available.
 */

function generateRouteDocs()
{
    const allRoutes = getFlattenedRoutesMemoized();

    return Object.entries(allRoutes).map(([key, route]) => ({
        key,
        path: route.path,
        protected: route.protected,
        roles: route.roles?.join(', ') || 'Any authenticated user',
        description: route.description || 'No description provided'
    }));
}


export const generateRouteDocsMemoized = memoizee(generateRouteDocs);

/**
* Generates breadcrumbs based on the given path.
* 
* @param path The URL path for which to generate breadcrumbs.
* @returns An array of objects, each representing a breadcrumb with the following properties:
* - `label`: The label to display for this breadcrumb.
* - `path`: The URL path for this breadcrumb.
*/
function getBreadcrumbs(path: string)
{
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs = [];

    let currentPath = '';
    const allRoutes = getFlattenedRoutesMemoized();

    // Add home
    breadcrumbs.push({
        label: 'Home',
        path: '/'
    });

    // Add path segments
    for (let i = 0; i < segments.length; i++)
    {
        currentPath += `/${segments[i]}`;

        // Find matching route for this path
        const matchingRoute = Object.values(allRoutes)
            .find(route => route.path === currentPath);

        if (matchingRoute)
        {
            breadcrumbs.push({
                label: matchingRoute.label,
                path: matchingRoute.path
            });
        }
    }

    return breadcrumbs;
}

export function GetMostSpecificRoute(pathname: string)
{
    // Get all routes in a flat structure
    const allRoutes = getFlattenedRoutesMemoized();

    // Find the most specific matching route
    const matchingRoute = Object.values(allRoutes)
        .filter(route =>
        {
            // Check exact match first
            if (route.path === pathname) return true;

            // Check if this is a parent route of the current path
            // e.g., '/admin' is a parent of '/admin/users'
            const routeSegments = route.path.split('/');
            const pathSegments = pathname.split('/');

            // The route must be a prefix of the path and have fewer segments
            return pathSegments.slice(0, routeSegments.length).join('/') === route.path;
        })
        // Sort by path length (descending) to find the most specific match
        .sort((a, b) => b.path.length - a.path.length)[0];

    return matchingRoute;
}


export const GetMostSpecificRouteMemoized = memoizee(GetMostSpecificRoute);
