import { Suspense } from 'react'
import { getPageBySlug } from '@/lib/db'
import { generatePageSEO } from '@/lib/seo'
import PrivacyPolicyPage from "@/components/legal/PrivacyPolicyPage"
import ClientDynamicPage from "@/components/ClientDynamicPage"

export const revalidate = false // Only manual revalidation

export async function generateMetadata() {
  const page = await getPageBySlug('privacy-policy')

  if (page) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!
    return generatePageSEO(page, baseUrl)
  }

  return {
    title: 'Privacy Policy',
    description: 'Privacy Policy - Our legal policies and terms.'
  }
}

export default async function Page() {
  const page = await getPageBySlug('privacy-policy')

  // If found in database, render dynamic content
  if (page) {
    return <ClientDynamicPage page={page} />
  }

  // Fall back to static component
  return <PrivacyPolicyPage />
}