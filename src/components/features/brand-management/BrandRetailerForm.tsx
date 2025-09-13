// components/brand-management/BrandRetailerForm.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useBrandHooks } from '@/hooks/api';
import type {
    CreateBrandSelfDistributedRetailerRequest,
    RetailerType
} from '@/types';
import type {
    UserManagementDomainDataEntitiesObjectValuesBusinessAddress,
    UserManagementDomainDataEntitiesObjectValuesContactInfo,
    UserManagementDomainDataEntitiesObjectValuesBusinessCategorySettings,
    UserManagementDomainDataEntitiesObjectValuesSocialMediaLink,
    UserManagementDomainDataEntitiesObjectValuesRegionalRetailerSettings
} from '@/gen/api/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, MapPin, Phone, Mail, Building, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Form validation schema - matching the exact API model
const retailerFormSchema = z.object({
    managing_team_id: z.string().min(1, 'Team ID is required'),
    legal_name: z.string().min(1, 'Legal name is required').max(200, 'Legal name too long'),
    display_name: z.string().min(1, 'Display name is required').max(200, 'Display name too long'),
    website_url: z.string().url('Invalid URL').nullable().optional(),
    description: z.string().max(2000, 'Description too long').nullable().optional(),
    
    // Address - matches UserManagementDomainDataEntitiesObjectValuesBusinessAddress
    address: z.object({
        street1: z.string().min(1, 'Street address is required'),
        street2: z.string().nullable().optional(),
        city: z.string().min(1, 'City is required'),
        state: z.string().nullable().optional(),
        postal_code: z.string().min(1, 'Postal code is required'),
        country: z.string().min(1, 'Country is required')
    }).nullable().optional(),
    
    // Contact Info - matches UserManagementDomainDataEntitiesObjectValuesContactInfo
    contact_info: z.object({
        email: z.string().email('Invalid email').min(1, 'Email is required'),
        phone: z.string().nullable().optional(),
        social_media_links: z.array(z.object({
            platform: z.string(),
            url: z.string(),
            handle: z.string(),
            description: z.string()
        })).default([])
    }),
    
    // Business Category Settings - matches UserManagementDomainDataEntitiesObjectValuesBusinessCategorySettings
    business_category_settings: z.object({
        company_categories: z.array(z.string()).min(1, 'At least one company category is required'),
        product_categories: z.array(z.string()).default([])
    }),
    
    service_regions: z.array(z.string()).min(1, 'At least one service region is required'),
    retailer_type: z.enum(['online', 'hybrid', 'marketplace', 'regional']),
    
    // Regional Settings (optional) - matches UserManagementDomainDataEntitiesObjectValuesRegionalRetailerSettings
    regional_settings: z.object({
        region_code: z.string(),
        region_name: z.string()
    }).nullable().optional(),
    
    // Retailer Policies (optional)
    retailer_policies: z.object({
        return_policy: z.string().nullable().optional(),
        shipping_policy: z.string().nullable().optional(),
        privacy_policy: z.string().nullable().optional()
    }).nullable().optional(),
    
    owner_brand_id: z.string().min(1, 'Brand ID is required')
});

type RetailerFormData = z.infer<typeof retailerFormSchema>;

interface BrandRetailerFormProps {
    brandId: string;
    teamId: string;
    mode?: 'create' | 'edit';
    retailerId?: string;
    onSuccess?: (retailerId: string) => void;
}

export default function BrandRetailerForm({ 
    brandId, 
    teamId, 
    mode = 'create', 
    retailerId, 
    onSuccess 
}: BrandRetailerFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Get brand hooks for API operations
    const brandHooks = useBrandHooks();
    const createRetailerMutation = brandHooks.create();

    const form = useForm<RetailerFormData>({
        resolver: zodResolver(retailerFormSchema),
        defaultValues: {
            managing_team_id: teamId,
            legal_name: '',
            display_name: '',
            website_url: '',
            description: '',
            address: {
                street1: '',
                street2: '',
                city: '',
                state: '',
                postal_code: '',
                country: 'Ukraine'
            },
            contact_info: {
                email: '',
                phone: '',
                social_media_links: []
            },
            business_category_settings: {
                company_categories: [],
                product_categories: []
            },
            service_regions: ['Ukraine'],
            retailer_type: 'hybrid',
            regional_settings: {
                region_code: 'UA',
                region_name: 'Ukraine'
            },
            retailer_policies: {
                return_policy: '',
                shipping_policy: '',
                privacy_policy: ''
            },
            owner_brand_id: brandId
        }
    });

    // For this MVP, we'll use simple dropdown selections for categories and regions
    // Field arrays can be added later if dynamic management is needed

    const onSubmit = async (data: RetailerFormData) => {
        try {
            setIsSubmitting(true);

            const requestData: CreateBrandSelfDistributedRetailerRequest = {
                managing_team_id: data.managing_team_id,
                legal_name: data.legal_name,
                display_name: data.display_name,
                website_url: data.website_url || null,
                description: data.description || null,
                address: data.address || null,
                business_category_settings: {
                    company_categories: data.business_category_settings.company_categories,
                    product_categories: data.business_category_settings.product_categories
                },
                contact_info: {
                    email: data.contact_info.email,
                    phone: data.contact_info.phone || null,
                    social_media_links: data.contact_info.social_media_links || []
                },
                service_regions: data.service_regions,
                retailer_type: data.retailer_type as RetailerType,
                regional_settings: data.regional_settings || null,
                retailer_policies: data.retailer_policies || null,
                owner_brand_id: data.owner_brand_id
            };

            const newRetailer = await createRetailerMutation.mutateAsync({ data: requestData });
            toast.success('Self-distributed retailer created successfully');
            
            if (onSuccess) {
                onSuccess(newRetailer.id);
            } else {
                router.push(`/brand-management/retailers/${newRetailer.id}`);
            }
        } catch (error) {
            console.error('Error creating retailer:', error);
            toast.error('Failed to create retailer. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = useCallback(() => {
        router.back();
    }, [router]);

    return (
        <div className="min-h-screen bg-[#171717] p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handleBack}
                        className="text-[#828288] hover:text-[#EDECF8]"
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#EDECF8]">
                            {mode === 'create' ? 'Create Self-Distributed Retailer' : 'Edit Retailer'}
                        </h1>
                        <p className="text-[#828288]">
                            Set up your own retail location to distribute your products directly
                        </p>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        
                        {/* Basic Information */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <Building size={20} />
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="legal_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Legal Name *</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="Official business name"
                                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-[#575757]">
                                                    Official registered name of your retail business
                                                </FormDescription>
                                                <FormMessage className="text-[#ef4444]" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="display_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Display Name *</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="Store name customers see"
                                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-[#575757]">
                                                    Name displayed to customers
                                                </FormDescription>
                                                <FormMessage className="text-[#ef4444]" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#EDECF8]">Description</FormLabel>
                                            <FormControl>
                                                <Textarea 
                                                    placeholder="Describe your retail location and services..."
                                                    className="bg-[#202020] border-[#575757] text-[#EDECF8] min-h-[100px]"
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[#ef4444]" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="retailer_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#EDECF8]">Retailer Type *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                                        <SelectValue placeholder="Select retailer type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-[#202020] border-[#575757]">
                                                    <SelectItem value="online" className="text-[#EDECF8]">Online Store</SelectItem>
                                                    <SelectItem value="hybrid" className="text-[#EDECF8]">Hybrid (Physical + Online)</SelectItem>
                                                    <SelectItem value="marketplace" className="text-[#EDECF8]">Marketplace</SelectItem>
                                                    <SelectItem value="regional" className="text-[#EDECF8]">Regional Store</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-[#ef4444]" />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <Phone size={20} />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="contact_info.email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Email *</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="contact@retailer.com"
                                                        type="email"
                                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-[#ef4444]" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contact_info.phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Phone</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="+380 XX XXX XXXX"
                                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        {...field}
                                                        value={field.value || ''}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-[#ef4444]" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="website_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#EDECF8]">Website</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="https://yourstore.com"
                                                    className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[#ef4444]" />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Location */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <MapPin size={20} />
                                    Location & Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="address.street1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#EDECF8]">Street Address *</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="123 Main Street"
                                                    className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[#ef4444]" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address.street2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#EDECF8]">Street Address 2</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Apartment, suite, etc. (optional)"
                                                    className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[#ef4444]" />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid md:grid-cols-3 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="address.city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">City *</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="Kyiv"
                                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        {...field}
                                                        value={field.value || ''}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-[#ef4444]" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="address.state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">State/Province</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="Kyiv Oblast"
                                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        {...field}
                                                        value={field.value || ''}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-[#ef4444]" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="address.postal_code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Postal Code *</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        placeholder="01001"
                                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        {...field}
                                                        value={field.value || ''}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-[#ef4444]" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="address.country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#EDECF8]">Country *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                                        <SelectValue placeholder="Select country" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-[#202020] border-[#575757]">
                                                    <SelectItem value="Ukraine" className="text-[#EDECF8]">Ukraine</SelectItem>
                                                    <SelectItem value="Poland" className="text-[#EDECF8]">Poland</SelectItem>
                                                    <SelectItem value="Germany" className="text-[#EDECF8]">Germany</SelectItem>
                                                    <SelectItem value="Other" className="text-[#EDECF8]">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-[#ef4444]" />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-4 pt-6">
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={handleBack}
                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                            >
                                <Save size={18} className="mr-2" />
                                {isSubmitting ? 'Creating...' : 'Create Retailer'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}