# Dynamic Pages Implementation Guide

This guide provides a complete step-by-step implementation of dynamic pages with Supabase, ISR (Incremental Static Regeneration), multilingual support, and manual revalidation for Next.js 15.

## 🎯 Features

- ✅ **Dynamic page rendering** from Supabase database
- ✅ **Multilingual content support** with language switcher
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
- ✅ **Language preference persistence** with localStorage and cookies

## 📋 Prerequisites

- Next.js 15.x
- Supabase account and project
- TailwindCSS with custom CSS variables
- TypeScript

## 🏗️ Architecture

### Component Structure
```
src/components/
├── dynamic/
│   ├── ClientDynamicPage.tsx       # For legal pages (always show header/footer via layout)
│   ├── StandaloneDynamicPage.tsx   # For non-legal pages (conditional header/footer)
│   └── RevalidationScript.tsx      # Manual revalidation functionality
├── layout/
│   └── LanguageSwitcher.tsx        # Language selection dropdown
├── contexts/
│   └── LanguageContext.tsx         # Language state management
└── hooks/
    └── usePreferredLanguage.ts     # Language preference hook
```

### Page Types
- **Legal Pages** (privacy-policy, terms-of-service, cookie-policy)
  - Always render with header/footer via `(main)` layout
  - Use `ClientDynamicPage` component
  - Legal page styling with proper spacing

- **Non-Legal Pages** (faq, demo-menu, etc.)
  - Conditional header/footer via `show_header`/`show_footer` database fields
  - Use `StandaloneDynamicPage` component
  - Full layout control

## 🗄️ Database Setup

### 1. Create Supabase Table

```sql
-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content JSONB NOT NULL, -- Stores content in various formats
  style JSONB, -- Stores CSS styling {type: "css", value: "CSS content"}

  -- Additional fields
  keywords TEXT[] DEFAULT '{}', -- Array of keywords
  status TEXT DEFAULT 'published', -- published, draft, archived
  lang TEXT DEFAULT 'en',
  images TEXT[] DEFAULT '{}', -- Array of image URLs
  videos TEXT[] DEFAULT '{}', -- Array of video URLs

  -- Display options
  show_title BOOLEAN DEFAULT true,
  show_description BOOLEAN DEFAULT true,
  show_metadata BOOLEAN DEFAULT true,
  show_button BOOLEAN DEFAULT true,
  show_header BOOLEAN DEFAULT false,
  show_footer BOOLEAN DEFAULT false,
  button JSONB DEFAULT '{"type": "html", "value": "<a href=\"/\" class=\"inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-2 hover:text-light hover:bg-accent rounded-md transition-colors border border-gray-1\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"m12 19-7-7 7-7\"/><path d=\"M19 12H5\"/></svg>Back</a>"}',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_lang ON pages(lang);
CREATE INDEX IF NOT EXISTS idx_pages_slug_lang ON pages(slug, lang);
CREATE INDEX IF NOT EXISTS idx_pages_status_lang ON pages(status, lang);
CREATE INDEX IF NOT EXISTS idx_pages_created_at ON pages(created_at);
CREATE INDEX IF NOT EXISTS idx_pages_updated_at ON pages(updated_at);
CREATE INDEX IF NOT EXISTS idx_pages_keywords ON pages USING GIN (keywords);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for public read access to published pages
CREATE POLICY "Allow public read access to published pages"
ON pages FOR SELECT
USING (status = 'published');

-- Create RLS policy for authenticated users to manage pages
-- Note: Adjust this based on your authentication requirements
CREATE POLICY "Allow authenticated users to manage pages"
ON pages FOR ALL
USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT SELECT ON pages TO anon;
GRANT ALL ON pages TO authenticated;
```

### 2. Insert Sample Data

Run the contents of `database/sample-data.sql` to create test pages.

## 📄 Content Formats

The dynamic pages system supports multiple content formats for maximum flexibility:

### Supported Content Types

#### 1. HTML Format (Direct HTML)
```json
{
  "type": "html",
  "value": "<div class=\"hero\"><h1>Welcome</h1><p>Direct HTML content</p></div>"
}
```

#### 2. JSON Tree Format (Structured Elements)
```json
{
  "type": "json",
  "value": [
    {
      "tag": "div",
      "type": "element",
      "attributes": {
        "class": "hero",
        "style": "padding: 2rem; text-align: center;"
      },
      "children": [
        {
          "tag": "h1",
          "type": "element",
          "children": [
            {
              "text": "Welcome to Our Platform",
              "type": "text"
            }
          ],
          "attributes": {
            "style": "color: #333; font-size: 2rem;"
          }
        }
      ]
    }
  ]
}
```

#### 3. Plain Text Format
```json
{
  "type": "text",
  "value": "Plain text content that will be properly escaped"
}
```

#### 4. CSS Styling Format
```json
{
  "type": "css",
  "value": ":root { --theme-color: #3498db; } .hero { background: var(--theme-color); }"
}
```

### Content Conversion

The system automatically detects and converts content formats using the `convertContentToHtml()` function:

- **JSON trees** are converted to proper HTML with attributes and styling
- **Text content** is escaped for security
- **HTML content** is rendered directly
- **CSS styling** is injected via `<style>` tags

### Content Converter Implementation

Located at `src/lib/content-converter.ts`, this utility handles:

- Tree traversal for JSON structures
- Attribute and style processing
- Text node escaping
- Self-closing tag support
- Client/server-side compatibility

## 📁 Implementation Steps

### Step 1: Database Interface (`src/lib/db.ts`)

```typescript
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
})

type JSONContent = string | { type: string; value: any }

export interface PageRecord {
  id: string
  slug: string
  title: string
  content: JSONContent
  style?: JSONContent
  description?: string
  keywords: any
  status: string
  lang: string
  images: any
  videos: any
  show_title: boolean
  show_description: boolean
  show_metadata: boolean
  show_button?: boolean
  show_header?: boolean
  show_footer?: boolean
  button?: JSONContent
  created_at: string
  updated_at: string
}

/**
 * Get the user's preferred language from cookies
 */
async function getPreferredLanguage(): Promise<string> {
  try {
    const cookieStore = await cookies()
    const language = cookieStore.get('language')?.value
    return ['en', 'pl', 'ua'].includes(language || '') ? language! : 'en'
  } catch {
    // If cookies() fails (e.g., in client component), return default
    return 'en'
  }
}

export async function getPageBySlug(slug: string, lang?: string): Promise<PageRecord | null> {
  // Use provided language or get from cookies, fallback to 'en'
  const selectedLang = lang || await getPreferredLanguage()

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('lang', selectedLang)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Unexpected database error for slug:', slug, 'lang:', selectedLang, error)
    return null
  }

  return data
}

export async function getAllPublishedPages(): Promise<PageRecord[]> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('status', 'published')
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching pages:', error)
    return []
  }

  return data || []
}

export async function getAllPublishedSlugs(lang?: string): Promise<string[]> {
  // Use provided language or get from cookies, fallback to 'en'
  const selectedLang = lang || await getPreferredLanguage()

  const { data, error } = await supabase
    .from('pages')
    .select('slug')
    .eq('status', 'published')
    .eq('lang', selectedLang)

  if (error) {
    console.error('Error fetching slugs:', error)
    return []
  }

  return data?.map(page => page.slug) || []
}
```

### Step 2: Dynamic Components

#### ClientDynamicPage (for legal pages)
Located at `src/components/dynamic/ClientDynamicPage.tsx` - renders content without header/footer (relies on layout).

#### StandaloneDynamicPage (for non-legal pages)
Located at `src/components/dynamic/StandaloneDynamicPage.tsx` - full layout control with conditional header/footer.

#### RevalidationScript
Located at `src/components/dynamic/RevalidationScript.tsx` - provides manual revalidation functionality.

### Step 2.5: Language Components

#### LanguageSwitcher Component
Located at `src/components/layout/LanguageSwitcher.tsx` - provides language selection dropdown with flag icons and native names.

#### Language Context
Located at `src/contexts/LanguageContext.tsx` - manages language state across the application with event-driven updates.

#### Language Hook
Located at `src/hooks/usePreferredLanguage.ts` - provides easy access to user's preferred language in client components.

### Step 3: Dynamic Route (`src/app/[slug]/page.tsx`)

```typescript
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getPageBySlug, getAllPublishedSlugs } from '@/lib/db'
import { generatePageSEO } from '@/lib/seo'
import { isLegalPage, getLegalComponent } from '@/lib/legal-fallbacks'
import ClientDynamicPage from '@/components/dynamic/ClientDynamicPage'
import StandaloneDynamicPage from '@/components/dynamic/StandaloneDynamicPage'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = false // Only manual revalidation

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  // If dynamic page exists in database, render it with appropriate component
  if (page) {
    // Legal pages always show header/footer via layout
    if (isLegalPage(slug)) {
      return <ClientDynamicPage page={page} />
    }
    // Non-legal pages use conditional header/footer
    return <StandaloneDynamicPage page={page} />
  }

  // If no database page but is a legal page, fall back to static component
  if (isLegalPage(slug)) {
    const LegalComponent = getLegalComponent(slug)
    if (LegalComponent) {
      return (
        <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
          <LegalComponent />
        </Suspense>
      )
    }
  }

  // If no page and no legal fallback, show 404
  notFound()
}
```

### Step 4: Legal Page Routes

Update legal page routes to use the new component path:

```typescript
import ClientDynamicPage from '@/components/dynamic/ClientDynamicPage'
```

### Step 5: Manual Revalidation API

Located at `src/app/api/dynamic-pages/route.ts` - provides endpoints for manual cache revalidation.

## 🎨 Styling

The components use your existing CSS custom properties:
- Legal pages: Match static legal page styling with proper spacing
- Non-legal pages: Use existing theme variables (text-light, text-gray-2, etc.)

## 🔧 Usage

### Creating Pages

#### HTML Content Example
```sql
INSERT INTO pages (title, slug, description, content, style, keywords, status, lang, show_header, show_footer)
VALUES (
  'Simple HTML Page',
  'simple-page',
  'A simple HTML content page',
  '{"type": "html", "value": "<div class=\"container\"><h1>Hello World</h1><p>This is HTML content.</p></div>"}',
  '{"type": "css", "value": ".container { max-width: 800px; margin: 0 auto; padding: 2rem; }"}',
  ARRAY['html', 'simple'],
  'published',
  'en',   -- Language
  true,   -- Show header
  true    -- Show footer
);
```

#### Multilingual Content Example
```sql
-- English version
INSERT INTO pages (title, slug, description, content, keywords, status, lang, show_header, show_footer)
VALUES (
  'Frequently Asked Questions',
  'faq',
  'Find answers to commonly asked questions',
  '{"type": "html", "value": "<div class=\"space-y-6\"><h2 class=\"text-2xl font-bold text-light mb-6\">General Questions</h2><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">What is this platform?</h3><p class=\"text-gray-2\">This is a dynamic content management system...</p></div></div>"}',
  ARRAY['faq', 'help', 'support'],
  'published',
  'en',
  false,
  false
);

-- Polish version
INSERT INTO pages (title, slug, description, content, keywords, status, lang, show_header, show_footer)
VALUES (
  'Często zadawane pytania',
  'faq',
  'Znajdź odpowiedzi na najczęściej zadawane pytania',
  '{"type": "html", "value": "<div class=\"space-y-6\"><h2 class=\"text-2xl font-bold text-light mb-6\">Ogólne pytania</h2><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">Czym jest ta platforma?</h3><p class=\"text-gray-2\">To dynamiczny system zarządzania treścią...</p></div></div>"}',
  ARRAY['faq', 'pomoc', 'wsparcie'],
  'published',
  'pl',
  false,
  false
);

-- Ukrainian version
INSERT INTO pages (title, slug, description, content, keywords, status, lang, show_header, show_footer)
VALUES (
  'Питання та відповіді',
  'faq',
  'Знайдіть відповіді на найчастіші питання',
  '{"type": "html", "value": "<div class=\"space-y-6\"><h2 class=\"text-2xl font-bold text-light mb-6\">Загальні питання</h2><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">Що це за платформа?</h3><p class=\"text-gray-2\">Це динамічна система управління контентом...</p></div></div>"}',
  ARRAY['faq', 'допомога', 'підтримка'],
  'published',
  'ua',
  false,
  false
);
```

#### Interactive Component Example
```sql
INSERT INTO pages (title, slug, description, content, style, keywords, status, lang, show_header, show_footer)
VALUES (
  'Dynamic Test Page',
  'test-page',
  'Interactive test page with dynamic components',
  '{"type": "html", "value": "<div class=\"test-container\"><div class=\"clock\" id=\"live-clock\">Loading...</div><script>function updateClock(){document.getElementById(\"live-clock\").textContent=new Date().toLocaleTimeString();}setInterval(updateClock,1000);updateClock();</script></div>"}',
  '{"type": "css", "value": ".test-container { padding: 2rem; } .clock { font-size: 2rem; font-weight: bold; text-align: center; }"}',
  ARRAY['test', 'dynamic', 'interactive'],
  'published',
  'en',   -- Language
  false,  -- No header
  false   -- No footer
);
```

#### JSON Tree Structure Example
```sql
INSERT INTO pages (title, slug, description, content, keywords, status, lang, show_header, show_footer)
VALUES (
  'Structured Content',
  'structured-page',
  'Page using JSON tree format',
  '{"type": "json", "value": [{"tag": "section", "type": "element", "attributes": {"class": "hero"}, "children": [{"tag": "h1", "type": "element", "children": [{"text": "Structured Content", "type": "text"}]}]}]}',
  NULL,
  ARRAY['structured', 'json'],
  'published',
  'en',   -- Language
  true,
  true
);
```

### Manual Revalidation

Use the revalidation buttons provided in the demo menu or call the API directly:

```javascript
// Revalidate all pages
fetch('/api/dynamic-pages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'all' })
})
```

## 📊 Sample Pages Included

1. **FAQ** (`/faq`) - Shows conditional header/footer example
   - English: "Frequently Asked Questions"
   - Polish: "Często zadawane pytania"
   - Ukrainian: "Питання та відповіді"
2. **Demo Menu** (`/demo-menu`) - Interactive revalidation controls
3. **Welcome Post** (`/welcome-to-dynamic-pages`) - Full featured example

## 🌍 Language Support

### Available Languages
- **English (en)** - Default language, comprehensive content
- **Polish (pl)** - Partial content available
- **Ukrainian (ua)** - Partial content available

### Language Switcher Features
- 🌐 Globe icon with current language indicator
- 🏃‍♂️ Quick language switching in header
- 💾 Preference persistence via localStorage and cookies
- 📱 Mobile-responsive design (shows flag only on small screens)
- ♻️ Automatic page refresh on language change

### How Language Selection Works
1. User clicks the language switcher in header
2. Selection is saved to localStorage and cookies
3. Page refreshes to load content in selected language
4. Database queries automatically filter by selected language
5. Fallback to English if content not available in selected language

## 🚀 Benefits

- **Multilingual Support** - Full internationalization with language switcher and user preference persistence
- **Multiple Content Formats** - Support for HTML, JSON tree, and plain text with automatic conversion
- **Dynamic CSS Styling** - Per-page custom styling with the style field
- **Flexible Layout Control** - Legal pages always show header/footer, dynamic pages are configurable
- **Interactive Components** - Support for JavaScript and dynamic elements
- **Clean Architecture** - Organized components with clear separation of concerns
- **Content Security** - Automatic text escaping and safe HTML rendering
- **Performance** - Server-side caching with manual revalidation and optimized database queries
- **SEO Friendly** - Proper meta tags and Open Graph support with language-specific content
- **User Experience** - Language preferences persist across sessions with intuitive switching
- **Maintainable** - Well-structured codebase with TypeScript and modular components
- **Extensible** - Easy to add new languages, fields, and functionality
- **Format Flexibility** - Compatible with various CMS editors and content sources
- **Database Optimization** - Efficient indexes for multilingual content queries

## 🔒 Security

- Row Level Security (RLS) enabled
- Public read access for published pages only
- Authenticated users can manage content
- No sensitive data exposure in client code

This implementation provides a robust foundation for multilingual dynamic content management with excellent performance, user experience, and SEO characteristics. The language switcher makes it easy for users to access content in their preferred language, while the database-driven approach ensures content management remains simple and scalable.