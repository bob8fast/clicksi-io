// components/features/commission/rules/CommissionRuleCard.tsx - Individual Commission Rule Card

'use client';

import { format } from 'date-fns';
import
{
    AlertCircle,
    Calculator,
    Calendar,
    Edit,
    Eye,
    MoreHorizontal,
    Power,
    PowerOff,
    Target,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import
{
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import
{
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

import { useCommissionHooks } from '@/hooks/api/commission-hooks';
import { RuleState, type CommissionRuleResponse } from '@/types/app/commission';
import { getEntityType } from '@/types/management';
// import { useSession } from 'next-auth/react'; // Removed auth
import { CommissionStateBadge } from '../shared/CommissionStateBadge';

interface CommissionRuleCardProps
{
    rule: CommissionRuleResponse;
}

export function CommissionRuleCard({ rule }: CommissionRuleCardProps)
{
    const [isUpdating, setIsUpdating] = useState(false);
    const commissionHooks = useCommissionHooks();
    // const { data: session } = useSession(); // Removed auth
    const session = null; // Mock session - auth removed
    const entityType = getEntityType(session?.user_info);
    // Mutations
    const updateStateMutation = commissionHooks.updateRuleState();
    const deleteRuleMutation = commissionHooks.deleteRule();

    // Generate URLs based on entity type
    const detailHref = `/${entityType}-management/commission/${rule.id}`;
    const editHref = `/${entityType}-management/commission/${rule.id}/edit`;

    // Handle state toggle
    const handleStateToggle = async () =>
    {
        if (isUpdating) return;

        const newState = rule.state === RuleState.Active ? RuleState.Inactive : RuleState.Active;

        setIsUpdating(true);
        try
        {
            await updateStateMutation.mutateAsync({ id: rule.id, state: newState });

            toast.success(`Rule ${newState === RuleState.Active ? 'activated' : 'deactivated'} successfully`);
        } catch (error)
        {
            toast.error(`Failed to ${newState === RuleState.Active ? 'activate' : 'deactivate'} rule`);
        } finally
        {
            setIsUpdating(false);
        }
    };

    // Handle delete
    const handleDelete = async () =>
    {
        if (isUpdating || rule.state === RuleState.Active) return;

        if (!confirm('Are you sure you want to delete this commission rule? This action cannot be undone.'))
        {
            return;
        }

        setIsUpdating(true);
        try
        {
            await deleteRuleMutation.mutateAsync(rule.id);
            toast.success('Commission rule deleted successfully');
        } catch (error)
        {
            toast.error('Failed to delete commission rule');
        } finally
        {
            setIsUpdating(false);
        }
    };

    // Format scope for display
    const formatScope = (scope: string) =>
    {
        return scope
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    // Check if rule is expiring soon
    const isExpiringSoon = rule.effective_to &&
        new Date(rule.effective_to) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return (
        <Card className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate" title={rule.name}>
                                {rule.name}
                            </h3>
                            {isExpiringSoon && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <AlertCircle className="h-4 w-4 text-amber-500" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Expiring soon</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2" title={rule.description}>
                            {rule.description}
                        </p>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={isUpdating}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={detailHref}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={editHref}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Rule
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleStateToggle}
                                disabled={isUpdating}
                            >
                                {rule.state === RuleState.Active ? (
                                    <>
                                        <PowerOff className="mr-2 h-4 w-4" />
                                        Deactivate
                                    </>
                                ) : (
                                    <>
                                        <Power className="mr-2 h-4 w-4" />
                                        Activate
                                    </>
                                )}
                            </DropdownMenuItem>
                            {rule.state !== RuleState.Active && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleDelete}
                                        disabled={isUpdating}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Rule
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-2">
                    <CommissionStateBadge state={rule.state} />
                    <Badge variant="outline" className="text-xs">
                        Priority {rule.priority}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="space-y-3">
                    {/* Formula Preview */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <Calculator className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">Formula</span>
                        </div>
                        <div className="bg-muted/30 rounded p-2">
                            <code className="text-xs font-mono text-foreground">
                                {rule.formula.expression}
                            </code>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {rule.formula.description}
                        </p>
                    </div>

                    <Separator />

                    {/* Rule Details */}
                    <div className="grid grid-cols-1 gap-2 text-xs">
                        <div className="flex items-center gap-2">
                            <Target className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Scope:</span>
                            <span className="font-medium">{formatScope(rule.scope)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Valid:</span>
                            <span className="font-medium">
                                {format(new Date(rule.effective_from), 'MMM d, yyyy')}
                                {rule.effective_to && (
                                    <> - {format(new Date(rule.effective_to), 'MMM d, yyyy')}</>
                                )}
                            </span>
                        </div>

                        {/* Commission Range */}
                        {(rule.min_commission || rule.max_commission) && (
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Commission:</span>
                                <span className="font-medium">
                                    {rule.min_commission && `$${rule.min_commission}`}
                                    {rule.min_commission && rule.max_commission && ' - '}
                                    {rule.max_commission && `$${rule.max_commission}`}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Restrictions Summary */}
                    {rule.restrictions && (
                        <>
                            <Separator />
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground">Restrictions</span>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {rule.restrictions.description}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-3 flex justify-between items-center text-xs text-muted-foreground">
                <span>
                    Updated {format(new Date(rule.modified_at), 'MMM d, yyyy')}
                </span>
                <Link
                    href={detailHref}
                    className="text-primary hover:underline font-medium"
                >
                    View Details →
                </Link>
            </CardFooter>
        </Card>
    );
}