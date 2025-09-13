import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getAllPublishedSlugs } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, slug } = body

    if (type === 'all') {
      // Revalidate all dynamic pages
      const slugs = await getAllPublishedSlugs()
      const paths = [
        ...slugs.map(s => `/${s}`),
        '/privacy-policy',
        '/terms-of-service',
        '/cookie-policy'
      ]

      // Revalidate each path
      for (const path of paths) {
        revalidatePath(path)
      }

      // Revalidate API route
      revalidatePath('/api/dynamic-pages')

      // Revalidate cache tags
      revalidateTag('pages')

      return NextResponse.json({
        revalidated: true,
        paths,
        message: `Revalidated ${paths.length} pages`
      })

    } else if (type === 'single' && slug) {
      // Revalidate single page
      const path = `/${slug}`
      revalidatePath(path)

      return NextResponse.json({
        revalidated: true,
        paths: [path],
        message: `Revalidated page: ${slug}`
      })

    } else {
      return NextResponse.json(
        { error: 'Invalid revalidation type' },
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