import { Suspense } from 'react'
import { getPageBySlug } from '@/lib/db'
import { generatePageSEO } from '@/lib/seo'

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
    title: 'Dynamic Pages Demo - Home',
    description: 'Demonstration of dynamic pages with internationalization support'
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    // Check if there's a dynamic page with slug "home"
    const page = await getPageBySlug('home', locale)

    // If dynamic page exists in database, render it
    if (page) {
        return (
            <div className="container">
                <h1>{page.title}</h1>
                <div className="dynamic-content" dangerouslySetInnerHTML={{ __html: page.content as string }} />
            </div>
        )
    }

    // Otherwise, render the static home page
    return (
        <div className="container">
            <h1>Dynamic Pages Demo</h1>
            <p>Welcome to the dynamic pages demonstration!</p>
            <p>Current locale: <strong>{locale}</strong></p>

            <h2>Features:</h2>
            <ul>
                <li>✅ Internationalization (i18n) with locale routing</li>
                <li>✅ Dynamic pages from database</li>
                <li>✅ Static page fallbacks</li>
                <li>✅ SEO optimization</li>
                <li>✅ Automatic locale detection</li>
            </ul>

            <h2>Available Routes:</h2>
            <ul>
                <li><a href="/en/">/en/ - English home</a></li>
                <li><a href="/ua/">/ua/ - Ukrainian home</a></li>
                <li><a href="/pl/">/pl/ - Polish home</a></li>
                <li><a href="/en/privacy-policy">/en/privacy-policy - Legal page</a></li>
                <li><a href="/en/dynamic-slug">/en/dynamic-slug - Dynamic page (if exists in DB)</a></li>
            </ul>
        </div>
    );
}