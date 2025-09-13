import { ImageResponse } from 'next/og'
import { getPageBySlug } from '@/lib/db'

export const alt = 'Dynamic Page'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function OpengraphImage({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  const title = page?.og_title || page?.title || 'Page'
  const description = page?.og_description || page?.meta_description || ''

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '900px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <h1
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 20px 0',
              lineHeight: '1.1',
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                fontSize: '24px',
                color: '#6b7280',
                margin: '0',
                lineHeight: '1.4',
              }}
            >
              {description.slice(0, 150)}
              {description.length > 150 ? '...' : ''}
            </p>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}