// components/categories/CategoryStatistics.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ResponsiveModal from '@/components/ui/responsive-modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCategoryHooks } from '@/hooks/api';
import { CategoryType } from '@/types';
import
{
    CATEGORY_TYPE_CONFIG,
    categoryTypes
} from '@/types/app/category-types';
import
{
    Activity,
    BarChart3,
    CheckCircle,
    Globe,
    Layers,
    Target,
    TrendingUp,
    Users,
    XCircle
} from 'lucide-react';

interface CategoryStatisticsProps
{
    isOpen: boolean;
    onClose: () => void;
}

export default function CategoryStatistics({ isOpen, onClose }: CategoryStatisticsProps)
{
    return (
        <ResponsiveModal
            isOpen={isOpen}
            onClose={onClose}
            title="Category Analytics Dashboard"
            description="Comprehensive overview of category data and performance metrics"
            icon={<BarChart3 className="h-5 w-5 text-[#D78E59]" />}
            maxWidth="7xl"
            height="90vh"
            useWideLayout={true}
        >
            <ScrollArea className="h-full">
                <div className="space-y-8 p-1">
                    {/* Introduction */}
                    <div className="text-center space-y-2">
                        <p className="text-[#828288] max-w-3xl mx-auto">
                            This dashboard provides a comprehensive overview of your category system performance,
                            distribution, and health metrics across all category types.
                        </p>
                    </div>

                    {/* Hero Statistics */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Category Types"
                            value={categoryTypes.length}
                            icon={<Layers className="h-6 w-6" />}
                            color="from-[#D78E59] to-[#FFAA6C]"
                            description="Different category classifications (Consumer, Creator, Brand, etc.)"
                        />
                        <StatCard
                            title="Total Categories"
                            value={<TotalCategoriesCount />}
                            icon={<BarChart3 className="h-6 w-6" />}
                            color="from-green-500 to-green-400"
                            description="Sum of all categories across all types and hierarchy levels"
                        />
                        <StatCard
                            title="Active Categories"
                            value={<ActiveCategoriesCount />}
                            icon={<CheckCircle className="h-6 w-6" />}
                            color="from-blue-500 to-blue-400"
                            description="Categories currently enabled and visible to users"
                        />
                        <StatCard
                            title="Translations"
                            value={<TotalTranslationsCount />}
                            icon={<Globe className="h-6 w-6" />}
                            color="from-purple-500 to-purple-400"
                            description="Total number of language localizations across all categories"
                        />
                    </div>

                    {/* Overview Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <CategoryDistributionCard />
                        <ActivityOverviewCard />
                    </div>

                    {/* Detailed Category Type Statistics */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold text-[#EDECF8] flex items-center space-x-2">
                                <TrendingUp className="h-6 w-6 text-[#D78E59]" />
                                <span>Category Type Analytics</span>
                            </h3>
                            <Badge variant="outline" className="bg-[#202020] text-[#828288] border-[#575757]">
                                Live Data
                            </Badge>
                        </div>

                        <div className="text-sm text-[#828288] mb-6">
                            Detailed breakdown of each category type showing active/inactive status, hierarchy depth,
                            and localization coverage. Each card represents one category type with its specific metrics.
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {categoryTypes.map(type => (
                                <CategoryTypeStatsCard key={type} type={type} />
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </ResponsiveModal>
    );
}

// Modern stat card component
interface StatCardProps
{
    title: string;
    value: React.ReactNode;
    icon: React.ReactNode;
    color: string;
    description: string;
}

function StatCard({ title, value, icon, color, description }: StatCardProps)
{
    return (
        <Card className="bg-[#090909] border-[#202020] overflow-hidden relative group hover:border-[#575757] transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-20`}>
                        <div className="text-white">
                            {icon}
                        </div>
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="text-3xl font-bold text-[#EDECF8]">
                        {value}
                    </div>
                    <div className="text-sm font-medium text-[#828288]">{title}</div>
                    <div className="text-xs text-[#575757]">{description}</div>
                </div>
            </CardContent>
        </Card>
    );
}

// Category distribution visualization
function CategoryDistributionCard()
{
    const allStats = categoryTypes.map(type =>
    {
        const categoryHooks = useCategoryHooks();
        const { data: categories } = categoryHooks.getAll(type);
        const config = CATEGORY_TYPE_CONFIG[type];

        return {
            type,
            count: (categories || []).length,
            config
        };
    });

    const totalCategories = allStats.reduce((sum, stat) => sum + stat.count, 0);

    return (
        <Card className="bg-[#090909] border-[#202020]">
            <CardHeader>
                <CardTitle className="text-xl text-[#EDECF8] flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-[#D78E59]" />
                    <span>Category Distribution</span>
                </CardTitle>
                <div className="text-sm text-[#828288] mt-2">
                    Shows how categories are distributed across different types (Consumer, Creator, Brand, etc.).
                    Each bar represents the percentage and count of categories for that specific type.
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {allStats.map(({ type, count, config }) =>
                {
                    const percentage = totalCategories > 0 ? (count / totalCategories) * 100 : 0;
                    const IconComponent = config.icon;

                    return (
                        <div key={type} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <IconComponent className="h-4 w-4 text-[#828288]" />
                                    <span className="text-sm font-medium text-[#EDECF8]">
                                        {type}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-[#EDECF8]">{count}</div>
                                    <div className="text-xs text-[#575757]">{percentage.toFixed(1)}%</div>
                                </div>
                            </div>
                            <div className="w-full bg-[#202020] rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full ${config.color} transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}

                {totalCategories === 0 && (
                    <div className="text-center py-8 text-[#575757]">
                        No categories found
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Activity overview card
function ActivityOverviewCard()
{
    let totalActive = 0;
    let totalInactive = 0;
    let totalTranslations = 0;

    categoryTypes.forEach(type =>
    {
        const categoryHooks = useCategoryHooks();
        const { data: categories } = categoryHooks.getAll(type);
        if (categories)
        {
            totalActive += categories.filter(cat => cat.is_active).length;
            totalInactive += categories.filter(cat => !cat.is_active).length;
            totalTranslations += categories.reduce((acc, cat) => acc + (cat.localizations?.length || 0), 0);
        }
    });

    const total = totalActive + totalInactive;
    const activePercentage = total > 0 ? (totalActive / total) * 100 : 0;

    return (
        <Card className="bg-[#090909] border-[#202020]">
            <CardHeader>
                <CardTitle className="text-xl text-[#EDECF8] flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-[#D78E59]" />
                    <span>Activity Overview</span>
                </CardTitle>
                <div className="text-sm text-[#828288] mt-2">
                    Displays the overall health of your category system. The ring chart shows the percentage of active
                    categories, while the stats below break down active vs inactive categories and total translations.
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Activity Ring */}
                <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="#202020"
                                strokeWidth="8"
                                fill="transparent"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="#22c55e"
                                strokeWidth="8"
                                fill="transparent"
                                strokeLinecap="round"
                                strokeDasharray={`${(activePercentage / 100) * 351.86} 351.86`}
                                className="transition-all duration-1000"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-[#EDECF8]">
                                    {activePercentage.toFixed(0)}%
                                </div>
                                <div className="text-xs text-[#575757]">Active</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-lg font-bold text-green-400">{totalActive}</span>
                        </div>
                        <div className="text-xs text-[#575757]">Active</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                            <XCircle className="h-4 w-4 text-red-400" />
                            <span className="text-lg font-bold text-red-400">{totalInactive}</span>
                        </div>
                        <div className="text-xs text-[#575757]">Inactive</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                            <Globe className="h-4 w-4 text-blue-400" />
                            <span className="text-lg font-bold text-blue-400">{totalTranslations}</span>
                        </div>
                        <div className="text-xs text-[#575757]">Translations</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Enhanced category type statistics card
interface CategoryTypeStatsCardProps
{
    type: CategoryType;
}

function CategoryTypeStatsCard({ type }: CategoryTypeStatsCardProps)
{
    const categoryHooks = useCategoryHooks();
    const { data: categories, isLoading } = categoryHooks.getAll(type);
    const config = CATEGORY_TYPE_CONFIG[type];
    const IconComponent = config.icon;

    if (isLoading)
    {
        return (
            <Card className={`bg-[#090909] border-[#202020] relative overflow-hidden ${config.borderColor}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`}></div>
                <CardContent className="p-6 relative">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-[#202020] rounded w-1/2"></div>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-16 bg-[#202020] rounded"></div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const allCategories = categories || [];
    const totalCount = allCategories.length;
    const activeCount = allCategories.filter(cat => cat.is_active).length;
    const rootCount = allCategories.filter(cat => (cat.level || 1) === 1).length;
    const maxDepth = Math.max(...allCategories.map(cat => cat.level || 1), 0);

    // Language statistics
    const languageStats: Record<string, number> = allCategories.reduce((acc, cat) =>
    {
        cat.localizations?.forEach((loc: any) =>
        {
            acc[loc.language_code] = (acc[loc.language_code] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const topLanguages = Object.entries(languageStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4);

    return (
        <Card className={`bg-[#090909] border-[#202020] relative overflow-hidden hover:border-[#575757] transition-all duration-300 ${config.borderColor}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`}></div>
            <CardHeader className="relative">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${config.color} bg-opacity-20`}>
                            <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="text-lg font-bold text-[#EDECF8]">
                                {type}
                            </span>
                            <div className="text-sm text-[#575757] font-normal">
                                {config.description}
                            </div>
                        </div>
                    </div>
                    <Badge className={config.lightColor}>
                        {totalCount} total
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-6">
                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-[#171717]/80 rounded-lg backdrop-blur">
                        <div className="text-2xl font-bold text-green-400">{activeCount}</div>
                        <div className="text-sm text-[#575757]">Active</div>
                    </div>
                    <div className="text-center p-4 bg-[#171717]/80 rounded-lg backdrop-blur">
                        <div className="text-2xl font-bold text-orange-400">{totalCount - activeCount}</div>
                        <div className="text-sm text-[#575757]">Inactive</div>
                    </div>
                    <div className="text-center p-4 bg-[#171717]/80 rounded-lg backdrop-blur">
                        <div className="text-2xl font-bold text-blue-400">{rootCount}</div>
                        <div className="text-sm text-[#575757]">Root Categories</div>
                    </div>
                    <div className="text-center p-4 bg-[#171717]/80 rounded-lg backdrop-blur">
                        <div className="text-2xl font-bold text-purple-400">{maxDepth}</div>
                        <div className="text-sm text-[#575757]">Max Depth</div>
                    </div>
                </div>

                {/* Language Distribution */}
                <div>
                    <h4 className="text-sm font-semibold text-[#828288] mb-3 flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span>Top Languages</span>
                    </h4>
                    <div className="text-xs text-[#575757] mb-3">
                        Most used languages for this category type. Numbers show how many categories have translations in each language.
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {topLanguages.map(([code, count]) => (
                            <div key={code} className="flex items-center justify-between p-3 bg-[#171717]/80 rounded-lg backdrop-blur">
                                <span className="text-sm font-medium text-[#EDECF8]">{code.toUpperCase()}</span>
                                <span className="text-sm text-[#575757]">{count}</span>
                            </div>
                        ))}
                        {topLanguages.length === 0 && (
                            <div className="col-span-2 text-center py-4 text-[#575757] text-sm">
                                No translations found
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Helper components for statistics
function TotalCategoriesCount()
{
    let total = 0;

    categoryTypes.forEach(type =>
    {
        const categoryHooks = useCategoryHooks();
        const { data: categories } = categoryHooks.getAll(type);
        if (categories)
        {
            total += categories.length;
        }
    });

    return total;
}

function ActiveCategoriesCount()
{
    let total = 0;

    categoryTypes.forEach(type =>
    {
        const categoryHooks = useCategoryHooks();
        const { data: categories } = categoryHooks.getAll(type);
        if (categories)
        {
            total += categories.filter(cat => cat.is_active).length;
        }
    });

    return total;
}

function TotalTranslationsCount()
{
    let total = 0;

    categoryTypes.forEach(type =>
    {
        const categoryHooks = useCategoryHooks();
        const { data: categories } = categoryHooks.getAll(type);
        if (categories)
        {
            total += categories.reduce((acc, cat) => acc + (cat.localizations?.length || 0), 0);
        }
    });

    return total;
}

