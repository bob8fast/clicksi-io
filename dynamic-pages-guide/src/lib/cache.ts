export const CACHE_TAGS = {
  PAGES: 'pages',
  PAGE: (slug: string) => `page:${slug}`,
} as const

export const REVALIDATE_TIME = {
  PAGES: false, // Only revalidate manually or on restart
  PAGE: false,  // Only revalidate manually or on restart
} as const

export function getCacheHeaders() {
  return {
    'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate=86400', // 1 year cache
  }
}

export function getPageCacheKey(slug: string) {
  return `page:${slug}`
}