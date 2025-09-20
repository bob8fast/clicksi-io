'use client';
// app/unauthorized/page.tsx
// import { useSession } from 'next-auth/react'; // Removed auth
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UnauthorizedPage()
{
    // Mock session data since auth is removed
    const mockSession = { user_info: { user_role: 'Consumer' } };
    const status = 'authenticated';
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    // Redirect to homepage after countdown
    useEffect(() =>
    {
        if (countdown <= 0)
        {
            router.push('/');
            return;
        }

        const timer = setTimeout(() =>
        {
            setCountdown(countdown - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                        <svg className="h-10 w-10 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">Access Denied</h2>
                    <p className="mt-2 text-gray-600">
                        {status === 'authenticated' ? (
                            <>
                                Your account doesn&apos;t have permission to access this page.
                                {mockSession.user_info?.user_role && (
                                    <span> You&apos;re signed in with <span className="font-semibold">{mockSession.user_info?.user_role}</span> privileges.</span>
                                )}
                            </>
                        ) : (
                            <>
                                You need to be signed in to access this page.
                            </>
                        )}
                    </p>

                    <div className="mt-6 flex flex-col space-y-4">
                        {status === 'authenticated' ? (
                            <>
                                <Link
                                    href="/"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Go to Home Page
                                </Link>
                                <div className="text-sm text-gray-500">
                                    Redirecting to home page in {countdown} second{countdown !== 1 && 's'}...
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/sign-in"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/"
                                    className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Go to Home Page
                                </Link>
                                <div className="text-sm text-gray-500">
                                    Redirecting to home page in {countdown} second{countdown !== 1 && 's'}...
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}