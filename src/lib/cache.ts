// lib/cache.ts - Caching utilities for pages
import { unstable_cache } from 'next/cache';
import { getPageBySlug, getDynamicPageSlugs, getAllPages, DynamicPage, getLegalPageContent } from './db';

// Cache configurations
export const CACHE_CONFIGS = {
  LEGAL_PAGES: {
    revalidate: 86400, // 24 hours for legal pages
    tags: ['legal-pages'],
  },
  DYNAMIC_PAGES: {
    revalidate: 86400, // 24 hours for dynamic pages
    tags: ['dynamic-pages'],
  },
  PAGE_LIST: {
    revalidate: 3600, // 1 hour for page lists
    tags: ['page-lists'],
  },
} as const;

// Cached version of getPageBySlug for dynamic pages
export const getCachedPageBySlug = unstable_cache(
  async (slug: string): Promise<DynamicPage | null> => {
    return await getPageBySlug(slug);
  },
  ['page-by-slug'],
  {
    revalidate: CACHE_CONFIGS.DYNAMIC_PAGES.revalidate,
    tags: ['dynamic-pages', 'page-by-slug'],
  }
);

// Cached version of getLegalPageContent
export const getCachedLegalPageContent = unstable_cache(
  async (slug: string): Promise<DynamicPage | null> => {
    return await getLegalPageContent(slug);
  },
  ['legal-page-content'],
  {
    revalidate: CACHE_CONFIGS.LEGAL_PAGES.revalidate,
    tags: ['legal-pages', 'legal-page-content'],
  }
);

// Cached version of getDynamicPageSlugs
export const getCachedDynamicPageSlugs = unstable_cache(
  async (): Promise<string[]> => {
    return await getDynamicPageSlugs();
  },
  ['dynamic-page-slugs'],
  {
    revalidate: CACHE_CONFIGS.PAGE_LIST.revalidate,
    tags: ['page-lists', 'dynamic-page-slugs'],
  }
);

// Cached version of getAllPages
export const getCachedAllPages = unstable_cache(
  async (status?: string): Promise<DynamicPage[]> => {
    return await getAllPages(status);
  },
  ['all-pages'],
  {
    revalidate: CACHE_CONFIGS.PAGE_LIST.revalidate,
    tags: ['page-lists', 'all-pages'],
  }
);

// Memory cache for frequently accessed data (client-side)
class MemoryCache<T> {
  private cache = new Map<string, { data: T; expires: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: T, ttl?: number): void {
    const expires = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data, expires });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Export memory cache instance
export const memoryCache = new MemoryCache<any>();

// Helper function for cache warming
export async function warmCache(): Promise<void> {
  try {
    console.log('Warming cache...');

    // Warm dynamic page slugs cache
    await getCachedDynamicPageSlugs();

    // Warm published pages cache
    await getCachedAllPages('published');

    console.log('Cache warmed successfully');
  } catch (error) {
    console.error('Error warming cache:', error);
  }
}

// Cache statistics
export function getCacheStats() {
  return {
    memoryCache: {
      size: memoryCache.size(),
    },
  };
}