const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixPageStatus() {
  try {
    console.log('🔧 Updating page-landing status to published...');

    const { data, error } = await supabase
      .from('pages')
      .update({
        status: 'published',
        updated_at: new Date().toISOString()
      })
      .eq('slug', 'page-landing')
      .select();

    if (error) {
      console.error('❌ Error updating page status:', error);
      return;
    }

    console.log('✅ Page status updated successfully:', data[0]);
    console.log('📄 Page details:', {
      slug: data[0].slug,
      title: data[0].title,
      status: data[0].status,
      updated_at: data[0].updated_at
    });

    // Verify the update
    console.log('\n🔍 Verifying update...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('pages')
      .select('slug, title, status, updated_at')
      .eq('slug', 'page-landing')
      .eq('status', 'published')
      .single();

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError);
    } else {
      console.log('✅ Verification successful:', verifyData);
      console.log('🌐 Page should now be accessible at: /page-landing');
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

fixPageStatus();