// pages/auth/register.tsx
import { generatePageMetadata } from '@/lib/metadata-utils';
import Link from 'next/link';

export const metadata = generatePageMetadata('/register');

export default function Register()
{
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#090909]">
            <div className="max-w-md w-full space-y-8 p-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-[#EDECF8]">Register</h2>
                    <p className="mt-2 text-sm text-[#828288]">
                        Authentication has been removed from this application.
                    </p>
                </div>
                <div className="mt-8">
                    <Link
                        href="/"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D78E59] hover:bg-[#FFAA6C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D78E59]"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}