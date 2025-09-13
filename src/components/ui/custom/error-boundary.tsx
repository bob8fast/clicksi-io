// components/ui/error-boundary.tsx - Error boundary for brand management
'use client'

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props
{
    children: ReactNode;
}

interface State
{
    hasError: boolean;
    error?: Error;
}

export class BrandManagementErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State
    {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo)
    {
        console.error('Brand Management Error:', error, errorInfo);
    }

    public render()
    {
        if (this.state.hasError)
        {
            return (
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                        <AlertTriangle className="w-16 h-16 text-[#575757] mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-[#EDECF8] mb-2">Something went wrong</h2>
                        <p className="text-[#828288] mb-6">
                            There was an error loading the brand management interface.
                        </p>
                        <Button
                            onClick={() => this.setState({ hasError: false })}
                            className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}