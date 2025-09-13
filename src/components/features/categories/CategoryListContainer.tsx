// components/categories/CategoryListContainer.tsx
'use client'

import React from 'react';

interface CategoryListContainerProps
{
    children: React.ReactNode;
    categoryCount: number;
    hasUnsavedChanges: boolean;
    changedCategoriesCount: number;
    title?: string;
}

export default function CategoryListContainer({
    children,
    categoryCount,
    hasUnsavedChanges,
    changedCategoriesCount,
    title = "Categories"
}: CategoryListContainerProps)
{
    return (
        <div className="border border-[#202020] rounded-lg bg-[#090909] overflow-hidden">
            {/* Container Header */}
            <div className="px-4 py-3 border-b border-[#202020] bg-[#171717]">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-[#EDECF8]">
                        {title} ({categoryCount})
                    </div>
                    <div className="text-xs text-[#575757]">
                        {hasUnsavedChanges && `${changedCategoriesCount} pending changes`}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="overflow-x-auto">
                {children}
            </div>
        </div>
    );
}