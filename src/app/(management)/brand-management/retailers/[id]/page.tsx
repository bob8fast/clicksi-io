// app/brand-management/retailers/[id]/page.tsx
'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Settings, Package, BarChart3, MapPin, Globe, Mail, Phone, Edit } from 'lucide-react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useRetailerHooks, useProductHooks } from '@/hooks/api';
// import { useSession } from 'next-auth/react'; // Removed auth
import type { UserManagementDomainDTOsRetailerDto, ProductCatalogDomainDTOsProductListDto } from '@/gen/api/types';
import { useState } from 'react';

export default function RetailerManagementPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    
    const retailerId = params.id as string;
    const brandId = searchParams.get('brandId') || '';
    const teamId = searchParams.get('teamId') || '';

    // Get retailer hooks for API operations
    const retailerHooks = useRetailerHooks();
    const productHooks = useProductHooks();
    
    const { data: retailer, isLoading: isLoadingRetailer } = retailerHooks.getById(
        { id: retailerId },
        {
            query: {
                enabled: !!retailerId
            }
        }
    );

    const { data: productsResponse, isLoading: isLoadingProducts } = productHooks.getAll(
        {
            query: {
                enabled: !!brandId
            }
        }
    );

    const products = productsResponse?.products || [];
    const [productAvailability, setProductAvailability] = useState<Record<string, boolean>>({});

    const handleBack = () => {
        router.push(`/brand-management/retailers?brandId=${brandId}&teamId=${teamId}`);
    };

    const handleEdit = () => {
        router.push(`/brand-management/retailers/${retailerId}/edit?brandId=${brandId}&teamId=${teamId}`);
    };

    const toggleProductAvailability = (productId: string, available: boolean) => {
        setProductAvailability(prev => ({
            ...prev,
            [productId]: available
        }));
        // TODO: Implement API call to update product availability for this retailer
    };

    if (isLoadingRetailer) {
        return (
            <div className="min-h-screen bg-[#171717] p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-spin w-8 h-8 border-2 border-[#D78E59] border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-center text-[#828288] mt-4">Loading retailer...</p>
                </div>
            </div>
        );
    }

    if (!retailer) {
        return (
            <div className="min-h-screen bg-[#171717] p-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-[#EDECF8] mb-4">Retailer Not Found</h1>
                    <p className="text-[#828288] mb-4">The retailer you're looking for doesn't exist.</p>
                    <Button onClick={handleBack} className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]">
                        Back to Retailers
                    </Button>
                </div>
            </div>
        );
    }

    const isSelfDistributed = retailer.parent_brand_id === brandId;

    return (
        <div className="min-h-screen bg-[#171717] p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={handleBack}
                            className="text-[#828288] hover:text-[#EDECF8]"
                        >
                            <ArrowLeft size={20} />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold text-[#EDECF8]">{retailer.display_name}</h1>
                                <Badge variant={isSelfDistributed ? "default" : "outline"} 
                                       className={isSelfDistributed ? "bg-[#D78E59] text-[#171717]" : "border-[#575757] text-[#828288]"}>
                                    {isSelfDistributed ? 'Self-Distributed' : 'Partner'}
                                </Badge>
                            </div>
                            <p className="text-[#828288]">{retailer.legal_name}</p>
                        </div>
                    </div>
                    {isSelfDistributed && (
                        <Button 
                            onClick={handleEdit}
                            variant="outline"
                            className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                        >
                            <Edit size={18} className="mr-2" />
                            Edit Retailer
                        </Button>
                    )}
                </div>

                {/* Retailer Overview */}
                <Card className="bg-[#090909] border-[#202020] mb-8">
                    <CardHeader>
                        <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                            <Settings size={20} />
                            Retailer Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-[#EDECF8] font-semibold mb-3">Basic Information</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[#575757]">Display Name:</span>
                                        <span className="text-[#EDECF8]">{retailer.display_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[#575757]">Legal Name:</span>
                                        <span className="text-[#EDECF8]">{retailer.legal_name}</span>
                                    </div>
                                    {retailer.website_url && (
                                        <div className="flex justify-between">
                                            <span className="text-[#575757]">Website:</span>
                                            <a href={retailer.website_url} target="_blank" rel="noopener noreferrer" 
                                               className="text-[#D78E59] hover:text-[#FFAA6C]">
                                                {retailer.website_url}
                                            </a>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-[#575757]">Verified:</span>
                                        <Badge variant={retailer.is_verified ? "default" : "outline"} 
                                               className={retailer.is_verified ? "bg-green-600 text-white text-xs" : "border-[#575757] text-[#828288] text-xs"}>
                                            {retailer.is_verified ? 'Verified' : 'Unverified'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[#EDECF8] font-semibold mb-3">Contact & Location</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Mail size={14} className="text-[#575757]" />
                                        <span className="text-[#EDECF8]">{retailer.contact_info.email}</span>
                                    </div>
                                    {retailer.contact_info.phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-[#575757]" />
                                            <span className="text-[#EDECF8]">{retailer.contact_info.phone}</span>
                                        </div>
                                    )}
                                    {retailer.address && (
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-[#575757]" />
                                            <span className="text-[#EDECF8]">
                                                {retailer.address.city}, {retailer.address.country}
                                            </span>
                                        </div>
                                    )}
                                    {retailer.regional_settings && (
                                        <div className="flex items-center gap-2">
                                            <Globe size={14} className="text-[#575757]" />
                                            <span className="text-[#EDECF8]">
                                                Region: {retailer.regional_settings.region_name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {retailer.description && (
                            <div className="mt-6">
                                <h3 className="text-[#EDECF8] font-semibold mb-2">Description</h3>
                                <p className="text-[#575757] text-sm">{retailer.description}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Management Tabs */}
                <Tabs defaultValue="products" className="space-y-6">
                    <TabsList className="bg-[#202020] border-[#575757]">
                        <TabsTrigger value="products" className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-[#171717]">
                            <Package size={16} className="mr-2" />
                            Product Management
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-[#171717]">
                            <BarChart3 size={16} className="mr-2" />
                            Analytics
                        </TabsTrigger>
                    </TabsList>

                    {/* Product Management Tab */}
                    <TabsContent value="products">
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Product Availability Management</CardTitle>
                                <p className="text-[#575757] text-sm">
                                    Manage which products are available through this retailer
                                </p>
                            </CardHeader>
                            <CardContent>
                                {isLoadingProducts ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin w-8 h-8 border-2 border-[#D78E59] border-t-transparent rounded-full mx-auto mb-4"></div>
                                        <p className="text-[#828288]">Loading products...</p>
                                    </div>
                                ) : products.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Package className="w-12 h-12 text-[#575757] mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-[#EDECF8] mb-2">No Products Available</h3>
                                        <p className="text-[#828288]">
                                            Create products first before managing retailer availability.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {products.map((product: ProductCatalogDomainDTOsProductListDto) => (
                                            <div key={product.id} className="border border-[#202020] rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="text-lg font-semibold text-[#EDECF8]">{product.name}</h4>
                                                            <Badge variant="outline" className="border-[#575757] text-[#828288] text-xs">
                                                                {product.sku}
                                                            </Badge>
                                                        </div>
                                                        {product.short_description && (
                                                            <p className="text-[#575757] text-sm">{product.short_description}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Label htmlFor={`product-${product.id}`} className="text-[#EDECF8] text-sm">
                                                            Available
                                                        </Label>
                                                        <Switch
                                                            id={`product-${product.id}`}
                                                            checked={productAvailability[product.id] || false}
                                                            onCheckedChange={(checked) => toggleProductAvailability(product.id, checked)}
                                                            className="data-[state=checked]:bg-[#D78E59]"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics">
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Retailer Analytics</CardTitle>
                                <p className="text-[#575757] text-sm">
                                    Performance metrics and insights for this retailer
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <BarChart3 className="w-12 h-12 text-[#575757] mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-[#EDECF8] mb-2">Analytics Coming Soon</h3>
                                    <p className="text-[#828288]">
                                        Detailed analytics and performance metrics will be available in a future update.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}