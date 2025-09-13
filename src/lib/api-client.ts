// lib/api-client.ts - Shared API client for fetching page data
import { DynamicPage } from './db';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser: use relative URL
    return '';
  }

  // Server: use environment variable or fallback
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
};

// Helper function to parse dates from API response
function parseDatesInPage(page: any): DynamicPage {
  return {
    ...page,
    created_at: page.created_at ? new Date(page.created_at) : undefined,
    updated_at: page.updated_at ? new Date(page.updated_at) : undefined,
  };
}

// Helper function to fetch page data via API
export async function fetchPageData(slug: string): Promise<DynamicPage | null> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/dynamic-pages?slug=${slug}`, {
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (response.ok) {
      const page = await response.json();
      return parseDatesInPage(page);
    }
    return null;
  } catch (error) {
    console.error('Error fetching page data:', error);
    return null;
  }
}

// Helper function to fetch all pages with optional status filter
export async function fetchAllPages(status?: string): Promise<DynamicPage[]> {
  try {
    const baseUrl = getBaseUrl();
    const url = status
      ? `${baseUrl}/api/dynamic-pages?status=${status}`
      : `${baseUrl}/api/dynamic-pages`;

    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (response.ok) {
      const pages = await response.json();
      return pages.map((page: any) => parseDatesInPage(page));
    }
    return [];
  } catch (error) {
    console.error('Error fetching all pages:', error);
    return [];
  }
}

// Helper function to fetch dynamic page slugs (excluding legal pages)
export async function fetchDynamicPageSlugs(): Promise<string[]> {
  try {
    const pages = await fetchAllPages('published');
    // Filter out legal pages
    return pages
      .filter(page => !['privacy-policy', 'cookie-policy', 'terms-of-service'].includes(page.slug))
      .map(page => page.slug);
  } catch (error) {
    console.error('Error fetching dynamic page slugs:', error);
    return [];
  }
}

// Helper function for cache revalidation
export async function revalidatePages(type: 'all' | 'legal' | 'dynamic' | 'single', slug?: string) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/dynamic-pages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, slug })
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error(`Revalidation failed: ${response.status}`);
  } catch (error) {
    console.error('Error revalidating pages:', error);
    throw error;
  }
}