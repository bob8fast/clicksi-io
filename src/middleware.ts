// middleware.ts - Simple and stable locale middleware
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';

const locales = ['en', 'ua', 'pl'];
const defaultLocale = 'en';

function getLocale(request: NextRequest): string {
    // 1. Check cookie first (user's previous choice)
    const cookieLocale = request.cookies.get('language')?.value;
    if (cookieLocale && locales.includes(cookieLocale)) {
        return cookieLocale;
    }

    // 2. Check Accept-Language header
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage) {
        for (const locale of locales) {
            if (acceptLanguage.includes(locale)) {
                return locale;
            }
        }
    }

    // 3. Default to English
    return defaultLocale;
}

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Skip API routes, static files, and Next.js internals
    if (
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/manifest.json') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Check if pathname already has a valid locale
    const pathnameLocale = pathname.split('/')[1];
    const hasValidLocale = locales.includes(pathnameLocale);

    if (!hasValidLocale) {
        // Get the preferred locale and redirect
        const locale = getLocale(request);
        const newUrl = new URL(`/${locale}${pathname}`, request.url);
        return NextResponse.redirect(newUrl);
    }

    // If valid locale is present, continue
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - . (files with extensions)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};