// components/categories/CategoryHistoryView.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ResponsiveModal from '@/components/ui/responsive-modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategoryHooks } from '@/hooks/api';
import { CategoryType } from '@/types';
import { ProductCatalogDomainDTOsCategoryTreeHistoryDto } from '@/gen/api/types/product_catalog_domain_dt_os_category_tree_history_dto';
import { ProductCatalogDomainDTOsCategoryTreeHistoryDetailDto } from '@/gen/api/types/product_catalog_domain_dt_os_category_tree_history_detail_dto';
import { categoryTypes, convertToCategoryTypeEnum, getCategoryTypeName } from '@/types/app/category-types';
import { format } from 'date-fns';
import
{
    Calendar,
    ChevronDown,
    ChevronRight,
    Copy,
    Download,
    FileText,
    History,
    Loader2,
    RefreshCw,
    RotateCcw,
    Search,
    User
} from 'lucide-react';
import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface CategoryHistoryViewProps
{
    isOpen: boolean;
    onClose: () => void;
    type?: CategoryType;
}

export default function CategoryHistoryView({ isOpen, onClose, type }: CategoryHistoryViewProps)
{
    const [selectedType, setSelectedType] = useState<CategoryType>(type || 'Consumer');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
    const [historyLimit, setHistoryLimit] = useState(20);
    const [detailsCache, setDetailsCache] = useState<Map<string, {
        isLoading: boolean;
        isLoaded: boolean;
        error?: string;
        data?: ProductCatalogDomainDTOsCategoryTreeHistoryDetailDto;
    }>>(new Map());

    const categoryHooks = useCategoryHooks();
    
    // Get history using mutation hook (since it's a POST request)
    const historyMutation = categoryHooks.getHistory();
    const recoverMutation = categoryHooks.recoverToHistoricalState();
    
    // State for history data
    const [historyEntries, setHistoryEntries] = useState<ProductCatalogDomainDTOsCategoryTreeHistoryDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Load history data
    const loadHistory = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await historyMutation.mutateAsync({
                data: {
                    category_type: selectedType,
                    page_size: historyLimit,
                    page: 1,
                }
            });
            setHistoryEntries(response || []);
        } catch (error) {
            console.error('Failed to load history:', error);
            toast.error('Failed to load category history');
            setHistoryEntries([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedType, historyLimit, historyMutation]);
    
    // Load history when component mounts or type changes
    React.useEffect(() => {
        if (isOpen) {
            loadHistory();
        }
    }, [isOpen, loadHistory]);
    
    // Load details for a specific history entry
    const loadDetails = useCallback(async (entryId: string) => {
        // Set loading state
        setDetailsCache(prev => new Map(prev.set(entryId, {
            isLoading: true,
            isLoaded: false,
            error: undefined,
            data: undefined
        })));
        
        try {
            const detailsQuery = categoryHooks.getHistoryDetails(entryId);
            const response = await detailsQuery.refetch();
            
            setDetailsCache(prev => new Map(prev.set(entryId, {
                isLoading: false,
                isLoaded: true,
                error: undefined,
                data: response.data
            })));
        } catch (error) {
            console.error('Failed to load details:', error);
            setDetailsCache(prev => new Map(prev.set(entryId, {
                isLoading: false,
                isLoaded: false,
                error: 'Failed to load details',
                data: undefined
            })));
        }
    }, [categoryHooks]);
    
    const getLoadingState = useCallback((entryId: string) => {
        return detailsCache.get(entryId) || { isLoading: false, isLoaded: false, error: undefined, data: undefined };
    }, [detailsCache]);
    
    const refetch = useCallback(() => {
        loadHistory();
    }, [loadHistory]);

    // Filter history entries based on search
    const filteredEntries = historyEntries?.filter(entry =>
        entry.change_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.updated_by_user_id?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const toggleEntryExpanded = (entryId: string) =>
    {
        if (expandedEntryId === entryId)
        {
            // Collapse if already expanded
            setExpandedEntryId(null);
        } else
        {
            // Expand new entry (collapse others automatically)
            setExpandedEntryId(entryId);
            // Load details when expanding if not already loaded
            const loadingState = getLoadingState(entryId);
            if (!loadingState.isLoaded)
            {
                loadDetails(entryId);
            }
        }
    };

    const handleRecover = useCallback(async (entryId: string) => {
        try {
            await recoverMutation.mutateAsync({
                data: {
                    history_id: entryId,
                    category_type: selectedType
                }
            });
            toast.success('Successfully recovered to historical state');
            // Reload history after recovery
            loadHistory();
        } catch (error) {
            console.error('Recovery failed:', error);
            toast.error('Failed to recover to historical state');
        }
    }, [recoverMutation, selectedType, loadHistory]);

    const exportHistory = () =>
    {
        const data = {
            categoryType: getCategoryTypeName(selectedType),
            exportDate: new Date().toISOString(),
            entries: filteredEntries
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `category-history-${getCategoryTypeName(selectedType).toLowerCase()}-${format(new Date(), 'yyyy-MM-dd')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const content = (
        <div className="flex flex-col h-full space-y-4">
            {/* Controls */}
            <div className="flex-shrink-0 space-y-4">
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                    {/* Category Type Selector */}
                    <div>
                        <Label className="text-[#828288]">Category Type</Label>
                        <Select value={selectedType.toString()} onValueChange={(value) => setSelectedType(convertToCategoryTypeEnum(value) || 'Consumer')}>
                            <SelectTrigger className="mt-1 bg-[#090909] border-[#575757] text-[#EDECF8] w-full sm:w-auto">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#090909] border-[#575757] text-[#EDECF8]">
                                {categoryTypes.map(type => (
                                    <SelectItem key={type} value={type.toString()}>
                                        {getCategoryTypeName(type)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Limit Selector */}
                    <div>
                        <Label className="text-[#828288]">Show Last</Label>
                        <Select value={historyLimit.toString()} onValueChange={(value) => setHistoryLimit(parseInt(value))}>
                            <SelectTrigger className="mt-1 bg-[#090909] border-[#575757] text-[#EDECF8] w-full sm:w-auto">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#090909] border-[#575757] text-[#EDECF8]">
                                <SelectItem value="10">10 entries</SelectItem>
                                <SelectItem value="20">20 entries</SelectItem>
                                <SelectItem value="50">50 entries</SelectItem>
                                <SelectItem value="100">100 entries</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 sm:min-w-[200px]">
                        <Label className="text-[#828288]">Search</Label>
                        <div className="relative mt-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#575757] h-4 w-4" />
                            <Input
                                placeholder="Search changes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-[#090909] border-[#575757] text-[#EDECF8]"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        disabled={isLoading}
                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={exportHistory}
                        disabled={filteredEntries.length === 0}
                        className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* History Entries */}
            <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                    <div className="space-y-4 p-1">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="h-5 w-5 animate-spin text-[#D78E59]" />
                                    <span className="text-[#828288]">Loading history...</span>
                                </div>
                            </div>
                        ) : filteredEntries.length === 0 ? (
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardContent className="py-12 text-center">
                                    <History className="h-12 w-12 text-[#575757] mx-auto mb-4" />
                                    <div className="text-[#575757] mb-2">No history entries found</div>
                                    <div className="text-sm text-[#575757]">
                                        {searchQuery
                                            ? 'Try adjusting your search criteria'
                                            : 'History will appear here after category changes are made'
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredEntries.map((entry) => (
                                <HistoryEntryCard
                                    key={entry.id}
                                    entry={entry}
                                    isExpanded={expandedEntryId === entry.id}
                                    onToggleExpanded={() => toggleEntryExpanded(entry.id!)}
                                    loadingState={getLoadingState(entry.id!)}
                                    onLoadDetails={() => loadDetails(entry.id!)}
                                    onRecover={() => handleRecover(entry.id!)}
                                    isRecovering={recoverMutation.isPending}
                                />
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Summary */}
            {filteredEntries.length > 0 && (
                <div className="flex-shrink-0 border-t border-[#202020] pt-4">
                    <div className="flex items-center justify-between text-sm text-[#575757]">
                        <div>
                            Showing {filteredEntries.length} of {historyEntries?.length || 0} entries
                        </div>
                        <div>
                            {getCategoryTypeName(selectedType)} category history
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <ResponsiveModal
            isOpen={isOpen}
            onClose={onClose}
            title="Category History"
            description="View audit trail of category changes and modifications"
            icon={<History className="h-5 w-5 text-[#D78E59]" />}
            maxWidth="6xl"
            height="80vh"
            useWideLayout={true}
        >
            {content}
        </ResponsiveModal>
    );
}

// Individual history entry card
interface HistoryEntryCardProps
{
    entry: ProductCatalogDomainDTOsCategoryTreeHistoryDto;
    isExpanded: boolean;
    onToggleExpanded: () => void;
    loadingState: {
        isLoading: boolean;
        isLoaded: boolean;
        error?: string;
        data?: any;
    };
    onLoadDetails: () => void;
    onRecover: () => void;
    isRecovering: boolean;
}

function HistoryEntryCard({ entry, isExpanded, onToggleExpanded, loadingState, onLoadDetails, onRecover, isRecovering }: HistoryEntryCardProps)
{
    const formatTimestamp = (timestamp: string) =>
    {
        try
        {
            return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
        } catch
        {
            return timestamp;
        }
    };

    const getRelativeTime = (timestamp: string) =>
    {
        try
        {
            const date = new Date(timestamp);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            return formatTimestamp(timestamp);
        } catch
        {
            return timestamp;
        }
    };

    const copyToClipboard = async (data: any, label: string) =>
    {
        try
        {
            await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            toast.success(`${label} copied to clipboard`);
        } catch (error)
        {
            toast.error('Failed to copy to clipboard');
        }
    };

    return (
        <Card className="bg-[#090909] border-[#202020] hover:border-[#575757] transition-colors">
            <CardHeader className="cursor-pointer" onClick={onToggleExpanded}>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="flex items-center space-x-1 flex-shrink-0 mt-1">
                            {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-[#575757]" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-[#575757]" />
                            )}
                            <FileText className="h-4 w-4 text-[#D78E59]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-base text-[#EDECF8] break-words leading-5 mb-2">
                                {entry.change_description || 'Category Update'}
                            </CardTitle>
                            <div className="flex flex-col space-y-1 text-sm text-[#575757]">
                                <div className="flex items-center space-x-1">
                                    <User className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{entry.updated_by_user_id}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3 flex-shrink-0" />
                                    <span>{getRelativeTime(entry.timestamp!)}</span>
                                </div>
                                {/* TODO: Implement changes count when available in new API */}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                        <Badge variant="secondary" className="bg-[#202020] text-[#828288] text-xs">
                            {getCategoryTypeName(entry.category_type || 'Consumer')}
                        </Badge>
                        {/* Recover Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) =>
                            {
                                e.stopPropagation();
                                onRecover();
                            }}
                            disabled={isRecovering}
                            className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:border-[#D78E59] h-8 px-3 text-xs whitespace-nowrap"
                        >
                            {isRecovering ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                            ) : (
                                <RotateCcw className="h-3 w-3 mr-2" />
                            )}
                            <span className="hidden sm:inline">Recover to that version</span>
                            <span className="sm:hidden">Recover</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="pt-0">
                    <div className="border-t border-[#202020] pt-4">
                        {/* Loading/Error State */}
                        {loadingState.isLoading && (
                            <div className="flex items-center justify-center py-8">
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-[#D78E59]" />
                                    <span className="text-[#828288]">Loading details...</span>
                                </div>
                            </div>
                        )}

                        {loadingState.error && (
                            <div className="flex flex-col items-center justify-center py-8 space-y-3">
                                <div className="text-red-400 text-sm">Failed to load details: {loadingState.error}</div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onLoadDetails}
                                    className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                                >
                                    Retry
                                </Button>
                            </div>
                        )}

                        {/* Not loaded yet */}
                        {!loadingState.isLoading && !loadingState.isLoaded && !loadingState.error && (
                            <div className="flex flex-col items-center justify-center py-8 space-y-3">
                                <div className="text-[#575757] text-sm">Details not loaded</div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onLoadDetails}
                                    className="border-[#575757] text-[#828288] hover:text-[#EDECF8]"
                                >
                                    Load Details
                                </Button>
                            </div>
                        )}

                        {/* Loaded Content */}
                        {loadingState.isLoaded && loadingState.data && (
                            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                                {/* Before Changes */}
                                {loadingState.data?.categories_before_changes && (
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-sm font-semibold text-[#828288]">Before Changes</h4>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(loadingState.data.categories_before_changes, 'Before changes')}
                                                className="h-6 w-6 p-0 text-[#575757] hover:text-[#EDECF8]"
                                            >
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="bg-[#171717] border border-[#202020] rounded p-3 max-h-60 overflow-y-auto">
                                            <pre className="text-xs text-[#575757] whitespace-pre-wrap">
                                                {JSON.stringify(loadingState.data.categories_before_changes, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}

                                {/* After Changes */}
                                {loadingState.data?.categories_after_changes && (
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-sm font-semibold text-[#828288]">After Changes</h4>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(loadingState.data.categories_after_changes, 'After changes')}
                                                className="h-6 w-6 p-0 text-[#575757] hover:text-[#EDECF8]"
                                            >
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="bg-[#171717] border border-[#202020] rounded p-3 max-h-60 overflow-y-auto">
                                            <pre className="text-xs text-[#575757] whitespace-pre-wrap">
                                                {JSON.stringify(loadingState.data.categories_after_changes, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}

                                {/* Summary when no before/after data */}
                                {!loadingState.data?.categories_before_changes && !loadingState.data?.categories_after_changes && (
                                    <div className="col-span-full">
                                        <div className="text-center py-8 text-[#575757]">
                                            <div className="text-sm">No detailed change data available for this entry</div>
                                            <div className="text-xs mt-2">This might be an older entry or summary change</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Detailed Timestamp */}
                        <div className="mt-4 pt-4 border-t border-[#202020]">
                            <div className="text-xs text-[#575757]">
                                <span className="font-medium">Full timestamp:</span> {formatTimestamp(entry.timestamp!)}
                            </div>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}