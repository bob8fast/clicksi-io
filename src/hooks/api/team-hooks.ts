// hooks/api/team-hooks.ts
import {
    useAcceptTeamInvitation,
    useAddTeamMember,
    useDeclineTeamInvitation,
    useDeleteTeam,
    useGetTeamById,
    useGetTeamInvitations,
    useGetTeamMember,
    useGetTeamMemberPermissions,
    useGetTeamMemberRole,
    useGetTeamsByMember,
    useGetTeamsByOwner,
    useInviteToTeam,
    useIsTeamMember,
    useRemoveTeamMember,
    useUpdateTeam,
    useUpdateTeamMemberRole,
} from '@/gen/api/hooks/user_management/teams';

import {
    useGetTeamUsageLimits,
    useResetUsage,
} from '@/gen/api/hooks/user_management/usage';

/**
 * Team management hooks
 * Provides organized interface for team operations
 */
export const useTeamHooks = () => ({
    getById: useGetTeamById,
    getByOwner: useGetTeamsByOwner,
    getByMember: useGetTeamsByMember,
    update: useUpdateTeam(),
    delete: useDeleteTeam(),

    // Members
    getMember: useGetTeamMember,
    getMemberRole: useGetTeamMemberRole,
    getMemberPermissions: useGetTeamMemberPermissions,
    isMember: useIsTeamMember,
    addMember: useAddTeamMember(),
    removeMember: useRemoveTeamMember(),
    updateMemberRole: useUpdateTeamMemberRole(),

    // Invitations
    getInvitations: useGetTeamInvitations,
    invite: useInviteToTeam(),
    acceptInvitation: useAcceptTeamInvitation(),
    declineInvitation: useDeclineTeamInvitation(),

    // Usage & limits
    getUsageLimits: useGetTeamUsageLimits,
    resetUsage: useResetUsage(),
});