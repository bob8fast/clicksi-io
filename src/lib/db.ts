// lib/db.ts - Database connection and queries
import { Pool } from 'pg';

let pool: Pool | null = null;

export interface DynamicPage {
  id: string;
  slug: string;
  title: string;
  content: any;
  description?: string;
  keywords?: string[];
  status?: 'draft' | 'published' | 'archived';
  lang?: string;
  images?: any;
  videos?: any;
  created_at?: Date;
  updated_at?: Date;
  show_title?: boolean;
  show_metadata?: boolean;
  show_description?: boolean;
}

export interface CreatePageData {
  slug: string;
  title: string;
  content: any;
  description?: string;
  keywords?: string[];
  status?: 'draft' | 'published' | 'archived';
  lang?: string;
  images?: any;
  videos?: any;
}

export interface UpdatePageData extends Partial<CreatePageData> {
  id: string;
}

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_PAGES_URL;

    if (!connectionString) {
      console.error('DATABASE_PAGES_URL environment variable is not set');
      throw new Error('DATABASE_PAGES_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('PostgreSQL pool error:', err);
    });
  }

  return pool;
}

// Get page by slug (for dynamic pages - only published)
export async function getPageBySlug(slug: string): Promise<DynamicPage | null> {
  const pool = getPool();

  try {
    const result = await pool.query(
      'SELECT * FROM pages WHERE slug = $1 AND status = $2',
      [slug, 'published']
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    throw new Error('Failed to fetch page');
  }
}

// Get legal page content (for legal pages - any status)
export async function getLegalPageContent(slug: string): Promise<DynamicPage | null> {
  const pool = getPool();
  try {
    const result = await pool.query(
      'SELECT * FROM pages WHERE slug = $1', // No status filter for legal pages
      [slug]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching legal page:', error);
    return null; // Return null instead of throwing error
  }
}

// Get all pages with optional status filter
export async function getAllPages(status?: string): Promise<DynamicPage[]> {
  const pool = getPool();

  try {
    const query = status
      ? 'SELECT * FROM pages WHERE status = $1 ORDER BY created_at DESC'
      : 'SELECT * FROM pages ORDER BY created_at DESC';

    const params = status ? [status] : [];
    const result = await pool.query(query, params);

    return result.rows;
  } catch (error) {
    console.error('Error fetching all pages:', error);
    throw new Error('Failed to fetch pages');
  }
}

// Get page by ID
export async function getPageById(id: string): Promise<DynamicPage | null> {
  const pool = getPool();

  try {
    const result = await pool.query(
      'SELECT * FROM pages WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching page by id:', error);
    throw new Error('Failed to fetch page');
  }
}

// Get published slugs (for static generation)
export async function getPublishedSlugs(): Promise<string[]> {
  const pool = getPool();

  try {
    const result = await pool.query(
      'SELECT slug FROM pages WHERE status = $1',
      ['published']
    );

    return result.rows.map(row => row.slug);
  } catch (error) {
    console.error('Error fetching published slugs:', error);
    throw new Error('Failed to fetch slugs');
  }
}

// Get dynamic page slugs (exclude legal pages)
export async function getDynamicPageSlugs(): Promise<string[]> {
  const pool = getPool();

  try {
    const result = await pool.query(
      `SELECT slug FROM pages
       WHERE status = $1
       AND slug NOT IN ('privacy-policy', 'cookie-policy', 'terms-of-service')`,
      ['published']
    );

    return result.rows.map(row => row.slug);
  } catch (error) {
    console.error('Error fetching dynamic page slugs:', error);
    throw new Error('Failed to fetch dynamic slugs');
  }
}

// Add display control fields to pages table
export async function addDisplayControlFields(): Promise<boolean> {
  const pool = getPool();

  try {
    // Check if columns already exist to avoid errors
    const checkResult = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'pages'
      AND column_name IN ('show_title', 'show_metadata', 'show_description')
    `);

    const existingColumns = checkResult.rows.map(row => row.column_name);

    const columnsToAdd = [];
    if (!existingColumns.includes('show_title')) {
      columnsToAdd.push('ADD COLUMN show_title BOOLEAN DEFAULT true');
    }
    if (!existingColumns.includes('show_metadata')) {
      columnsToAdd.push('ADD COLUMN show_metadata BOOLEAN DEFAULT true');
    }
    if (!existingColumns.includes('show_description')) {
      columnsToAdd.push('ADD COLUMN show_description BOOLEAN DEFAULT true');
    }

    if (columnsToAdd.length > 0) {
      const alterQuery = `ALTER TABLE pages ${columnsToAdd.join(', ')}`;
      await pool.query(alterQuery);
      console.log(`✅ Added display control fields: ${columnsToAdd.join(', ')}`);
      return true;
    } else {
      console.log('ℹ️ Display control fields already exist');
      return false;
    }
  } catch (error) {
    console.error('Error adding display control fields:', error);
    throw new Error('Failed to add display control fields');
  }
}

// Clean header content from pages
export async function cleanHeadersFromPages(): Promise<string[]> {
  const pool = getPool();

  try {
    // Get all pages with HTML content that might have headers
    const result = await pool.query(`
      SELECT id, slug, content
      FROM pages
      WHERE content->>'type' = 'html'
      AND content->>'value' LIKE '%Last updated:%'
    `);

    console.log(`Found ${result.rows.length} pages with headers to clean`);
    const cleaned: string[] = [];

    for (const page of result.rows) {
      let htmlContent = page.content.value;

      // Remove the header section with "Last updated" and Home button
      const headerRegex = /<div class="bg-primary border border-accent p-6 rounded-lg"><div class="flex items-center justify-between mb-4"><p class="text-gray-2">Last updated:.*?<\/p><a href="\/" class="btn-primary">.*?<\/a><\/div><\/div>/;

      const cleanedContent = htmlContent.replace(headerRegex, '');

      if (cleanedContent !== htmlContent) {
        // Update the database
        await pool.query(
          'UPDATE pages SET content = $1, updated_at = NOW() WHERE id = $2',
          [{ type: 'html', value: cleanedContent }, page.id]
        );

        cleaned.push(page.slug);
        console.log(`✅ Cleaned header from: ${page.slug}`);
      }
    }

    return cleaned;
  } catch (error) {
    console.error('Error cleaning headers:', error);
    throw new Error('Failed to clean headers');
  }
}

// Test display controls by updating a page
export async function testDisplayControls(): Promise<boolean> {
  const pool = getPool();

  try {
    // Update test-page to hide title as a test
    await pool.query(
      'UPDATE pages SET show_title = false WHERE slug = $1',
      ['test-page']
    );
    console.log('✅ Updated test-page to hide title');
    return true;
  } catch (error) {
    console.error('Error testing display controls:', error);
    throw new Error('Failed to test display controls');
  }
}

// Close database pool
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}