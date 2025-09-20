'use client'

import { PageRecord } from '@/lib/db'
import { useEffect, useState } from 'react'
import RevalidationScript from '@/components/dynamic/RevalidationScript'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface ClientDynamicPageProps {
  page: PageRecord
}

export default function ClientDynamicPage({ page }: ClientDynamicPageProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a basic structure during SSR to avoid hydration mismatch
    return (
      <div className="flex flex-col min-h-screen">
        <div style={{ minHeight: '200px' }} />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <RevalidationScript />

      {/* Conditional Header */}
      {page.show_header && <Header />}

      {/* Main Content */}
      <main className={`flex-grow ${page.show_header ? 'pt-16' : ''}`}>
        <div className="section-container">
          <div className="section-content">
          {/* Conditional header section */}
          {(page.show_title || page.show_description || page.show_metadata) && (
            <div className="mb-12">
              {/* Back button - completely from database */}
              {page.show_back && page.back && page.show_title && (
                <div className="mb-6">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: typeof page.back === 'object' && page.back?.value
                        ? page.back.value
                        : page.back
                    }}
                  />
                </div>
              )}

              {page.show_title && (
                <h1 className="text-5xl font-bold text-light mb-8">
                  {page.title}
                </h1>
              )}

              {page.show_description && page.description && (
                <p className="text-xl text-gray-2 leading-relaxed mb-6">
                  {page.description}
                </p>
              )}

              {page.show_metadata && (
                <div className="text-sm text-gray-2 mb-6">
                  <strong>
                    Last updated: {new Date(page.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </strong>
                </div>
              )}
            </div>
          )}

          {/* Main content */}
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: typeof page.content === 'object' && page.content?.value
                ? page.content.value
                : page.content
            }}
          />
          </div>
        </div>
      </main>

      {/* Conditional Footer */}
      {page.show_footer && <Footer />}
    </div>
  )
}