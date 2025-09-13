// app/[slug]/page.tsx - Dynamic pages route
import { generatePageMetadata, generateAllStructuredData } from '@/lib/seo';
import { getPageBySlugSupabase, getDynamicPageSlugsSupabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

// Force dynamic rendering during build for database-driven pages
export const dynamic = 'auto';

export async function generateStaticParams() {
  // During build time on Vercel, the database might not be available
  // Return empty array to force dynamic rendering for all routes
  if (process.env.VERCEL && process.env.NODE_ENV === 'production') {
    console.log('[BUILD] Skipping static param generation on Vercel - using dynamic rendering');
    return [];
  }

  // For local development, try to generate static params
  try {
    const slugs = await getDynamicPageSlugsSupabase();
    console.log(`[BUILD] Generated static params for ${slugs.length} pages:`, slugs);
    return slugs.map((slug: string) => ({ slug }));
  } catch (error) {
    console.error('[BUILD] Error generating static params, falling back to dynamic rendering:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const page = await getPageBySlugSupabase(slug);

    if (!page) {
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.',
      };
    }

    return generatePageMetadata(page);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }
}

// Render different content types
function renderContent(content: any): JSX.Element {
  if (typeof content === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  if (typeof content === 'object' && content !== null) {
    // Handle HTML content type
    if (content.type === 'html') {
      return <div dangerouslySetInnerHTML={{ __html: content.value }} />;
    }

    // Handle structured content with blocks
    if (content.blocks && Array.isArray(content.blocks)) {
      return (
        <div className="space-y-6">
          {content.blocks.map((block: any, index: number) => (
            <div key={index}>
              {block.type === 'paragraph' && (
                <p className="text-base leading-7">{block.content}</p>
              )}
              {block.type === 'heading' && (
                <>
                  {block.level === 1 && <h1 className="text-4xl font-bold mb-4">{block.content}</h1>}
                  {block.level === 2 && <h2 className="text-3xl font-semibold mb-3">{block.content}</h2>}
                  {block.level === 3 && <h3 className="text-2xl font-medium mb-2">{block.content}</h3>}
                </>
              )}
              {block.type === 'image' && (
                <div className="my-8">
                  <img
                    src={block.url}
                    alt={block.alt || ''}
                    className="max-w-full h-auto rounded-lg"
                    width={block.width}
                    height={block.height}
                  />
                  {block.caption && (
                    <p className="text-sm text-gray-600 mt-2 italic">{block.caption}</p>
                  )}
                </div>
              )}
              {block.type === 'html' && (
                <div dangerouslySetInnerHTML={{ __html: block.content }} />
              )}
            </div>
          ))}
        </div>
      );
    }
  }

  // Fallback for unknown content structure
  return <div className="prose max-w-none">{JSON.stringify(content)}</div>;
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  let page;
  try {
    page = await getPageBySlugSupabase(slug);
  } catch (error) {
    console.error('Supabase error:', error);
    notFound();
  }

  if (!page) {
    notFound();
  }

  // Generate structured data for SEO
  const structuredData = generateAllStructuredData(page);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            structuredData.article,
            structuredData.breadcrumb,
          ]),
        }}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <article>
          <header className="mb-8">
            {(page.show_title !== false) && (
              <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
            )}
            {(page.show_description !== false) && page.description && (
              <p className="text-xl text-gray-600 mb-4">{page.description}</p>
            )}
            {(page.show_metadata !== false) && (
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {page.created_at && (
                  <time dateTime={
                    page.created_at instanceof Date
                      ? page.created_at.toISOString()
                      : new Date(page.created_at).toISOString()
                  }>
                    {
                      page.created_at instanceof Date
                        ? page.created_at.toLocaleDateString()
                        : new Date(page.created_at).toLocaleDateString()
                    }
                  </time>
                )}
                {page.updated_at && (
                  <span>
                    Updated: {
                      page.updated_at instanceof Date
                        ? page.updated_at.toLocaleDateString()
                        : new Date(page.updated_at).toLocaleDateString()
                    }
                  </span>
                )}
                {page.lang && (
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs uppercase">
                    {page.lang}
                  </span>
                )}
              </div>
            )}
          </header>

          <main className="prose prose-lg max-w-none">
            {renderContent(page.content)}
          </main>

          {/* Image Gallery */}
          {page.images && Array.isArray(page.images) && page.images.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {page.images.map((image: any, index: number) => (
                  <div key={index} className="aspect-video relative overflow-hidden rounded-lg">
                    <img
                      src={image.url}
                      alt={image.alt || `Gallery image ${index + 1}`}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Video Section */}
          {page.videos && Array.isArray(page.videos) && page.videos.length > 0 && (
            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Videos</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {page.videos.map((video: any, index: number) => (
                  <div key={index} className="aspect-video">
                    <video
                      controls
                      className="w-full h-full rounded-lg"
                      poster={video.poster}
                    >
                      <source src={video.url} type={video.type || 'video/mp4'} />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </>
  );
}