-- Dynamic Pages Database Schema for Supabase
-- This schema creates the pages table for dynamic page rendering

-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content JSONB NOT NULL, -- Stores {type: "html", value: "<html content>"}

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
  show_back BOOLEAN DEFAULT true,
  show_header BOOLEAN DEFAULT false,
  show_footer BOOLEAN DEFAULT false,
  back JSONB DEFAULT '{"type": "html", "value": "<button onclick=\"window.history.back()\" class=\"inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-2 hover:text-light hover:bg-accent rounded-md transition-colors border border-gray-1\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"m12 19-7-7 7-7\"/><path d=\"M19 12H5\"/></svg>Back</button>"}',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_slug_lang UNIQUE(slug, lang)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_lang ON pages(lang);
CREATE INDEX IF NOT EXISTS idx_pages_created_at ON pages(created_at);
CREATE INDEX IF NOT EXISTS idx_pages_updated_at ON pages(updated_at);
CREATE INDEX IF NOT EXISTS idx_pages_keywords ON pages USING GIN (keywords);
CREATE INDEX IF NOT EXISTS idx_pages_status_lang ON pages(status, lang);
CREATE INDEX IF NOT EXISTS idx_pages_slug_status ON pages(slug, status);

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