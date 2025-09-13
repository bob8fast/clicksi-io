// lib/seo.ts - SEO utilities and metadata generation
import { Metadata } from 'next';
import { DynamicPage } from './db';

interface SEOConfig {
  defaultTitle?: string;
  titleTemplate?: string;
  defaultDescription?: string;
  siteUrl?: string;
  defaultImage?: string;
  twitterHandle?: string;
}

const defaultSEOConfig: SEOConfig = {
  defaultTitle: 'Clicksi - Connect Brands with Creators',
  titleTemplate: '%s - Clicksi',
  defaultDescription: 'Where beauty brands and creators unite to create impactful collaborations',
  siteUrl: 'https://clicksi.io',
  defaultImage: '/dark-icon.png',
  twitterHandle: '@clicksi',
};

// Helper function to safely convert date to ISO string
function toISOStringSafe(date: Date | string | undefined | null): string | undefined {
  if (!date) return undefined;

  try {
    if (date instanceof Date) {
      return date.toISOString();
    }

    if (typeof date === 'string') {
      return new Date(date).toISOString();
    }

    return undefined;
  } catch (error) {
    console.warn('Failed to convert date to ISO string:', date, error);
    return undefined;
  }
}

// Generate metadata for pages from database
export function generatePageMetadata(
  page: DynamicPage,
  config: SEOConfig = {}
): Metadata {
  const seoConfig = { ...defaultSEOConfig, ...config };

  const title = page.title;
  const description = page.description || seoConfig.defaultDescription || '';
  const url = `${seoConfig.siteUrl}/${page.slug}`;

  // Extract first image for social sharing
  const firstImage = page.images && Array.isArray(page.images) && page.images.length > 0
    ? page.images[0]
    : null;

  const ogImage = firstImage?.url || seoConfig.defaultImage;

  return {
    title,
    description,
    keywords: page.keywords?.join(', '),
    authors: [{ name: 'Clicksi' }],
    creator: 'Clicksi',
    metadataBase: new URL(seoConfig.siteUrl || 'https://clicksi.io'),
    alternates: {
      canonical: url,
      languages: page.lang ? {
        [page.lang]: url,
        'x-default': url
      } : undefined,
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: 'Clicksi',
      locale: page.lang || 'en_US',
      publishedTime: toISOStringSafe(page.created_at),
      modifiedTime: toISOStringSafe(page.updated_at),
      images: ogImage ? [{
        url: ogImage,
        width: firstImage?.width || 1200,
        height: firstImage?.height || 630,
        alt: firstImage?.alt || title,
      }] : undefined,
      authors: ['Clicksi'],
    },
    twitter: {
      card: 'summary_large_image',
      site: seoConfig.twitterHandle,
      creator: seoConfig.twitterHandle,
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: {
      index: page.status === 'published',
      follow: page.status === 'published',
      googleBot: {
        index: page.status === 'published',
        follow: page.status === 'published',
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Generate structured data for pages
export function generateStructuredData(page: DynamicPage, config: SEOConfig = {}) {
  const seoConfig = { ...defaultSEOConfig, ...config };
  const url = `${seoConfig.siteUrl}/${page.slug}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.description,
    url,
    datePublished: toISOStringSafe(page.created_at),
    dateModified: toISOStringSafe(page.updated_at),
    author: {
      '@type': 'Organization',
      name: 'Clicksi',
      url: seoConfig.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Clicksi',
      url: seoConfig.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.siteUrl}${seoConfig.defaultImage}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(page.images && Array.isArray(page.images) && page.images.length > 0 && {
      image: page.images.map(img => ({
        '@type': 'ImageObject',
        url: img.url,
        width: img.width,
        height: img.height,
        caption: img.alt || img.caption,
      })),
    }),
    ...(page.keywords && page.keywords.length > 0 && {
      keywords: page.keywords.join(', '),
    }),
    inLanguage: page.lang || 'en',
  };

  return structuredData;
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(
  page: DynamicPage,
  config: SEOConfig = {}
) {
  const seoConfig = { ...defaultSEOConfig, ...config };

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: seoConfig.siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.title,
        item: `${seoConfig.siteUrl}/${page.slug}`,
      },
    ],
  };
}

// Generate legal page specific metadata
export function generateLegalPageMetadata(
  page: DynamicPage,
  config: SEOConfig = {}
): Metadata {
  const seoConfig = { ...defaultSEOConfig, ...config };

  return {
    title: page.title,
    description: page.description || `${page.title} - Clicksi`,
    authors: [{ name: 'Clicksi' }],
    creator: 'Clicksi',
    metadataBase: new URL(seoConfig.siteUrl || 'https://clicksi.io'),
    alternates: {
      canonical: `${seoConfig.siteUrl}/${page.slug}`,
    },
    openGraph: {
      type: 'website',
      title: page.title,
      description: page.description || `${page.title} - Clicksi`,
      url: `${seoConfig.siteUrl}/${page.slug}`,
      siteName: 'Clicksi',
    },
    twitter: {
      card: 'summary',
      site: seoConfig.twitterHandle,
      title: page.title,
      description: page.description || `${page.title} - Clicksi`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Helper function to generate all structured data for a page
export function generateAllStructuredData(
  page: DynamicPage,
  config: SEOConfig = {}
) {
  return {
    article: generateStructuredData(page, config),
    breadcrumb: generateBreadcrumbStructuredData(page, config),
  };
}