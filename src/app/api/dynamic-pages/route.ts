// app/api/dynamic-pages/route.ts - GET + revalidation API
import { getAllPages, getPageById } from '@/lib/db';
import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch pages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');

    // Get specific page by ID
    if (id) {
      const page = await getPageById(id);
      if (!page) {
        return NextResponse.json(
          { error: 'Page not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(page);
    }

    // Get specific page by slug
    if (slug) {
      const { getPageBySlug } = await import('@/lib/db');
      const page = await getPageBySlug(slug);
      if (!page) {
        return NextResponse.json(
          { error: 'Page not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(page);
    }

    // Get all pages with optional status filter
    const pages = await getAllPages(status);
    return NextResponse.json(pages);

  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

// POST - Revalidate cache
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { type, slug, path } = body;

    const revalidated: string[] = [];

    switch (type) {
      case 'single':
        // Revalidate single page
        if (slug) {
          revalidatePath(`/${slug}`);
          revalidated.push(`/${slug}`);
        }
        if (path) {
          revalidatePath(path);
          revalidated.push(path);
        }
        break;

      case 'legal':
        // Revalidate all legal pages
        const legalPaths = [
          '/privacy-policy',
          '/cookie-policy',
          '/terms-of-service'
        ];

        for (const legalPath of legalPaths) {
          revalidatePath(legalPath);
          revalidated.push(legalPath);
        }
        revalidateTag('legal-pages');
        revalidated.push('tag:legal-pages');
        break;

      case 'dynamic':
        // Revalidate all dynamic pages
        revalidateTag('dynamic-pages');
        revalidated.push('tag:dynamic-pages');
        break;

      case 'all':
      default:
        // Revalidate everything
        revalidatePath('/', 'layout');
        revalidateTag('legal-pages');
        revalidateTag('dynamic-pages');
        revalidateTag('page-lists');

        // Revalidate specific legal pages
        revalidatePath('/privacy-policy');
        revalidatePath('/cookie-policy');
        revalidatePath('/terms-of-service');

        revalidated.push(
          'layout:/',
          'tag:legal-pages',
          'tag:dynamic-pages',
          'tag:page-lists',
          '/privacy-policy',
          '/cookie-policy',
          '/terms-of-service'
        );
        break;
    }

    return NextResponse.json({
      revalidated: true,
      paths: revalidated,
      timestamp: new Date().toISOString(),
      message: `Revalidated ${revalidated.length} items`
    });

  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json(
      {
        error: "Failed to revalidate",
        details: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PATCH - Clean headers from database content
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action } = body;

    if (action === 'clean-headers') {
      const { cleanHeadersFromPages } = await import('@/lib/db');

      const cleaned = await cleanHeadersFromPages();

      // Revalidate all affected pages
      if (cleaned.length > 0) {
        revalidateTag('legal-pages');
        revalidateTag('dynamic-pages');
        for (const slug of cleaned) {
          revalidatePath(`/${slug}`);
        }
      }

      return NextResponse.json({
        success: true,
        cleaned: cleaned,
        message: `Cleaned headers from ${cleaned.length} pages`,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'add-display-fields') {
      const { addDisplayControlFields } = await import('@/lib/db');

      const added = await addDisplayControlFields();

      return NextResponse.json({
        success: true,
        added: added,
        message: added ? 'Display control fields added successfully' : 'Display control fields already exist',
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'test-display-controls') {
      const { testDisplayControls } = await import('@/lib/db');

      await testDisplayControls();

      // Revalidate the page
      revalidatePath('/test-page');

      return NextResponse.json({
        success: true,
        message: 'Updated test-page to hide title',
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error cleaning headers:', error);
    return NextResponse.json(
      { error: 'Failed to clean headers', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// OPTIONS - CORS preflight (if needed)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}