-- Sample data for testing the dynamic pages system
-- This file contains example pages to demonstrate the functionality
-- Updated to include multilingual content examples

-- Insert sample dynamic pages
INSERT INTO pages (title, slug, description, content, keywords, status, lang, images, videos, show_title, show_description, show_metadata, show_back, show_header, show_footer, back) VALUES

-- FAQ Page
(
  'Frequently Asked Questions',
  'faq',
  'Find answers to commonly asked questions about our platform and dynamic page system.',
  '{"type": "html", "value": "<div class=\"space-y-8\"><section><h2 class=\"text-2xl font-bold text-light mb-6\">General Questions</h2><div class=\"space-y-6\"><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">What is this platform?</h3><p class=\"text-gray-2\">This is a dynamic content management system built with Next.js 15 and Supabase, featuring server-side caching and manual revalidation.</p></div><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">How does caching work?</h3><p class=\"text-gray-2\">Pages are cached on the server and only refresh when manually revalidated or when the app restarts.</p></div><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">What are show fields?</h3><p class=\"text-gray-2\">Each page has display options: show_title, show_description, show_metadata, show_back, show_header, and show_footer that can be toggled on/off.</p></div></div></section><section class=\"mt-12\"><h2 class=\"text-2xl font-bold text-light mb-6\">Technical Questions</h2><div class=\"space-y-6\"><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">What database is used?</h3><p class=\"text-gray-2\">Supabase PostgreSQL with Row Level Security (RLS) for secure data access.</p></div><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">How are pages rendered?</h3><p class=\"text-gray-2\">Using Incremental Static Regeneration (ISR) with client-side hydration to prevent mismatch errors.</p></div></div></section><div class=\"mt-12 text-center\"><p class=\"text-gray-2 mb-4\">Need more help?</p><a href=\"/demo-menu\" class=\"bg-orange hover:bg-orange-light text-primary font-semibold py-3 px-6 rounded-lg transition-colors\">Visit Demo Menu</a></div></div>"}',
  ARRAY['faq', 'help', 'support', 'questions'],
  'published',
  'en',
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  true,
  true,
  false,
  false,
  '{"type": "html", "value": "<button onclick=\"window.history.back()\" class=\"inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-2 hover:text-light hover:bg-accent rounded-md transition-colors border border-gray-1\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"m12 19-7-7 7-7\"/><path d=\"M19 12H5\"/></svg>Back</button>"}'
),

-- Demo Menu Page
(
  'Demo Menu',
  'demo-menu',
  'Simple demo menu with revalidation tools and system overview for testing dynamic pages.',
  '{"type": "html", "value": "<div class=\"space-y-8\"><div class=\"bg-secondary border border-accent p-6 rounded-lg text-center\"><h2 class=\"text-2xl font-bold text-orange mb-4\">🚀 Dynamic Page Demo</h2><p class=\"text-gray-2 mb-6\">Test the manual revalidation system and explore dynamic content features.</p></div><section><h3 class=\"text-xl font-semibold text-light mb-4\">Cache Management</h3><p class=\"text-gray-2 mb-6\">Use these buttons to manually refresh cached pages from the database.</p><div class=\"grid md:grid-cols-3 gap-4 mb-8\"><button onclick=\"revalidatePages(''all'')\" class=\"bg-orange hover:bg-orange-light text-primary font-semibold py-4 px-6 rounded-lg transition-colors\">Revalidate All</button><button onclick=\"revalidatePages(''dynamic'')\" class=\"bg-accent hover:bg-gray-1 text-light font-semibold py-4 px-6 rounded-lg border border-gray-2 transition-colors\">Revalidate Dynamic</button><button onclick=\"revalidatePages(''legal'')\" class=\"bg-secondary hover:bg-accent text-light font-semibold py-4 px-6 rounded-lg border border-gray-2 transition-colors\">Revalidate Legal</button></div></section><section><h3 class=\"text-xl font-semibold text-light mb-4\">System Tools</h3><div class=\"grid md:grid-cols-3 gap-4 mb-8\"><button onclick=\"checkSystemStatus()\" class=\"bg-gray-1 hover:bg-gray-2 text-primary font-semibold py-3 px-4 rounded-lg transition-colors\">System Status</button><button onclick=\"clearCache()\" class=\"bg-primary hover:bg-accent text-light font-semibold py-3 px-4 rounded-lg transition-colors\">Clear Cache</button><button onclick=\"generateSitemap()\" class=\"bg-accent hover:bg-gray-1 text-light font-semibold py-3 px-4 rounded-lg border border-gray-2 transition-colors\">Generate Sitemap</button></div></section><div id=\"revalidate-status\" class=\"hidden mb-8\"></div><section><h3 class=\"text-xl font-semibold text-light mb-4\">How It Works</h3><div class=\"bg-secondary border border-accent rounded-lg p-6\"><ul class=\"space-y-3 text-gray-2\"><li>• Pages stored in Supabase with JSON content structure</li><li>• Server-side caching with manual revalidation only</li><li>• Legal pages check database first, then static fallback</li><li>• SEO optimized with meta tags and Open Graph</li><li>• Hydration-safe client rendering</li><li>• Back button system with database control</li><li>• Header and footer can be shown conditionally</li></ul></div></section><section class=\"mt-8\"><h3 class=\"text-xl font-semibold text-light mb-4\">Quick Links</h3><div class=\"grid md:grid-cols-2 gap-4\"><div class=\"bg-secondary border border-accent rounded-lg p-4\"><h4 class=\"font-semibold text-orange mb-2\">Sample Pages</h4><ul class=\"space-y-1 text-sm text-gray-2\"><li><a href=\"/faq\" class=\"text-orange hover:text-orange-light underline\">FAQ</a></li><li><a href=\"/privacy-policy\" class=\"text-orange hover:text-orange-light underline\">Privacy Policy</a></li></ul></div><div class=\"bg-secondary border border-accent rounded-lg p-4\"><h4 class=\"font-semibold text-orange mb-2\">API</h4><ul class=\"space-y-1 text-sm text-gray-2\"><li><a href=\"/api/dynamic-pages\" class=\"text-orange hover:text-orange-light underline\">View API</a></li><li class=\"text-xs\">GET: List pages / POST: Revalidate</li></ul></div></div></section></div>"}',
  ARRAY['demo', 'test', 'revalidation', 'cache'],
  'published',
  'en',
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  true,
  true,
  false,
  false,
  '{"type": "html", "value": "<button onclick=\"window.history.back()\" class=\"inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-2 hover:text-light hover:bg-accent rounded-md transition-colors border border-gray-1\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"m12 19-7-7 7-7\"/><path d=\"M19 12H5\"/></svg>Back</button>"}'
),

-- Welcome Post
(
  'Welcome to Dynamic Pages',
  'welcome-to-dynamic-pages',
  'Learn about our dynamic page system and its powerful features for content management.',
  '{"type": "html", "value": "<div class=\"space-y-8\"><div class=\"text-center mb-12\"><h2 class=\"text-3xl font-bold text-light mb-4\">Welcome to Dynamic Pages</h2><p class=\"text-xl text-gray-2\">Discover the power of dynamic content management with server-side caching.</p></div><div class=\"prose prose-invert max-w-none space-y-6\"><h3 class=\"text-2xl font-semibold text-light mb-4\">🚀 Key Features</h3><ul class=\"list-disc list-inside text-gray-2 space-y-2 mb-6\"><li>Server-side caching with manual revalidation</li><li>Conditional field display (title, description, metadata, back button)</li><li>SEO optimization with meta tags and Open Graph</li><li>Legal page fallbacks to static components</li><li>Hydration-safe client rendering</li><li>Row Level Security (RLS) with Supabase</li><li>Optional header and footer display</li></ul><h3 class=\"text-2xl font-semibold text-light mb-4\">💡 How It Works</h3><p class=\"text-gray-2 mb-4\">Our system uses Next.js 15 App Router with Incremental Static Regeneration (ISR). Pages are cached on the server and only regenerated when explicitly requested through the revalidation API.</p><div class=\"bg-secondary border border-accent rounded-lg p-6 mb-6\"><h4 class=\"text-lg font-semibold text-light mb-2\">Back Button System</h4><p class=\"text-gray-2\">Each page can have a customizable back button controlled through the database with full HTML and styling control.</p></div><div class=\"bg-secondary border border-accent rounded-lg p-6 mb-6\"><h4 class=\"text-lg font-semibold text-light mb-2\">Header & Footer Control</h4><p class=\"text-gray-2\">Pages can conditionally show the site header and footer using show_header and show_footer database fields.</p></div><p class=\"text-gray-2\">Ready to explore? Check out our <a href=\"/demo-menu\" class=\"text-primary hover:text-primary-hover underline\">demo menu</a> to test the features!</p></div></div>"}',
  ARRAY['welcome', 'guide', 'features', 'documentation'],
  'published',
  'en',
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  true,
  true,
  true,
  true,
  '{"type": "html", "value": "<a href=\"/\" class=\"text-orange hover:text-orange-light underline\">← Back to Home</a>"}'
),

-- Polish FAQ Page
(
  'Często zadawane pytania',
  'faq',
  'Znajdź odpowiedzi na najczęściej zadawane pytania o naszą platformę.',
  '{"type": "html", "value": "<div class=\"space-y-8\"><section><h2 class=\"text-2xl font-bold text-light mb-6\">Ogólne pytania</h2><div class=\"space-y-6\"><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">Czym jest ta platforma?</h3><p class=\"text-gray-2\">To dynamiczny system zarządzania treścią zbudowany z Next.js 15 i Supabase, z cache\'owaniem po stronie serwera i ręczną rewalidacją.</p></div><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">Jak działa cache\'owanie?</h3><p class=\"text-gray-2\">Strony są cache\'owane na serwerze i odświeżają się tylko po ręcznej rewalidacji lub restarcie aplikacji.</p></div><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">Co to są pola show?</h3><p class=\"text-gray-2\">Każda strona ma opcje wyświetlania: show_title, show_description, show_metadata, show_back, show_header i show_footer, które można włączać/wyłączać.</p></div></div></section><div class=\"mt-12 text-center\"><p class=\"text-gray-2 mb-4\">Potrzebujesz więcej pomocy?</p><a href=\"/demo-menu\" class=\"bg-orange hover:bg-orange-light text-primary font-semibold py-3 px-6 rounded-lg transition-colors\">Odwiedź Demo Menu</a></div></div>"}',
  ARRAY['faq', 'pomoc', 'wsparcie', 'pytania'],
  'published',
  'pl',
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  true,
  true,
  false,
  false,
  '{"type": "html", "value": "<button onclick=\"window.history.back()\" class=\"inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-2 hover:text-light hover:bg-accent rounded-md transition-colors border border-gray-1\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"m12 19-7-7 7-7\"/><path d=\"M19 12H5\"/></svg>Wstecz</button>"}'
),

-- Ukrainian FAQ Page
(
  'Питання та відповіді',
  'faq',
  'Знайдіть відповіді на найчастіші питання про нашу платформу.',
  '{"type": "html", "value": "<div class=\"space-y-8\"><section><h2 class=\"text-2xl font-bold text-light mb-6\">Загальні питання</h2><div class=\"space-y-6\"><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">Що це за платформа?</h3><p class=\"text-gray-2\">Це динамічна система управління контентом, побудована з Next.js 15 і Supabase, з кешуванням на стороні сервера та ручною ревалідацією.</p></div><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">Як працює кешування?</h3><p class=\"text-gray-2\">Сторінки кешуються на сервері і оновлюються тільки після ручної ревалідації або перезапуску додатку.</p></div><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">Що таке поля show?</h3><p class=\"text-gray-2\">Кожна сторінка має опції відображення: show_title, show_description, show_metadata, show_back, show_header і show_footer, які можна вмикати/вимикати.</p></div></div></section><div class=\"mt-12 text-center\"><p class=\"text-gray-2 mb-4\">Потрібна додаткова допомога?</p><a href=\"/demo-menu\" class=\"bg-orange hover:bg-orange-light text-primary font-semibold py-3 px-6 rounded-lg transition-colors\">Відвідайте Demo Menu</a></div></div>"}',
  ARRAY['faq', 'допомога', 'підтримка', 'питання'],
  'published',
  'ua',
  ARRAY[]::TEXT[],
  ARRAY[]::TEXT[],
  true,
  true,
  true,
  true,
  false,
  false,
  '{"type": "html", "value": "<button onclick=\"window.history.back()\" class=\"inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-2 hover:text-light hover:bg-accent rounded-md transition-colors border border-gray-1\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"m12 19-7-7 7-7\"/><path d=\"M19 12H5\"/></svg>Назад</button>"}'
);

-- Display insert results
SELECT
  title,
  slug,
  lang,
  show_title,
  show_description,
  show_metadata,
  show_back,
  show_header,
  show_footer,
  status,
  created_at
FROM pages
ORDER BY created_at DESC;