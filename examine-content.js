const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function examineContent() {
  try {
    console.log('🔍 Examining page-landing content structure...');

    const { data, error } = await supabase
      .from('pages')
      .select('slug, title, content, style')
      .eq('slug', 'page-landing')
      .single();

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('📄 Page details:');
    console.log('  Slug:', data.slug);
    console.log('  Title:', data.title);
    console.log('\n📝 Content structure:');
    console.log('  Type:', typeof data.content);
    console.log('  Content:', JSON.stringify(data.content, null, 2));

    console.log('\n🎨 Style structure:');
    console.log('  Type:', typeof data.style);
    console.log('  Style:', JSON.stringify(data.style, null, 2));

    // Try to parse and understand the structure
    if (data.content && typeof data.content === 'object') {
      console.log('\n🔧 Content analysis:');
      console.log('  content.type:', data.content.type);
      console.log('  content.value type:', typeof data.content.value);

      if (data.content.value && Array.isArray(data.content.value)) {
        console.log('  content.value length:', data.content.value.length);
        console.log('  content.value[0]:', JSON.stringify(data.content.value[0], null, 2));
      } else {
        console.log('  content.value:', data.content.value);
      }
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

examineContent();