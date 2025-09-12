// app/brand-management/retailers/page.tsx
'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, ShoppingBag, Plus, Store, Globe, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBrandHooks, useRetailerHooks } from '@/hooks/api';
// import { useSession } from 'next-auth/react'; // Removed auth
import type { UserManagementDomainDTOsRetailerDto } from '@/gen/api/types';

export default function RetailersPage()
{
    const router = useRouter();
    const searchParams = useSearchParams();
    // const { data: session } = useSession(); // Removed auth
    const session = null; // Mock session - auth removed
    
    // Get current brand and team IDs from URL parameters
    // In real implementation, these would come from user context/session
    const brandId = searchParams.get('brandId') || '';
    const teamId = searchParams.get('teamId') || '';

    // Get retailer hooks for API operations
    const retailerHooks = useRetailerHooks();
    const { data: retailersResponse, isLoading: isLoadingRetailers } = retailerHooks.getAll(
        {}, // Empty params for now
        {
            query: {
                enabled: !!teamId
            }
        }
    );
    
    // Extract retailers array from response
    const retailers = retailersResponse?.retailers || [];

    const handleCreateSelfDistributedRetailer = () => {
        router.push(`/brand-management/retailers/create?brandId=${brandId}&teamId=${teamId}`);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#EDECF8]">Retailers</h1>
                    <p className="text-[#828288] mt-1">Manage retailer partnerships and self-distributed locations</p>
                </div>
                <div className="flex gap-3">
                    <Button 
                        onClick={handleCreateSelfDistributedRetailer}
                        className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                    >
                        <Plus size={18} className="mr-2" />
                        Create Self-Distributed
                    </Button>
                    <Button variant="outline" className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]">
                        Invite Retailer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-[#090909] border-[#202020]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#202020] rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-[#D78E59]" />
                            </div>
                            <div>
                                <p className="text-sm text-[#828288]">Active Retailers</p>
                                <p className="text-2xl font-bold text-[#EDECF8]">
                                    {isLoadingRetailers ? '...' : retailers?.length || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#090909] border-[#202020]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#202020] rounded-xl flex items-center justify-center">
                                <Store className="w-6 h-6 text-[#FFAA6C]" />
                            </div>
                            <div>
                                <p className="text-sm text-[#828288]">Self-Distributed</p>
                                <p className="text-2xl font-bold text-[#EDECF8]">
                                    {isLoadingRetailers ? '...' : retailers?.filter((r: UserManagementDomainDTOsRetailerDto) => r.parent_brand_id === brandId)?.length || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#090909] border-[#202020]">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#202020] rounded-xl flex items-center justify-center">
                                <Globe className="w-6 h-6 text-[#575757]" />
                            </div>
                            <div>
                                <p className="text-sm text-[#828288]">Partners</p>
                                <p className="text-2xl font-bold text-[#EDECF8]">
                                    {isLoadingRetailers ? '...' : retailers?.filter((r: UserManagementDomainDTOsRetailerDto) => r.parent_brand_id !== brandId)?.length || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Self-Distributed Retailers Section */}
            <Card className="bg-[#090909] border-[#202020] mb-8">
                <CardHeader>
                    <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                        <Store size={20} />
                        Self-Distributed Retailers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingRetailers ? (
                        <div className="text-center py-8">
                            <div className="animate-spin w-8 h-8 border-2 border-[#D78E59] border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-[#828288]">Loading retailers...</p>
                        </div>
                    ) : retailers?.filter((r: UserManagementDomainDTOsRetailerDto) => r.parent_brand_id === brandId).length === 0 ? (
                        <div className="text-center py-8">
                            <Store className="w-12 h-12 text-[#575757] mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-[#EDECF8] mb-2">No Self-Distributed Retailers Yet</h3>
                            <p className="text-[#828288] mb-4">
                                Create your own retail locations to distribute your products directly to customers.
                            </p>
                            <Button 
                                onClick={handleCreateSelfDistributedRetailer}
                                className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                            >
                                <Plus size={18} className="mr-2" />
                                Create Your First Location
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {retailers?.filter((r: UserManagementDomainDTOsRetailerDto) => r.parent_brand_id === brandId).map((retailer: UserManagementDomainDTOsRetailerDto) => (
                                <div key={retailer.id} className="border border-[#202020] rounded-lg p-4 hover:border-[#575757] transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-lg font-semibold text-[#EDECF8]">{retailer.display_name}</h4>
                                                <Badge variant="secondary" className="bg-[#D78E59] text-[#171717] text-xs">
                                                    Self-Distributed
                                                </Badge>
                                            </div>
                                            <p className="text-[#828288] text-sm mb-2">{retailer.legal_name}</p>
                                            {retailer.description && (
                                                <p className="text-[#575757] text-sm mb-3">{retailer.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 text-xs text-[#575757]">
                                                {retailer.address && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={12} />
                                                        <span>{retailer.address.city}, {retailer.address.country}</span>
                                                    </div>
                                                )}
                                                {retailer.regional_settings && (
                                                    <div className="flex items-center gap-1">
                                                        <Globe size={12} />
                                                        <span>Region: {retailer.regional_settings.region_name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => router.push(`/brand-management/retailers/${retailer.id}`)}
                                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                            >
                                                Manage
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Partner Retailers Section */}
            <Card className="bg-[#090909] border-[#202020]">
                <CardHeader>
                    <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                        <Globe size={20} />
                        Partner Retailers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingRetailers ? (
                        <div className="text-center py-8">
                            <div className="animate-spin w-8 h-8 border-2 border-[#D78E59] border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-[#828288]">Loading partners...</p>
                        </div>
                    ) : retailers?.filter((r: UserManagementDomainDTOsRetailerDto) => r.parent_brand_id !== brandId).length === 0 ? (
                        <div className="text-center py-8">
                            <Globe className="w-12 h-12 text-[#575757] mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-[#EDECF8] mb-2">No Partner Retailers Yet</h3>
                            <p className="text-[#828288] mb-4">
                                Invite external retailers to sell your products and expand your reach.
                            </p>
                            <Button 
                                variant="outline" 
                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                            >
                                Invite Retailer Partner
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {retailers?.filter((r: UserManagementDomainDTOsRetailerDto) => r.parent_brand_id !== brandId).map((retailer: UserManagementDomainDTOsRetailerDto) => (
                                <div key={retailer.id} className="border border-[#202020] rounded-lg p-4 hover:border-[#575757] transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-lg font-semibold text-[#EDECF8]">{retailer.display_name}</h4>
                                                <Badge variant="outline" className="border-[#575757] text-[#828288] text-xs">
                                                    Partner
                                                </Badge>
                                                <Badge variant="secondary" className="bg-[#575757] text-[#EDECF8] text-xs">
                                                    External
                                                </Badge>
                                            </div>
                                            <p className="text-[#828288] text-sm mb-2">{retailer.legal_name}</p>
                                            {retailer.description && (
                                                <p className="text-[#575757] text-sm mb-3">{retailer.description}</p>
                                            )}
                                            <div className="flex items-center gap-4 text-xs text-[#575757]">
                                                {retailer.address && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={12} />
                                                        <span>{retailer.address.city}, {retailer.address.country}</span>
                                                    </div>
                                                )}
                                                {retailer.regional_settings && (
                                                    <div className="flex items-center gap-1">
                                                        <Globe size={12} />
                                                        <span>Region: {retailer.regional_settings.region_name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => router.push(`/brand-management/retailers/${retailer.id}`)}
                                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                            >
                                                View Partnership
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}