// components/retailers/RetailerEditPage.tsx
'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useRetailer, useUpdateRetailer } from '@/hooks/retailer-hooks';
import { RetailerUpdateData } from '@/types/retailer';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
// import { useSession } from 'next-auth/react'; // Removed auth
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const retailerEditSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    logo: z.string().url('Logo must be a valid URL'),
    coverImage: z.string().url('Cover image must be a valid URL'),
    website: z.string().url('Website must be a valid URL').optional().or(z.literal('')),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().optional(),
    type: z.enum(['online', 'physical', 'hybrid']),
    categories: z.array(z.string()).min(1, 'Please select at least one category'),
    tags: z.string(),
    locations: z.array(z.object({
        city: z.string().min(1, 'City is required'),
        country: z.string().min(1, 'Country is required'),
        address: z.string().optional(),
    })).min(1, 'At least one location is required'),
    'socialMedia.instagram': z.string().optional(),
    'socialMedia.facebook': z.string().optional(),
    'socialMedia.twitter': z.string().optional(),
    'policies.shipping': z.string().optional(),
    'policies.returns': z.string().optional(),
    'policies.privacy': z.string().optional(),
    'policies.terms': z.string().optional(),
    'contactPerson.name': z.string().min(1, 'Contact person name is required'),
    'contactPerson.position': z.string().min(1, 'Contact person position is required'),
    'contactPerson.email': z.string().email('Please enter a valid email'),
    'contactPerson.phone': z.string().optional(),
    paymentMethods: z.array(z.string()),
    deliveryOptions: z.array(z.string()),
    operatingHours: z.object({
        monday: z.object({ open: z.string(), close: z.string(), closed: z.boolean().optional() }).optional(),
        tuesday: z.object({ open: z.string(), close: z.string(), closed: z.boolean().optional() }).optional(),
        wednesday: z.object({ open: z.string(), close: z.string(), closed: z.boolean().optional() }).optional(),
        thursday: z.object({ open: z.string(), close: z.string(), closed: z.boolean().optional() }).optional(),
        friday: z.object({ open: z.string(), close: z.string(), closed: z.boolean().optional() }).optional(),
        saturday: z.object({ open: z.string(), close: z.string(), closed: z.boolean().optional() }).optional(),
        sunday: z.object({ open: z.string(), close: z.string(), closed: z.boolean().optional() }).optional(),
    }).optional(),
});

type RetailerEditFormData = z.infer<typeof retailerEditSchema>;

const retailerTypes = [
    { value: 'online', label: 'Online Store' },
    { value: 'physical', label: 'Physical Store' },
    { value: 'hybrid', label: 'Hybrid Store' }
];

const availableCategories = [
    'Skincare', 'Makeup', 'Beauty Tools', 'Nail Care', 'Natural Skincare',
    'Organic Makeup', 'Essential Oils', 'Luxury Skincare', 'High-End Makeup',
    'Exclusive Fragrance', 'Hair Care', 'Fragrance', 'Body Care'
];

const availablePaymentMethods = [
    'Cash', 'Card', 'Apple Pay', 'Google Pay', 'PayPal', 'Bank Transfer',
    'LiqPay', 'Cash on Delivery', 'Cryptocurrency'
];

const availableDeliveryOptions = [
    'Standard', 'Express', 'Same Day', 'Next Day', 'Store Pickup',
    'Nova Poshta', 'Ukrposhta', 'Courier', 'Local Delivery', 'White Glove'
];

const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

interface RetailerEditPageProps
{
    retailerId: string;
}

export default function RetailerEditPage({ retailerId }: RetailerEditPageProps)
{
    const { data: retailer, isLoading, error } = useRetailer(retailerId);
    const { data: session } = useSession();
    const router = useRouter();
    const updateRetailer = useUpdateRetailer();

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);
    const [selectedDeliveryOptions, setSelectedDeliveryOptions] = useState<string[]>([]);

    const form = useForm<RetailerEditFormData>({
        resolver: zodResolver(retailerEditSchema),
        defaultValues: {
            name: '',
            description: '',
            logo: '',
            coverImage: '',
            website: '',
            email: '',
            phone: '',
            type: 'online',
            categories: [],
            tags: '',
            locations: [{ city: '', country: '', address: '' }],
            'socialMedia.instagram': '',
            'socialMedia.facebook': '',
            'socialMedia.twitter': '',
            'policies.shipping': '',
            'policies.returns': '',
            'policies.privacy': '',
            'policies.terms': '',
            'contactPerson.name': '',
            'contactPerson.position': '',
            'contactPerson.email': '',
            'contactPerson.phone': '',
            paymentMethods: [],
            deliveryOptions: [],
            operatingHours: {},
        },
    });

    const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({
        control: form.control,
        name: 'locations',
    });

    // Check if user is authorized to edit this retailer
    const isOwner = session?.user_info?.user_id === retailer?.ownerId;

    useEffect(() =>
    {
        if (retailer && !isLoading)
        {
            setSelectedCategories(retailer.categories);
            setSelectedPaymentMethods(retailer.paymentMethods);
            setSelectedDeliveryOptions(retailer.deliveryOptions);

            form.reset({
                name: retailer.name,
                description: retailer.description,
                logo: retailer.logo,
                coverImage: retailer.coverImage,
                website: retailer.website || '',
                email: retailer.email,
                phone: retailer.phone || '',
                type: retailer.type,
                categories: retailer.categories,
                tags: retailer.tags.join(', '),
                locations: retailer.locations.map(loc => ({
                    city: loc.city,
                    country: loc.country,
                    address: loc.address || '',
                })),
                'socialMedia.instagram': retailer.socialMedia.instagram || '',
                'socialMedia.facebook': retailer.socialMedia.facebook || '',
                'socialMedia.twitter': retailer.socialMedia.twitter || '',
                'policies.shipping': retailer.policies.shipping || '',
                'policies.returns': retailer.policies.returns || '',
                'policies.privacy': retailer.policies.privacy || '',
                'policies.terms': retailer.policies.terms || '',
                'contactPerson.name': retailer.contactPerson.name,
                'contactPerson.position': retailer.contactPerson.position,
                'contactPerson.email': retailer.contactPerson.email,
                'contactPerson.phone': retailer.contactPerson.phone || '',
                paymentMethods: retailer.paymentMethods,
                deliveryOptions: retailer.deliveryOptions,
                operatingHours: retailer.operatingHours || {},
            });
        }
    }, [retailer, isLoading, form]);

    useEffect(() =>
    {
        if (!isLoading && (!retailer || !isOwner))
        {
            router.push('/retailers');
            if (retailer && !isOwner)
            {
                toast.error('You are not authorized to edit this retailer');
            }
        }
    }, [retailer, isOwner, isLoading, router]);

    const toggleCategory = (category: string) =>
    {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];
        setSelectedCategories(newCategories);
        form.setValue('categories', newCategories);
    };

    const togglePaymentMethod = (method: string) =>
    {
        const newMethods = selectedPaymentMethods.includes(method)
            ? selectedPaymentMethods.filter(m => m !== method)
            : [...selectedPaymentMethods, method];
        setSelectedPaymentMethods(newMethods);
        form.setValue('paymentMethods', newMethods);
    };

    const toggleDeliveryOption = (option: string) =>
    {
        const newOptions = selectedDeliveryOptions.includes(option)
            ? selectedDeliveryOptions.filter(o => o !== option)
            : [...selectedDeliveryOptions, option];
        setSelectedDeliveryOptions(newOptions);
        form.setValue('deliveryOptions', newOptions);
    };

    const onSubmit = async (data: RetailerEditFormData) =>
    {
        const updateData: RetailerUpdateData = {
            name: data.name,
            description: data.description,
            logo: data.logo,
            coverImage: data.coverImage,
            website: data.website || undefined,
            email: data.email,
            phone: data.phone || undefined,
            type: data.type,
            categories: data.categories,
            tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            locations: data.locations.map(loc => ({
                city: loc.city,
                country: loc.country,
                address: loc.address || undefined,
            })),
            socialMedia: {
                instagram: data['socialMedia.instagram'] || undefined,
                facebook: data['socialMedia.facebook'] || undefined,
                twitter: data['socialMedia.twitter'] || undefined,
            },
            policies: {
                shipping: data['policies.shipping'] || undefined,
                returns: data['policies.returns'] || undefined,
                privacy: data['policies.privacy'] || undefined,
                terms: data['policies.terms'] || undefined,
            },
            contactPerson: {
                name: data['contactPerson.name'],
                position: data['contactPerson.position'],
                email: data['contactPerson.email'],
                phone: data['contactPerson.phone'] || undefined,
            },
            paymentMethods: data.paymentMethods,
            deliveryOptions: data.deliveryOptions,
            operatingHours: data.operatingHours,
        };

        try
        {
            await updateRetailer.mutateAsync({ id: retailerId, data: updateData });
            toast.success('Retailer updated successfully!');
            router.push(`/retailers/${retailerId}`);
        } catch (error)
        {
            toast.error('Failed to update retailer. Please try again.');
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

    if (error || !retailer || !isOwner)
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
                        onClick={() => router.push(`/retailers/${retailerId}`)}
                        className="text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Store
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-[#EDECF8]">Edit Store</h1>
                        <p className="text-[#828288]">Update your store information and settings</p>
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
                                                <FormLabel className="text-[#EDECF8]">Store Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Store Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                                            <SelectValue placeholder="Select store type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-[#171717] border-[#575757]">
                                                        {retailerTypes.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>
                                                                {type.label}
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
                                                    placeholder="Tell us about your store..."
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
                                                    placeholder="premium, luxury, fast-delivery (separate with commas)"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Categories */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Categories</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {availableCategories.map((category) => (
                                        <div key={category} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={category}
                                                checked={selectedCategories.includes(category)}
                                                onCheckedChange={() => toggleCategory(category)}
                                                className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                                            />
                                            <Label htmlFor={category} className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal">
                                                {category}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Locations */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-[#EDECF8]">Store Locations</CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendLocation({ city: '', country: '', address: '' })}
                                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Location
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {locationFields.map((field, index) => (
                                    <div key={field.id} className="p-4 border border-[#575757] rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-[#EDECF8] font-medium">Location {index + 1}</h4>
                                            {locationFields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeLocation(index)}
                                                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`locations.${index}.city`}
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
                                                name={`locations.${index}.country`}
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
                                            name={`locations.${index}.address`}
                                            render={({ field }) => (
                                                <FormItem className="mt-4">
                                                    <FormLabel className="text-[#EDECF8]">Full Address</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} className="bg-[#202020] border-[#575757] text-[#EDECF8]" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ))}
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

                                <Separator className="bg-[#575757] my-6" />

                                <h4 className="text-[#EDECF8] font-semibold mb-4">Contact Person</h4>
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

                        {/* Payment & Delivery */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8]">Payment Methods</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {availablePaymentMethods.map((method) => (
                                            <div key={method} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`payment-${method}`}
                                                    checked={selectedPaymentMethods.includes(method)}
                                                    onCheckedChange={() => togglePaymentMethod(method)}
                                                    className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                                                />
                                                <Label htmlFor={`payment-${method}`} className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal">
                                                    {method}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8]">Delivery Options</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {availableDeliveryOptions.map((option) => (
                                            <div key={option} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`delivery-${option}`}
                                                    checked={selectedDeliveryOptions.includes(option)}
                                                    onCheckedChange={() => toggleDeliveryOption(option)}
                                                    className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                                                />
                                                <Label htmlFor={`delivery-${option}`} className="text-[#828288] hover:text-[#EDECF8] cursor-pointer font-normal">
                                                    {option}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Operating Hours */}
                        {form.watch('type') !== 'online' && (
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8]">Operating Hours</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {daysOfWeek.map((day) => (
                                        <div key={day} className="grid grid-cols-4 gap-4 items-center">
                                            <div className="capitalize text-[#EDECF8] font-medium">{day}</div>
                                            <FormField
                                                control={form.control}
                                                name={`operatingHours.${day}.open` as any}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="time"
                                                                className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                                disabled={form.watch(`operatingHours.${day}.closed` as any)}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`operatingHours.${day}.close` as any}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="time"
                                                                className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                                disabled={form.watch(`operatingHours.${day}.closed` as any)}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`${day}-closed`}
                                                    checked={form.watch(`operatingHours.${day}.closed` as any) || false}
                                                    onCheckedChange={(checked) =>
                                                    {
                                                        form.setValue(`operatingHours.${day}.closed` as any, checked);
                                                        if (checked)
                                                        {
                                                            form.setValue(`operatingHours.${day}.open` as any, '');
                                                            form.setValue(`operatingHours.${day}.close` as any, '');
                                                        }
                                                    }}
                                                    className="border-[#575757] data-[state=checked]:bg-[#D78E59] data-[state=checked]:border-[#D78E59]"
                                                />
                                                <Label htmlFor={`${day}-closed`} className="text-[#828288] text-sm">
                                                    Closed
                                                </Label>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

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
                            </CardContent>
                        </Card>

                        {/* Policies */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Store Policies</CardTitle>
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

                                <FormField
                                    control={form.control}
                                    name="policies.terms"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#EDECF8]">Terms & Conditions</FormLabel>
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
                                disabled={updateRetailer.isPending}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {updateRetailer.isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push(`/retailers/${retailerId}`)}
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