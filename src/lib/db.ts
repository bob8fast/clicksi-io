import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
})

type JSONContent = string | { type: string; value: string }

export interface PageRecord {
  id: string
  slug: string
  title: string
  content: JSONContent
  description?: string
  keywords: any
  status: string
  lang: string
  images: any
  videos: any
  show_title: boolean
  show_description: boolean
  show_metadata: boolean
  show_back?: boolean
  show_header?: boolean
  show_footer?: boolean
  back?: JSONContent
  created_at: string
  updated_at: string
}

export async function getPageBySlug(slug: string): Promise<PageRecord | null> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    // If it's a "not found" error, that's expected - don't log as error
    if (error.code === 'PGRST116') {
      return null
    }

    // Only log unexpected errors
    console.error('Unexpected database error for slug:', slug, error)
    return null
  }

  return data
}

export async function getAllPublishedPages(): Promise<PageRecord[]> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('status', 'published')
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching pages:', error)
    return []
  }

  return data || []
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('pages')
    .select('slug')
    .eq('status', 'published')

  if (error) {
    console.error('Error fetching slugs:', error)
    return []
  }

  return data?.map(page => page.slug) || []
}