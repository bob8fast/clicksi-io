'use client';
// app/auth/error/page.tsx
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

const ERROR_MESSAGES: Record<string, string> = {
    'Default': 'An unexpected error occurred during authentication.',
    'CredentialsSignin': 'Invalid email or password. Please try again.',
    'OAuthAccountNotLinked': 'This account is linked to a different sign-in method.',
    'RefreshAccessTokenError': 'Your session has expired. Please sign in again.',
};



function ErrorPageContent() {
    const searchParams = useSearchParams();
    const [error, setError] = useState<string>('Default');
    const [errorMessage, setErrorMessage] = useState<string>(ERROR_MESSAGES['Default']);

    useEffect(() =>
    {
        const errorType = searchParams.get('error') || 'Default';
        setError(errorType);
        setErrorMessage(ERROR_MESSAGES[errorType] || ERROR_MESSAGES['Default']);
    }, [searchParams]);

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-[#EDECF8]">Authentication Error</h2>
                <p className="mt-2 text-sm text-[#828288]">
                    {errorMessage}
                </p>
            </div>

            <div className="bg-[#171717] border border-[#575757] rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-[#EDECF8]">What you can do</h3>
                    <div className="mt-2 max-w-xl text-sm text-[#828288]">
                        <p>
                            Try the following options to resolve the issue:
                        </p>
                    </div>
                    <ul className="mt-3 list-disc list-inside text-sm text-[#828288] space-y-2">
                        {error === 'CredentialsSignin' && (
                            <>
                                <li>Check if your email and password are correct</li>
                                <li>Reset your password if you can&apos;t remember it</li>
                            </>
                        )}
                        {error === 'OAuthAccountNotLinked' && (
                            <>
                                <li>Use the same social account you used when you first signed up</li>
                                <li>Sign in with your email and password instead</li>
                            </>
                        )}
                        {error === 'RefreshAccessTokenError' && (
                            <>
                                <li>Your session has expired</li>
                                <li>Sign in again to continue</li>
                            </>
                        )}
                        <li>Go back to the sign in page and try again</li>
                        <li>Contact support if the problem persists</li>
                    </ul>
                    <div className="mt-5 flex justify-center space-x-4">
                        <Link
                            href="/sign-in"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#D78E59] hover:bg-[#FFAA6C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D78E59]"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 border border-[#575757] shadow-sm text-sm font-medium rounded-md text-[#EDECF8] bg-[#171717] hover:bg-[#202020] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D78E59]"
                        >
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ErrorPage() {
    return (
        <Suspense fallback={
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-[#EDECF8]">Loading...</h2>
                </div>
            </div>
        }>
            <ErrorPageContent />
        </Suspense>
    );
}