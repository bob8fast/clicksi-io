-- Add show_header and show_footer fields to pages table
ALTER TABLE pages ADD COLUMN show_header BOOLEAN DEFAULT false;
ALTER TABLE pages ADD COLUMN show_footer BOOLEAN DEFAULT false;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'pages'
AND column_name IN ('show_header', 'show_footer')
ORDER BY column_name;