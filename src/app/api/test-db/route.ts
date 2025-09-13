// api/test-db/route.ts - Database connection test endpoint
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const useAdmin = searchParams.get('admin') === 'true';

  console.log('[DB-TEST] Testing database connection...');
  console.log('[DB-TEST] Environment check:');
  console.log('[DB-TEST] - NEXT_PUBLIC_PAGES_URL:', process.env.NEXT_PUBLIC_PAGES_URL?.substring(0, 30) + '...');
  console.log('[DB-TEST] - NEXT_PUBLIC_PAGES_ANON_KEY:', process.env.NEXT_PUBLIC_PAGES_ANON_KEY ? 'Present' : 'Missing');
  console.log('[DB-TEST] - PAGES_SERVICE_ROLE_KEY:', process.env.PAGES_SERVICE_ROLE_KEY ? 'Present' : 'Missing');
  console.log('[DB-TEST] - Using admin client:', useAdmin);

  try {
    const client = useAdmin ? supabaseAdmin : supabase;

    // Test 1: Basic connectivity
    console.log('[DB-TEST] Step 1: Testing basic connectivity...');
    const { data: connectTest, error: connectError } = await client
      .from('pages')
      .select('count(*)')
      .limit(1);

    if (connectError) {
      console.error('[DB-TEST] Connection error:', connectError);
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: connectError.message,
        code: connectError.code,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // Test 2: Count pages
    console.log('[DB-TEST] Step 2: Counting pages...');
    const { count: totalPages, error: countError } = await client
      .from('pages')
      .select('*', { count: 'exact', head: true });

    // Test 3: Get published pages
    console.log('[DB-TEST] Step 3: Getting published pages...');
    const { data: publishedPages, error: publishedError } = await client
      .from('pages')
      .select('slug, title, status, created_at')
      .eq('status', 'published')
      .limit(5);

    // Test 4: Environment variables check
    const envCheck = {
      NEXT_PUBLIC_PAGES_URL: process.env.NEXT_PUBLIC_PAGES_URL ? 'OK' : 'MISSING',
      NEXT_PUBLIC_PAGES_ANON_KEY: process.env.NEXT_PUBLIC_PAGES_ANON_KEY ? 'OK' : 'MISSING',
      PAGES_SERVICE_ROLE_KEY: process.env.PAGES_SERVICE_ROLE_KEY ? 'OK' : 'MISSING',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL ? 'true' : 'false',
    };

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      clientType: useAdmin ? 'admin' : 'public',
      environment: envCheck,
      tests: {
        connection: connectError ? 'FAILED' : 'PASSED',
        count: countError ? 'FAILED' : 'PASSED',
        published: publishedError ? 'FAILED' : 'PASSED'
      },
      data: {
        totalPages: totalPages || 0,
        publishedPages: publishedPages || [],
        errors: {
          countError: countError?.message,
          publishedError: publishedError?.message
        }
      }
    };

    console.log('[DB-TEST] All tests completed successfully');
    console.log('[DB-TEST] Results:', JSON.stringify(result, null, 2));

    return NextResponse.json(result);

  } catch (error) {
    console.error('[DB-TEST] Unexpected error:', error);

    return NextResponse.json({
      success: false,
      error: 'Unexpected database error',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}