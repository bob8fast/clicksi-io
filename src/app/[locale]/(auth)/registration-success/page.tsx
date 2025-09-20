'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Mail } from 'lucide-react';

export default function RegistrationSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userRole = searchParams.get('role') || 'Consumer';
    
    const [timeLeft, setTimeLeft] = useState(15);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Use setTimeout to defer the navigation to avoid setState during render
                    setTimeout(() => {
                        router.push('/sign-in');
                    }, 0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    const progressPercentage = ((15 - timeLeft) / 15) * 100;
    const needsEmailVerification = userRole === 'Creator' || userRole === 'BusinessUser';

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 mb-6">
                    <CheckCircle className="h-10 w-10 text-green-400" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-[#EDECF8]">
                    Registration Successful!
                </h2>
                <p className="mt-2 text-sm text-[#828288]">
                    {needsEmailVerification 
                        ? 'Your account has been created and a verification email has been sent.'
                        : 'Your account has been created successfully and is ready to use.'
                    }
                </p>
            </div>

            {needsEmailVerification && (
                <div className="bg-blue-900/20 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-lg">
                    <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium mb-1">Email Verification Required</p>
                            <p className="text-sm">
                                Please check your email and click the verification link to activate your account. 
                                You won&apos;t be able to sign in until your email is verified.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[#171717] border border-[#575757] rounded-lg p-6">
                <div className="text-center mb-6">
                    <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                        <svg 
                            className="w-20 h-20 transform -rotate-90" 
                            viewBox="0 0 100 100"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="#575757"
                                strokeWidth="6"
                                fill="none"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="#D78E59"
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 45}`}
                                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-linear"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-[#EDECF8]">{timeLeft}</span>
                        </div>
                    </div>
                    <p className="text-sm text-[#828288]">
                        Redirecting to sign in automatically
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/sign-in"
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#D78E59] hover:bg-[#FFAA6C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D78E59] transition-colors"
                    >
                        Sign In Now
                    </Link>
                    <Link
                        href="/"
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-[#575757] shadow-sm text-sm font-medium rounded-md text-[#EDECF8] bg-[#171717] hover:bg-[#202020] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D78E59] transition-colors"
                    >
                        Go Home
                    </Link>
                </div>
            </div>

            <div className="text-center">
                <p className="text-xs text-[#828288]">
                    Welcome to Clicksi! {needsEmailVerification ? 'Don&apos;t forget to verify your email.' : 'You can start exploring right away.'}
                </p>
            </div>
        </div>
    );
}