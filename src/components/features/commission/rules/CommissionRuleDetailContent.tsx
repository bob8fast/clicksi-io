// components/features/commission/rules/CommissionRuleDetailContent.tsx - Commission Rule Details View

'use client';

import { format } from 'date-fns';
import
{
    Activity,
    AlertCircle,
    Calculator,
    Calendar,
    Copy,
    Edit,
    Power,
    PowerOff,
    Shield,
    Target,
    Trash2,
    TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import
{
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';

import { useCommissionHooks } from '@/hooks/api/commission-hooks';
import { RuleState } from '@/types/app/commission';
import { getEntityType } from '@/types/management';
// import { useSession } from 'next-auth/react'; // Removed auth
import { CommissionStateBadge } from '../shared/CommissionStateBadge';

interface CommissionRuleDetailContentProps
{
    ruleId: string;
}

export function CommissionRuleDetailContent({ ruleId }: CommissionRuleDetailContentProps)
{
    const router = useRouter();

    // const { data: session } = useSession(); // Removed auth
    const session = null; // Mock session - auth removed
    const entityType = getEntityType(session?.user_info);
    const [isUpdating, setIsUpdating] = useState(false);

    const commissionHooks = useCommissionHooks();

    // Fetch rule details
    const { data: rule, isLoading, error } = commissionHooks.getRuleById(ruleId);

    // Mutations
    const updateStateMutation = commissionHooks.updateRuleState();
    const deleteRuleMutation = commissionHooks.deleteRule();

    // Handle state toggle
    const handleStateToggle = async () =>
    {
        if (!rule || isUpdating) return;

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
        if (!rule || isUpdating || rule.state === RuleState.Active) return;

        if (!confirm('Are you sure you want to delete this commission rule? This action cannot be undone.'))
        {
            return;
        }

        setIsUpdating(true);
        try
        {
            await deleteRuleMutation.mutateAsync(rule.id);
            toast.success('Commission rule deleted successfully');
            router.push(`/${entityType}-management/commission`);
        } catch (error)
        {
            toast.error('Failed to delete commission rule');
        } finally
        {
            setIsUpdating(false);
        }
    };

    // Handle copy formula
    const handleCopyFormula = () =>
    {
        if (rule?.formula.expression)
        {
            navigator.clipboard.writeText(rule.formula.expression);
            toast.success('Formula copied to clipboard');
        }
    };

    // Generate URLs
    const editHref = `/${entityType}-management/commission/${ruleId}/edit`;

    // Format scope for display
    const formatScope = (scope: string) =>
    {
        return scope
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
    };

    // Check if rule is expiring soon
    const isExpiringSoon = rule?.effective_to &&
        new Date(rule.effective_to) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    if (isLoading)
    {
        return <CommissionRuleDetailSkeleton />;
    }

    if (error || !rule)
    {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Rule</AlertTitle>
                <AlertDescription>
                    {error?.message || 'Commission rule not found. It may have been deleted or you may not have permission to view it.'}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">{rule.name}</h1>
                        {isExpiringSoon && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <AlertCircle className="h-5 w-5 text-amber-500" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Expiring soon</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                    <p className="text-muted-foreground">{rule.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <CommissionStateBadge state={rule.state} />
                        <Badge variant="outline">Priority {rule.priority}</Badge>
                        <Badge variant="secondary">{formatScope(rule.scope)}</Badge>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild variant="outline">
                        <Link href={editHref}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Link>
                    </Button>
                    <Button
                        variant={rule.state === RuleState.Active ? 'destructive' : 'default'}
                        onClick={handleStateToggle}
                        disabled={isUpdating}
                    >
                        {rule.state === RuleState.Active ? (
                            <>
                                <PowerOff className="h-4 w-4 mr-2" />
                                Deactivate
                            </>
                        ) : (
                            <>
                                <Power className="h-4 w-4 mr-2" />
                                Activate
                            </>
                        )}
                    </Button>
                    {rule.state !== RuleState.Active && (
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isUpdating}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    )}
                </div>
            </div>

            {/* Expiring Soon Alert */}
            {isExpiringSoon && (
                <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Rule Expiring Soon</AlertTitle>
                    <AlertDescription className="text-amber-700">
                        This rule will expire on {format(new Date(rule.effective_to!), 'MMMM d, yyyy')}.
                        Consider extending the effective period or creating a replacement rule.
                    </AlertDescription>
                </Alert>
            )}

            {/* Commission Formula */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Commission Formula
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Expression</h4>
                            <Button variant="ghost" size="sm" onClick={handleCopyFormula}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <code className="text-lg font-mono block p-2 bg-background rounded border">
                            {rule.formula.expression}
                        </code>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-muted-foreground">{rule.formula.description}</p>
                    </div>

                    {/* Variables section removed - not part of API response */}
                </CardContent>
            </Card>

            {/* Rule Details */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            Rule Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Scope</span>
                            <p className="font-medium">{formatScope(rule.scope)}</p>
                        </div>

                        <Separator />

                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Priority</span>
                            <p className="font-medium">{rule.priority}</p>
                        </div>

                        {rule.campaign_id && (
                            <>
                                <Separator />
                                <div className="space-y-1">
                                    <span className="text-sm font-medium text-muted-foreground">Campaign</span>
                                    <p className="font-medium">{rule.campaign_id}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Effective Period */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Effective Period
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">From</span>
                            <p className="font-medium">{format(new Date(rule.effective_from), 'MMMM d, yyyy')}</p>
                        </div>

                        <Separator />

                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">To</span>
                            <p className="font-medium">
                                {rule.effective_to
                                    ? format(new Date(rule.effective_to), 'MMMM d, yyyy')
                                    : 'No end date'
                                }
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Commission Limits */}
            {(rule.min_commission || rule.max_commission) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Commission Limits
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {rule.min_commission && (
                                <div className="space-y-1">
                                    <span className="text-sm font-medium text-muted-foreground">Minimum Commission</span>
                                    <p className="text-lg font-semibold">${rule.min_commission}</p>
                                </div>
                            )}

                            {rule.max_commission && (
                                <div className="space-y-1">
                                    <span className="text-sm font-medium text-muted-foreground">Maximum Commission</span>
                                    <p className="text-lg font-semibold">${rule.max_commission}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Restrictions */}
            {rule.restrictions && rule.restrictions.description && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Restrictions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{rule.restrictions.description}</p>

                        {/* Display actual restriction fields instead of non-existent conditions */}
                        <div className="mt-4 space-y-3">
                            {rule.restrictions.product_ids && rule.restrictions.product_ids.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-2">Restricted to Products</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {rule.restrictions.product_ids.map((productId) => (
                                            <Badge key={productId} variant="secondary">{productId}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {rule.restrictions.category_ids && rule.restrictions.category_ids.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-2">Restricted to Categories</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {rule.restrictions.category_ids.map((categoryId) => (
                                            <Badge key={categoryId} variant="secondary">{categoryId}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {rule.restrictions.creator_tiers && rule.restrictions.creator_tiers.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-2">Creator Tiers</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {rule.restrictions.creator_tiers.map((tier) => (
                                            <Badge key={tier} variant="outline">{tier}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {(rule.restrictions.min_order_value || rule.restrictions.max_order_value) && (
                                <div>
                                    <h4 className="font-medium mb-2">Order Value Limits</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {rule.restrictions.min_order_value && `Min: $${rule.restrictions.min_order_value}`}
                                        {rule.restrictions.min_order_value && rule.restrictions.max_order_value && ' • '}
                                        {rule.restrictions.max_order_value && `Max: $${rule.restrictions.max_order_value}`}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Metadata */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Rule History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 text-sm">
                        <div className="space-y-1">
                            <span className="text-muted-foreground">Created</span>
                            <p className="font-medium">{format(new Date(rule.created_at), 'MMMM d, yyyy \'at\' h:mm a')}</p>
                        </div>

                        <div className="space-y-1">
                            <span className="text-muted-foreground">Last Modified</span>
                            <p className="font-medium">{format(new Date(rule.modified_at), 'MMMM d, yyyy \'at\' h:mm a')}</p>
                        </div>

                        <div className="space-y-1">
                            <span className="text-muted-foreground">Rule ID</span>
                            <code className="text-xs bg-muted px-1 py-0.5 rounded">{rule.id}</code>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Loading skeleton component
function CommissionRuleDetailSkeleton()
{
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96" />
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-16" />
                        <Skeleton className="h-9 w-20" />
                    </div>
                </div>
            </div>

            {/* Cards Skeleton */}
            <div className="space-y-6">
                <Skeleton className="h-48 w-full" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-36 w-full" />
                    <Skeleton className="h-36 w-full" />
                </div>
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
    );
}