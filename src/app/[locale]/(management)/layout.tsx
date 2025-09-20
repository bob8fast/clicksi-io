// app/(management)/layout.tsx - Management layout (will be enhanced with ManagementStateProvider)
import { ReactNode } from 'react';

interface ManagementLayoutProps {
    children: ReactNode;
}

export default function ManagementLayout({ children }: ManagementLayoutProps) {
    return (
        <div className="min-h-screen bg-[#090909]">
            {children}
        </div>
    );
}