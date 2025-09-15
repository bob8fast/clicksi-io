const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not available, continue without it
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertTestPage() {
  try {
    // Read the content file
    const contentPath = path.join(__dirname, 'test-page-content.json');
    const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

    // Read the CSS file
    const cssPath = path.join(__dirname, 'test-page-styles.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    // Prepare page data for database
    const pageData = {
      slug: contentData.slug,
      title: contentData.title,
      content: contentData.content,
      description: contentData.description,
      keywords: contentData.keywords,
      status: contentData.status,
      lang: contentData.lang,
      images: [],
      videos: [],
      show_title: contentData.show_title,
      show_description: contentData.show_description,
      show_metadata: contentData.show_metadata,
      show_header: contentData.show_header,
      show_footer: contentData.show_footer,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Check if page already exists
    const { data: existingPage } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', contentData.slug)
      .single();

    if (existingPage) {
      // Update existing page
      const { data, error } = await supabase
        .from('pages')
        .update({
          ...pageData,
          updated_at: new Date().toISOString()
        })
        .eq('slug', contentData.slug)
        .select();

      if (error) {
        console.error('Error updating page:', error);
        return;
      }

      console.log('✅ Test page updated successfully:', data[0]);
    } else {
      // Insert new page
      const { data, error } = await supabase
        .from('pages')
        .insert(pageData)
        .select();

      if (error) {
        console.error('Error inserting page:', error);
        return;
      }

      console.log('✅ Test page created successfully:', data[0]);
    }

    // Save CSS to a separate table or file if needed
    console.log('📄 Page content:', pageData.content.value.length, 'characters');
    console.log('🎨 CSS styles:', cssContent.length, 'characters');
    console.log('🌐 Page URL: /' + contentData.slug);

  } catch (error) {
    console.error('Error:', error);
  }
}

insertTestPage();