"use client";
// TeamManagementPage.tsx
import React, { useState } from 'react';

// Mock UserInfo type since next-auth is removed
interface UserInfo {
    user_id: string;
    user_role: ClicksiDataContractsCommonEnumsUserRole;
}
import { useTeamHooks } from '@/hooks/api';
import { 
    ClicksiDataContractsCommonEnumsTeamRole,
    ClicksiDataContractsCommonEnumsUserRole,
    TeamResponse,
    TeamMemberResponse,
    TeamInvitationResponse
} from '@/gen/api/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
    Users, 
    Crown, 
    UserPlus, 
    Settings, 
    Mail, 
    Shield, 
    Trash2, 
    CheckCircle, 
    XCircle, 
    AlertCircle,
    MoreVertical,
    Edit,
    UserX
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TeamManagementPageProps {
    user: UserInfo;
}

const TeamManagementPage: React.FC<TeamManagementPageProps> = ({ user }) => {
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<ClicksiDataContractsCommonEnumsTeamRole>(ClicksiDataContractsCommonEnumsTeamRole.Member);
    const [inviteMessage, setInviteMessage] = useState('');
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    
    const teamHooks = useTeamHooks();
    
    // Get teams where user is owner
    const { data: ownedTeams, isLoading: ownedTeamsLoading } = teamHooks.getByOwner({
        userId: user.user_id
    });
    
    // Get teams where user is member
    const { data: memberTeams, isLoading: memberTeamsLoading } = teamHooks.getByMember({
        userId: user.user_id
    });
    
    // Get pending invitations for user
    const { data: userInvitations, isLoading: userInvitationsLoading } = teamHooks.getInvitations({
        teamId: selectedTeamId || ownedTeams?.[0]?.teamId || ''
    });

    const canManageTeams = user.user_role === ClicksiDataContractsCommonEnumsUserRole.Creator || 
                          user.user_role === ClicksiDataContractsCommonEnumsUserRole.BusinessUser;

    if (!canManageTeams) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] p-6">
                <Card className="bg-[#171717] border-[#202020] border-dashed max-w-md mx-auto">
                    <CardContent className="p-6 text-center">
                        <Users className="w-8 h-8 text-[#828288] mx-auto mb-2" />
                        <h3 className="text-[#EDECF8] font-medium mb-1">Teams Not Available</h3>
                        <p className="text-[#828288] text-sm">
                            Team management is only available for creators and business users
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Hook mutations
    const inviteMutation = teamHooks.invite;
    const acceptInvitationMutation = teamHooks.acceptInvitation;
    const declineInvitationMutation = teamHooks.declineInvitation;
    const removeMemberMutation = teamHooks.removeMember;
    const updateMemberRoleMutation = teamHooks.updateMemberRole;

    const handleInviteMember = async () => {
        if (!inviteEmail || !selectedTeamId) return;
        
        try {
            await inviteMutation.mutateAsync({
                pathParams: { teamId: selectedTeamId },
                data: {
                    team_id: selectedTeamId,
                    email: inviteEmail,
                    role: inviteRole,
                    message: inviteMessage || null
                }
            });
            
            setInviteEmail('');
            setInviteRole(ClicksiDataContractsCommonEnumsTeamRole.Member);
            setInviteMessage('');
            setIsInviteDialogOpen(false);
        } catch (error) {
            console.error('Failed to send invitation:', error);
        }
    };

    const handleAcceptInvitation = async (invitationId: string) => {
        try {
            await acceptInvitationMutation.mutateAsync({
                data: {
                    token: invitationId
                }
            });
        } catch (error) {
            console.error('Failed to accept invitation:', error);
        }
    };

    const handleDeclineInvitation = async (invitationId: string) => {
        try {
            await declineInvitationMutation.mutateAsync({
                data: {
                    token: invitationId
                }
            });
        } catch (error) {
            console.error('Failed to decline invitation:', error);
        }
    };

    const handleRemoveMember = async (teamId: string, userId: string) => {
        try {
            await removeMemberMutation.mutateAsync({
                pathParams: { teamId: teamId, userId: userId },
                data: {
                    team_id: teamId,
                    user_id: userId,
                    reason: null
                }
            });
        } catch (error) {
            console.error('Failed to remove member:', error);
        }
    };

    const handleUpdateMemberRole = async (teamId: string, userId: string, newRole: ClicksiDataContractsCommonEnumsTeamRole) => {
        try {
            await updateMemberRoleMutation.mutateAsync({
                pathParams: { teamId: teamId, userId: userId },
                data: {
                    team_id: teamId,
                    user_id: userId,
                    role: newRole,
                    reason: null
                }
            });
        } catch (error) {
            console.error('Failed to update member role:', error);
        }
    };

    const getRoleBadgeColor = (role: ClicksiDataContractsCommonEnumsTeamRole) => {
        switch (role) {
            case ClicksiDataContractsCommonEnumsTeamRole.Owner:
                return 'bg-[#D78E59] text-white';
            case ClicksiDataContractsCommonEnumsTeamRole.Admin:
                return 'bg-[#4C1D95] text-white';
            case ClicksiDataContractsCommonEnumsTeamRole.Manager:
                return 'bg-[#059669] text-white';
            case ClicksiDataContractsCommonEnumsTeamRole.Member:
                return 'bg-[#202020] text-[#EDECF8]';
            case ClicksiDataContractsCommonEnumsTeamRole.Contributor:
                return 'bg-[#374151] text-[#EDECF8]';
            case ClicksiDataContractsCommonEnumsTeamRole.Viewer:
                return 'bg-[#1F2937] text-[#EDECF8]';
            default:
                return 'bg-[#202020] text-[#EDECF8]';
        }
    };

    const getInvitationStatusIcon = (status: string) => {
        switch (status) {
            case 'Pending':
                return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            case 'Accepted':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'Declined':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'Expired':
                return <XCircle className="w-4 h-4 text-gray-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-[#828288]" />;
        }
    };

    // Select the first owned team by default
    const defaultTeam = ownedTeams?.[0] || memberTeams?.[0];
    const currentTeamId = selectedTeamId || defaultTeam?.teamId;

    return (
        <div className="min-h-screen bg-[#0D0D0D] p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#EDECF8] mb-1">Team Management</h1>
                        <p className="text-[#828288]">Manage your team members and collaborations</p>
                    </div>
                    
                    {(ownedTeams?.length || 0) > 0 && (
                        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                            <DialogTrigger asChild>
                                <Button 
                                    className="bg-[#D78E59] hover:bg-[#B86F47] text-white"
                                    onClick={() => setSelectedTeamId(currentTeamId || null)}
                                >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Invite Member
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#171717] border-[#202020] text-[#EDECF8]">
                                <DialogHeader>
                                    <DialogTitle>Invite Team Member</DialogTitle>
                                    <DialogDescription className="text-[#828288]">
                                        Send an invitation to join your team
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="email" className="text-[#EDECF8]">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="member@example.com"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            className="bg-[#090909] border-[#202020] text-[#EDECF8]"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="role" className="text-[#EDECF8]">Role</Label>
                                        <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as ClicksiDataContractsCommonEnumsTeamRole)}>
                                            <SelectTrigger className="bg-[#090909] border-[#202020] text-[#EDECF8]">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#171717] border-[#202020]">
                                                <SelectItem value={ClicksiDataContractsCommonEnumsTeamRole.Viewer}>Viewer</SelectItem>
                                                <SelectItem value={ClicksiDataContractsCommonEnumsTeamRole.Contributor}>Contributor</SelectItem>
                                                <SelectItem value={ClicksiDataContractsCommonEnumsTeamRole.Member}>Member</SelectItem>
                                                <SelectItem value={ClicksiDataContractsCommonEnumsTeamRole.Manager}>Manager</SelectItem>
                                                <SelectItem value={ClicksiDataContractsCommonEnumsTeamRole.Admin}>Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="message" className="text-[#EDECF8]">Message (Optional)</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Add a personal message to the invitation..."
                                            value={inviteMessage}
                                            onChange={(e) => setInviteMessage(e.target.value)}
                                            className="bg-[#090909] border-[#202020] text-[#EDECF8]"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setIsInviteDialogOpen(false)}
                                        className="border-[#202020] text-[#EDECF8] hover:bg-[#202020]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleInviteMember}
                                        disabled={!inviteEmail}
                                        className="bg-[#D78E59] hover:bg-[#B86F47] text-white"
                                    >
                                        Send Invitation
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-[#171717] border border-[#202020]">
                        <TabsTrigger 
                            value="overview" 
                            className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-white"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger 
                            value="members" 
                            className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-white"
                        >
                            Team Members
                        </TabsTrigger>
                        <TabsTrigger 
                            value="invitations" 
                            className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-white"
                        >
                            Invitations
                        </TabsTrigger>
                        <TabsTrigger 
                            value="settings" 
                            className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-white"
                        >
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-[#171717] border-[#202020]">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-[#D78E59] bg-opacity-20 rounded-lg">
                                            <Crown className="w-6 h-6 text-[#D78E59]" />
                                        </div>
                                        <div>
                                            <p className="text-[#828288] text-sm">Teams Owned</p>
                                            <p className="text-2xl font-bold text-[#EDECF8]">
                                                {ownedTeamsLoading ? '...' : ownedTeams?.length || 0}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#171717] border-[#202020]">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-[#4C1D95] bg-opacity-20 rounded-lg">
                                            <Users className="w-6 h-6 text-[#4C1D95]" />
                                        </div>
                                        <div>
                                            <p className="text-[#828288] text-sm">Teams Joined</p>
                                            <p className="text-2xl font-bold text-[#EDECF8]">
                                                {memberTeamsLoading ? '...' : memberTeams?.length || 0}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#171717] border-[#202020]">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-[#059669] bg-opacity-20 rounded-lg">
                                            <Mail className="w-6 h-6 text-[#059669]" />
                                        </div>
                                        <div>
                                            <p className="text-[#828288] text-sm">Pending Invites</p>
                                            <p className="text-2xl font-bold text-[#EDECF8]">
                                                {userInvitationsLoading ? '...' : userInvitations?.filter((inv: TeamInvitationResponse) => inv.status === 'Pending').length || 0}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Teams List */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Owned Teams */}
                            <Card className="bg-[#171717] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8] flex items-center">
                                        <Crown className="w-5 h-5 mr-2 text-[#D78E59]" />
                                        My Teams
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {ownedTeamsLoading ? (
                                        <div className="flex items-center justify-center p-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D78E59]"></div>
                                        </div>
                                    ) : ownedTeams?.length ? (
                                        <div className="space-y-4">
                                            {ownedTeams.map((team: TeamResponse) => (
                                                <div key={team.teamId} className="p-4 bg-[#090909] rounded-lg border border-[#202020]">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-[#EDECF8] font-medium">{team.name}</h3>
                                                        <Badge className={getRoleBadgeColor(ClicksiDataContractsCommonEnumsTeamRole.Owner)}>
                                                            <Crown className="w-3 h-3 mr-1" />
                                                            Owner
                                                        </Badge>
                                                    </div>
                                                    {team.description && (
                                                        <p className="text-[#828288] text-sm mb-2">{team.description}</p>
                                                    )}
                                                    <div className="flex items-center space-x-4 text-sm text-[#828288]">
                                                        <span>{team.memberCount} members</span>
                                                        <span>Created {new Date(team.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center p-8">
                                            <Users className="w-8 h-8 text-[#828288] mx-auto mb-2" />
                                            <p className="text-[#EDECF8] font-medium mb-1">No teams owned</p>
                                            <p className="text-[#828288] text-sm">You don't own any teams yet</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Member Teams */}
                            <Card className="bg-[#171717] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8] flex items-center">
                                        <Users className="w-5 h-5 mr-2 text-[#4C1D95]" />
                                        Joined Teams
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {memberTeamsLoading ? (
                                        <div className="flex items-center justify-center p-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D78E59]"></div>
                                        </div>
                                    ) : memberTeams?.length ? (
                                        <div className="space-y-4">
                                            {memberTeams.map((team: TeamResponse) => (
                                                <div key={team.teamId} className="p-4 bg-[#090909] rounded-lg border border-[#202020]">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="text-[#EDECF8] font-medium">{team.name}</h3>
                                                        <Badge className={getRoleBadgeColor(ClicksiDataContractsCommonEnumsTeamRole.Member)}>
                                                            Member
                                                        </Badge>
                                                    </div>
                                                    {team.description && (
                                                        <p className="text-[#828288] text-sm mb-2">{team.description}</p>
                                                    )}
                                                    <div className="flex items-center space-x-4 text-sm text-[#828288]">
                                                        <span>{team.memberCount} members</span>
                                                        <span>Joined {new Date(team.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center p-8">
                                            <Users className="w-8 h-8 text-[#828288] mx-auto mb-2" />
                                            <p className="text-[#EDECF8] font-medium mb-1">No teams joined</p>
                                            <p className="text-[#828288] text-sm">You haven't joined any teams yet</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Members Tab */}
                    <TabsContent value="members" className="space-y-6">
                        <Card className="bg-[#171717] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Team Members</CardTitle>
                                <CardDescription className="text-[#828288]">
                                    Manage your team members and their roles
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center p-8">
                                    <Users className="w-8 h-8 text-[#828288] mx-auto mb-2" />
                                    <p className="text-[#EDECF8] font-medium mb-1">Team Members</p>
                                    <p className="text-[#828288] text-sm">
                                        Team member management will be implemented here
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Invitations Tab */}
                    <TabsContent value="invitations" className="space-y-6">
                        <Card className="bg-[#171717] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center">
                                    <Mail className="w-5 h-5 mr-2 text-[#D78E59]" />
                                    Team Invitations
                                </CardTitle>
                                <CardDescription className="text-[#828288]">
                                    Manage incoming and outgoing team invitations
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {userInvitationsLoading ? (
                                    <div className="flex items-center justify-center p-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D78E59]"></div>
                                    </div>
                                ) : userInvitations?.length ? (
                                    <div className="space-y-4">
                                        {userInvitations.map((invitation: TeamInvitationResponse) => (
                                            <div key={invitation.invitationId} className="p-4 bg-[#090909] rounded-lg border border-[#202020]">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            {getInvitationStatusIcon(invitation.status)}
                                                            <h3 className="text-[#EDECF8] font-medium">{invitation.teamName}</h3>
                                                            <Badge className={getRoleBadgeColor(invitation.role)}>
                                                                {invitation.role}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-[#828288] text-sm mb-2">
                                                            Invited to {invitation.inviteeEmail}
                                                        </p>
                                                        {invitation.message && (
                                                            <p className="text-[#828288] text-sm mb-3">"{invitation.message}"</p>
                                                        )}
                                                        <p className="text-[#828288] text-xs">
                                                            Sent {new Date(invitation.createdAt).toLocaleDateString()}
                                                            {invitation.expiresAt && (
                                                                <> • Expires {new Date(invitation.expiresAt).toLocaleDateString()}</>
                                                            )}
                                                        </p>
                                                    </div>
                                                    
                                                    {invitation.status === 'Pending' && (
                                                        <div className="flex space-x-2 ml-4">
                                                            <Button 
                                                                size="sm"
                                                                onClick={() => handleAcceptInvitation(invitation.invitationId)}
                                                                className="bg-[#059669] hover:bg-[#047857] text-white"
                                                            >
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Accept
                                                            </Button>
                                                            <Button 
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleDeclineInvitation(invitation.invitationId)}
                                                                className="border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white"
                                                            >
                                                                <XCircle className="w-3 h-3 mr-1" />
                                                                Decline
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center p-8">
                                        <Mail className="w-8 h-8 text-[#828288] mx-auto mb-2" />
                                        <p className="text-[#EDECF8] font-medium mb-1">No invitations</p>
                                        <p className="text-[#828288] text-sm">You don't have any pending team invitations</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        <Card className="bg-[#171717] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center">
                                    <Settings className="w-5 h-5 mr-2 text-[#D78E59]" />
                                    Team Settings
                                </CardTitle>
                                <CardDescription className="text-[#828288]">
                                    Configure team preferences and permissions
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center p-8">
                                    <Settings className="w-8 h-8 text-[#828288] mx-auto mb-2" />
                                    <p className="text-[#EDECF8] font-medium mb-1">Team Settings</p>
                                    <p className="text-[#828288] text-sm">
                                        Team settings configuration will be implemented here
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default TeamManagementPage;