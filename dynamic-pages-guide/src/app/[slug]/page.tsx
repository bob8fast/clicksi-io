import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getPageBySlug, getAllPublishedSlugs } from '@/lib/db'
import { generatePageSEO } from '@/lib/seo'
import { isLegalPage, getLegalComponent } from '@/lib/legal-fallbacks'
import ClientDynamicPage from '@/components/dynamic/ClientDynamicPage'
import StandaloneDynamicPage from '@/components/dynamic/StandaloneDynamicPage'

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = false // Only manual revalidation

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  const legalSlugs = ['privacy-policy', 'terms-of-service', 'cookie-policy']

  // Combine dynamic slugs with legal page slugs
  const allSlugs = [...slugs, ...legalSlugs]
  return allSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (page) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!
    return generatePageSEO(page, baseUrl)
  }

  // For legal pages without DB content, provide basic metadata
  if (isLegalPage(slug)) {
    const titles: Record<string, string> = {
      'privacy-policy': 'Privacy Policy',
      'terms-of-service': 'Terms of Service',
      'cookie-policy': 'Cookie Policy'
    }

    return {
      title: titles[slug] || 'Legal Page',
      description: `${titles[slug]} - Our legal policies and terms.`
    }
  }

  return {
    title: 'Page Not Found',
    description: 'The requested page could not be found.',
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  // If dynamic page exists in database, render it with appropriate component
  if (page) {
    // Legal pages always show header/footer via layout
    if (isLegalPage(slug)) {
      return <ClientDynamicPage page={page} />
    }
    // Non-legal pages use conditional header/footer
    return <StandaloneDynamicPage page={page} />
  }

  // If no database page but is a legal page, fall back to static component
  if (isLegalPage(slug)) {
    const LegalComponent = getLegalComponent(slug)

    if (LegalComponent) {
      return (
        <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
          <LegalComponent />
        </Suspense>
      )
    }
  }

  // If no page and no legal fallback, show 404
  notFound()
}