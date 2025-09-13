// middleware.ts - Simple middleware without authentication
import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
    // Allow all requests to proceed without authentication checks
    return NextResponse.next();
}

// Optional: You can remove this config entirely if you don't need middleware
export const config = {
    matcher: [
        // Skip all internal paths (_next, api, etc)
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};