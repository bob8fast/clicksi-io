'use client';

import { GetMostSpecificRouteMemoized, canAccessRoute } from '@/config/routes';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useMemo, useRef } from 'react';

interface RouteGuardProps
{
    children: ReactNode;
}

import { LoadingState } from '@/components/ui/loading';

/**
 * Route Guard component that checks user access to routes
 * This is a client-side complement to the middleware
 */export default function RouteGuard({ children }: RouteGuardProps)
{
    // Since authentication is removed, always allow access
    return <>{children}</>;
}


export function useAuthorizationCheck()
{
    // Mock session and status since next-auth is removed
    const session = null;
    const status = 'unauthenticated';
    
    // Since authentication is removed, always return authorized
    return { authorized: true, isChecking: false, status: 'authenticated' };
}