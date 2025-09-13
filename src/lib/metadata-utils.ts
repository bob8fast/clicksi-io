import { Metadata } from 'next';

// Title mapping for all app routes (shared between metadata and hook)
export const titleMap: Record<string, string> = {
  // Root
  '/': 'Home',
  
  // Auth routes
  '/sign-in': 'Sign In',
  '/register': 'Register',
  '/registration-success': 'Registration Successful',
  '/verify-email': 'Verify Email',
  '/error': 'Authentication Error',
  '/sign-out': 'Signing Out',
  '/forgot-password': 'Forgot Password',
  '/reset-password': 'Reset Password',
  
  // Main routes
  '/about': 'About Us',
  '/dashboard/subscription-overview': 'Subscription Overview',
  '/profile': 'Profile',
  '/premium-features': 'Premium Features',
  '/team': 'Team',
  '/unauthorized': 'Unauthorized',
  '/verification': 'Verification',
  
  // Brands
  '/brands': 'Brands',
  '/brands/[id]': 'Brand Details',
  '/brands/[id]/edit': 'Edit Brand',
  
  // Creators
  '/creators': 'Creators',
  '/creators/[handle]': 'Creator Profile',
  
  // Products
  '/products': 'Products',
  '/products/[id]': 'Product Details',
  
  // Retailers
  '/retailers': 'Retailers',
  '/retailers/[id]': 'Retailer Details',
  '/retailers/[id]/edit': 'Edit Retailer',
  
  // Categories
  '/categories': 'Categories',
  
  // Legal
  '/cookie-policy': 'Cookie Policy',
  '/privacy-policy': 'Privacy Policy',  
  '/terms-of-service': 'Terms of Service',
  
  // Subscription
  '/subscription': 'Subscription',
  '/subscription/checkout': 'Checkout',
  '/subscription/manage': 'Manage Subscription',
  '/subscription/payments': 'Payment History',
  '/subscription/success': 'Subscription Successful',
  '/subscription/trial': 'Trial Subscription',
  
  // Admin Management
  '/admin': 'Admin Dashboard',
  '/admin/admins': 'Manage Admins',
  '/admin/admins/create': 'Create Admin',
  '/admin/admins/[adminId]': 'Admin Details',
  '/admin/categories': 'Manage Categories',
  '/admin/moderation': 'Content Moderation',
  '/admin/permissions': 'Permissions',
  '/admin/subscriptions': 'Manage Subscriptions',
  '/admin/trial-requests': 'Trial Requests',
  '/admin/users': 'Manage Users',
  '/admin/users/[userId]': 'User Details',
  '/admin/verification': 'Verification Queue',
  '/admin/verification/[id]': 'Verification Details',
  
  // Brand Management
  '/brand-management': 'Brand Dashboard',
  '/brand-management/analytics': 'Brand Analytics',
  '/brand-management/creators': 'Brand Creators',
  '/brand-management/products': 'Manage Products',
  '/brand-management/products/create': 'Create Product',
  '/brand-management/products/[id]': 'Product Details',
  '/brand-management/products/[id]/edit': 'Edit Product',
  '/brand-management/retailers': 'Brand Retailers',
  '/brand-management/retailers/create': 'Add Retailer',
  '/brand-management/retailers/[id]': 'Retailer Details',
  '/brand-management/retailers/[id]/edit': 'Edit Retailer',
  
  // Creator Management  
  '/creator-management': 'Creator Dashboard',
  '/creator-management/analytics': 'Creator Analytics',
  '/creator-management/content': 'Content Management',
  '/creator-management/links': 'Manage Links',
  '/creator-management/team': 'Creator Team',
  
  // Retailer Management
  '/retailer-management': 'Retailer Dashboard',
  '/retailer-management/brands': 'Partner Brands',
  '/retailer-management/distribution': 'Distribution Management',
};

/**
 * Generate metadata for a page based on its route
 * Uses the shared title mapping for consistent page titles
 */
export function generatePageMetadata(
  route: string, 
  customTitle?: string,
  customDescription?: string
): Metadata {
  const title = customTitle || titleMap[route] || 'Clicksi';
  
  return {
    title,
    description: customDescription || getDefaultDescription(route),
  };
}

/**
 * Get default description based on route category
 */
function getDefaultDescription(route: string): string {
  if (route.startsWith('/auth') || route.includes('sign-in') || route.includes('register')) {
    return 'Access your Clicksi account to manage beauty collaborations';
  }
  
  if (route.startsWith('/admin')) {
    return 'Admin dashboard for managing Clicksi platform';
  }
  
  if (route.startsWith('/brand-management')) {
    return 'Manage your brand, products, and creator collaborations';
  }
  
  if (route.startsWith('/creator-management')) {
    return 'Manage your content, collaborations, and creator profile';
  }
  
  if (route.startsWith('/retailer-management')) {
    return 'Manage your retail operations and brand partnerships';
  }
  
  if (route.includes('brands')) {
    return 'Discover and connect with Ukrainian beauty brands';
  }
  
  if (route.includes('creators')) {
    return 'Find talented creators for beauty brand collaborations';
  }
  
  if (route.includes('products')) {
    return 'Explore beauty products from Ukrainian brands';
  }
  
  if (route.includes('subscription')) {
    return 'Manage your Clicksi subscription and features';
  }
  
  return 'Clicksi - Connecting beauty brands with creators';
}

/**
 * Internal function to resolve page title from pathname
 * Handles both exact matches and dynamic routes
 */
function resolveTitleFromPath(pathname: string): string {
  // Try exact match first
  let title = titleMap[pathname];
  
  // If no exact match, try to find a dynamic route match
  if (!title) {
    // Handle dynamic routes like /brands/123 -> /brands/[id]
    const pathSegments = pathname.split('/');
    for (const [route, routeTitle] of Object.entries(titleMap)) {
      const routeSegments = route.split('/');
      
      if (pathSegments.length === routeSegments.length) {
        const isMatch = routeSegments.every((segment, index) => {
          return segment.startsWith('[') && segment.endsWith(']') || segment === pathSegments[index];
        });
        
        if (isMatch) {
          title = routeTitle;
          break;
        }
      }
    }
  }
  
  return title || 'Clicksi';
}

/**
 * Get page title from pathname without setting it
 * Useful for components that need to display the current page title
 * 
 * @example
 * // In a breadcrumb component
 * const currentPageTitle = getPageTitle(pathname);
 * 
 * // With custom title
 * const title = getPageTitle('/brands/123', 'Awesome Brand');
 */
export function getPageTitle(pathname: string, customTitle?: string): string {
  return customTitle || resolveTitleFromPath(pathname);
}

/**
 * Generate metadata for dynamic routes (pages with [id], [slug], etc.)
 * 
 * This function creates SEO-friendly metadata for pages that depend on dynamic data.
 * It combines the entity name with the base page title to create unique, descriptive titles.
 * 
 * @param baseRoute - The route pattern from titleMap (e.g., '/brands/[id]', '/products/[id]')
 * @param entityName - The specific entity name fetched from your API (e.g., brand name, product name)
 * @param customDescription - Optional custom description for SEO
 * 
 * @returns Metadata object with title and description
 * 
 * @example
 * // In src/app/(main)/brands/[id]/page.tsx
 * export async function generateMetadata({ params }: { params: { id: string } }) {
 *   const brand = await fetchBrand(params.id);
 *   return generateDynamicMetadata(
 *     '/brands/[id]',                    // Base route from titleMap
 *     brand.name,                        // "L'Oréal"
 *     `Discover ${brand.name} products`  // Custom SEO description
 *   );
 * }
 * // Result: { title: "L'Oréal - Brand Details", description: "Discover L'Oréal products" }
 * // Final browser title: "L'Oréal - Brand Details - Clicksi"
 * 
 * @example
 * // In src/app/(main)/products/[id]/page.tsx
 * export async function generateMetadata({ params }: { params: { id: string } }) {
 *   const product = await fetchProduct(params.id);
 *   return generateDynamicMetadata(
 *     '/products/[id]',
 *     product.name,
 *     `${product.name} - ${product.shortDescription}`
 *   );
 * }
 * // Result: { title: "Ultra Serum - Product Details", description: "Ultra Serum - Hydrating face serum" }
 * 
 * @example
 * // In src/app/(management)/admin/users/[userId]/page.tsx
 * export async function generateMetadata({ params }: { params: { userId: string } }) {
 *   const user = await fetchUser(params.userId);
 *   return generateDynamicMetadata(
 *     '/admin/users/[userId]',
 *     user.email,
 *     `Manage user account for ${user.email}`
 *   );
 * }
 * // Result: { title: "user@example.com - User Details", description: "Manage user account..." }
 * 
 * @note This function should be used inside Next.js generateMetadata() functions,
 *       not in regular React components. For components that need title info,
 *       use getPageTitle() instead.
 * 
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export function generateDynamicMetadata(
  baseRoute: string,
  entityName?: string,
  customDescription?: string
): Metadata {
  const baseTitle = titleMap[baseRoute] || 'Details';
  const title = entityName ? `${entityName} - ${baseTitle}` : baseTitle;
  
  return {
    title,
    description: customDescription || getDefaultDescription(baseRoute),
  };
}