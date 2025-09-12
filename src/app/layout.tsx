import { Toaster } from '@/components/ui/sonner';
import { AppThemeProvider } from '@/providers/app-theme-provider';
// import AuthSessionProvider from '@/providers/auth-session-provider'; // Removed auth
import QueryProvider from '@/providers/query-provider';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: {
        template: '%s - Clicksi',
        default: 'Clicksi - Connect Brands with Creators',
    },
    description: 'Where beauty brands and creators unite to create impactful collaborations',
    keywords: ['beauty brands', 'creators', 'influencer marketing', 'collaborations'],
    authors: [{ name: 'Clicksi' }],
    creator: 'Clicksi',
    metadataBase: new URL('https://clicksi.io'),
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://clicksi.io',
        siteName: 'Clicksi',
        title: {
            template: '%s - Clicksi',
            default: 'Clicksi - Connect Brands with Creators',
        },
        description: 'Where beauty brands and creators unite to create impactful collaborations',
        images: [
            {
                url: '/dark-icon.png',
                width: 1200,
                height: 630,
                alt: 'Clicksi - Connect Brands with Creators',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: {
            template: '%s - Clicksi',
            default: 'Clicksi - Connect Brands with Creators',
        },
        description: 'Where beauty brands and creators unite to create impactful collaborations',
        images: ['/dark-icon.png'],
        creator: '@clicksi',
    },
    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/favicon.svg', type: 'image/svg+xml', sizes: '16x16' },
            { url: '/favicon.svg', type: 'image/svg+xml', sizes: '32x32' },
        ],
        apple: [
            { url: '/apple-icon.png' },
            { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        other: [
            {
                rel: 'mask-icon',
                url: '/favicon.svg',
                color: '#D78E59',
            },
        ],
    },
    //manifest: '/site.webmanifest',

    // themeColor: [
    //     { media: '(prefers-color-scheme: light)', color: '#EDECF8' },
    //     { media: '(prefers-color-scheme: dark)', color: '#171717' },
    // ],
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>)
{
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.className} bg-[var(--color-primary)] text-[var(--color-light)] min-h-screen`}
            >
                <AppThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                    themes={['light', 'dark']}
                    value={{
                        light: 'light',
                        dark: 'dark',
                    }}
                >
                    {/* Auth provider removed */}
                        <QueryProvider>
                            {children}
                            <Toaster
                                richColors
                                closeButton
                                position="bottom-right"
                                toastOptions={{
                                    classNames: {
                                        toast: 'bg-[var(--color-primary)] border-[var(--color-gray-1)]',
                                        title: 'text-[var(--color-light)]',
                                        description: 'text-[var(--color-gray-2)]',
                                    },
                                }}
                            />
                        </QueryProvider>
                    {/* Auth provider removed */}
                </AppThemeProvider>
            </body>
        </html>
    );
}