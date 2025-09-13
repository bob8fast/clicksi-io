"use client";
// ProfileHeader.tsx
import { ClicksiDataContractsCommonEnumsUserRole } from "@/gen/api/types";
import { ClicksiDataContractsCommonEnumsBusinessType } from "@/gen/api/types";

// Mock user type to replace UserInfo from next-auth
interface UserInfo {
    name?: string;
    email?: string;
    profile_image?: string;
    user_role: ClicksiDataContractsCommonEnumsUserRole;
    business_type?: ClicksiDataContractsCommonEnumsBusinessType;
    business_verification_status?: boolean;
}
import Image from "next/image";
import React, { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Building2, UserCheck, Star, Crown, CameraIcon, CheckCircleIcon, AlertCircle } from "lucide-react";

interface ProfileHeaderProps
{
    user: UserInfo;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) =>
{
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImage, setProfileImage] = useState<string | null>(user.profile_image || null);

    const handleImageUpload = async (file: File) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image size must be less than 5MB');
            return;
        }

        setIsUploading(true);
        setUploadError(null);
        setUploadSuccess(false);

        try {
            // Create FormData for upload
            const formData = new FormData();
            formData.append('image', file);

            // This would be replaced with your actual API call
            const response = await fetch('/api/user/profile-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();
            setProfileImage(data.image_url);
            setUploadSuccess(true);
            
            // Clear success message after 3 seconds
            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (error) {
            setUploadError('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };
    const getRoleBadge = () => {
        const role = user.user_role;
        const businessType = user.business_type;
        
        if (role === ClicksiDataContractsCommonEnumsUserRole.Admin) {
            return (
                <Badge variant="default" className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] font-semibold px-3 py-1">
                    <Crown className="w-4 h-4 mr-1" />
                    Admin
                </Badge>
            );
        }
        
        if (role === ClicksiDataContractsCommonEnumsUserRole.Creator) {
            return (
                <Badge variant="secondary" className="bg-[#8B5CF6] hover:bg-[#A78BFA] text-white font-semibold px-3 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Creator
                </Badge>
            );
        }
        
        if (role === ClicksiDataContractsCommonEnumsUserRole.BusinessUser) {
            const businessLabel = businessType === ClicksiDataContractsCommonEnumsBusinessType.Brand 
                ? "Brand" 
                : businessType === ClicksiDataContractsCommonEnumsBusinessType.Retailer 
                ? "Retailer" 
                : "Business";
                
            return (
                <Badge variant="outline" className="bg-[#10B981] hover:bg-[#34D399] text-white border-[#10B981] font-semibold px-3 py-1">
                    <Building2 className="w-4 h-4 mr-1" />
                    {businessLabel}
                </Badge>
            );
        }
        
        return (
            <Badge variant="outline" className="bg-[#6B7280] hover:bg-[#9CA3AF] text-white border-[#6B7280] font-semibold px-3 py-1">
                <UserCheck className="w-4 h-4 mr-1" />
                Consumer
            </Badge>
        );
    };

    const getVerificationStatus = () => {
        if (user.business_verification_status) {
            return (
                <Badge variant="default" className="bg-green-600 hover:bg-green-500 text-white font-semibold px-3 py-1">
                    <UserCheck className="w-4 h-4 mr-1" />
                    Verified
                </Badge>
            );
        }
        
        if (user.user_role === ClicksiDataContractsCommonEnumsUserRole.BusinessUser || 
            user.user_role === ClicksiDataContractsCommonEnumsUserRole.Creator) {
            return (
                <Badge variant="outline" className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 font-semibold px-3 py-1">
                    Pending Verification
                </Badge>
            );
        }
        
        return null;
    };

    return (
        <div className="bg-[#171717] border border-[#202020] rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
                {/* Avatar */}
                <div className="relative group">
                    <div className="h-32 w-32 relative rounded-full overflow-hidden bg-[#202020] border-4 border-[#575757] flex items-center justify-center shadow-lg transition-all duration-200 group-hover:border-[#D78E59]">
                        {profileImage ? (
                            <Image
                                src={profileImage}
                                alt={user.name || "User avatar"}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <span className="text-5xl text-[#D78E59] font-bold">
                                {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                            </span>
                        )}
                        
                        {/* Upload overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-full">
                            <button
                                onClick={triggerFileInput}
                                disabled={isUploading}
                                className="text-white hover:text-[#D78E59] transition-colors"
                                title="Change profile picture"
                            >
                                {isUploading ? (
                                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <CameraIcon className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                    
                    {/* Status indicators */}
                    {uploadSuccess && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                            <CheckCircleIcon className="h-4 w-4 text-white" />
                        </div>
                    )}
                    {uploadError && (
                        <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-full p-1">
                            <AlertCircle className="h-4 w-4 text-white" />
                        </div>
                    )}
                    
                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
                
                {/* User Info */}
                <div className="text-center lg:text-left flex-1">
                    <h1 className="text-4xl font-bold text-[#EDECF8] mb-2">{user.name}</h1>
                    <p className="text-[#828288] text-xl mb-4">{user.email}</p>
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                        {getRoleBadge()}
                        {getVerificationStatus()}
                    </div>
                    
                    {/* Upload status messages */}
                    {uploadError && (
                        <div className="mt-3 text-sm text-red-400 flex items-center justify-center lg:justify-start">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {uploadError}
                        </div>
                    )}
                    {uploadSuccess && (
                        <div className="mt-3 text-sm text-green-400 flex items-center justify-center lg:justify-start">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Profile picture updated successfully!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;