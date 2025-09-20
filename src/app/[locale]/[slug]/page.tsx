import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getPageBySlug, getAllPublishedSlugs } from '@/lib/db'
import { generatePageSEO } from '@/lib/seo'
import { REVALIDATE_TIME } from '@/lib/cache'
import { isLegalPage, getLegalComponent } from '@/lib/legal-fallbacks'
import ClientDynamicPage from '@/components/dynamic/ClientDynamicPage'
import StandaloneDynamicPage from '@/components/dynamic/StandaloneDynamicPage'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export const revalidate = false // Only manual revalidation

export async function generateStaticParams() {
  const locales = ['en', 'ua', 'pl']
  const allParams = []

  for (const locale of locales) {
    const slugs = await getAllPublishedSlugs(locale)
    const legalSlugs = ['privacy-policy', 'terms-of-service', 'cookie-policy']
    const allSlugs = [...slugs, ...legalSlugs]

    for (const slug of allSlugs) {
      allParams.push({ locale, slug })
    }
  }

  return allParams
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params
  const page = await getPageBySlug(slug, locale)

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
  const { locale, slug } = await params
  const page = await getPageBySlug(slug, locale)

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