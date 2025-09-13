"use client";
// ModerationSettings.tsx
import { UserInfo } from "@/types/next-auth";
import { ClicksiDataContractsCommonEnumsUserRole } from "@/gen/api/types";
import { useModerationHooks, useTeamHooks } from "@/hooks/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Shield, Eye, EyeOff, Flag, CheckCircle, XCircle, Clock, FileText, Image as ImageIcon } from "lucide-react";
import React, { useState } from "react";

interface ModerationSettingsProps {
    user: UserInfo;
}

const ModerationSettings: React.FC<ModerationSettingsProps> = ({ user }) => {
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
    
    const moderationHooks = useModerationHooks();
    const teamHooks = useTeamHooks();
    
    // Get user's team for content moderation context
    const { data: ownedTeams } = teamHooks.getByOwner({
        userId: user.user_id
    });
    
    const userTeamId = ownedTeams?.[0]?.teamId;
    
    // Placeholder data for moderation features (to be implemented with backend)
    // Content reports will be fetched by team ID since creators work in teams
    const reports = { items: [] };
    const actions = { items: [] };
    const reportsLoading = false;
    const actionsLoading = false;
    const reportDetails = null;

    const canViewModeration = user.user_role === ClicksiDataContractsCommonEnumsUserRole.Creator;

    if (!canViewModeration) {
        return (
            <div className="p-6">
                <Card className="bg-[#171717] border-[#202020] border-dashed">
                    <CardContent className="p-6 text-center">
                        <Shield className="w-8 h-8 text-[#828288] mx-auto mb-2" />
                        <h3 className="text-[#EDECF8] font-medium mb-1">Content Moderation Not Available</h3>
                        <p className="text-[#828288] text-sm">
                            Content moderation features are only available for creators
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleContentVisibilityToggle = async (contentId: string, isVisible: boolean) => {
        // Placeholder for content moderation functionality
        console.log(`Content ${contentId} ${isVisible ? 'restored' : 'hidden'} by creator`);
        // TODO: Implement actual API call when backend is ready
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-500';
            case 'resolved': return 'text-green-500';
            case 'dismissed': return 'text-gray-500';
            case 'escalated': return 'text-red-500';
            default: return 'text-[#828288]';
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'hidden': return 'text-red-500';
            case 'warning': return 'text-yellow-500';
            case 'restored': return 'text-green-500';
            default: return 'text-[#828288]';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'dismissed': return <XCircle className="w-4 h-4 text-gray-500" />;
            case 'escalated': return <AlertTriangle className="w-4 h-4 text-red-500" />;
            default: return <Clock className="w-4 h-4 text-[#828288]" />;
        }
    };

    const getContentTypeIcon = (contentType: string) => {
        switch (contentType) {
            case 'image': return <ImageIcon className="w-4 h-4" />;
            case 'video': return <FileText className="w-4 h-4" />;
            case 'post': return <FileText className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-lg font-medium text-[#EDECF8] mb-1">Team Content Moderation</h2>
                <p className="text-[#828288] text-sm">Manage your team's content reports and moderation status</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="bg-[#171717] border border-[#202020]">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-white">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-white">
                        Content Reports
                    </TabsTrigger>
                    <TabsTrigger value="actions" className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-white">
                        Moderation Actions
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    {/* Moderation Overview */}
                    <Card className="bg-[#171717] border-[#202020]">
                        <CardHeader>
                            <CardTitle className="text-[#EDECF8] flex items-center">
                                <Shield className="w-5 h-5 mr-2 text-[#D78E59]" />
                                Moderation Status
                            </CardTitle>
                            <CardDescription className="text-[#828288]">
                                Your content moderation dashboard and statistics
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-[#090909] rounded-lg border border-[#202020]">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Flag className="w-4 h-4 text-[#DC2626]" />
                                        <span className="text-[#EDECF8] text-sm font-medium">Total Reports</span>
                                    </div>
                                    <p className="text-2xl font-bold text-[#DC2626]">
                                        {reportsLoading ? '...' : reports?.items?.length || 0}
                                    </p>
                                </div>
                                
                                <div className="p-4 bg-[#090909] rounded-lg border border-[#202020]">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Clock className="w-4 h-4 text-[#F59E0B]" />
                                        <span className="text-[#EDECF8] text-sm font-medium">Pending Reports</span>
                                    </div>
                                    <p className="text-2xl font-bold text-[#F59E0B]">
                                        {reportsLoading ? '...' : reports?.items?.filter((r: any) => !r.isResolved).length || 0}
                                    </p>
                                </div>
                                
                                <div className="p-4 bg-[#090909] rounded-lg border border-[#202020]">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Shield className="w-4 h-4 text-[#059669]" />
                                        <span className="text-[#EDECF8] text-sm font-medium">Actions Taken</span>
                                    </div>
                                    <p className="text-2xl font-bold text-[#059669]">
                                        {actionsLoading ? '...' : actions?.items?.length || 0}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Content Status */}
                            <div className="p-4 bg-[#090909] rounded-lg border border-[#202020]">
                                <h3 className="text-[#EDECF8] font-medium mb-3 flex items-center">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Content Visibility Status
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#EDECF8]">Visible Content</span>
                                        <span className="text-green-500">Active</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#EDECF8]">Hidden by Reports</span>
                                        <span className="text-red-500">
                                            {reports?.items?.filter((r: any) => !r.isResolved).length || 0} items
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#EDECF8]">Under Review</span>
                                        <span className="text-yellow-500">
                                            {reports?.items?.filter((r: any) => !r.isResolved).length || 0} items
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reports" className="space-y-4">
                    {/* Content Reports */}
                    <Card className="bg-[#171717] border-[#202020]">
                        <CardHeader>
                            <CardTitle className="text-[#EDECF8] flex items-center">
                                <Flag className="w-5 h-5 mr-2 text-[#D78E59]" />
                                Content Reports
                            </CardTitle>
                            <CardDescription className="text-[#828288]">
                                Reports filed against your content and their status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {reportsLoading ? (
                                <div className="flex items-center justify-center p-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D78E59]"></div>
                                </div>
                            ) : false ? ( // Temporarily disabled until backend is ready
                                <div className="space-y-4">
                                    {/* Reports will be displayed here when backend is ready */}
                                </div>
                            ) : (
                                <div className="text-center p-8">
                                    <Flag className="w-8 h-8 text-[#828288] mx-auto mb-2" />
                                    <p className="text-[#EDECF8] font-medium mb-1">No reports</p>
                                    <p className="text-[#828288] text-sm">You don't have any content reports</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="actions" className="space-y-4">
                    {/* Moderation Actions */}
                    <Card className="bg-[#171717] border-[#202020]">
                        <CardHeader>
                            <CardTitle className="text-[#EDECF8] flex items-center">
                                <Shield className="w-5 h-5 mr-2 text-[#D78E59]" />
                                Moderation Actions
                            </CardTitle>
                            <CardDescription className="text-[#828288]">
                                Actions taken by moderators on your content
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {actionsLoading ? (
                                <div className="flex items-center justify-center p-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D78E59]"></div>
                                </div>
                            ) : false ? ( // Temporarily disabled until backend is ready
                                <div className="space-y-4">
                                    {/* Actions will be displayed here when backend is ready */}
                                </div>
                            ) : (
                                <div className="text-center p-8">
                                    <Shield className="w-8 h-8 text-[#828288] mx-auto mb-2" />
                                    <p className="text-[#EDECF8] font-medium mb-1">No moderation actions</p>
                                    <p className="text-[#828288] text-sm">No moderation actions have been taken on your content</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ModerationSettings;