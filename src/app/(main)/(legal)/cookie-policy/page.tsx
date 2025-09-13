// app/(main)/(legal)/cookie-policy/page.tsx
import { generateLegalPageMetadata } from '@/lib/seo';
import { getLegalPageContentSupabase } from '@/lib/supabase';
import CookiePolicyPage from "@/components/legal/CookiePolicyPage";
import { Metadata } from 'next';

// Force dynamic rendering for database-driven pages on Vercel
export const dynamic = 'force-dynamic';

// ISR: Revalidate every 24 hours (when using static generation)
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getLegalPageContentSupabase('cookie-policy');

    if (page) {
      return generateLegalPageMetadata(page);
    }

    return {
      title: 'Cookie Policy - Clicksi',
      description: 'Cookie Policy - Information about how we use cookies on our website.',
    };
  } catch (error) {
    return {
      title: 'Cookie Policy - Clicksi',
      description: 'Cookie Policy - Information about how we use cookies on our website.',
    };
  }
}

function renderContent(content: any): JSX.Element {
  if (typeof content === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  if (typeof content === 'object' && content !== null) {
    if (content.type === 'html') {
      return <div dangerouslySetInnerHTML={{ __html: content.value }} />;
    }

    return <div dangerouslySetInnerHTML={{ __html: JSON.stringify(content) }} />;
  }

  return <div>{JSON.stringify(content)}</div>;
}

export default async function Page() {
  const pageFromDB = await getLegalPageContentSupabase('cookie-policy');

  if (pageFromDB && pageFromDB.content) {
    return (
      <div className="bg-[#171717] py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {(pageFromDB.show_title !== false) && (
            <h1 className="text-5xl font-bold text-[#EDECF8] mb-8">{pageFromDB.title}</h1>
          )}

          <div className="prose prose-invert max-w-none">
            {(pageFromDB.show_metadata !== false) && pageFromDB.updated_at && (
              <p className="text-[#828288] mb-6">
                <strong>Last Updated: {
                  pageFromDB.updated_at instanceof Date
                    ? pageFromDB.updated_at.toLocaleDateString()
                    : new Date(pageFromDB.updated_at).toLocaleDateString()
                }</strong>
              </p>
            )}

            <div className="text-[#828288]">
              {renderContent(pageFromDB.content)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <CookiePolicyPage />;
}