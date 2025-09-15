const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProdSchema() {
  try {
    console.log('🔍 Checking production database schema...');
    console.log('Supabase URL:', supabaseUrl);

    // Try to select with new field names
    console.log('\n1. Testing new field names (show_button, button):');
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('slug, show_button, button, style')
        .eq('slug', 'page-landing')
        .single();

      if (error) {
        console.error('❌ Error with new fields:', error.message);
        console.error('This suggests the production database still has old schema');
      } else {
        console.log('✅ New fields work! Data:', {
          slug: data.slug,
          show_button: data.show_button,
          button: data.button ? 'present' : 'null',
          style: data.style ? 'present' : 'null'
        });
      }
    } catch (err) {
      console.error('❌ Exception with new fields:', err.message);
    }

    // Try to select with old field names
    console.log('\n2. Testing old field names (show_back, back):');
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('slug, show_back, back')
        .eq('slug', 'page-landing')
        .single();

      if (error) {
        console.log('✅ Old fields don\'t exist (good!)');
      } else {
        console.log('⚠️  Old fields still exist:', {
          slug: data.slug,
          show_back: data.show_back,
          back: data.back ? 'present' : 'null'
        });
        console.log('This means the production database needs schema update!');
      }
    } catch (err) {
      console.log('✅ Old fields not found (good!)');
    }

    // Get all columns to see what exists
    console.log('\n3. Getting first page to see all available columns:');
    const { data: sample, error: sampleError } = await supabase
      .from('pages')
      .select('*')
      .limit(1)
      .single();

    if (sampleError) {
      console.error('❌ Error getting sample:', sampleError);
    } else {
      console.log('📋 Available columns:', Object.keys(sample).sort());
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

checkProdSchema();