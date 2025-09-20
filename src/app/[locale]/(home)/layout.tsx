// app/(main)/layout.tsx - Main app layout with Header and Footer
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import RouteGuard from '@/components/shared/guards/route-guard';
import { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
}

export default function HomeLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-16">
                <RouteGuard>
                    {children}
                </RouteGuard>
            </main>
            <Footer />
        </div>
    );
}