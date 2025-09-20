// app/categories/page.tsx
'use client'

import CategoryBrowser from '@/components/features/categories/CategoryBrowser';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryDto, CategoryType } from '@/types';
import { categoryTypes, convertToCategoryTypeEnum, getCategoryTypeName, getCategoryName, getCategoryDescription, CATEGORY_TYPE_CONFIG } from '@/types/app/category-types';
import
{
    Bookmark,
    ExternalLink,
    Share2
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

// Category type configuration

export default function CategoriesPage()
{
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get initial state from URL params
    const initialType = searchParams.get('type') ?
        convertToCategoryTypeEnum(searchParams.get('type')!) || 'Consumer' :
        'Consumer';
    const initialCategoryId = searchParams.get('categoryId') || undefined;

    const [selectedType, setSelectedType] = useState<CategoryType>(initialType);
    const [selectedCategories, setSelectedCategories] = useState<CategoryDto[]>([]);

    // Handle category selection
    const handleCategorySelect = (category: CategoryDto) =>
    {
        setSelectedCategories(prev =>
        {
            const existing = prev.find(c => c.category_id === category.category_id);
            if (existing)
            {
                return prev.filter(c => c.category_id !== category.category_id);
            } else
            {
                return [...prev, category];
            }
        });

        // Update URL
        const params = new URLSearchParams(searchParams);
        params.set('type', selectedType.toString());
        params.set('categoryId', category.category_id!);
        router.replace(`/categories?${params.toString()}`);
    };

    // Handle type change
    const handleTypeChange = (type: string) =>
    {
        const categoryType = convertToCategoryTypeEnum(type) || 'Consumer';
        setSelectedType(categoryType);
        setSelectedCategories([]); // Clear selection when changing types

        // Update URL
        const params = new URLSearchParams();
        params.set('type', type);
        router.replace(`/categories?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-[#090909] text-[#EDECF8]">
            {/* Header */}
            <div className="border-b border-[#202020] bg-[#171717]">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-[#EDECF8] mb-2">Browse Categories</h1>
                            <p className="text-[#828288]">
                                Discover and explore different categories across our platform
                            </p>
                        </div>

                        {selectedCategories.length > 0 && (
                            <div className="flex items-center space-x-3">
                                <Badge variant="secondary" className="bg-[#D78E59] text-[#171717]">
                                    {selectedCategories.length} selected
                                </Badge>
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedCategories([])}
                                    className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                                >
                                    Clear Selection
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Category Type Selector */}
                    <div className="lg:col-span-1">
                        <Card className="bg-[#171717] border-[#202020] sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-lg text-[#EDECF8]">Category Types</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {categoryTypes.map((type) =>
                                {
                                    const config = CATEGORY_TYPE_CONFIG[type];
                                    const Icon = config.icon;
                                    const isSelected = selectedType === type;

                                    return (
                                        <button
                                            key={type}
                                            onClick={() => handleTypeChange(type.toString())}
                                            className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${isSelected
                                                ? 'bg-[#D78E59] text-[#171717]'
                                                : 'bg-[#090909] hover:bg-[#202020] text-[#EDECF8]'
                                                }`}
                                        >
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className={`p-2 rounded ${isSelected ? 'bg-[#171717]' : config.color
                                                    }`}>
                                                    <Icon className={`h-4 w-4 ${isSelected ? 'text-[#D78E59]' : 'text-white'
                                                        }`} />
                                                </div>
                                                <span className="font-semibold">
                                                    {getCategoryTypeName(type)}
                                                </span>
                                            </div>
                                            <p className={`text-sm ${isSelected ? 'text-[#575757]' : 'text-[#828288]'
                                                }`}>
                                                {config.description}
                                            </p>
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {config.examples.slice(0, 2).map((example, index) => (
                                                    <span
                                                        key={index}
                                                        className={`text-xs px-2 py-1 rounded ${isSelected
                                                            ? 'bg-[#171717] text-[#D78E59]'
                                                            : 'bg-[#202020] text-[#575757]'
                                                            }`}
                                                    >
                                                        {example}
                                                    </span>
                                                ))}
                                            </div>
                                        </button>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Category Browser */}
                    <div className="lg:col-span-3">
                        <Card className="bg-[#171717] border-[#202020]">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl text-[#EDECF8] flex items-center space-x-2">
                                        <span>{getCategoryTypeName(selectedType)} Categories</span>
                                    </CardTitle>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-[#828288] hover:text-[#EDECF8]"
                                        >
                                            <Bookmark className="h-4 w-4 mr-2" />
                                            Save
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-[#828288] hover:text-[#EDECF8]"
                                        >
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Share
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CategoryBrowser
                                    type={selectedType}
                                    selectedCategoryId={initialCategoryId}
                                    onCategorySelect={handleCategorySelect}
                                    showSearch={true}
                                    showLanguageSelector={true}
                                    layout="grid"
                                    maxDepth={3}
                                    allowMultiSelect={true}
                                    className="min-h-[600px]"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Selected Categories Summary */}
                {selectedCategories.length > 0 && (
                    <div className="mt-8">
                        <Card className="bg-[#171717] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-lg text-[#EDECF8]">
                                    Selected Categories ({selectedCategories.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {selectedCategories.map((category) => (
                                        <div
                                            key={category.category_id}
                                            className="bg-[#090909] border border-[#202020] rounded-lg p-4 hover:border-[#575757] transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-[#EDECF8] mb-1">
                                                        {getCategoryName(category, 'en')}
                                                    </h4>
                                                    {getCategoryDescription(category, 'en') && (
                                                        <p className="text-sm text-[#828288] mb-2 line-clamp-2">
                                                            {getCategoryDescription(category, 'en')}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant="secondary" className="text-xs bg-[#202020] text-[#575757]">
                                                            Level {category.level}
                                                        </Badge>
                                                        <span className="text-xs text-[#575757]">
                                                            {category.path}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCategorySelect(category)}
                                                    className="text-[#575757] hover:text-[#EDECF8] ml-2"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 flex items-center justify-end space-x-3">
                                    <Button
                                        variant="outline"
                                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                                    >
                                        Export Selection
                                    </Button>
                                    <Button
                                        className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                    >
                                        Continue with Selection
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}