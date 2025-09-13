// app/(main)/(legal)/privacy-policy/page.tsx
import { generateLegalPageMetadata } from '@/lib/seo';
import { fetchPageData } from '@/lib/api-client';
import PrivacyPolicyPage from "@/components/legal/PrivacyPolicyPage";
import { Metadata } from 'next';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await fetchPageData('privacy-policy');

    if (page) {
      return generateLegalPageMetadata(page);
    }

    return {
      title: 'Privacy Policy - Clicksi',
      description: 'Privacy Policy - Learn how we protect your privacy and handle your data.',
    };
  } catch (error) {
    return {
      title: 'Privacy Policy - Clicksi',
      description: 'Privacy Policy - Learn how we protect your privacy and handle your data.',
    };
  }
}

// Render content from database or static component
function renderContent(content: any): JSX.Element {
  if (typeof content === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  if (typeof content === 'object' && content !== null) {
    if (content.type === 'html') {
      return <div dangerouslySetInnerHTML={{ __html: content.value }} />;
    }

    // Handle other content structures as needed
    return <div dangerouslySetInnerHTML={{ __html: JSON.stringify(content) }} />;
  }

  return <div>{JSON.stringify(content)}</div>;
}

export default async function Page() {
  // Try to get content from API first
  const pageFromDB = await fetchPageData('privacy-policy');

  // If database content exists, show it
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

  // Fallback to existing static component
  return <PrivacyPolicyPage />;
}