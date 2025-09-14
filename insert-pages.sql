-- Insert FAQ Page
INSERT INTO pages (
    title,
    slug,
    content,
    description,
    keywords,
    status,
    lang,
    show_title,
    show_description,
    show_metadata
) VALUES (
    'Frequently Asked Questions',
    'faq',
    '{
        "type": "html",
        "value": "<div class=\"space-y-8\"><section><h2 class=\"text-2xl font-bold text-light mb-6\">General Questions</h2><div class=\"space-y-6\"><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">What is this platform?</h3><p class=\"text-gray-2\">This is a dynamic content management system built with Next.js 15 and Supabase, featuring server-side caching and manual revalidation.</p></div><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">How does caching work?</h3><p class=\"text-gray-2\">Pages are cached on the server and only refresh when manually revalidated or when the app restarts.</p></div><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">What are show fields?</h3><p class=\"text-gray-2\">Each page has three display options: show_title, show_description, and show_metadata that can be toggled on/off.</p></div></div></section><section class=\"mt-12\"><h2 class=\"text-2xl font-bold text-light mb-6\">Technical Questions</h2><div class=\"space-y-6\"><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">What database is used?</h3><p class=\"text-gray-2\">Supabase PostgreSQL with Row Level Security (RLS) for secure data access.</p></div><div class=\"bg-secondary border border-accent rounded-lg p-6\"><h3 class=\"text-lg font-semibold text-orange mb-3\">How are pages rendered?</h3><p class=\"text-gray-2\">Using Incremental Static Regeneration (ISR) with client-side hydration to prevent mismatch errors.</p></div></div></section><div class=\"mt-12 text-center\"><p class=\"text-gray-2 mb-4\">Need more help?</p><a href=\"/demo-menu\" class=\"bg-orange hover:bg-orange-light text-primary font-semibold py-3 px-6 rounded-lg transition-colors\">Visit Demo Menu</a></div></div>"
    }',
    'Find answers to commonly asked questions about our platform and dynamic page system.',
    ARRAY['faq', 'questions', 'help', 'support', 'dynamic pages'],
    'published',
    'en',
    true,
    true,
    true
);

-- Insert Demo Menu Page
INSERT INTO pages (
    title,
    slug,
    content,
    description,
    keywords,
    status,
    lang,
    show_title,
    show_description,
    show_metadata
) VALUES (
    'Demo Menu',
    'demo-menu',
    '{
        "type": "html",
        "value": "<div class=\"space-y-8\"><div class=\"bg-secondary border border-accent p-6 rounded-lg text-center\"><h2 class=\"text-2xl font-bold text-orange mb-4\">🚀 Dynamic Page Demo</h2><p class=\"text-gray-2 mb-6\">Test the manual revalidation system and explore dynamic content features.</p></div><section><h3 class=\"text-xl font-semibold text-light mb-4\">Cache Management</h3><p class=\"text-gray-2 mb-6\">Use these buttons to manually refresh cached pages from the database.</p><div class=\"grid md:grid-cols-3 gap-4 mb-8\"><button onclick=\"revalidatePages(''all'')\" class=\"bg-orange hover:bg-orange-light text-primary font-semibold py-4 px-6 rounded-lg transition-colors\">Revalidate All</button><button onclick=\"revalidatePages(''dynamic'')\" class=\"bg-accent hover:bg-gray-1 text-light font-semibold py-4 px-6 rounded-lg border border-gray-2 transition-colors\">Revalidate Dynamic</button><button onclick=\"revalidatePages(''legal'')\" class=\"bg-secondary hover:bg-accent text-light font-semibold py-4 px-6 rounded-lg border border-gray-2 transition-colors\">Revalidate Legal</button></div></section><section><h3 class=\"text-xl font-semibold text-light mb-4\">System Tools</h3><div class=\"grid md:grid-cols-3 gap-4 mb-8\"><button onclick=\"checkSystemStatus()\" class=\"bg-gray-1 hover:bg-gray-2 text-primary font-semibold py-3 px-4 rounded-lg transition-colors\">System Status</button><button onclick=\"clearCache()\" class=\"bg-primary hover:bg-accent text-light font-semibold py-3 px-4 rounded-lg transition-colors\">Clear Cache</button><button onclick=\"generateSitemap()\" class=\"bg-accent hover:bg-gray-1 text-light font-semibold py-3 px-4 rounded-lg border border-gray-2 transition-colors\">Generate Sitemap</button></div></section><div id=\"revalidate-status\" class=\"hidden mb-8\"></div><section><h3 class=\"text-xl font-semibold text-light mb-4\">How It Works</h3><div class=\"bg-secondary border border-accent rounded-lg p-6\"><ul class=\"space-y-3 text-gray-2\"><li>• Pages stored in Supabase with JSON content structure</li><li>• Server-side caching with manual revalidation only</li><li>• Legal pages check database first, then static fallback</li><li>• SEO optimized with meta tags and Open Graph</li><li>• Hydration-safe client rendering</li></ul></div></section><section class=\"mt-8\"><h3 class=\"text-xl font-semibold text-light mb-4\">Quick Links</h3><div class=\"grid md:grid-cols-2 gap-4\"><div class=\"bg-secondary border border-accent rounded-lg p-4\"><h4 class=\"font-semibold text-orange mb-2\">Sample Pages</h4><ul class=\"space-y-1 text-sm text-gray-2\"><li><a href=\"/faq\" class=\"text-orange hover:text-orange-light underline\">FAQ</a></li><li><a href=\"/privacy-policy\" class=\"text-orange hover:text-orange-light underline\">Privacy Policy</a></li></ul></div><div class=\"bg-secondary border border-accent rounded-lg p-4\"><h4 class=\"font-semibold text-orange mb-2\">API</h4><ul class=\"space-y-1 text-sm text-gray-2\"><li><a href=\"/api/dynamic-pages\" class=\"text-orange hover:text-orange-light underline\">View API</a></li><li class=\"text-xs\">GET: List pages / POST: Revalidate</li></ul></div></div></section></div>"
    }',
    'Simple demo menu with revalidation tools and system overview for testing dynamic pages.',
    ARRAY['demo', 'admin', 'revalidate', 'test', 'cache'],
    'published',
    'en',
    true,
    true,
    true
);