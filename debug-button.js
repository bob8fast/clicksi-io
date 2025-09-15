const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugButton() {
  try {
    console.log('🔍 Debugging button configuration...');

    const { data, error } = await supabase
      .from('pages')
      .select('slug, title, show_button, button, show_header, show_footer')
      .eq('slug', 'page-landing')
      .single();

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('📄 Page-landing button configuration:');
    console.log('  Slug:', data.slug);
    console.log('  Title:', data.title);
    console.log('  show_button:', data.show_button);
    console.log('  show_header:', data.show_header);
    console.log('  show_footer:', data.show_footer);
    console.log('  button type:', typeof data.button);
    console.log('  button content:', JSON.stringify(data.button, null, 2));

    // Check other pages too
    console.log('\n📋 All pages button configurations:');
    const { data: allPages, error: allError } = await supabase
      .from('pages')
      .select('slug, title, show_button, button')
      .eq('status', 'published')
      .order('slug');

    if (allError) {
      console.error('❌ Error fetching all pages:', allError);
    } else {
      allPages.forEach(page => {
        console.log(`  ${page.slug}:`);
        console.log(`    show_button: ${page.show_button}`);
        console.log(`    button: ${page.button ? 'present' : 'null'}`);
      });
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

debugButton();