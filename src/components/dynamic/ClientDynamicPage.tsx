'use client'

import { PageRecord } from '@/lib/db'
import { useEffect, useState } from 'react'
import RevalidationScript from '@/components/dynamic/RevalidationScript'

interface ClientDynamicPageProps {
  page: PageRecord
}

function renderContent(content: string | { type: string; value: string }) {
  return typeof content === 'object' && content?.value ? content.value : content
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function ClientDynamicPage({ page }: ClientDynamicPageProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ minHeight: '200px' }} />
  }

  const hasPageHeader = page.show_title || page.show_description || page.show_metadata
  const showBackButton = page.show_back && page.back

  return (
    <>
      <RevalidationScript />
      <div className="bg-[#171717] py-16">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {showBackButton && (
            <div className="mb-6" dangerouslySetInnerHTML={{ __html: renderContent(page.back!) }} />
          )}

          {hasPageHeader && (
            <div className="mb-12">
              {page.show_title && (
                <h1 className="text-5xl font-bold text-[#EDECF8] mb-8">{page.title}</h1>
              )}

              {page.show_description && page.description && (
                <p className="text-[#828288] mb-6">{page.description}</p>
              )}

              {page.show_metadata && (
                <div className="text-[#828288] mb-6">
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
    </>
  )
}