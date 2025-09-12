// components/brands/BrandEditPage.tsx
'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useBrand, useUpdateBrand } from '@/hooks/brand-hooks';
import { BrandUpdateData } from '@/types/brand';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
// import { useSession } from 'next-auth/react'; // Removed auth
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const brandEditSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    logo: z.string().url('Logo must be a valid URL'),
    coverImage: z.string().url('Cover image must be a valid URL'),
    website: z.string().url('Website must be a valid URL').optional().or(z.literal('')),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().optional(),
    category: z.string().min(1, 'Please select a category'),
    tags: z.string(),
    'location.city': z.string().min(1, 'City is required'),
    'location.country': z.string().min(1, 'Country is required'),
    'location.address': z.string().optional(),
    'socialMedia.instagram': z.string().optional(),
    'socialMedia.facebook': z.string().optional(),
    'socialMedia.twitter': z.string().optional(),
    'socialMedia.tiktok': z.string().optional(),
    'policies.shipping': z.string().optional(),
    'policies.returns': z.string().optional(),
    'policies.privacy': z.string().optional(),
    'contactPerson.name': z.string().min(1, 'Contact person name is required'),
    'contactPerson.position': z.string().min(1, 'Contact person position is required'),
    'contactPerson.email': z.string().email('Please enter a valid email'),
    'contactPerson.phone': z.string().optional(),
});

type BrandEditFormData = z.infer<typeof brandEditSchema>;

const categories = ['Beauty & Skincare', 'Cosmetics', 'Luxury Beauty', 'Skincare', 'Natural Beauty'];

interface BrandEditPageProps
{
    brandId: string;
}

export default function BrandEditPage({ brandId }: BrandEditPageProps)
{
    const { data: brand, isLoading, error } = useBrand(brandId);
    // const { data: session } = useSession(); // Removed auth
    const session = null; // Mock session - auth removed
    const router = useRouter();
    const updateBrand = useUpdateBrand();

    const form = useForm<BrandEditFormData>({
        resolver: zodResolver(brandEditSchema),
        defaultValues: {
            name: '',
            description: '',
            logo: '',
            coverImage: '',
            website: '',
            email: '',
            phone: '',
            category: '',
            tags: '',
            'location.city': '',
            'location.country': '',
            'location.address': '',
            'socialMedia.instagram': '',
            'socialMedia.facebook': '',
            'socialMedia.twitter': '',
            'socialMedia.tiktok': '',
            'policies.shipping': '',
            'policies.returns': '',
            'policies.privacy': '',
            'contactPerson.name': '',
            'contactPerson.position': '',
            'contactPerson.email': '',
            'contactPerson.phone': '',
        },
    });

    // Check if user is authorized to edit this brand
    const isOwner = session?.user_info?.user_id === brand?.ownerId;

    useEffect(() =>
    {
        if (brand && !isLoading)
        {
            form.reset({
                name: brand.name,
                description: brand.description,
                logo: brand.logo,
                coverImage: brand.coverImage,
                website: brand.website || '',
                email: brand.email,
                phone: brand.phone || '',
                category: brand.category,
                tags: brand.tags.join(', '),
                'location.city': brand.location.city,
                'location.country': brand.location.country,
                'location.address': brand.location.address || '',
                'socialMedia.instagram': brand.socialMedia.instagram || '',
                'socialMedia.facebook': brand.socialMedia.facebook || '',
                'socialMedia.twitter': brand.socialMedia.twitter || '',
                'socialMedia.tiktok': brand.socialMedia.tiktok || '',
                'policies.shipping': brand.policies.shipping || '',
                'policies.returns': brand.policies.returns || '',
                'policies.privacy': brand.policies.privacy || '',
                'contactPerson.name': brand.contactPerson.name,
                'contactPerson.position': brand.contactPerson.position,
                'contactPerson.email': brand.contactPerson.email,
                'contactPerson.phone': brand.contactPerson.phone || '',
            });
        }
    }, [brand, isLoading, form]);

    useEffect(() =>
    {
        if (!isLoading && (!brand || !isOwner))
        {
            router.push('/brands');
            if (brand && !isOwner)
            {
                toast.error('You are not authorized to edit this brand');
            }
        }
    }, [brand, isOwner, isLoading, router]);

    const onSubmit = async (data: BrandEditFormData) =>
    {
        const updateData: BrandUpdateData = {
            name: data.name,
            description: data.description,
            logo: data.logo,
            coverImage: data.coverImage,
            website: data.website || undefined,
            email: data.email,
            phone: data.phone || undefined,
            category: data.category,
            tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            location: {
                city: data['location.city'],
                country: data['location.country'],
                address: data['location.address'] || undefined,
            },
            socialMedia: {
                instagram: data['socialMedia.instagram'] || undefined,
                facebook: data['socialMedia.facebook'] || undefined,
                twitter: data['socialMedia.twitter'] || undefined,
                tiktok: data['socialMedia.tiktok'] || undefined,
            },
            policies: {
                shipping: data['policies.shipping'] || undefined,
                returns: data['policies.returns'] || undefined,
                privacy: data['policies.privacy'] || undefined,
            },
            contactPerson: {
                name: data['contactPerson.name'],
                position: data['contactPerson.position'],
                email: data['contactPerson.email'],
                phone: data['contactPerson.phone'] || undefined,
            },
        };

        try
        {
            await updateBrand.mutateAsync({ id: brandId, data: updateData });
            toast.success('Brand updated successfully!');
            router.push(`/brands/${brandId}`);
        } catch (error)
        {
            toast.error('Failed to update brand. Please try again.');
        }
    };

    if (isLoading)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-[#202020] rounded w-1/3"></div>
                        <div className="h-32 bg-[#202020] rounded"></div>
                        <div className="h-32 bg-[#202020] rounded"></div>
                        <div className="h-32 bg-[#202020] rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !brand || !isOwner)
    {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push(`/brands/${brandId}`)}
                        className="text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Brand
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-[#EDECF8]">Edit Brand</h1>
                        <p className="text-[#828288]">Update your brand information and settings</p>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Basic Information */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Brand Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Category</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                                            <SelectValue placeholder="Select category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-[#171717] border-[#575757]">
                                                        {categories.map((category) => (
                                                            <SelectItem key={category} value={category}>
                                                                {category}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
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
                                                    {...field}
                                                    className="bg-[#202020] border-[#575757] text-[#EDECF8] min-h-[100px]"
                                                    placeholder="Tell us about your brand..."
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#EDECF8]">Tags</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                    placeholder="natural, organic, premium (separate with commas)"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="logo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Logo URL</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="coverImage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Cover Image URL</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Email</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="email" className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Phone</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#EDECF8]">Website</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Location */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Location</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="location.city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">City</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="location.country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Country</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="location.address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#EDECF8]">Full Address</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Contact Person */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Contact Person</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="contactPerson.name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="contactPerson.position"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Position</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="contactPerson.email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Email</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="email" className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="contactPerson.phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Phone</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Media */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Social Media</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="socialMedia.instagram"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Instagram</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="@username" className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="socialMedia.facebook"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Facebook</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="username" className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="socialMedia.twitter"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Twitter</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="@username" className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="socialMedia.tiktok"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">TikTok</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="@username" className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Policies */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Policies</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="policies.shipping"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#EDECF8]">Shipping Policy</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="policies.returns"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#EDECF8]">Returns Policy</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="policies.privacy"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#EDECF8]">Privacy Policy</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                disabled={updateBrand.isPending}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {updateBrand.isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push(`/brands/${brandId}`)}
                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}