"use client";
// TeamSettings.tsx - Redirect component to dedicated team management page

// Mock UserInfo type since next-auth is removed
interface UserInfo {
    user_role: ClicksiDataContractsCommonEnumsUserRole;
}
import { ClicksiDataContractsCommonEnumsUserRole } from "@/gen/api/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ExternalLink, ArrowRight, Mail, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface TeamSettingsProps {
    user: UserInfo;
}

const TeamSettings: React.FC<TeamSettingsProps> = ({ user }) => {
    const router = useRouter();

    const canManageTeams = user.user_role === ClicksiDataContractsCommonEnumsUserRole.Creator || 
                          user.user_role === ClicksiDataContractsCommonEnumsUserRole.BusinessUser;

    if (!canManageTeams) {
        return (
            <div className="p-6">
                <Card className="bg-[#171717] border-[#202020] border-dashed">
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

    const handleOpenTeamManagement = () => {
        router.push('/team');
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-lg font-medium text-[#EDECF8] mb-1">Team Management</h2>
                <p className="text-[#828288] text-sm">Manage your team members and collaborations</p>
            </div>

            <Card className="bg-[#171717] border-[#202020]">
                <CardHeader>
                    <CardTitle className="text-[#EDECF8] flex items-center">
                        <Users className="w-5 h-5 mr-2 text-[#D78E59]" />
                        Team Management Portal
                    </CardTitle>
                    <CardDescription className="text-[#828288]">
                        Access your dedicated team management interface
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-6 bg-[#090909] rounded-lg border border-[#202020] text-center">
                        <Users className="w-12 h-12 text-[#D78E59] mx-auto mb-4" />
                        <h3 className="text-[#EDECF8] font-medium mb-2">Advanced Team Management</h3>
                        <p className="text-[#828288] text-sm mb-4">
                            Access the full team management interface with advanced features for invitations, 
                            role management, and team settings.
                        </p>
                        <Button 
                            onClick={handleOpenTeamManagement}
                            className="bg-[#D78E59] hover:bg-[#B86F47] text-white"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open Team Management
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-[#090909] rounded-lg border border-[#202020] text-center">
                            <Users className="w-6 h-6 text-[#4C1D95] mx-auto mb-2" />
                            <h4 className="text-[#EDECF8] font-medium text-sm mb-1">Member Management</h4>
                            <p className="text-[#828288] text-xs">Invite, remove, and manage team member roles</p>
                        </div>
                        
                        <div className="p-4 bg-[#090909] rounded-lg border border-[#202020] text-center">
                            <Mail className="w-6 h-6 text-[#059669] mx-auto mb-2" />
                            <h4 className="text-[#EDECF8] font-medium text-sm mb-1">Invitations</h4>
                            <p className="text-[#828288] text-xs">Send and manage team invitations</p>
                        </div>
                        
                        <div className="p-4 bg-[#090909] rounded-lg border border-[#202020] text-center">
                            <Settings className="w-6 h-6 text-[#D78E59] mx-auto mb-2" />
                            <h4 className="text-[#EDECF8] font-medium text-sm mb-1">Team Settings</h4>
                            <p className="text-[#828288] text-xs">Configure team preferences and permissions</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TeamSettings;