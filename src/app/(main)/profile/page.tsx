"use client";

// import MfaSetup from "@/components/features/auth/mfa/MfaSetup"; // Removed auth
import AccountSettings from "@/components/features/profile/AccountSettings";
import ProfileHeader from "@/components/features/profile/ProfileHeader";
import ProfileSidebar from "@/components/features/profile/ProfileSidebar";
import ProfileMobileNav from "@/components/features/profile/ProfileMobileNav";
import SecuritySettings from "@/components/features/profile/SecuritySettings";
import { BusinessSettings } from "@/components/features/business";
import { SocialSettings, UserDiscovery } from "@/components/features/social";
import { ModerationSettings, TeamSettings } from "@/components/features/team";
import { ClicksiDataContractsCommonEnumsUserRole } from "@/gen/api/types";
// import { useSession } from "next-auth/react"; // Removed auth
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProfilePage: React.FC = () =>
{
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams?.get("tab");

    const [activeTab, setActiveTab] = useState<string>(tabParam || "general");

    // Mock user data since auth is removed
    const mockUser = {
        user_id: 'mock-user-id',
        email: 'user@example.com',
        name: 'Mock User',
        user_role: 'Consumer' as ClicksiDataContractsCommonEnumsUserRole,
        business_type: null,
        profile_image_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    // Update URL when tab changes
    const handleTabChange = (tab: string) =>
    {
        setActiveTab(tab);
        router.push(`/profile?tab=${tab}`, { scroll: false });
    };

    // Update active tab from URL when it changes
    useEffect(() =>
    {
        const validTabs = ["general", "business", "team", "social", "discovery", "moderation", "security", "notifications", "privacy"];
        if (tabParam && validTabs.includes(tabParam))
        {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    // Always show the profile page with mock data

    const renderTabContent = () =>
    {
        switch (activeTab)
        {
            case "general":
                return <AccountSettings user={mockUser} />;
            case "business":
                return <BusinessSettings user={mockUser} />;
            case "team":
                return <TeamSettings user={mockUser} />;
            case "social":
                return <SocialSettings user={mockUser} />;
            case "discovery":
                return <UserDiscovery user={mockUser} />;
            case "moderation":
                return <ModerationSettings user={mockUser} />;
            case "security":
                return <SecuritySettings />;
            case "notifications":
                return (
                    <div className="p-6 lg:p-8">
                        <div className="max-w-4xl">
                            <h2 className="text-2xl font-semibold text-[#EDECF8] mb-2">Notification Settings</h2>
                            <p className="text-[#828288] mb-6">Manage how you want to be notified about platform activities.</p>
                            <div className="bg-[#202020] border border-[#575757] rounded-lg p-4">
                                <p className="text-[#828288]">Notification preferences will be available soon.</p>
                            </div>
                        </div>
                    </div>
                );
            case "privacy":
                return (
                    <div className="p-6 lg:p-8">
                        <div className="max-w-4xl">
                            <h2 className="text-2xl font-semibold text-[#EDECF8] mb-2">Privacy Settings</h2>
                            <p className="text-[#828288] mb-6">Control your privacy and data sharing preferences.</p>
                            <div className="bg-[#202020] border border-[#575757] rounded-lg p-4">
                                <p className="text-[#828288]">Privacy settings will be available soon.</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#090909]">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
                {/* Profile Header */}
                <div className="mb-8">
                    <ProfileHeader user={mockUser} />
                </div>

                {/* Profile Content */}
                <div className="bg-[#171717] border border-[#202020] rounded-2xl shadow-xl overflow-hidden">
                    {/* Mobile Navigation */}
                    <ProfileMobileNav 
                        activeTab={activeTab} 
                        onTabChange={handleTabChange} 
                        user={mockUser} 
                    />
                    
                    {/* Desktop Layout */}
                    <div className="flex min-h-[600px]">
                        {/* Sidebar Navigation - Desktop Only */}
                        <div className="hidden lg:block">
                            <ProfileSidebar 
                                activeTab={activeTab} 
                                onTabChange={handleTabChange} 
                                user={mockUser} 
                            />
                        </div>
                        
                        {/* Content Area */}
                        <div className="flex-1">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;