const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugPage() {
  try {
    console.log('🔍 Debugging page-landing...');

    // 1. Check if page exists with any status
    console.log('1. Checking if page-landing exists with any status:');
    const { data: allPages, error: allError } = await supabase
      .from('pages')
      .select('slug, status, title, created_at, updated_at')
      .eq('slug', 'page-landing');

    if (allError) {
      console.error('❌ Error checking all pages:', allError);
    } else {
      console.log('📄 Found pages:', allPages);
    }

    // 2. Check published pages only
    console.log('\n2. Checking published page-landing:');
    const { data: publishedPage, error: publishedError } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', 'page-landing')
      .eq('status', 'published')
      .single();

    if (publishedError) {
      console.error('❌ Error checking published page:', publishedError);
      console.log('Error code:', publishedError.code);
      console.log('Error message:', publishedError.message);
    } else {
      console.log('✅ Published page found:', {
        id: publishedPage.id,
        slug: publishedPage.slug,
        title: publishedPage.title,
        status: publishedPage.status,
        created_at: publishedPage.created_at
      });
    }

    // 3. Check all published pages
    console.log('\n3. Listing all published pages:');
    const { data: allPublished, error: allPublishedError } = await supabase
      .from('pages')
      .select('slug, title, status')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (allPublishedError) {
      console.error('❌ Error listing published pages:', allPublishedError);
    } else {
      console.log('📋 All published pages:');
      allPublished.forEach(page => {
        console.log(`  - ${page.slug} (${page.title}) - ${page.status}`);
      });
    }

    // 4. Check if case sensitivity is an issue
    console.log('\n4. Checking case-sensitive slug matches:');
    const { data: caseCheck, error: caseError } = await supabase
      .from('pages')
      .select('slug, status')
      .ilike('slug', '%page-landing%');

    if (caseError) {
      console.error('❌ Error checking case sensitivity:', caseError);
    } else {
      console.log('🔤 Case-insensitive matches:', caseCheck);
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

debugPage();