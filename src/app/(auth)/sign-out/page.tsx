'use client';

export const dynamic = 'force-dynamic';
// app/auth/signout/page.tsx
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignOut() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  useEffect(() => {
    // Simply redirect to home or callback URL since we don't have auth
    const timer = setTimeout(() => {
      router.push(callbackUrl);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [router, callbackUrl]);
  
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-[#EDECF8]">Signed out</h2>
        <p className="text-sm text-[#828288]">You have been signed out successfully. Redirecting you...</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D78E59]"></div>
        </div>
      </div>
    </div>
  );
}