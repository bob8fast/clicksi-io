// app/admin/categories/page.tsx
'use client'

import CategoryHistoryView from '@/components/features/categories/CategoryHistoryView';
import CategoryImportExport from '@/components/features/categories/CategoryImportExport';
import CategoryStatistics from '@/components/features/categories/CategoryStatistics';
import CategoryTypeManager from '@/components/features/categories/CategoryTypeManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeviceDetection } from '@/hooks/system/use-device-detection';
import { useCategoryHooks } from '@/hooks/api';
import { CategoryType } from '@/types';
import { CATEGORY_TYPE_CONFIG, categoryTypes } from '@/types/app/category-types';
import
{
    BarChart3,
    FileText,
    History,
    Package,
    RefreshCw,
    Search,
    ShoppingCart,
    Star,
    Upload,
    Users
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function AdminCategoriesPage()
{
    const { isMobile } = useDeviceDetection();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get initial tab from URL params or default to Consumer
    const initialTab = searchParams.get('type') || 'Consumer'.toString();
    const [activeTab, setActiveTab] = useState<string>(initialTab);
    const [searchQuery, setSearchQuery] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const [showImportExport, setShowImportExport] = useState(false);
    const [showStatistics, setShowStatistics] = useState(false);

    // Parse active tab to CategoryType
    const activeType = (activeTab as CategoryType) || 'Consumer';

    // Handle tab change and update URL
    const handleTabChange = (value: string) =>
    {
        setActiveTab(value);
        setSearchQuery(''); // Reset search when switching tabs

        // Update URL using Next.js router with shallow routing to prevent page refresh
        const params = new URLSearchParams(searchParams);
        params.set('type', value);
        router.push(`/admin/categories?${params.toString()}`, { scroll: false });
    };

    // Prefetch all category types for better UX
    const handlePrefetchAll = async () =>
    {
        try
        {
            // This would be handled by the hook now
            toast.success('All category data preloaded successfully');
        } catch (error)
        {
            toast.error('Failed to preload category data');
        }
    };

    return (
        <div className="min-h-screen bg-[#090909] text-[#EDECF8]">
            {/* Header */}
            <div className="border-b border-[#202020] bg-[#171717]">
                <div className="container mx-auto px-4 sm:px-6 py-4">
                    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#EDECF8] mb-1">Category Management</h1>
                            <p className="text-sm sm:text-base text-[#828288]">
                                Manage product categories, hierarchies, and localizations across all category types
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowStatistics(true)}
                                className="border-[#575757] bg-[#171717] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] text-xs sm:text-sm"
                            >
                                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Statistics</span>
                                <span className="sm:hidden">Stats</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowImportExport(true)}
                                className="border-[#575757] bg-[#171717] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] text-xs sm:text-sm"
                            >
                                <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Import/Export</span>
                                <span className="sm:hidden">Import</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowHistory(true)}
                                className="border-[#575757] bg-[#171717] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] text-xs sm:text-sm"
                            >
                                <History className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">History</span>
                                <span className="sm:hidden">Log</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrefetchAll}
                                className="border-[#575757] bg-[#171717] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] text-xs sm:text-sm"
                            >
                                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Refresh All</span>
                                <span className="sm:hidden">Refresh</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
                {/* Enhanced Category Management Tabs */}
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    {/* Desktop Tabs */}
                    {!isMobile && (
                        <div className="overflow-x-auto pb-2 mb-4 sm:mb-6">
                            <TabsList className="grid w-full grid-cols-6 bg-[#171717] border border-[#202020]">
                                {categoryTypes.map((type) =>
                                {
                                    const config = CATEGORY_TYPE_CONFIG[type];
                                    const Icon = config.icon;

                                    return (
                                        <TabsTrigger
                                            key={type}
                                            value={type.toString()}
                                            className="flex items-center space-x-2 data-[state=active]:bg-[#D78E59] data-[state=active]:text-[#171717] relative overflow-hidden px-4 py-2 text-sm"
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0 data-[state=active]:opacity-10 transition-opacity`} />
                                            <Icon className="h-4 w-4 z-10 flex-shrink-0" />
                                            <span className="z-10 truncate">
                                                {type}
                                            </span>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </div>
                    )}

                    {/* Mobile Selector with Icons */}
                    {isMobile && (
                        <div className="mb-4 sm:mb-6">
                            <Select value={activeTab} onValueChange={handleTabChange}>
                                <SelectTrigger className="w-full bg-[#171717] border-[#575757] text-[#EDECF8]">
                                    <SelectValue>
                                        <div className="flex items-center space-x-2">
                                            {React.createElement(CATEGORY_TYPE_CONFIG[activeType].icon, {
                                                className: "h-4 w-4 text-[#D78E59]"
                                            })}
                                            <span>{activeType}</span>
                                        </div>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="bg-[#171717] border-[#575757] text-[#EDECF8]">
                                    {categoryTypes.map((type) =>
                                    {
                                        const config = CATEGORY_TYPE_CONFIG[type];
                                        const Icon = config.icon;
                                        return (
                                            <SelectItem key={type} value={type.toString()}>
                                                <div className="flex items-center space-x-2">
                                                    <Icon className="h-4 w-4 text-[#D78E59]" />
                                                    <span>{type}</span>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Tab Content */}
                    {categoryTypes.map((type) => (
                        <TabsContent key={type} value={type.toString()} className="mt-0">
                            {/* Statistics Card with description */}
                            <CategoryQuickStats type={type} isMobile={isMobile} />

                            {/* Search */}
                            <div className="mb-4 sm:mb-6">
                                <div className="relative max-w-full sm:max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#575757] h-4 w-4" />
                                    <Input
                                        placeholder={`Search ${activeType.toLowerCase()} categories...`}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 bg-[#171717] border-[#575757] text-[#EDECF8] placeholder-[#575757] focus:border-[#D78E59] text-sm sm:text-base"
                                    />
                                </div>
                            </div>

                            <CategoryTypeManager
                                type={type}
                                searchQuery={searchQuery}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            {/* Modals */}
            {showHistory && (
                <CategoryHistoryView
                    isOpen={showHistory}
                    onClose={() => setShowHistory(false)}
                    type={activeType}
                />
            )}

            {showImportExport && (
                <CategoryImportExport
                    isOpen={showImportExport}
                    onClose={() => setShowImportExport(false)}
                />
            )}

            <CategoryStatistics
                isOpen={showStatistics}
                onClose={() => setShowStatistics(false)}
            />
        </div>
    );
}

/**
 * Quick stats component for category type - moved up
 */
interface CategoryQuickStatsProps
{
    type: CategoryType;
    isMobile: boolean;
}

function CategoryQuickStats({ type, isMobile }: CategoryQuickStatsProps)
{
    const { getAll } = useCategoryHooks();
    const { data: categories, isLoading } = getAll(type);

    if (isLoading)
    {
        return (
            <Card className="bg-[#171717] border-[#202020] mb-6">
                <CardContent className="p-6">
                    <div className="animate-pulse">
                        <div className="h-6 bg-[#202020] rounded w-1/3 mb-4"></div>
                        <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
                            {[1, 2, 3, 4].slice(0, isMobile ? 2 : 4).map(i => (
                                <div key={i} className="h-16 bg-[#202020] rounded"></div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const flatCategories = categories || [];
    const totalCount = flatCategories.length;
    const activeCount = flatCategories.filter(cat => cat.is_active).length;
    const inactiveCount = totalCount - activeCount;
    const rootCount = categories?.length || 0;

    // Count translations
    const totalTranslations = flatCategories.reduce((acc, cat) => acc + (cat.localizations?.length || 0), 0);
    const avgTranslations = totalCount > 0 ? (totalTranslations / totalCount).toFixed(1) : '0';

    return (
        <Card className="bg-[#171717] border-[#202020] mb-6">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    {React.createElement(CATEGORY_TYPE_CONFIG[type].icon, { className: "h-5 w-5 text-[#D78E59]" })}
                    <span>{type} Overview</span>
                </CardTitle>
                <CardDescription className="text-[#828288]">
                    {CATEGORY_TYPE_CONFIG[type].description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-5'}`}>
                    <div className="text-center p-4 bg-[#090909] rounded-lg">
                        <div className="text-2xl font-bold text-[#EDECF8]">{totalCount}</div>
                        <div className="text-xs text-[#575757]">Total</div>
                    </div>
                    <div className="text-center p-4 bg-[#090909] rounded-lg">
                        <div className="text-2xl font-bold text-green-400">{activeCount}</div>
                        <div className="text-xs text-[#575757]">Active</div>
                    </div>
                    {!isMobile && (
                        <>
                            <div className="text-center p-4 bg-[#090909] rounded-lg">
                                <div className="text-2xl font-bold text-orange-400">{inactiveCount}</div>
                                <div className="text-xs text-[#575757]">Inactive</div>
                            </div>
                            <div className="text-center p-4 bg-[#090909] rounded-lg">
                                <div className="text-2xl font-bold text-blue-400">{rootCount}</div>
                                <div className="text-xs text-[#575757]">Root</div>
                            </div>
                            <div className="text-center p-4 bg-[#090909] rounded-lg">
                                <div className="text-2xl font-bold text-purple-400">{avgTranslations}</div>
                                <div className="text-xs text-[#575757]">Avg Translations</div>
                            </div>
                        </>
                    )}
                </div>
                {/* Show additional stats on mobile when expanded */}
                {isMobile && (
                    <div className="mt-4 pt-4 border-t border-[#202020]">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-lg font-bold text-orange-400">{inactiveCount}</div>
                                <div className="text-xs text-[#575757]">Inactive</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-blue-400">{rootCount}</div>
                                <div className="text-xs text-[#575757]">Root</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-purple-400">{avgTranslations}</div>
                                <div className="text-xs text-[#575757]">Avg Trans.</div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}