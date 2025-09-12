"use client";
// ProfileSidebar.tsx
import React, { useState } from 'react';
import { UserInfo } from "@/types/next-auth";
import { ClicksiDataContractsCommonEnumsUserRole } from "@/gen/api/types";
import {
    UserIcon,
    LockClosedIcon,
    ShieldCheckIcon,
    BellIcon,
    HeartIcon,
    MagnifyingGlassIcon,
    BuildingOfficeIcon,
    UsersIcon,
    ShieldExclamationIcon,
    ChevronDownIcon,
    ChevronRightIcon
} from "@heroicons/react/24/outline";
import clsx from "clsx";

interface ProfileSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    user: UserInfo;
}

interface NavigationSection {
    id: string;
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    items: NavigationItem[];
}

interface NavigationItem {
    id: string;
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const getNavigationSections = (userRole?: string): NavigationSection[] => {
    const sections: NavigationSection[] = [
        {
            id: "account",
            name: "Account",
            icon: UserIcon,
            items: [
                { id: "general", name: "General Information", icon: UserIcon },
                { id: "security", name: "Security & Privacy", icon: LockClosedIcon },
                { id: "mfa", name: "Two-Factor Auth", icon: ShieldCheckIcon },
            ]
        },
        {
            id: "social",
            name: "Social & Discovery",
            icon: HeartIcon,
            items: [
                { id: "social", name: "Social Settings", icon: HeartIcon },
                { id: "discovery", name: "Discovery Preferences", icon: MagnifyingGlassIcon },
            ]
        },
        {
            id: "preferences",
            name: "Preferences",
            icon: BellIcon,
            items: [
                { id: "notifications", name: "Notifications", icon: BellIcon },
                { id: "privacy", name: "Privacy Settings", icon: ShieldCheckIcon },
            ]
        }
    ];

    // Add business section for business users and creators
    if (userRole === ClicksiDataContractsCommonEnumsUserRole.Creator) {
        sections.splice(2, 0, {
            id: "business",
            name: "Business",
            icon: BuildingOfficeIcon,
            items: [
                { id: "business", name: "Business Information", icon: BuildingOfficeIcon },
                { id: "team", name: "Team Management", icon: UsersIcon },
                { id: "moderation", name: "Content Moderation", icon: ShieldExclamationIcon },
            ]
        });
    } else if (userRole === ClicksiDataContractsCommonEnumsUserRole.BusinessUser) {
        sections.splice(2, 0, {
            id: "business",
            name: "Business",
            icon: BuildingOfficeIcon,
            items: [
                { id: "business", name: "Business Information", icon: BuildingOfficeIcon },
                { id: "team", name: "Team Management", icon: UsersIcon },
            ]
        });
    }

    return sections;
};

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
    activeTab,
    onTabChange,
    user,
}) => {
    const sections = getNavigationSections(user.user_role);
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

    const toggleSection = (sectionId: string) => {
        const newCollapsed = new Set(collapsedSections);
        if (newCollapsed.has(sectionId)) {
            newCollapsed.delete(sectionId);
        } else {
            newCollapsed.add(sectionId);
        }
        setCollapsedSections(newCollapsed);
    };

    const isItemActive = (itemId: string) => activeTab === itemId;
    const isSectionActive = (section: NavigationSection) => 
        section.items.some(item => isItemActive(item.id));

    return (
        <div className="w-64 bg-[#171717] border-r border-[#202020] h-full overflow-y-auto">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-[#EDECF8] mb-6">Profile Settings</h2>
                
                <nav className="space-y-2">
                    {sections.map((section) => {
                        const isCollapsed = collapsedSections.has(section.id);
                        const isActive = isSectionActive(section);
                        
                        return (
                            <div key={section.id}>
                                {/* Section Header */}
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className={clsx(
                                        "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                        isActive
                                            ? "bg-[#D78E59]/10 text-[#D78E59]"
                                            : "text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]/50"
                                    )}
                                >
                                    <div className="flex items-center">
                                        <section.icon className="h-5 w-5 mr-3" />
                                        <span>{section.name}</span>
                                    </div>
                                    {isCollapsed ? (
                                        <ChevronRightIcon className="h-4 w-4" />
                                    ) : (
                                        <ChevronDownIcon className="h-4 w-4" />
                                    )}
                                </button>

                                {/* Section Items */}
                                {!isCollapsed && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {section.items.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => onTabChange(item.id)}
                                                className={clsx(
                                                    "w-full flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200",
                                                    isItemActive(item.id)
                                                        ? "bg-[#D78E59] text-[#171717] font-medium shadow-lg"
                                                        : "text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]/50"
                                                )}
                                            >
                                                <item.icon className="h-4 w-4 mr-3" />
                                                <span>{item.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default ProfileSidebar;