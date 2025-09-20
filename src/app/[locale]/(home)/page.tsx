import { Suspense } from 'react'
import { getPageBySlug } from '@/lib/db'
import { generatePageSEO } from '@/lib/seo'
import HomePage from '@/components/Pages/HomePage';
import ClientDynamicPage from '@/components/dynamic/ClientDynamicPage'
import StandaloneDynamicPage from '@/components/dynamic/StandaloneDynamicPage'

export const revalidate = false // Only manual revalidation

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const page = await getPageBySlug('home', locale)

  if (page) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!
    return generatePageSEO(page, baseUrl)
  }

  // Default metadata for static home page
  return {
    title: 'Clicksi - Connect Brands with Creators',
    description: 'Where beauty brands and creators unite to create impactful collaborations'
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    // Check if there's a dynamic page with slug "home"
    const page = await getPageBySlug('home', locale)

    // If dynamic page exists in database, render it
    if (page) {
        return <StandaloneDynamicPage page={page} />
    }

    // Otherwise, render the static HomePage component
    return (
        <>
            <HomePage />
        </>
    );
}