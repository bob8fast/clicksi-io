// BusinessSettings.tsx
import { UserInfo } from "@/types/next-auth";
import { ClicksiDataContractsCommonEnumsUserRole, ClicksiDataContractsCommonEnumsBusinessType } from "@/gen/api/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle, Clock, XCircle } from "lucide-react";
import React from "react";

interface BusinessSettingsProps {
    user: UserInfo;
}

const BusinessSettings: React.FC<BusinessSettingsProps> = ({ user }) => {
    const getBusinessTypeLabel = () => {
        if (user.business_type === ClicksiDataContractsCommonEnumsBusinessType.Brand) {
            return "Brand";
        }
        if (user.business_type === ClicksiDataContractsCommonEnumsBusinessType.Retailer) {
            return "Retailer";
        }
        return "Business";
    };

    const getVerificationStatus = () => {
        if (user.business_verification_status) {
            return {
                icon: <CheckCircle className="w-5 h-5 text-green-500" />,
                label: "Verified",
                description: "Your business has been verified",
                variant: "default" as const,
                className: "bg-green-600 text-white"
            };
        }
        
        return {
            icon: <Clock className="w-5 h-5 text-yellow-500" />,
            label: "Pending Verification",
            description: "Your verification is being reviewed",
            variant: "outline" as const,
            className: "border-yellow-500 text-yellow-500"
        };
    };

    const verificationStatus = getVerificationStatus();

    const handleVerificationRedirect = () => {
        window.location.href = "/verification";
    };

    if (user.user_role === ClicksiDataContractsCommonEnumsUserRole.Consumer) {
        return (
            <div className="p-6">
                <h2 className="text-lg font-medium text-[#EDECF8] mb-4">Business Settings</h2>
                <p className="text-[#828288]">Business settings are not available for consumer accounts.</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-lg font-medium text-[#EDECF8] mb-1">Business Settings</h2>
                <p className="text-[#828288] text-sm">Manage your business profile and verification status</p>
            </div>

            {/* Business Type Card */}
            <Card className="bg-[#171717] border-[#202020]">
                <CardHeader>
                    <CardTitle className="text-[#EDECF8] flex items-center">
                        <Building2 className="w-5 h-5 mr-2 text-[#D78E59]" />
                        Business Type
                    </CardTitle>
                    <CardDescription className="text-[#828288]">
                        Your account is registered as a {getBusinessTypeLabel().toLowerCase()}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Badge variant="outline" className="bg-[#059669] text-white border-[#059669]">
                        <Building2 className="w-3 h-3 mr-1" />
                        {getBusinessTypeLabel()}
                    </Badge>
                </CardContent>
            </Card>

            {/* Verification Status Card */}
            <Card className="bg-[#171717] border-[#202020]">
                <CardHeader>
                    <CardTitle className="text-[#EDECF8] flex items-center">
                        {verificationStatus.icon}
                        <span className="ml-2">Verification Status</span>
                    </CardTitle>
                    <CardDescription className="text-[#828288]">
                        {verificationStatus.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Badge variant={verificationStatus.variant} className={verificationStatus.className}>
                        {verificationStatus.label}
                    </Badge>
                    
                    {!user.business_verification_status && (
                        <div>
                            <p className="text-[#828288] text-sm mb-3">
                                Complete your business verification to access all features and build trust with customers.
                            </p>
                            <Button 
                                onClick={handleVerificationRedirect}
                                className="bg-[#D78E59] hover:bg-[#B86F47] text-white"
                            >
                                Complete Verification
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Business Profile Actions */}
            <Card className="bg-[#171717] border-[#202020]">
                <CardHeader>
                    <CardTitle className="text-[#EDECF8]">Business Profile</CardTitle>
                    <CardDescription className="text-[#828288]">
                        Manage your business profile and public information
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button 
                        variant="outline" 
                        className="w-full justify-start border-[#202020] text-[#EDECF8] hover:bg-[#202020]"
                        onClick={() => {
                            const businessType = user.business_type;
                            if (businessType === ClicksiDataContractsCommonEnumsBusinessType.Brand) {
                                window.location.href = "/brand-management";
                            } else if (businessType === ClicksiDataContractsCommonEnumsBusinessType.Retailer) {
                                window.location.href = "/retailers";
                            }
                        }}
                    >
                        <Building2 className="w-4 h-4 mr-2" />
                        Manage {getBusinessTypeLabel()} Profile
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default BusinessSettings;