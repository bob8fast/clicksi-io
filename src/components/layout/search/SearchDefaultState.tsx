'use client'

import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, Clock } from 'lucide-react';
import PopularSearches from './PopularSearches';

interface SearchDefaultStateProps
{
    recentSearches: Array<{ id: string; query: string; url: string }>;
    popularSearches: string[];
    onRecentSearchClick: (query: string) => void;
    onPopularSearchClick: (term: string) => void;
    popularSearchesHeight?: number;
}

export default function SearchDefaultState({
    recentSearches,
    popularSearches,
    onRecentSearchClick,
    onPopularSearchClick,
    popularSearchesHeight = 280
}: SearchDefaultStateProps)
{
    return (
        <div className="relative flex flex-col h-full">
            {/* Recent Searches - Top Section with flex-1 */}
            {recentSearches.length > 0 && (
                <div className="flex-1 min-h-0 overflow-hidden mb-2">
                    {/* Header outside ScrollArea */}
                    <div className="p-4 pb-0">
                        <h3 className="text-sm font-semibold text-[#828288] mb-3 flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            Recent Searches
                        </h3>
                    </div>
                    {/* ScrollArea with calculated height - account for header (56px) */}
                    <div style={{ height: 'calc(100% - 56px)' }}>
                        <ScrollArea className="h-full">
                            <div className="px-4 pb-4">
                                {recentSearches.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => onRecentSearchClick(item.query)}
                                        className="w-full flex items-center justify-between p-2 hover:bg-[#202020] rounded transition-colors group mb-2"
                                    >
                                        <span className="text-[#828288] group-hover:text-[#EDECF8]">{item.query}</span>
                                        <ChevronRight className="h-4 w-4 text-[#575757] group-hover:text-[#828288]" />
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            )}

            {/* Popular Searches - Dynamic height at bottom */}
            <div className="flex-shrink-0">
                <PopularSearches
                    popularSearches={popularSearches}
                    onPopularSearchClick={onPopularSearchClick}
                    expandedHeight={200}
                    collapsedHeight={60}
                />
            </div>
        </div>
    );
}