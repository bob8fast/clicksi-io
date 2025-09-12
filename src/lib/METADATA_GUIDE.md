# Next.js Metadata Best Practices Guide

This guide explains how to properly implement metadata in the Clicksi web platform using Next.js 13+ App Router.

## Table of Contents

- [Overview](#overview)
- [Root Layout Setup](#root-layout-setup)
- [Static Pages](#static-pages)
- [Dynamic Pages](#dynamic-pages)
- [Essential Metadata Fields](#essential-metadata-fields)
- [SEO Best Practices](#seo-best-practices)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

## Overview

The Clicksi platform uses a **template-based metadata system** where:

- **Root layout** (`src/app/layout.tsx`) defines the template and defaults
- **Individual pages** define their specific titles and descriptions
- **Dynamic pages** use `generateMetadata()` for data-dependent metadata
- **Utility functions** in `metadata-utils.ts` provide consistent helpers

## Root Layout Setup

The root layout defines the metadata template:

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: {
    template: '%s - Clicksi',  // Template for child pages
    default: 'Clicksi - Connect Brands with Creators',  // Fallback
  },
  description: 'Where beauty brands and creators unite to create impactful collaborations',
  keywords: ['beauty brands', 'creators', 'influencer marketing', 'collaborations'],
  authors: [{ name: 'Clicksi' }],
  creator: 'Clicksi',
  metadataBase: new URL('https://clicksi.io'),
  
  // OpenGraph for social media
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://clicksi.io',
    siteName: 'Clicksi',
    title: {
      template: '%s - Clicksi',
      default: 'Clicksi - Connect Brands with Creators',
    },
    description: 'Where beauty brands and creators unite to create impactful collaborations',
    images: [
      {
        url: '/dark-icon.png',
        width: 1200,
        height: 630,
        alt: 'Clicksi - Connect Brands with Creators',
      },
    ],
  },
  
  // Twitter/X cards
  twitter: {
    card: 'summary_large_image',
    title: {
      template: '%s - Clicksi',
      default: 'Clicksi - Connect Brands with Creators',
    },
    description: 'Where beauty brands and creators unite to create impactful collaborations',
    images: ['/dark-icon.png'],
    creator: '@clicksi',
  },
  
  // Icons and favicons
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: '16x16' },
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};
```

## Static Pages

For pages with fixed content, use the `generatePageMetadata()` utility:

```typescript
// src/app/(auth)/sign-in/page.tsx
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata('/sign-in');
// Result: "Sign In - Clicksi"

export default function SignInPage() {
  return <SignInForm />;
}
```

### Custom Static Metadata

For pages needing custom titles or descriptions:

```typescript
// src/app/(main)/about/page.tsx
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata(
  '/about',
  'About Us',  // Custom title
  'Learn about Clicksi\'s mission to connect Ukrainian beauty brands with talented creators'  // Custom description
);

export default function AboutPage() {
  return <AboutContent />;
}
```

## Dynamic Pages

For pages with `[id]`, `[slug]`, or other dynamic segments, use `generateMetadata()`:

```typescript
// src/app/(main)/brands/[id]/page.tsx
import { generateDynamicMetadata } from '@/lib/metadata-utils';

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    // Fetch the data
    const brand = await fetchBrand(params.id);
    
    // Generate metadata
    return generateDynamicMetadata(
      '/brands/[id]',                           // Base route
      brand.name,                               // Entity name
      `Discover ${brand.name} beauty products and creator collaborations. Connect with top Ukrainian beauty brands.`  // SEO description
    );
  } catch (error) {
    // Fallback for failed fetches
    return generateDynamicMetadata('/brands/[id]');
  }
}

export default async function BrandPage({ params }: { params: { id: string } }) {
  const brand = await fetchBrand(params.id);
  return <BrandDetails brand={brand} />;
}
```

### Advanced Dynamic Metadata

For complex dynamic metadata with custom OpenGraph images:

```typescript
// src/app/(main)/products/[id]/page.tsx
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await fetchProduct(params.id);
  
  return {
    title: `${product.name} - Product Details`,
    description: `${product.name} - ${product.shortDescription}. Available from ${product.brand.name}.`,
    
    // Custom OpenGraph for product
    openGraph: {
      title: `${product.name} - ${product.brand.name}`,
      description: product.description,
      images: [
        {
          url: product.imageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    
    // Twitter card for product
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - ${product.brand.name}`,
      description: product.shortDescription,
      images: [product.imageUrl],
    },
  };
}
```

## Essential Metadata Fields

### 🎯 **Critical Fields (Must Have)**

| Field | Purpose | Example |
|-------|---------|---------|
| `title` | Browser tab title & search results | `"Sign In - Clicksi"` |
| `description` | Search engine snippet | `"Access your Clicksi account to manage beauty collaborations"` |

### 📱 **Social Media Fields (Highly Recommended)**

| Field | Purpose | Platform |
|-------|---------|----------|
| `openGraph.title` | Social media card title | Facebook, LinkedIn |
| `openGraph.description` | Social media card description | Facebook, LinkedIn |
| `openGraph.images` | Social media card image | Facebook, LinkedIn |
| `twitter.title` | Twitter/X card title | Twitter/X |
| `twitter.description` | Twitter/X card description | Twitter/X |
| `twitter.images` | Twitter/X card image | Twitter/X |

### 🔍 **SEO Enhancement Fields (Optional)**

| Field | Purpose | Benefit |
|-------|---------|---------|
| `keywords` | Search keywords (limited value) | Minor SEO boost |
| `authors` | Content authorship | Rich snippets |
| `creator` | Platform creator | Brand attribution |
| `robots` | Search engine directives | Control indexing |

## SEO Best Practices

### ✅ **Title Guidelines**

- **Length**: 50-60 characters (including " - Clicksi")
- **Format**: `"Specific Page Title - Clicksi"`
- **Unique**: Each page should have a unique title
- **Descriptive**: Clearly describe the page content

```typescript
// ✅ Good
"Ultra Hydrating Serum - Product Details - Clicksi"  // 47 characters

// ❌ Too long
"Ultra Hydrating Vitamin C Serum with Hyaluronic Acid and Retinol - Product Details - Clicksi"  // 92 characters

// ❌ Too generic
"Product - Clicksi"  // Not descriptive
```

### ✅ **Description Guidelines**

- **Length**: 150-160 characters
- **Compelling**: Make users want to click
- **Informative**: Accurately describe the page
- **Include keywords**: Naturally incorporate relevant terms

```typescript
// ✅ Good
"Discover L'Oréal beauty products and creator collaborations. Connect with top Ukrainian beauty brands on Clicksi."  // 115 characters

// ❌ Too long
"Discover L'Oréal beauty products including skincare, makeup, haircare, and fragrance. Find creator collaborations, read reviews, compare prices, and connect with top Ukrainian beauty brands and influencers on the Clicksi platform."  // 234 characters

// ❌ Too short
"L'Oréal products."  // Not informative enough
```

### ✅ **Image Guidelines**

- **Dimensions**: 1200x630px (Facebook) or 1200x600px (Twitter)
- **Format**: JPG or PNG
- **Size**: Under 1MB
- **Alt text**: Always include descriptive alt text

## Common Patterns

### Pattern 1: Simple Static Page

```typescript
// For most static pages
export const metadata = generatePageMetadata('/dashboard');
```

### Pattern 2: Custom Description

```typescript
// When you need a specific description
export const metadata = generatePageMetadata(
  '/premium-features',
  undefined,  // Use default title
  'Unlock advanced features for brands and creators with Clicksi Premium subscription'
);
```

### Pattern 3: Dynamic Entity Page

```typescript
// For [id] routes
export async function generateMetadata({ params }) {
  const entity = await fetchEntity(params.id);
  return generateDynamicMetadata(
    '/entities/[id]',
    entity.name,
    `Learn more about ${entity.name} and their offerings`
  );
}
```

### Pattern 4: Search/Filter Pages

```typescript
// For pages with search parameters
export async function generateMetadata({ searchParams }) {
  const query = searchParams.q;
  
  if (query) {
    return {
      title: `Search: ${query}`,
      description: `Search results for "${query}" on Clicksi platform`,
    };
  }
  
  return generatePageMetadata('/search');
}
```

## Troubleshooting

### Issue: Title Not Updating

**Problem**: Page title shows generic "Clicksi - Connect Brands with Creators"

**Solutions**:
1. Check if page has `export const metadata` or `export async function generateMetadata`
2. Verify the route exists in `titleMap` in `metadata-utils.ts`
3. Ensure no client-side `document.title` overrides

### Issue: Dynamic Metadata Not Working

**Problem**: Dynamic pages show generic titles instead of entity names

**Solutions**:
1. Make sure you're using `generateMetadata()` function, not static `metadata`
2. Check if the data fetch is working correctly
3. Add error handling for failed fetches

```typescript
// ✅ Correct with error handling
export async function generateMetadata({ params }) {
  try {
    const brand = await fetchBrand(params.id);
    return generateDynamicMetadata('/brands/[id]', brand.name);
  } catch (error) {
    // Fallback to generic metadata
    return generateDynamicMetadata('/brands/[id]');
  }
}
```

### Issue: Social Media Cards Not Showing

**Problem**: Facebook/Twitter not showing rich cards

**Solutions**:
1. Verify `openGraph` and `twitter` fields are set
2. Check image URLs are absolute (not relative)
3. Test with Facebook Debugger and Twitter Card Validator
4. Ensure images are publicly accessible

### Issue: SEO Description Too Long

**Problem**: Search engines truncate descriptions

**Solutions**:
1. Keep descriptions under 160 characters
2. Put most important info at the beginning
3. Use `customDescription` parameter in utility functions

## Tools for Testing

- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Google Search Console**: Monitor how pages appear in search
- **Browser Dev Tools**: Check `<head>` elements are correctly rendered

## Examples in Codebase

Check these files for real implementations:

- `src/app/(auth)/sign-in/page.tsx` - Simple static metadata
- `src/app/(auth)/register/page.tsx` - Static with custom description  
- `src/lib/metadata-utils.ts` - All utility functions with examples
- `src/app/layout.tsx` - Root template setup

---

**Remember**: Good metadata improves SEO, social media sharing, and user experience. Always test your metadata before deploying to production!