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
    title: page.title,
    description: page.description,
    keywords: page.keywords?.join(', '),
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      type: 'article',
      images: page.images?.length ? page.images.map(img => ({ url: img })) : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: page.images?.length ? page.images : undefined,
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