'use client';

// pages/auth/verify-email.tsx
import { useAuthHooks } from '@/hooks/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function VerifyEmail()
{
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    const [isVerifying, setIsVerifying] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [canResend, setCanResend] = useState(false);

    const { verifyEmail, resendEmailVerification } = useAuthHooks();

    useEffect(() =>
    {
        // Verify email when component mounts if userId and token are available
        if (userId && token)
        {
            handleVerifyEmail(userId, token);
        } else
        {
            setError('Invalid or missing verification parameters.');
            setCanResend(true);
        }
    }, [userId, token, handleVerifyEmail]);

    const handleVerifyEmail = useCallback(async (userId: string, token: string) =>
    {
        setIsVerifying(true);
        setError('');

        try
        {
            await verifyEmail().mutateAsync({ userId, token });
            setIsSuccess(true);
        } catch (err)
        {
            if (err instanceof Error)
            {
                setError(err.message);
            } else
            {
                setError('An unexpected error occurred. Please try again.');
            }
            setCanResend(true);
        } finally
        {
            setIsVerifying(false);
        }
    }, [verifyEmail]);

    const handleResendVerification = async () =>
    {
        if (!userId) return;

        try
        {
            // Extract email from URL params if available, or we could ask user to enter email
            const email = searchParams.get('email');
            if (email)
            {
                await resendEmailVerification().mutateAsync(email);
            } else
            {
                setError('Email address is required to resend verification.');
            }
        } catch (err)
        {
            if (err instanceof Error)
            {
                setError(err.message);
            } else
            {
                setError('Failed to resend verification email.');
            }
        }
    };

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-[#EDECF8]">Email Verification</h2>
            </div>

            {isVerifying ? (
                <div className="text-center space-y-4">
                    <p className="text-sm text-[#828288]">Verifying your email...</p>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D78E59]"></div>
                    </div>
                </div>
            ) : isSuccess ? (
                <div className="space-y-6">
                    <div className="bg-green-900/20 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg" role="alert">
                        <p className="font-bold">Success!</p>
                        <p className="block sm:inline">Your email has been verified successfully.</p>
                    </div>

                    <div className="text-center">
                        <Link 
                            href="/sign-in" 
                            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D78E59] hover:bg-[#FFAA6C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D78E59]"
                        >
                            Sign in to your account
                        </Link>
                    </div>
                </div>
            ) : error ? (
                <div className="space-y-6">
                    <div className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg" role="alert">
                        <p className="font-bold">Error</p>
                        <p className="block sm:inline">{error}</p>
                    </div>

                    <div className="text-center space-y-4">
                        {canResend && (
                            <button
                                onClick={handleResendVerification}
                                disabled={resendEmailVerification().isPending}
                                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D78E59] hover:bg-[#FFAA6C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D78E59] disabled:opacity-50"
                            >
                                {resendEmailVerification().isPending ? 'Sending...' : 'Resend Verification Email'}
                            </button>
                        )}
                        <div>
                            <Link href="/sign-in" className="font-medium text-[#D78E59] hover:text-[#FFAA6C]">
                                Back to sign in
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center space-y-6">
                    <p className="text-sm text-[#828288]">
                        Invalid verification link. Please check your email and try again.
                    </p>

                    <div>
                        <Link href="/sign-in" className="font-medium text-[#D78E59] hover:text-[#FFAA6C]">
                            Back to sign in
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}