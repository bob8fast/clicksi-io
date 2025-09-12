// components/ui/empty-state.tsx
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps
{
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    children?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action, children }: EmptyStateProps)
{
    return (
        <div className="text-center py-12">
            {Icon && <Icon className="w-16 h-16 text-[#575757] mx-auto mb-4" />}
            <h3 className="text-xl font-semibold text-[#EDECF8] mb-2">{title}</h3>
            <p className="text-[#828288] mb-6 max-w-md mx-auto">{description}</p>
            {action && (
                <Button
                    onClick={action.onClick}
                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                >
                    {action.label}
                </Button>
            )}
            {children}
        </div>
    );
}