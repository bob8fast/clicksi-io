# Dynamic Pages Implementation Guide

This guide provides a complete step-by-step implementation of dynamic pages with Supabase, internationalization (i18n), and Next.js 15 App Router.

## 🎯 Features

- ✅ **App Router i18n** with locale-based routing (`/en/`, `/ua/`, `/pl/`)
- ✅ **Dynamic page rendering** from Supabase database
- ✅ **Multilingual content support** with automatic locale detection
- ✅ **Stable language persistence** using middleware and cookies
- ✅ **Multiple content formats** (HTML, JSON tree, plain text)
- ✅ **Dynamic CSS styling** with style field support
- ✅ **Server-side caching** with manual revalidation only
- ✅ **Legal page fallbacks** (database-first, then static components)
- ✅ **Conditional show fields** (title, description, metadata, button)
- ✅ **Conditional header/footer** for non-legal pages
- ✅ **Dual component system** (legal vs non-legal pages)
- ✅ **Flexible button system** with database control
- ✅ **SEO optimization** with keywords and images support
- ✅ **Manual revalidation API** with button controls
- ✅ **Organized component structure** in `/dynamic/` folder
- ✅ **Hydration-safe** client components
- ✅ **Content format auto-detection** and conversion

## 📋 Prerequisites

- Next.js 15.x with App Router
- Supabase account and project
- TailwindCSS (optional, for styling)
- TypeScript

## 🏗️ Architecture

### App Structure (with i18n)
```
src/app/
├── [locale]/                    # Locale-based routing
│   ├── (home)/                 # Home page group
│   │   └── page.tsx            # Home page with locale support
│   ├── [slug]/                 # Dynamic pages
│   │   └── page.tsx            # Dynamic page handler with locale
│   └── (main)/                 # Main routes group
│       └── (legal)/            # Legal pages group
│           ├── privacy-policy/
│           ├── terms-of-service/
│           └── cookie-policy/
├── api/                        # API routes (no locale)
│   └── dynamic-pages/
│       └── route.ts            # Revalidation API
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
└── middleware.ts               # Locale routing middleware
```

### Component Structure
```
src/components/
├── dynamic/
│   ├── ClientDynamicPage.tsx       # For legal pages (always show header/footer)
│   ├── StandaloneDynamicPage.tsx   # For non-legal pages (conditional header/footer)
│   └── RevalidationScript.tsx      # Manual revalidation functionality
└── layout/
    └── LanguageSwitcher.tsx         # Language selection with URL updates
```

### Library Structure
```
src/lib/
├── db.ts                       # Database functions with locale support
├── seo.ts                      # SEO metadata generation
├── legal-fallbacks.ts          # Static legal component fallbacks
└── cache.ts                    # Cache configuration
```

## 🌐 Internationalization (i18n)

### URL Structure
- `/` → Redirects to `/en/` (or user's preferred locale)
- `/en/` → English home page
- `/ua/` → Ukrainian home page
- `/pl/` → Polish home page
- `/en/privacy-policy` → English privacy policy
- `/ua/privacy-policy` → Ukrainian privacy policy
- `/en/your-slug` → English dynamic page
- `/ua/your-slug` → Ukrainian dynamic page

### Language Detection Priority
1. **Cookie** (user's previous choice) - highest priority
2. **Accept-Language header** (browser preference)
3. **Default locale** (English) - fallback

### Middleware Behavior
- Automatically redirects non-localized URLs to include locale
- Preserves user's language choice across navigation
- Handles all requests transparently
- Skips API routes and static files

## 📊 Database Schema

### Pages Table
```sql
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  style TEXT,
  description TEXT,
  keywords JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'draft',
  lang VARCHAR(10) DEFAULT 'en',          -- Language code
  images JSONB DEFAULT '[]'::jsonb,
  videos JSONB DEFAULT '[]'::jsonb,
  show_title BOOLEAN DEFAULT true,
  show_description BOOLEAN DEFAULT true,
  show_metadata BOOLEAN DEFAULT true,
  show_button BOOLEAN DEFAULT false,
  show_header BOOLEAN DEFAULT true,
  show_footer BOOLEAN DEFAULT true,
  button JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Unique constraint for slug per language
  UNIQUE(slug, lang)
);
```

### Key Database Functions
```typescript
// Get page by slug and locale
await getPageBySlug('about', 'ua')  // Ukrainian about page
await getPageBySlug('about', 'en')  // English about page

// Get all published slugs for a locale
await getAllPublishedSlugs('ua')     // Ukrainian slugs only
await getAllPublishedSlugs('en')     // English slugs only
```

## 🚀 Quick Start

### 1. Copy Implementation Files

Copy all files from this guide to your project:

```bash
# Copy the app structure
cp -r dynamic-pages-guide/src/app/[locale] src/app/
cp dynamic-pages-guide/src/app/layout.tsx src/app/
cp dynamic-pages-guide/src/middleware.ts src/

# Copy components and libraries
cp -r dynamic-pages-guide/src/components/dynamic src/components/
cp -r dynamic-pages-guide/src/lib/* src/lib/

# Copy configuration
cp dynamic-pages-guide/next.config.ts ./
```

### 2. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 3. Create Database Table

Run the SQL schema above in your Supabase SQL editor.

### 4. Test the Implementation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit different routes:
   - `http://localhost:3000/` → Redirects to `/en/`
   - `http://localhost:3000/en/` → English home
   - `http://localhost:3000/ua/` → Ukrainian home
   - `http://localhost:3000/en/privacy-policy` → Legal page

3. Add test data to your database:
   ```sql
   INSERT INTO pages (slug, title, content, lang, status) VALUES
   ('about', 'About Us', '<h1>About Us</h1><p>English content...</p>', 'en', 'published'),
   ('about', 'Про нас', '<h1>Про нас</h1><p>Українська версія...</p>', 'ua', 'published'),
   ('about', 'O nas', '<h1>O nas</h1><p>Polska wersja...</p>', 'pl', 'published');
   ```

4. Visit `http://localhost:3000/en/about` to see your dynamic page!

## 🔧 Configuration

### Adding New Locales

1. Update middleware locales:
   ```typescript
   // src/middleware.ts
   const locales = ['en', 'ua', 'pl', 'fr', 'de']; // Add new locales
   ```

2. Update generateStaticParams:
   ```typescript
   // src/app/[locale]/[slug]/page.tsx
   const locales = ['en', 'ua', 'pl', 'fr', 'de']; // Add new locales
   ```

3. Add locale-specific content to your database with the new `lang` values.

### Customizing Components

- **ClientDynamicPage**: For pages that need header/footer from layout
- **StandaloneDynamicPage**: For pages with conditional header/footer
- **Language Switcher**: Customize the language selection UI

## 🎨 Content Formats

The system supports multiple content formats:

### HTML Content
```json
{
  "content": "<h1>Title</h1><p>Paragraph...</p>"
}
```

### JSON Tree Content
```json
{
  "content": {
    "type": "div",
    "children": [
      {
        "type": "h1",
        "children": "Title"
      }
    ]
  }
}
```

### Plain Text
```json
{
  "content": "Simple text content"
}
```

## 🔄 Revalidation

Manual revalidation via API:

```bash
POST /api/dynamic-pages
{
  "slug": "about",
  "locale": "en"
}
```

Or revalidate all:

```bash
POST /api/dynamic-pages
{
  "revalidateAll": true
}
```

## 🎯 Best Practices

1. **Always provide fallbacks** for missing locale content
2. **Use consistent slug naming** across all languages
3. **Test all locale combinations** before deploying
4. **Monitor database performance** with proper indexing
5. **Cache aggressively** with manual revalidation only
6. **Validate content formats** before saving to database

## 🔍 Troubleshooting

### Language Not Persisting
- Check that middleware is working: visit `/` and see if it redirects to `/en/`
- Verify cookie is being set in language switcher
- Check browser developer tools for cookie presence

### Dynamic Pages Not Loading
- Verify database connection and credentials
- Check that pages have `status = 'published'`
- Ensure correct `lang` field in database
- Check middleware is not blocking the requests

### Build Errors
- Ensure all dependencies are installed
- Check TypeScript types are correctly imported
- Verify all required environment variables are set

## 📈 Performance

- **Static Generation**: Pre-builds all locale/slug combinations
- **Middleware Caching**: Efficient locale detection
- **Database Indexing**: Index on `(slug, lang, status)` for fast queries
- **Manual Revalidation**: Only regenerate when content changes

This implementation provides a robust, scalable foundation for multilingual dynamic pages with excellent performance and user experience.