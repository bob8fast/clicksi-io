// lib/supabase.ts - Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import { DynamicPage } from './db';

// Client-side Supabase client (for browser)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_PAGES_URL!,
  process.env.NEXT_PUBLIC_PAGES_ANON_KEY!
);

// Server-side Supabase client with service role (for server-side operations)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_PAGES_URL!,
  process.env.PAGES_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Helper function to get the appropriate client
const getSupabaseClient = () => {
  // Use admin client on server-side for bypassing RLS
  if (typeof window === 'undefined') {
    return supabaseAdmin;
  }
  return supabase;
};

// Database functions using Supabase client
export async function getPageBySlugSupabase(slug: string): Promise<DynamicPage | null> {
  try {
    const client = getSupabaseClient();
    console.log(`[SUPABASE] Fetching page by slug: ${slug}`);

    const { data, error } = await client
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        console.log(`[SUPABASE] No page found for slug: ${slug}`);
        return null;
      }
      console.error(`[SUPABASE] Error fetching page:`, error);
      return null;
    }

    console.log(`[SUPABASE] Successfully fetched page: ${data.title}`);
    return data as DynamicPage;
  } catch (error) {
    console.error(`[SUPABASE] Error in getPageBySlugSupabase:`, error);
    return null;
  }
}

export async function getLegalPageContentSupabase(slug: string): Promise<DynamicPage | null> {
  try {
    const client = getSupabaseClient();
    console.log(`[SUPABASE] Fetching legal page: ${slug}`);

    const { data, error } = await client
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`[SUPABASE] No legal page found for slug: ${slug}`);
        return null;
      }
      console.error(`[SUPABASE] Error fetching legal page:`, error);
      return null;
    }

    console.log(`[SUPABASE] Successfully fetched legal page: ${data.title}`);
    return data as DynamicPage;
  } catch (error) {
    console.error(`[SUPABASE] Error in getLegalPageContentSupabase:`, error);
    return null;
  }
}

export async function getAllPagesSupabase(status?: string): Promise<DynamicPage[]> {
  try {
    const client = getSupabaseClient();
    console.log(`[SUPABASE] Fetching all pages with status: ${status || 'all'}`);

    let query = client.from('pages').select('*').order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`[SUPABASE] Error fetching all pages:`, error);
      return [];
    }

    console.log(`[SUPABASE] Successfully fetched ${data.length} pages`);
    return data as DynamicPage[];
  } catch (error) {
    console.error(`[SUPABASE] Error in getAllPagesSupabase:`, error);
    return [];
  }
}

export async function getDynamicPageSlugsSupabase(): Promise<string[]> {
  try {
    const client = getSupabaseClient();
    console.log(`[SUPABASE] Fetching dynamic page slugs`);

    const { data, error } = await client
      .from('pages')
      .select('slug')
      .eq('status', 'published')
      .not('slug', 'in', '("privacy-policy","cookie-policy","terms-of-service")');

    if (error) {
      console.error(`[SUPABASE] Error fetching dynamic page slugs:`, error);
      return [];
    }

    const slugs = data.map(item => item.slug);
    console.log(`[SUPABASE] Successfully fetched ${slugs.length} dynamic page slugs:`, slugs);
    return slugs;
  } catch (error) {
    console.error(`[SUPABASE] Error in getDynamicPageSlugsSupabase:`, error);
    return [];
  }
}

export async function getPageByIdSupabase(id: string): Promise<DynamicPage | null> {
  try {
    const client = getSupabaseClient();
    console.log(`[SUPABASE] Fetching page by ID: ${id}`);

    const { data, error } = await client
      .from('pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`[SUPABASE] No page found for ID: ${id}`);
        return null;
      }
      console.error(`[SUPABASE] Error fetching page by ID:`, error);
      return null;
    }

    console.log(`[SUPABASE] Successfully fetched page by ID: ${data.title}`);
    return data as DynamicPage;
  } catch (error) {
    console.error(`[SUPABASE] Error in getPageByIdSupabase:`, error);
    return null;
  }
}