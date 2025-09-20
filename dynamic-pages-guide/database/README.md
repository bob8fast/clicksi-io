# Database Setup

This directory contains the database schema and sample data for the dynamic pages system.

## Files

- **schema.sql** - Complete database schema with tables, indexes, triggers, and RLS policies
- **sample-data.sql** - Sample pages for testing the dynamic page functionality

## Setup Instructions

### 1. Run Schema
Execute the schema file in your Supabase SQL editor:
```sql
-- Copy and paste the contents of schema.sql
```

### 2. Insert Sample Data
Execute the sample data file to create test pages:
```sql
-- Copy and paste the contents of sample-data.sql
```

### 3. Verify Setup
Check that your table was created correctly:
```sql
SELECT * FROM pages WHERE status = 'published';
```

## Table Structure

### `pages` table
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `title` | TEXT | Page title |
| `slug` | TEXT | URL slug (unique) |
| `description` | TEXT | Page description |
| `content` | JSONB | HTML content in {type, value} format |
| `keywords` | TEXT[] | Array of keywords |
| `status` | TEXT | Publication status (published, draft, archived) |
| `lang` | TEXT | Language code |
| `images` | TEXT[] | Array of image URLs |
| `videos` | TEXT[] | Array of video URLs |
| `show_title` | BOOLEAN | Whether to display title |
| `show_description` | BOOLEAN | Whether to display description |
| `show_metadata` | BOOLEAN | Whether to display metadata |
| `show_back` | BOOLEAN | Whether to display back button |
| `show_header` | BOOLEAN | Whether to display site header |
| `show_footer` | BOOLEAN | Whether to display site footer |
| `back` | JSONB | Back button HTML content |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

## Row Level Security (RLS)

The table has RLS enabled with these policies:
- **Public read access** - Anonymous users can read pages with status = 'published'
- **Authenticated management** - Authenticated users can manage all pages

## Content Format

The `content` field stores HTML in JSONB format:
```json
{
  "type": "html",
  "value": "<div>Your HTML content here</div>"
}
```

## Sample Pages Included

1. **FAQ** (`/faq`) - Frequently asked questions with styled content and back button
2. **Demo Menu** (`/demo-menu`) - Interactive demo features with revalidation buttons and back button
3. **Welcome Post** (`/welcome-to-dynamic-pages`) - Blog-style content showcase with simple back link

Each sample page demonstrates different configurations:
- **FAQ & Demo Menu**: No header/footer, modern back button with arrow icon
- **Welcome Post**: Shows header and footer, simple text link back to home

## Header & Footer Control

Pages can conditionally display the site header and footer using the `show_header` and `show_footer` boolean fields. When enabled, the page will use the same Header and Footer components as the main site layout.