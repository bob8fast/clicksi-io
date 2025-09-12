
"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { LoadingState } from "@/components/ui/loading";

/**
 * Dashboard Redirect Component
 * 
 * This component redirects users to the homepage since authentication is removed.
 */
const DashboardRedirect: React.FC = () =>
{
    const router = useRouter();

    useEffect(() =>
    {
        // Without authentication, just redirect to homepage
        router.push('/');
    }, [router]);

    // Show loading state while redirecting
    return <LoadingState message="Redirecting to your dashboard" description="Taking you to the right place..." />;
};

export default DashboardRedirect;