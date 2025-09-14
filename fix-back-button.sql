-- Clean back button with proper styling
UPDATE pages
SET back = '{"type": "html", "value": "<button onclick=\"window.history.back()\" class=\"inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-2 hover:text-light hover:bg-accent rounded-md transition-colors border border-gray-1\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"m12 19-7-7 7-7\"/><path d=\"M19 12H5\"/></svg>Back</button>"}'
WHERE show_back = true;