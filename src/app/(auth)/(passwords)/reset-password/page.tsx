'use client';

export const dynamic = 'force-dynamic';
// app/auth/reset-password/page.tsx
import { useAuthHooks } from '@/hooks/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

export default function ResetPasswordPage()
{
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const searchParams = useSearchParams();
    const email = searchParams.get('email') || searchParams.get('userId'); // Support both for backward compatibility
    const token = searchParams.get('token');
    const { resetPassword } = useAuthHooks();

    // Verify that we have the required parameters
    useEffect(() =>
    {
        if (!email || !token)
        {
            setError('Invalid or missing reset parameters. Please request a new password reset link.');
        }
    }, [email, token]);

    const handleSubmit = async (e: FormEvent) =>
    {
        e.preventDefault();

        if (!email || !token)
        {
            setError('Invalid or missing reset parameters. Please request a new password reset link.');
            return;
        }

        if (newPassword !== confirmPassword)
        {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8)
        {
            setError('Password must be at least 8 characters long');
            return;
        }

        setError('');

        try
        {
            await resetPassword.mutateAsync({
                data: {
                    reset_token: token,
                    new_password: newPassword,
                    confirm_new_password: confirmPassword,
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
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-[#EDECF8]">Password Reset Successful</h2>
                    <p className="mt-2 text-center text-sm text-[#828288]">
                        Your password has been successfully reset. You can now sign in with your new password.
                    </p>
                </div>
                <div className="mt-6 flex justify-center">
                    <Link
                        href="/sign-in"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#D78E59] hover:bg-[#FFAA6C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D78E59]"
                    >
                        Sign In
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
                    Enter your new password below.
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
                    <label htmlFor="new-password" className="block text-sm font-medium text-[#EDECF8]">New password</label>
                    <input
                        id="new-password"
                        name="newPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="mt-1 appearance-none block w-full px-3 py-2 border border-[#575757] rounded-md shadow-sm placeholder-[#828288] bg-[#171717] text-[#EDECF8] focus:outline-none focus:ring-[#D78E59] focus:border-[#D78E59] sm:text-sm"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={resetPassword.isPending || !email || !token}
                    />
                </div>

                <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-[#EDECF8]">Confirm new password</label>
                    <input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="mt-1 appearance-none block w-full px-3 py-2 border border-[#575757] rounded-md shadow-sm placeholder-[#828288] bg-[#171717] text-[#EDECF8] focus:outline-none focus:ring-[#D78E59] focus:border-[#D78E59] sm:text-sm"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={resetPassword.isPending || !email || !token}
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={resetPassword.isPending || !email || !token}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#D78E59] hover:bg-[#FFAA6C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D78E59] disabled:opacity-50"
                    >
                            {resetPassword.isPending ? (
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                        ) : (
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-white group-hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                        )}
                        {resetPassword.isPending ? 'Resetting...' : 'Reset Password'}
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