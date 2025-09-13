"use client";
// ProfileMobileNav.tsx
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
    Bars3Icon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import clsx from "clsx";

interface ProfileMobileNavProps {
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

const ProfileMobileNav: React.FC<ProfileMobileNavProps> = ({
    activeTab,
    onTabChange,
    user,
}) => {
    const sections = getNavigationSections(user.user_role);
    const [isOpen, setIsOpen] = useState(false);

    // Find current active item for display
    const currentActiveItem = sections
        .flatMap(section => section.items)
        .find(item => item.id === activeTab);

    const handleTabChange = (tab: string) => {
        onTabChange(tab);
        setIsOpen(false); // Close menu after selection
    };

    return (
        <>
            {/* Mobile Navigation Button */}
            <div className="lg:hidden bg-[#171717] border-b border-[#202020] px-4 py-3">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center justify-between w-full text-left"
                >
                    <div className="flex items-center">
                        {currentActiveItem && (
                            <>
                                <currentActiveItem.icon className="h-5 w-5 mr-3 text-[#D78E59]" />
                                <span className="text-[#EDECF8] font-medium">
                                    {currentActiveItem.name}
                                </span>
                            </>
                        )}
                    </div>
                    <Bars3Icon className="h-5 w-5 text-[#828288]" />
                </button>
            </div>

            {/* Mobile Navigation Overlay */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsOpen(false)}>
                    <div 
                        className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-[#171717] shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#202020]">
                            <h2 className="text-lg font-semibold text-[#EDECF8]">Profile Settings</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-[#828288] hover:text-[#EDECF8] transition-colors"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <div className="p-6 overflow-y-auto h-full">
                            <nav className="space-y-6">
                                {sections.map((section) => (
                                    <div key={section.id}>
                                        {/* Section Header */}
                                        <div className="flex items-center mb-3">
                                            <section.icon className="h-5 w-5 mr-3 text-[#D78E59]" />
                                            <h3 className="text-sm font-semibold text-[#EDECF8] uppercase tracking-wide">
                                                {section.name}
                                            </h3>
                                        </div>

                                        {/* Section Items */}
                                        <div className="space-y-1 ml-8">
                                            {section.items.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleTabChange(item.id)}
                                                    className={clsx(
                                                        "w-full flex items-center px-3 py-3 text-sm rounded-lg transition-all duration-200",
                                                        activeTab === item.id
                                                            ? "bg-[#D78E59] text-[#171717] font-medium shadow-lg"
                                                            : "text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]/50"
                                                    )}
                                                >
                                                    <item.icon className="h-4 w-4 mr-3" />
                                                    <span>{item.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileMobileNav;