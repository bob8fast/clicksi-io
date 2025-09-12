// components/categories/ValidationErrorsDisplay.tsx
'use client'

import { AlertTriangle } from 'lucide-react';

interface ValidationErrorsDisplayProps
{
    errors: string[];
    title?: string;
    description?: string;
}

export default function ValidationErrorsDisplay({
    errors,
    title = "Validation Errors",
    description = "Please fix these issues before saving your changes."
}: ValidationErrorsDisplayProps)
{
    if (errors.length === 0) return null;

    return (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <h3 className="text-sm font-medium text-red-400">{title}</h3>
                {errors.length > 1 && (
                    <span className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded-full">
                        {errors.length} issues
                    </span>
                )}
            </div>

            <ul className="text-sm text-red-300 space-y-1">
                {errors.map((error, index) => (
                    <li key={index} className="flex items-start space-x-2">
                        <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                        <span className="break-words">{error}</span>
                    </li>
                ))}
            </ul>

            {description && (
                <p className="text-xs text-red-400 mt-3 opacity-80">
                    {description}
                </p>
            )}
        </div>
    );
}