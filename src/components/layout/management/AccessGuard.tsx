// components/layout/management/AccessGuard.tsx - Role-based Access Control

'use client';

import { ReactNode, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Package, AlertCircle } from 'lucide-react';
import { useManagementLayout } from './ManagementLayoutProvider';

interface AccessGuardProps {
  children: ReactNode;
}

export function AccessGuard({ children }: AccessGuardProps) {
  const { config } = useManagementLayout();
  // Mock session since next-auth is removed
  const session = null;
  const status = 'unauthenticated';
  const router = useRouter();

  const hasAccess = useMemo(() => {
    // Since authentication is removed, always allow access
    return true;
  }, []);

  // Show loading state
  if (hasAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090909]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D78E59] mx-auto mb-4"></div>
          <p className="text-[#828288]">Loading...</p>
        </div>
      </div>
    );
  }

  // Show access denied
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090909]">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-16 h-16 text-[#575757] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#EDECF8] mb-2">Access Restricted</h1>
          <p className="text-[#828288] mb-6">
            You need to be a {config.entityLabel.toLowerCase()} owner to access {config.portalName}.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/')}
              className="w-full bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
            >
              Go Home
            </Button>
            {!session && (
              <Button
                onClick={() => router.push('/sign-in')}
                variant="outline" 
                className="w-full border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // User has access, render children
  return <>{children}</>;
}