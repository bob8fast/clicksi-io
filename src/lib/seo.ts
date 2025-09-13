import type { Metadata } from 'next'
import { PageRecord } from './db'

interface SEOConfig {
  title: string
  description: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  url: string
}

export function generatePageSEO(page: PageRecord, baseUrl: string): Metadata {
  const url = `${baseUrl}/${page.slug}`

  return {
    title: page.og_title || page.title,
    description: page.meta_description || page.og_description,
    keywords: page.meta_keywords,
    openGraph: {
      title: page.og_title || page.title,
      description: page.og_description || page.meta_description,
      url,
      type: 'article',
      images: page.og_image ? [{ url: page.og_image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.og_title || page.title,
      description: page.og_description || page.meta_description,
      images: page.og_image ? [page.og_image] : undefined,
    },
    alternates: {
      canonical: url,
    },
  }
}

export function generateDefaultSEO(): Metadata {
  return {
    title: 'Page Not Found',
    description: 'The requested page could not be found.',
    robots: 'noindex, nofollow',
  }
}