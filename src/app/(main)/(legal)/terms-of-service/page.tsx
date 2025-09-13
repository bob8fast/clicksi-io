import { getPageBySlug } from '@/lib/db'
import { generatePageSEO } from '@/lib/seo'
import TermsOfServicePage from '@/components/legal/TermsOfServicePage'
import ClientDynamicPage from '@/components/ClientDynamicPage'

export const revalidate = false // Only manual revalidation

export async function generateMetadata() {
  const page = await getPageBySlug('terms-of-service')

  if (page) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!
    return generatePageSEO(page, baseUrl)
  }

  return {
    title: 'Terms of Service',
    description: 'Terms of Service - Our legal policies and terms.'
  }
}

export default async function Page() {
  const page = await getPageBySlug('terms-of-service')

  // If found in database, render dynamic content
  if (page) {
    return <ClientDynamicPage page={page} />
  }

  // Fall back to static component
  return <TermsOfServicePage />
}