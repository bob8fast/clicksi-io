// app/components/ui/active-filters.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface ActiveFilter
{
    key: string;
    value: string | string[];
    label: string;
}

interface ActiveFiltersProps
{
    filters: ActiveFilter[];
    onRemoveFilter: (filterKey: string, value?: string) => void;
    onClearAll: () => void;
}

export function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps)
{
    if (filters.length === 0) return null;

    return (
        <div className="bg-[#090909] rounded-lg p-4 border border-[#202020] mb-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#828288]">Active Filters</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearAll}
                    className="text-[#575757] hover:text-[#D78E59] hover:bg-[#202020] h-7 px-2"
                >
                    Clear All
                </Button>
            </div>

            <div className="flex flex-wrap gap-2">
                {filters.map((filter, index) =>
                {
                    if (Array.isArray(filter.value))
                    {
                        return filter.value.map((val, idx) => (
                            <Badge
                                key={`${filter.key}-${val}-${idx}`}
                                variant="secondary"
                                className="bg-[#202020] text-[#EDECF8] border border-[#575757] pl-3 pr-1 py-1"
                            >
                                <span className="text-[#828288] mr-1">{filter.label}:</span>
                                {val}
                                <button
                                    onClick={() => onRemoveFilter(filter.key, val)}
                                    className="ml-2 p-1 hover:bg-[#575757] rounded transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </Badge>
                        ));
                    }

                    return (
                        <Badge
                            key={`${filter.key}-${index}`}
                            variant="secondary"
                            className="bg-[#202020] text-[#EDECF8] border border-[#575757] pl-3 pr-1 py-1"
                        >
                            <span className="text-[#828288] mr-1">{filter.label}:</span>
                            {filter.value}
                            <button
                                onClick={() => onRemoveFilter(filter.key)}
                                className="ml-2 p-1 hover:bg-[#575757] rounded transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </Badge>
                    );
                })}
            </div>
        </div>
    );
}