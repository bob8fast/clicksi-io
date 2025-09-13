// app/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Clicksi';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;

  // Edge Runtime - use static fallbacks for OpenGraph images
  // Dynamic content is not reliable in Edge Runtime, so we use generic branding
  const title = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  const description = 'Connect Brands with Creators';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#171717',
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '900px',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          {/* Logo or Brand */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#D78E59',
              marginBottom: '20px',
            }}
          >
            Clicksi
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 54,
              fontWeight: 700,
              color: '#EDECF8',
              marginBottom: '20px',
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>

          {/* Description */}
          {description && (
            <div
              style={{
                fontSize: 32,
                color: '#828288',
                lineHeight: 1.4,
                maxWidth: '800px',
              }}
            >
              {description}
            </div>
          )}

          {/* Bottom accent */}
          <div
            style={{
              marginTop: '40px',
              width: '200px',
              height: '4px',
              backgroundColor: '#D78E59',
              borderRadius: '2px',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}