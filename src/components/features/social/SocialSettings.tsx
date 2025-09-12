"use client";
"use client";
// SocialSettings.tsx
import { UserInfo } from "@/types/next-auth";
import { ClicksiDataContractsCommonEnumsUserRole } from "@/gen/api/types";
import { useEngagementHooks } from "@/hooks/api/engagement-hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Heart, Bookmark, Instagram, AlertCircle, Link as LinkIcon } from "lucide-react";
import React, { useState } from "react";

interface SocialSettingsProps {
    user: UserInfo;
}

const SocialSettings: React.FC<SocialSettingsProps> = ({ user }) => {
    const engagementHooks = useEngagementHooks();
    const [instagramConnectionStatus, setInstagramConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
    const [instagramData, setInstagramData] = useState<{
        username?: string;
        followerCount?: number;
        lastSync?: string;
    }>({});

    // Mock Instagram connection for now - will be replaced with real API in implementation
    const handleInstagramConnect = async () => {
        // This will be implemented with the actual Instagram OAuth API
        console.log("Instagram OAuth integration will be implemented");
        
        // Simulate connection process
        setInstagramConnectionStatus('connected');
        setInstagramData({
            username: 'example_user',
            followerCount: 1234,
            lastSync: new Date().toISOString()
        });
    };

    const handleInstagramDisconnect = () => {
        setInstagramConnectionStatus('disconnected');
        setInstagramData({});
    };

    const handleInstagramRefresh = async () => {
        // Manual refresh of Instagram data
        if (instagramConnectionStatus === 'connected') {
            setInstagramData(prev => ({
                ...prev,
                lastSync: new Date().toISOString()
            }));
        }
    };

    const getInstagramStatus = () => {
        switch (instagramConnectionStatus) {
            case 'connected':
                return {
                    icon: <Instagram className="w-5 h-5 text-pink-500" />,
                    label: "Connected",
                    description: "Your Instagram account is connected",
                    variant: "default" as const,
                    className: "bg-pink-600 text-white"
                };
            case 'error':
                return {
                    icon: <AlertCircle className="w-5 h-5 text-red-500" />,
                    label: "Connection Error",
                    description: "There was an issue with your Instagram connection",
                    variant: "destructive" as const,
                    className: "bg-red-600 text-white"
                };
            default:
                return {
                    icon: <Instagram className="w-5 h-5 text-gray-500" />,
                    label: "Not Connected",
                    description: "Connect your Instagram account to sync profile data",
                    variant: "outline" as const,
                    className: "border-gray-500 text-gray-500"
                };
        }
    };

    if (user.user_role === ClicksiDataContractsCommonEnumsUserRole.Consumer) {
        return (
            <div className="p-6 space-y-6">
                <div>
                    <h2 className="text-lg font-medium text-[#EDECF8] mb-1">Social Features</h2>
                    <p className="text-[#828288] text-sm">Basic social features available for consumer accounts</p>
                </div>

                {/* Following Statistics */}
                <Card className="bg-[#171717] border-[#202020]">
                    <CardHeader>
                        <CardTitle className="text-[#EDECF8] flex items-center">
                            <Users className="w-5 h-5 mr-2 text-[#D78E59]" />
                            Following
                        </CardTitle>
                        <CardDescription className="text-[#828288]">
                            Creators and brands you follow
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[#EDECF8]">Following</span>
                                <Badge variant="outline" className="border-[#D78E59] text-[#D78E59]">
                                    View Following
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const instagramStatus = getInstagramStatus();

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-lg font-medium text-[#EDECF8] mb-1">Social Settings</h2>
                <p className="text-[#828288] text-sm">Manage your social media connections and following</p>
            </div>

            {/* Instagram Integration - Creator Only */}
            {user.user_role === ClicksiDataContractsCommonEnumsUserRole.Creator && (
                <Card className="bg-[#171717] border-[#202020]">
                    <CardHeader>
                        <CardTitle className="text-[#EDECF8] flex items-center">
                            {instagramStatus.icon}
                            <span className="ml-2">Instagram Integration</span>
                        </CardTitle>
                        <CardDescription className="text-[#828288]">
                            {instagramStatus.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Badge variant={instagramStatus.variant} className={instagramStatus.className}>
                            {instagramStatus.label}
                        </Badge>

                        {instagramConnectionStatus === 'connected' && instagramData.username && (
                            <div className="bg-[#090909] p-4 rounded-lg border border-[#202020] space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[#EDECF8] font-medium">@{instagramData.username}</span>
                                    <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={handleInstagramRefresh}
                                        className="text-[#828288] hover:text-[#EDECF8]"
                                    >
                                        Refresh
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#828288]">Followers</span>
                                    <span className="text-[#EDECF8]">{instagramData.followerCount?.toLocaleString()}</span>
                                </div>
                                {instagramData.lastSync && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-[#828288]">Last Sync</span>
                                        <span className="text-[#828288]">
                                            {new Date(instagramData.lastSync).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            {instagramConnectionStatus === 'disconnected' ? (
                                <Button 
                                    onClick={handleInstagramConnect}
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                                >
                                    <Instagram className="w-4 h-4 mr-2" />
                                    Connect Instagram Account
                                </Button>
                            ) : (
                                <Button 
                                    variant="outline"
                                    onClick={handleInstagramDisconnect}
                                    className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                >
                                    <LinkIcon className="w-4 h-4 mr-2" />
                                    Disconnect Instagram
                                </Button>
                            )}
                        </div>

                        <div className="text-xs text-[#828288] space-y-1">
                            <p>• Profile info and follower count will be imported</p>
                            <p>• Data syncs daily automatically</p>
                            <p>• Optional connection - can be disconnected anytime</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Social Statistics */}
            <Card className="bg-[#171717] border-[#202020]">
                <CardHeader>
                    <CardTitle className="text-[#EDECF8] flex items-center">
                        <Users className="w-5 h-5 mr-2 text-[#D78E59]" />
                        Social Statistics
                    </CardTitle>
                    <CardDescription className="text-[#828288]">
                        Your following and engagement metrics
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        {user.user_role === ClicksiDataContractsCommonEnumsUserRole.Creator && (
                            <div className="text-center p-3 bg-[#090909] rounded-lg border border-[#202020]">
                                <Users className="w-6 h-6 text-[#D78E59] mx-auto mb-2" />
                                <div className="text-[#EDECF8] font-semibold">Followers</div>
                                <div className="text-[#828288] text-sm">View followers</div>
                            </div>
                        )}
                        <div className="text-center p-3 bg-[#090909] rounded-lg border border-[#202020]">
                            <Users className="w-6 h-6 text-[#D78E59] mx-auto mb-2" />
                            <div className="text-[#EDECF8] font-semibold">Following</div>
                            <div className="text-[#828288] text-sm">View following</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Coming Soon Notice */}
            <Card className="bg-[#171717] border-[#202020] border-dashed">
                <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                        <Instagram className="w-8 h-8 text-[#828288] mx-auto" />
                        <h3 className="text-[#EDECF8] font-medium">More Social Platforms</h3>
                        <p className="text-[#828288] text-sm">
                            TikTok, YouTube, and Facebook integration coming in future updates
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SocialSettings;