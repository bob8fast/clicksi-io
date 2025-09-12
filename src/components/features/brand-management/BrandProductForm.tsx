// components/brand-management/NewBrandProductForm.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useProductHooks, useCategoryHooks } from '@/hooks/api';
import type {
    CreateProductRequest,
    UpdateProductRequest,
    ProductLifecycleStatus,
    ProductPublicationStatus,
    ProductIngredientDto
} from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, Plus, Save, X, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// API-based schema following the actual DTOs
const productSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    short_description: z.string().optional(),
    sku: z.string().min(1, 'SKU is required'),
    brand_id: z.string().min(1, 'Brand ID is required'),
    category_ids: z.array(z.string()).min(1, 'At least one category is required'),
    primary_category_id: z.string().optional(),
    publication_status: z.string(),
    lifecycle_status: z.string(),
    size: z.string().optional(),
    weight: z.string().optional(),
    dimensions: z.object({
        length: z.number().optional(),
        width: z.number().optional(),
        height: z.number().optional()
    }).optional(),
    key_ingredients: z.array(z.object({
        name: z.string().min(1, 'Ingredient name is required'),
        percentage: z.number().optional(),
        benefit: z.string().min(1, 'Benefit description is required'),
    })).min(1, 'At least one key ingredient is required'),
    how_to_use: z.array(z.object({
        step: z.string().min(1, 'Usage instruction cannot be empty')
    })).min(1, 'At least one usage instruction is required'),
    skin_types: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    marketing_copy: z.string().optional(),
    external_url: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface BrandProductFormProps {
    brandId: string;
    productId?: string;
    mode: 'create' | 'edit';
}

export default function BrandProductForm({ brandId, productId, mode }: BrandProductFormProps) {
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);
    const [primaryImageUrl, setPrimaryImageUrl] = useState<string>('');
    const [newSkinType, setNewSkinType] = useState('');
    const [newTag, setNewTag] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // API Hooks
    const productHooks = useProductHooks();
    const categoryHooks = useCategoryHooks();

    const { data: product, isLoading: isLoadingProduct } = productHooks.getById(
        { productId: productId || '' },
        { 
            query: { 
                enabled: mode === 'edit' && !!productId 
            } 
        }
    );
    
    const { data: categories = [], isLoading: isLoadingCategories } = categoryHooks.getAll();

    const createProductMutation = productHooks.create();
    const updateProductMutation = productHooks.update();
    const uploadImageMutation = productHooks.uploadImage();

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            short_description: '',
            sku: '',
            brand_id: brandId,
            category_ids: [],
            primary_category_id: '',
            publication_status: 'draft',
            lifecycle_status: 'regular',
            size: '',
            weight: '',
            dimensions: undefined,
            key_ingredients: [{ name: '', percentage: undefined, benefit: '' }],
            how_to_use: [{ step: '' }],
            skin_types: [],
            tags: [],
            seo_title: '',
            seo_description: '',
            marketing_copy: '',
            external_url: '',
        },
    });

    // Define field arrays - let TypeScript infer types
    const ingredientFieldArray = useFieldArray({
        control: form.control,
        name: 'key_ingredients' as const,
    });
    const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = ingredientFieldArray;

    const howToUseFieldArray = useFieldArray({
        control: form.control,
        name: 'how_to_use' as const,
    });
    const { fields: howToUseFields, append: appendHowToUseStep, remove: removeHowToUseStep } = howToUseFieldArray;

    // Populate form when editing
    useEffect(() => {
        if (product && mode === 'edit' && !isLoadingProduct) {
            const formData: Partial<ProductFormData> = {
                name: product.name,
                description: product.description,
                short_description: product.short_description || '',
                sku: product.sku,
                brand_id: product.brand_id,
                category_ids: product.categories?.map(cat => cat.category_id) || [],
                primary_category_id: product.categories?.[0]?.category_id || '',
                publication_status: product.publication_status,
                lifecycle_status: product.lifecycle_status,
                size: product.size || '',
                weight: product.weight || '',
                dimensions: product.dimensions ? {
                    length: product.dimensions.length || undefined,
                    width: product.dimensions.width || undefined,
                    height: product.dimensions.height || undefined
                } : undefined,
                key_ingredients: product.key_ingredients?.map(ingredient => ({
                    name: ingredient.name,
                    percentage: ingredient.percentage || undefined,
                    benefit: ingredient.benefit
                })) || [],
                how_to_use: product.how_to_use?.map((step: any) => ({ step: typeof step === 'string' ? step : step.step || '' })) || [{ step: '' }],
                skin_types: product.skin_types || [],
                tags: product.tags || [],
                seo_title: product.seo_title || '',
                seo_description: product.seo_description || '',
                marketing_copy: product.marketing_copy || '',
                external_url: product.external_url || '',
            };

            form.reset(formData);
            setImages(product.images || []);
            setPrimaryImageUrl(product.primary_image || '');
            setSelectedCategories(product.categories?.map(cat => cat.category_id) || []);
        }
    }, [product, mode, isLoadingProduct, form]);

    const onSubmit = async (data: ProductFormData) => {
        try {
            const requestData: CreateProductRequest = {
                name: data.name,
                description: data.description,
                short_description: data.short_description || null,
                sku: data.sku,
                brand_id: data.brand_id,
                publication_status: data.publication_status as ProductPublicationStatus,
                lifecycle_status: data.lifecycle_status as ProductLifecycleStatus,
                category_ids: data.category_ids,
                primary_category_id: data.primary_category_id || null,
                size: data.size || null,
                weight: data.weight || null,
                dimensions: data.dimensions ? {
                    length: data.dimensions.length || null,
                    width: data.dimensions.width || null,
                    height: data.dimensions.height || null,
                    unit: 'mm' // Default unit
                } : null,
                key_ingredients: data.key_ingredients,
                how_to_use: data.how_to_use.map(item => item.step),
                skin_types: data.skin_types,
                tags: data.tags,
                seo_title: data.seo_title || null,
                seo_description: data.seo_description || null,
                marketing_copy: data.marketing_copy || null,
                external_url: data.external_url || null,
            };

            if (mode === 'create') {
                const newProduct = await createProductMutation.mutateAsync({ data: requestData });
                toast.success('Product created successfully');
                router.push(`/brand-management/products/${newProduct.id}`);
            } else if (productId) {
                const updateData: UpdateProductRequest = {
                    ...requestData,
                    id: productId
                };
                await updateProductMutation.mutateAsync({
                    pathParams: { productId },
                    data: updateData
                });
                toast.success('Product updated successfully');
                router.push(`/brand-management/products/${productId}`);
            }
        } catch (error) {
            console.error('Failed to save product:', error);
            toast.error(mode === 'create' ? 'Failed to create product' : 'Failed to update product');
        }
    };

    const handleImageUpload = useCallback(async (file: File) => {
        if (!productId && mode === 'edit') {
            toast.error('Please save the product first before uploading images');
            return;
        }

        try {
            const result = await uploadImageMutation.mutateAsync({
                pathParams: { productId: productId || 'temp' },
                data: { image: file }
            });
            
            if (result?.image_url) {
                setImages(prev => [...prev, result.image_url!]);
                if (!primaryImageUrl) {
                    setPrimaryImageUrl(result.image_url);
                }
                toast.success('Image uploaded successfully');
            }
        } catch (error) {
            console.error('Failed to upload image:', error);
            toast.error('Failed to upload image');
        }
    }, [productId, mode, uploadImageMutation, primaryImageUrl]);

    const addSkinType = () => {
        if (newSkinType.trim()) {
            const currentSkinTypes = form.getValues('skin_types');
            if (!currentSkinTypes.includes(newSkinType.trim())) {
                form.setValue('skin_types', [...currentSkinTypes, newSkinType.trim()]);
                setNewSkinType('');
            }
        }
    };

    const removeSkinType = (skinType: string) => {
        const currentSkinTypes = form.getValues('skin_types');
        form.setValue('skin_types', currentSkinTypes.filter(type => type !== skinType));
    };

    const addTag = () => {
        if (newTag.trim()) {
            const currentTags = form.getValues('tags');
            if (!currentTags.includes(newTag.trim())) {
                form.setValue('tags', [...currentTags, newTag.trim()]);
                setNewTag('');
            }
        }
    };

    const removeTag = (tag: string) => {
        const currentTags = form.getValues('tags');
        form.setValue('tags', currentTags.filter(t => t !== tag));
    };

    const handleCategoryChange = (categoryId: string, checked: boolean) => {
        const currentCategories = form.getValues('category_ids');
        if (checked) {
            if (!currentCategories.includes(categoryId)) {
                const newCategories = [...currentCategories, categoryId];
                form.setValue('category_ids', newCategories);
                setSelectedCategories(newCategories);
            }
        } else {
            const newCategories = currentCategories.filter(id => id !== categoryId);
            form.setValue('category_ids', newCategories);
            setSelectedCategories(newCategories);
        }
    };

    if (mode === 'edit' && isLoadingProduct) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-[#202020] rounded w-1/3"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-20 bg-[#202020] rounded"></div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-20 bg-[#202020] rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-[#EDECF8]">
                        {mode === 'create' ? 'Create Product' : 'Edit Product'}
                    </h1>
                    <p className="text-[#828288]">
                        {mode === 'create'
                            ? 'Add a new product to your catalog'
                            : 'Update product information and settings'
                        }
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8]">Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Product Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        placeholder="Enter product name"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="short_description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Short Description</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        placeholder="Brief product description for listings"
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-[#575757]">
                                                    Used in product cards and search results
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Full Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        className="bg-[#202020] border-[#575757] text-[#EDECF8] min-h-[120px]"
                                                        placeholder="Detailed product description..."
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="sku"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">SKU</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        placeholder="e.g., YB-HRS-001"
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
                                <CardContent className="space-y-4">
                                    {isLoadingCategories ? (
                                        <div className="animate-pulse space-y-2">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <div key={i} className="h-8 bg-[#202020] rounded"></div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {categories.map((category: any) => (
                                                <label
                                                    key={category.category_id}
                                                    className="flex items-center space-x-2 cursor-pointer hover:bg-[#202020] p-2 rounded"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategories.includes(category.category_id)}
                                                        onChange={(e) => handleCategoryChange(category.category_id, e.target.checked)}
                                                        className="rounded border-[#575757] text-[#D78E59] focus:ring-[#D78E59]"
                                                    />
                                                    <span className="text-[#EDECF8] text-sm">
                                                        {category.localizations?.[0]?.name || 'Category'}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                    <FormMessage />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Status & Settings */}
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8]">Status & Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="publication_status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#EDECF8]">Publication Status</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-[#171717] border-[#575757]">
                                                            <SelectItem value="draft">Draft</SelectItem>
                                                            <SelectItem value="active">Active</SelectItem>
                                                            <SelectItem value="inactive">Inactive</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="lifecycle_status"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#EDECF8]">Lifecycle Status</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                                                <SelectValue placeholder="Select lifecycle" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-[#171717] border-[#575757]">
                                                            <SelectItem value="regular">Regular</SelectItem>
                                                            <SelectItem value="coming_soon">Coming Soon</SelectItem>
                                                            <SelectItem value="discontinued">Discontinued</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Product Details */}
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8]">Product Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="size"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#EDECF8]">Size</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                            placeholder="e.g., 30ml, 50g"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="weight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#EDECF8]">Weight</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                            placeholder="e.g., 85g"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Skin Types */}
                                    <div>
                                        <Label className="text-[#EDECF8] mb-2 block">Skin Types</Label>
                                        <div className="flex gap-2 mb-2">
                                            <Input
                                                value={newSkinType}
                                                onChange={(e) => setNewSkinType(e.target.value)}
                                                placeholder="Add skin type"
                                                className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkinType())}
                                            />
                                            <Button
                                                type="button"
                                                onClick={addSkinType}
                                                className="bg-[#575757] hover:bg-[#828288] text-[#EDECF8]"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {form.watch('skin_types').map((skinType, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="bg-[#D78E59] text-[#171717] flex items-center gap-1"
                                                >
                                                    {skinType}
                                                    <X
                                                        className="w-3 h-3 cursor-pointer"
                                                        onClick={() => removeSkinType(skinType)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <Label className="text-[#EDECF8] mb-2 block">Tags</Label>
                                        <div className="flex gap-2 mb-2">
                                            <Input
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                placeholder="Add tag"
                                                className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                            />
                                            <Button
                                                type="button"
                                                onClick={addTag}
                                                className="bg-[#575757] hover:bg-[#828288] text-[#EDECF8]"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {form.watch('tags').map((tag, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="bg-[#575757] text-[#EDECF8] flex items-center gap-1"
                                                >
                                                    {tag}
                                                    <X
                                                        className="w-3 h-3 cursor-pointer"
                                                        onClick={() => removeTag(tag)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* SEO & Marketing */}
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8]">SEO & Marketing</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="seo_title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">SEO Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        placeholder="Optimized title for search engines"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="seo_description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">SEO Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        placeholder="Meta description for search results"
                                                        rows={3}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="marketing_copy"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#EDECF8]">Marketing Copy</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        placeholder="Compelling marketing message"
                                                        rows={3}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Full Width Sections */}

                    {/* Key Ingredients */}
                    <Card className="bg-[#090909] border-[#202020]">
                        <CardHeader>
                            <CardTitle className="text-[#EDECF8]">Key Ingredients</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {ingredientFields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-12 gap-4 items-end">
                                        <div className="col-span-4">
                                            <FormField
                                                control={form.control}
                                                name={`key_ingredients.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#EDECF8]">Ingredient Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                                placeholder="e.g., Hyaluronic Acid"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name={`key_ingredients.${index}.percentage`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#EDECF8]">%</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                step="0.1"
                                                                className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-5">
                                            <FormField
                                                control={form.control}
                                                name={`key_ingredients.${index}.benefit`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#EDECF8]">Benefit</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                                placeholder="e.g., Deep hydration and plumping"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeIngredient(index)}
                                                disabled={ingredientFields.length === 1}
                                                className="text-[#828288] hover:text-red-400 hover:bg-[#575757]"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => appendIngredient({ name: '', percentage: undefined, benefit: '' })}
                                    className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Ingredient
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* How to Use */}
                    <Card className="bg-[#090909] border-[#202020]">
                        <CardHeader>
                            <CardTitle className="text-[#EDECF8]">How to Use</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {howToUseFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-4 items-center">
                                        <div className="w-8 h-8 bg-[#D78E59] text-[#171717] rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name={`how_to_use.${index}.step`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                            placeholder="Enter usage instruction"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeHowToUseStep(index)}
                                            disabled={howToUseFields.length === 1}
                                            className="text-[#828288] hover:text-red-400 hover:bg-[#575757]"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => appendHowToUseStep({ step: '' })}
                                    className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Step
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-6">
                        <Button
                            type="submit"
                            className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                            disabled={createProductMutation.isPending || updateProductMutation.isPending}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {createProductMutation.isPending || updateProductMutation.isPending
                                ? 'Saving...'
                                : mode === 'create'
                                    ? 'Create Product'
                                    : 'Update Product'
                            }
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}