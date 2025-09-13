'use client'

import { PageRecord } from '@/lib/db'
import { useEffect, useState } from 'react'
import RevalidationScript from '@/components/RevalidationScript'

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
      <div className="section-container">
        <div className="section-content">
          <div style={{ minHeight: '200px' }} />
        </div>
      </div>
    )
  }

  return (
    <>
      <RevalidationScript />
      <div className="section-container">
        <div className="section-content">
          {/* Conditional header section */}
          {(page.show_title || page.show_description || page.show_metadata) && (
            <div className="mb-12">
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
    </>
  )
}