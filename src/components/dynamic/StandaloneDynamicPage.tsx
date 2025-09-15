'use client'

import { PageRecord } from '@/lib/db'
import { useEffect, useState } from 'react'
import RevalidationScript from '@/components/dynamic/RevalidationScript'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { convertContentToHtml } from '@/lib/content-converter'

interface StandaloneDynamicPageProps {
  page: PageRecord
}

function renderContent(content: string | { type: string; value: any }) {
  return convertContentToHtml(content);
}

function renderStyles(style: string | { type: string; value: string } | undefined) {
  if (!style) return null
  const styleContent = typeof style === 'object' && style?.value ? style.value : style
  if (!styleContent || typeof styleContent !== 'string') return null

  return (
    <style
      dangerouslySetInnerHTML={{ __html: styleContent }}
      key="page-styles"
    />
  )
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function StandaloneDynamicPage({ page }: StandaloneDynamicPageProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <div style={{ minHeight: '200px' }} />
      </div>
    )
  }

  const hasPageHeader = page.show_title || page.show_description || page.show_metadata
  const showBackButton = page.show_button && page.button

  return (
    <div className="flex flex-col min-h-screen">
      {renderStyles(page.style)}
      <RevalidationScript />

      {/* Conditional Header */}
      {page.show_header && <Header />}

      {/* Main Content */}
      <main className={`flex-grow ${page.show_header ? 'pt-16' : ''}`}>
        <div className="section-container">
          <div className="section-content">
            {showBackButton && (
              <div className="mb-6" dangerouslySetInnerHTML={{ __html: renderContent(page.button!) }} />
            )}

            {hasPageHeader && (
              <div className="mb-12">
                {page.show_title && (
                  <h1 className="text-5xl font-bold text-light mb-8">{page.title}</h1>
                )}

                {page.show_description && page.description && (
                  <p className="text-xl text-gray-2 leading-relaxed mb-6">{page.description}</p>
                )}

                {page.show_metadata && (
                  <div className="text-sm text-gray-2 mb-6">
                    <strong>Last updated: {formatDate(page.updated_at)}</strong>
                  </div>
                )}
              </div>
            )}

            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderContent(page.content) }}
            />
          </div>
        </div>
      </main>

      {/* Conditional Footer */}
      {page.show_footer && <Footer />}
    </div>
  )
}