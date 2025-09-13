'use client';
// app/auth/forgot-password/page.tsx
import { useAuthHooks } from '@/hooks/api';
import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function ForgotPasswordPage()
{
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { forgotPassword } = useAuthHooks();

    const handleSubmit = async (e: FormEvent) =>
    {
        e.preventDefault();

        if (!email)
        {
            setError('Email is required');
            return;
        }

        setError('');

        try
        {
            await forgotPassword.mutateAsync({ 
                data: { 
                    email: email 
                } 
            });
            setSuccess(true);
        } catch (error)
        {
            if (error instanceof Error)
            {
                setError(error.message);
            } else
            {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    // Show success message
    if (success)
    {
        return (
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[#EDECF8]">Check your email</h2>
                    <p className="mt-2 text-center text-sm text-[#828288]">
                        If an account exists with the email you provided, we&apos;ve sent instructions to reset your password.
                    </p>
                </div>
                <div className="mt-6 flex justify-center">
                    <Link
                        href="/sign-in"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#D78E59] hover:bg-[#FFAA6C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D78E59]"
                    >
                        Return to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-8">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-[#EDECF8]">Reset your password</h2>
                <p className="mt-2 text-center text-sm text-[#828288]">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
            </div>

            {error && (
                <div className="rounded-md bg-red-900/20 p-4 border border-red-500/20">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-400">Error</h3>
                            <div className="mt-2 text-sm text-red-300">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email-address" className="block text-sm font-medium text-[#EDECF8]">Email address</label>
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="mt-1 appearance-none block w-full px-3 py-2 border border-[#575757] rounded-md shadow-sm placeholder-[#828288] bg-[#171717] text-[#EDECF8] focus:outline-none focus:ring-[#D78E59] focus:border-[#D78E59] sm:text-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={forgotPassword.isPending}
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={forgotPassword.isPending}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#D78E59] hover:bg-[#FFAA6C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D78E59] disabled:opacity-50"
                    >
                            {forgotPassword.isPending ? (
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                            ) : (
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-white group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                            )}
                        {forgotPassword.isPending ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </div>
            </form>

            <div className="text-sm text-center">
                <Link href="/sign-in" className="font-medium text-[#D78E59] hover:text-[#FFAA6C]">
                    Back to sign in
                </Link>
            </div>
        </div>
    );
}