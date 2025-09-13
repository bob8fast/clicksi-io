// components/categories/CategoryImportExport.tsx
'use client'

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import ResponsiveModal from '@/components/ui/responsive-modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useCategoryHooks } from '@/hooks/api';
import { CategoryDto, CategoryType } from '@/types';
import { categoryTypes, convertToCategoryTypeEnum, getCategoryTypeName } from '@/types/app/category-types';
import { format } from 'date-fns';
import
{
    AlertCircle,
    CheckCircle,
    Download,
    FileJson,
    FileSpreadsheet,
    FileText,
    Upload,
    X
} from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface CategoryImportExportProps
{
    isOpen: boolean;
    onClose: () => void;
}

interface ImportPreview
{
    categories: CategoryDto[];
    errors: string[];
    warnings: string[];
    stats: {
        total: number;
        new: number;
        updated: number;
        localizationsCount: number;
    };
}

export default function CategoryImportExport({ isOpen, onClose }: CategoryImportExportProps)
{
    const [activeTab, setActiveTab] = useState('export');
    const [selectedExportType, setSelectedExportType] = useState<CategoryType>('Consumer');
    const [selectedImportType, setSelectedImportType] = useState<CategoryType>('Consumer');
    const [importData, setImportData] = useState('');
    const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const categoryHooks = useCategoryHooks();
    const { mutate: bulkUpdate } = categoryHooks.bulkUpdate();
    const { data: exportCategories } = categoryHooks.getAll(selectedExportType);

    // Export categories to JSON
    const handleExportCategories = async () =>
    {
        try
        {
            setIsProcessing(true);
            setProcessingProgress(20);

            // Use categories fetched from hook
            const categories = exportCategories || [];

            setProcessingProgress(60);

            const exportData = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    categoryType: getCategoryTypeName(selectedExportType),
                    totalCategories: categories.length,
                    version: '1.0'
                },
                categories: categories
            };

            setProcessingProgress(90);

            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `categories-${getCategoryTypeName(selectedExportType).toLowerCase()}-${format(new Date(), 'yyyy-MM-dd-HHmm')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setProcessingProgress(100);
            toast.success('Categories exported successfully');
        } catch (error)
        {
            toast.error('Failed to export categories');
        } finally
        {
            setIsProcessing(false);
            setProcessingProgress(0);
        }
    };

    // Export template
    const handleExportTemplate = () =>
    {
        const template = {
            metadata: {
                template: true,
                categoryType: getCategoryTypeName(selectedExportType),
                version: '1.0',
                instructions: 'Fill in the categories array with your category data. Ensure all required fields are provided.'
            },
            categories: [
                {
                    category_id: '',
                    path: 'example-category',
                    display_order: 1,
                    type: selectedExportType,
                    is_active: true,
                    localizations: [
                        {
                            language_code: 'en',
                            name: 'Example Category',
                            slug: 'example-category',
                            description: 'This is an example category description'
                        }
                    ],
                    level: 1,
                    icon_name: 'Package',
                    image_id: null
                }
            ]
        };

        const blob = new Blob([JSON.stringify(template, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `category-template-${getCategoryTypeName(selectedExportType).toLowerCase()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Template downloaded successfully');
    };

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) =>
    {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.includes('json'))
        {
            toast.error('Please select a JSON file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) =>
        {
            const content = e.target?.result as string;
            setImportData(content);
            handlePreviewImport(content);
        };
        reader.readAsText(file);
    };

    // Preview import data
    const handlePreviewImport = (jsonData: string) =>
    {
        try
        {
            const parsed = JSON.parse(jsonData);

            // Validate structure
            if (!parsed.categories || !Array.isArray(parsed.categories))
            {
                throw new Error('Invalid format: categories array is required');
            }

            const categories = parsed.categories;
            const errors: string[] = [];
            const warnings: string[] = [];
            let newCount = 0;
            let updatedCount = 0;
            let localizationsCount = 0;

            // Validate each category
            categories.forEach((cat: any, index: number) =>
            {
                const prefix = `Category ${index + 1}`;

                // Required fields validation
                if (!cat.path) errors.push(`${prefix}: path is required`);
                if (!cat.localizations || !Array.isArray(cat.localizations))
                {
                    errors.push(`${prefix}: localizations array is required`);
                } else
                {
                    localizationsCount += cat.localizations.length;

                    // Check for English localization
                    const hasEnglish = cat.localizations.some((loc: any) => loc.language_code === 'en');
                    if (!hasEnglish)
                    {
                        errors.push(`${prefix}: English localization is required`);
                    }

                    // Validate localization fields
                    cat.localizations.forEach((loc: any, locIndex: number) =>
                    {
                        if (!loc.language_code) errors.push(`${prefix} localization ${locIndex + 1}: language_code is required`);
                        if (!loc.name) errors.push(`${prefix} localization ${locIndex + 1}: name is required`);
                        if (!loc.slug) errors.push(`${prefix} localization ${locIndex + 1}: slug is required`);
                    });
                }

                if (typeof cat.display_order !== 'number')
                {
                    warnings.push(`${prefix}: display_order should be a number`);
                }

                if (typeof cat.is_active !== 'boolean')
                {
                    warnings.push(`${prefix}: is_active should be a boolean`);
                }

                // Check if it's new or update
                if (!cat.category_id || cat.category_id === '')
                {
                    newCount++;
                } else
                {
                    updatedCount++;
                }

                // Type validation
                if (cat.type !== selectedImportType)
                {
                    warnings.push(`${prefix}: category type (${cat.type}) doesn't match selected type (${selectedImportType})`);
                }
            });

            // Check for duplicate paths
            const paths = categories.map((cat: any) => cat.path).filter(Boolean);
            const uniquePaths = new Set(paths);
            if (paths.length !== uniquePaths.size)
            {
                errors.push('Duplicate category paths found');
            }

            // Check for duplicate slugs within localizations
            const slugCheck = new Map<string, Set<string>>();
            categories.forEach((cat: any) =>
            {
                cat.localizations?.forEach((loc: any) =>
                {
                    if (!slugCheck.has(loc.language_code))
                    {
                        slugCheck.set(loc.language_code, new Set());
                    }
                    const langSlugs = slugCheck.get(loc.language_code)!;
                    if (langSlugs.has(loc.slug))
                    {
                        errors.push(`Duplicate slug '${loc.slug}' found for language '${loc.language_code}'`);
                    }
                    langSlugs.add(loc.slug);
                });
            });

            setImportPreview({
                categories,
                errors,
                warnings,
                stats: {
                    total: categories.length,
                    new: newCount,
                    updated: updatedCount,
                    localizationsCount
                }
            });

        } catch (error)
        {
            setImportPreview({
                categories: [],
                errors: [`JSON parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`],
                warnings: [],
                stats: { total: 0, new: 0, updated: 0, localizationsCount: 0 }
            });
        }
    };

    // Execute import
    const handleExecuteImport = () =>
    {
        if (!importPreview || importPreview.errors.length > 0)
        {
            toast.error('Cannot import data with errors');
            return;
        }

        // Convert CategoryDto to CategoryUpdateDto format (simplified mapping)
        const updateCategories = importPreview.categories.map(cat => ({
            category_id: cat.category_id,
            path: cat.path,
            display_order: cat.display_order,
            type: cat.type,
            is_active: cat.is_active,
            localizations: cat.localizations,
            level: cat.level,
            icon_name: cat.icon_name,
            image_id: cat.image_id
        }));

        bulkUpdate({
            data: {
                CategoryType: selectedImportType,
                Categories: updateCategories as any, // TODO: Fix type mapping for CategoryUpdateDto
                ChangeDescription: 'Bulk import from file'
            }
        });

        toast.success('Import completed successfully');
        onClose();
    };

    const content = (
        <div className="flex flex-col h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 bg-[#090909] border border-[#202020] flex-shrink-0">
                    <TabsTrigger
                        value="export"
                        className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-[#171717]"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </TabsTrigger>
                    <TabsTrigger
                        value="import"
                        className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-[#171717]"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Import
                    </TabsTrigger>
                </TabsList>

                {/* Export Tab */}
                <TabsContent value="export" className="flex-1 flex flex-col min-h-0 mt-4">
                    <ScrollArea className="flex-1">
                        <div className="space-y-4 p-1">
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-lg text-[#EDECF8]">Export Categories</CardTitle>
                                    <div className="text-sm text-[#828288]">
                                        Download categories as JSON files for backup or transfer
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                        <div>
                                            <Label className="text-[#828288]">Category Type</Label>
                                            <Select value={selectedExportType.toString()} onValueChange={(value) => setSelectedExportType(convertToCategoryTypeEnum(value) || 'Consumer')}>
                                                <SelectTrigger className="mt-1 w-full bg-[#171717] border-[#575757] text-[#EDECF8]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#171717] border-[#575757] text-[#EDECF8]">
                                                    {categoryTypes.map(type => (
                                                        <SelectItem key={type} value={type.toString()}>
                                                            {getCategoryTypeName(type)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {isProcessing && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-[#828288]">Processing export...</span>
                                                <span className="text-[#D78E59]">{processingProgress}%</span>
                                            </div>
                                            <Progress value={processingProgress} className="w-full" />
                                        </div>
                                    )}

                                    <div className="flex gap-3 flex-col sm:flex-row">
                                        <Button
                                            onClick={handleExportCategories}
                                            disabled={isProcessing}
                                            className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                        >
                                            <FileJson className="h-4 w-4 mr-2" />
                                            Export Categories
                                        </Button>
                                        <Button
                                            onClick={handleExportTemplate}
                                            variant="outline"
                                            className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                                        >
                                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                                            Download Template
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-base text-[#EDECF8]">Export Instructions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-[#828288] space-y-2">
                                        <p>• <strong>Export Categories:</strong> Downloads all categories of the selected type with their current data</p>
                                        <p>• <strong>Download Template:</strong> Downloads an empty template showing the required JSON structure</p>
                                        <p>• <strong>File Format:</strong> Categories are exported as JSON with metadata and localization support</p>
                                        <p>• <strong>Media Files:</strong> Image URLs are included but media files need to be handled separately</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </ScrollArea>
                </TabsContent>

                {/* Import Tab */}
                <TabsContent value="import" className="flex-1 flex flex-col min-h-0 mt-4">
                    <ScrollArea className="flex-1">
                        <div className="space-y-4 p-1">
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-lg text-[#EDECF8]">Import Categories</CardTitle>
                                    <div className="text-sm text-[#828288]">
                                        Upload JSON files to import or update categories
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                        <div>
                                            <Label className="text-[#828288]">Target Category Type</Label>
                                            <Select value={selectedImportType.toString()} onValueChange={(value) => setSelectedImportType(convertToCategoryTypeEnum(value) || 'Consumer')}>
                                                <SelectTrigger className="mt-1 w-full bg-[#171717] border-[#575757] text-[#EDECF8]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#171717] border-[#575757] text-[#EDECF8]">
                                                    {categoryTypes.map(type => (
                                                        <SelectItem key={type} value={type.toString()}>
                                                            {getCategoryTypeName(type)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-[#828288]">Upload File</Label>
                                        <div className="mt-1">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".json"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                            />
                                            <Button
                                                onClick={() => fileInputRef.current?.click()}
                                                variant="outline"
                                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                Choose JSON File
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-[#828288]">Or Paste JSON Data</Label>
                                        <Textarea
                                            value={importData}
                                            onChange={(e) =>
                                            {
                                                setImportData(e.target.value);
                                                if (e.target.value.trim())
                                                {
                                                    handlePreviewImport(e.target.value);
                                                } else
                                                {
                                                    setImportPreview(null);
                                                }
                                            }}
                                            placeholder="Paste your JSON category data here..."
                                            className="mt-1 bg-[#171717] border-[#575757] text-[#EDECF8] min-h-32"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Import Preview */}
                            {importPreview && (
                                <Card className="bg-[#090909] border-[#202020]">
                                    <CardHeader>
                                        <CardTitle className="text-base text-[#EDECF8] flex items-center space-x-2">
                                            <span>Import Preview</span>
                                            {importPreview.errors.length === 0 ? (
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <AlertCircle className="h-5 w-5 text-red-500" />
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Stats */}
                                        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-[#EDECF8]">
                                                    {importPreview.stats.total}
                                                </div>
                                                <div className="text-sm text-[#575757]">Total Categories</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-400">
                                                    {importPreview.stats.new}
                                                </div>
                                                <div className="text-sm text-[#575757]">New</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-orange-400">
                                                    {importPreview.stats.updated}
                                                </div>
                                                <div className="text-sm text-[#575757]">Updates</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-blue-400">
                                                    {importPreview.stats.localizationsCount}
                                                </div>
                                                <div className="text-sm text-[#575757]">Localizations</div>
                                            </div>
                                        </div>

                                        {/* Errors */}
                                        {importPreview.errors.length > 0 && (
                                            <Alert className="bg-red-900/20 border-red-500/50">
                                                <AlertCircle className="h-4 w-4 text-red-400" />
                                                <AlertDescription className="text-red-200">
                                                    <div className="font-semibold mb-2">
                                                        {importPreview.errors.length} Error(s) Found:
                                                    </div>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        {importPreview.errors.map((error, index) => (
                                                            <li key={index} className="text-sm">{error}</li>
                                                        ))}
                                                    </ul>
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        {/* Warnings */}
                                        {importPreview.warnings.length > 0 && (
                                            <Alert className="bg-orange-900/20 border-orange-500/50">
                                                <AlertCircle className="h-4 w-4 text-orange-400" />
                                                <AlertDescription className="text-orange-200">
                                                    <div className="font-semibold mb-2">
                                                        {importPreview.warnings.length} Warning(s):
                                                    </div>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        {importPreview.warnings.map((warning, index) => (
                                                            <li key={index} className="text-sm">{warning}</li>
                                                        ))}
                                                    </ul>
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        {/* Import Action */}
                                        {importPreview.errors.length === 0 && (
                                            <div className="flex justify-end gap-3 flex-col sm:flex-row">
                                                <Button
                                                    onClick={() =>
                                                    {
                                                        setImportData('');
                                                        setImportPreview(null);
                                                    }}
                                                    variant="outline"
                                                    className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Clear
                                                </Button>
                                                <Button
                                                    onClick={handleExecuteImport}
                                                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Execute Import
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    );

    return (
        <ResponsiveModal
            isOpen={isOpen}
            onClose={onClose}
            title="Import/Export Categories"
            description="Export existing categories or import categories from JSON files"
            icon={<FileText className="h-5 w-5 text-[#D78E59]" />}
            maxWidth="6xl"
            height="80vh"
            useWideLayout={true}
        >
            {content}
        </ResponsiveModal>
    );
}