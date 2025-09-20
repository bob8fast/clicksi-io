// app/(auth)/layout.tsx - Auth layout with Header and Footer
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import RouteGuard from '@/components/shared/guards/route-guard';
import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div>
            <Header />
            {/* Main content area with calculated height to push footer up at lower zoom levels
                calc(100vh - 80px - 200px): viewport height minus header (~80px) and footer (~200px)
                Uses min-h to allow expansion for large content (like registration form) */}
            <main className="pt-16 bg-gradient-to-br from-[#090909] to-[#171717] min-h-[calc(100vh-80px-200px)] w-full">
                <RouteGuard>
                    <div className="w-full min-w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-16 flex items-center justify-center min-h-full overflow-x-hidden">
                        {children}
                    </div>
                </RouteGuard>
            </main>
            <Footer />
        </div>
    );
}