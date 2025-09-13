import { NextRequest, NextResponse } from 'next/server'
import { getAllPublishedPages, getAllPublishedSlugs } from '@/lib/db'
import { getCacheHeaders } from '@/lib/cache'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function GET() {
  try {
    const pages = await getAllPublishedPages()

    return NextResponse.json(
      { pages, count: pages.length },
      {
        status: 200,
        headers: getCacheHeaders()
      }
    )
  } catch (error) {
    console.error('Error fetching dynamic pages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}

// Handle revalidation requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body

    if (type === 'all' || type === 'dynamic') {
      // Revalidate all dynamic pages
      const slugs = await getAllPublishedSlugs()
      const paths = slugs.map(s => `/${s}`)

      // Revalidate each dynamic page path
      for (const path of paths) {
        revalidatePath(path)
      }

      // Revalidate this API route
      revalidatePath('/api/dynamic-pages')

      // Revalidate cache tags
      revalidateTag('pages')

      return NextResponse.json({
        revalidated: true,
        paths,
        message: `Revalidated ${paths.length} dynamic pages`
      })

    } else if (type === 'legal') {
      // Revalidate legal pages
      const paths = ['/privacy-policy', '/terms-of-service', '/cookie-policy']

      for (const path of paths) {
        revalidatePath(path)
      }

      return NextResponse.json({
        revalidated: true,
        paths,
        message: `Revalidated ${paths.length} legal pages`
      })

    } else {
      return NextResponse.json(
        { error: 'Invalid revalidation type. Use "all", "dynamic", or "legal"' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    )
  }
}