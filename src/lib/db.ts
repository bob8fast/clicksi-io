import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

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
  style?: JSONContent
  description?: string
  keywords: any
  status: string
  lang: string
  images: any
  videos: any
  show_title: boolean
  show_description: boolean
  show_metadata: boolean
  show_button?: boolean
  show_header?: boolean
  show_footer?: boolean
  button?: JSONContent
  created_at: string
  updated_at: string
}

/**
 * Get the user's preferred language from cookies
 */
async function getPreferredLanguage(): Promise<string> {
  try {
    const cookieStore = await cookies()
    const language = cookieStore.get('language')?.value
    return ['en', 'pl', 'ua'].includes(language || '') ? language! : 'en'
  } catch {
    // If cookies() fails (e.g., in client component), return default
    return 'en'
  }
}

export async function getPageBySlug(slug: string, lang?: string): Promise<PageRecord | null> {
  // Use provided language or get from cookies, fallback to 'en'
  const selectedLang = lang || await getPreferredLanguage()

  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('lang', selectedLang)
    .single()

  if (error) {
    // If it's a "not found" error and not already trying English, fallback to English
    if (error.code === 'PGRST116' && selectedLang !== 'en') {
      console.log(`Page '${slug}' not found in '${selectedLang}', falling back to English`)
      return getPageBySlugWithFallback(slug, 'en')
    }

    // If it's a "not found" error for English or other languages, that's expected
    if (error.code === 'PGRST116') {
      return null
    }

    // Only log unexpected errors
    console.error('Unexpected database error for slug:', slug, 'lang:', selectedLang, error)
    return null
  }

  return data
}

/**
 * Internal function to get page without fallback logic to prevent infinite recursion
 */
async function getPageBySlugWithFallback(slug: string, lang: string): Promise<PageRecord | null> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('lang', lang)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Unexpected database error for fallback slug:', slug, 'lang:', lang, error)
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

export async function getAllPublishedSlugs(lang?: string): Promise<string[]> {
  // Use provided language or get from cookies, fallback to 'en'
  const selectedLang = lang || await getPreferredLanguage()

  const { data, error } = await supabase
    .from('pages')
    .select('slug')
    .eq('status', 'published')
    .eq('lang', selectedLang)

  if (error) {
    console.error('Error fetching slugs:', error)
    return []
  }

  return data?.map(page => page.slug) || []
}