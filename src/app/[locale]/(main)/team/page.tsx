// Team Management Page
'use client';

import { useEffect } from 'react';
// import { useSession } from 'next-auth/react'; // Removed auth
import { useRouter } from 'next/navigation';
import { ClicksiDataContractsCommonEnumsUserRole } from '@/gen/api/types';
import TeamManagementPage from '@/components/features/team/TeamManagementPage';

export default function TeamPage() {
    // Mock session data since auth is removed
    const mockSession = { 
        user_info: { 
            user_id: 'mock-user-id',
            user_role: ClicksiDataContractsCommonEnumsUserRole.Creator 
        } 
    };
    const status = 'authenticated';
    const router = useRouter();

    // Access user_info from mock session structure
    const userInfo = mockSession.user_info;

    // Check if user can access team management
    const canAccessTeamManagement = userInfo?.user_role === ClicksiDataContractsCommonEnumsUserRole.Creator || 
                                  userInfo?.user_role === ClicksiDataContractsCommonEnumsUserRole.BusinessUser;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/sign-in');
            return;
        }

        if (status === 'authenticated' && !canAccessTeamManagement) {
            router.push('/unauthorized');
            return;
        }
    }, [status, canAccessTeamManagement, router]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D78E59]"></div>
            </div>
        );
    }

    if (!userInfo || !canAccessTeamManagement) {
        return null;
    }

    return <TeamManagementPage user={userInfo} />;
}