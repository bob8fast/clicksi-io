// components/features/commission/rules/CommissionRuleEditContent.tsx - Edit Commission Rule Form

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { AlertCircle, CalendarIcon, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import
{
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import
{
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

import { useCommissionHooks } from '@/hooks/api/commission-hooks';
import { CommissionRuleScope, commissionRuleFormSchema, CommissionRuleFormData, RuleState, type UpdateCommissionRuleRequest } from '@/types/app/commission';
import { CommissionStateBadge } from '../shared/CommissionStateBadge';
import { getEntityType } from '@/types/management';
// import { useSession } from 'next-auth/react'; // Removed auth
import { FormulaEditor, type FormulaData } from '../formulas/FormulaEditor';

interface CommissionRuleEditContentProps
{
    ruleId: string;
}

export function CommissionRuleEditContent({ ruleId }: CommissionRuleEditContentProps)
{
    const router = useRouter();
    const { data: session } = useSession();
    const entityType = getEntityType(session?.user_info);
    const [effectiveFromDate, setEffectiveFromDate] = useState<Date>();
    const [effectiveToDate, setEffectiveToDate] = useState<Date | undefined>();
    // Variables state removed - not part of API schema

    const commissionHooks = useCommissionHooks();



    // Fetch rule details
    const { data: rule, isLoading, error } = commissionHooks.getRuleById(ruleId);

    // Update mutation
    const updateRuleMutation = commissionHooks.updateRule();

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<CommissionRuleFormData>({
        resolver: zodResolver(commissionRuleFormSchema),
    });

    // Initialize form when rule data is loaded
    useEffect(() =>
    {
        if (rule)
        {
            const formData = {
                name: rule.name,
                description: rule.description,
                scope: rule.scope,
                priority: rule.priority,
                formula: {
                    expression: rule.formula.expression,
                    description: rule.formula.description,
                    // variables removed - not part of API schema
                },
                min_commission: rule.min_commission,
                max_commission: rule.max_commission,
                restrictions: {
                    description: rule.restrictions?.description || '',
                    product_ids: rule.restrictions?.product_ids || [],
                    category_ids: rule.restrictions?.category_ids || [],
                    creator_tiers: rule.restrictions?.creator_tiers || [],
                    min_order_value: rule.restrictions?.min_order_value,
                    max_order_value: rule.restrictions?.max_order_value
                }
            };

            reset(formData);
            setEffectiveFromDate(new Date(rule.effective_from));
            setEffectiveToDate(rule.effective_to ? new Date(rule.effective_to) : undefined);
            // setVariables removed - not part of API schema
        }
    }, [rule, reset]);

    const scope = watch('scope');
    const formulaExpression = watch('formula.expression');

    // Handle form submission
    const onSubmit = async (data: CommissionRuleFormData) =>
    {
        try
        {
            // Validate required date
            if (!effectiveFromDate) {
                toast.error('Effective from date is required');
                return;
            }

            // Transform form data to API request format (without id since it's passed separately)
            const requestData: UpdateCommissionRuleRequest = {
                ...data,
                id: ruleId, // Include id as required by UpdateCommissionRuleRequest type
                effective_from: effectiveFromDate.toISOString(),
                effective_to: effectiveToDate?.toISOString(),
                // formula is already in correct format from form
            };

            await updateRuleMutation.mutateAsync({ id: ruleId, data: requestData });

            toast.success('Commission rule updated successfully');
            router.push(`/${entityType}-management/commission/${ruleId}`);
        } catch (error)
        {
            toast.error('Failed to update commission rule');
        }
    };

    // Variable management functions removed - not part of API schema

    // getSuggestedFormulas moved to FormulaEditor component

    if (isLoading)
    {
        return <CommissionRuleEditSkeleton />;
    }

    if (error || !rule)
    {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Rule</AlertTitle>
                <AlertDescription>
                    {error?.message || 'Commission rule not found. It may have been deleted or you may not have permission to edit it.'}
                </AlertDescription>
            </Alert>
        );
    }

    // Check if rule is active (warn about editing active rules)
    const isActiveRule = rule.state === RuleState.Active;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">Edit Commission Rule</h1>
                    <p className="text-muted-foreground">
                        Modify the commission rule settings and formula.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <CommissionStateBadge state={rule.state} />
                    </div>
                </div>
            </div>

            {/* Active Rule Warning */}
            {isActiveRule && (
                <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Editing Active Rule</AlertTitle>
                    <AlertDescription className="text-amber-700">
                        This rule is currently active. Changes will take effect immediately after saving.
                        Consider deactivating the rule first if you need to make significant changes.
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                            Basic details about the commission rule
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Rule Name *</Label>
                                <Input
                                    id="name"
                                    {...register('name')}
                                    placeholder="e.g., Standard Product Commission"
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority *</Label>
                                <Input
                                    id="priority"
                                    type="number"
                                    {...register('priority', { valueAsNumber: true })}
                                    placeholder="100"
                                    min="1"
                                    max="1000"
                                />
                                {errors.priority && (
                                    <p className="text-sm text-destructive">{errors.priority.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                {...register('description')}
                                placeholder="Describe when this rule should be applied..."
                                rows={3}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Rule Scope *</Label>
                            <Controller
                                name="scope"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={CommissionRuleScope.GeneralBusinessSpecificCommission}>
                                                General Business Specific
                                            </SelectItem>
                                            <SelectItem value={CommissionRuleScope.ExclusiveCampaignCommission}>
                                                Exclusive Campaign
                                            </SelectItem>
                                            <SelectItem value={CommissionRuleScope.PartnershipDefinedCommission}>
                                                Partnership Defined
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.scope && (
                                <p className="text-sm text-destructive">{errors.scope.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Formula Configuration - Using Enhanced FormulaEditor */}
                <div className="space-y-4">
                    <FormulaEditor
                        formula={{
                            expression: watch('formula.expression') || '',
                            description: watch('formula.description') || ''
                        }}
                        onFormulaChange={(changes: Partial<FormulaData>) => {
                            if (changes.expression !== undefined) {
                                setValue('formula.expression', changes.expression, { shouldDirty: true });
                            }
                            if (changes.description !== undefined) {
                                setValue('formula.description', changes.description, { shouldDirty: true });
                            }
                        }}
                        scope={scope}
                        showTestRunner={true}
                        showKeywordsHelper={true}
                        enableDragDrop={true}
                        disabled={isSubmitting}
                    />
                    
                    {/* Show validation errors from React Hook Form */}
                    {(errors.formula?.expression || errors.formula?.description) && (
                        <div className="space-y-1">
                            {errors.formula?.expression && (
                                <p className="text-sm text-destructive">{errors.formula.expression.message}</p>
                            )}
                            {errors.formula?.description && (
                                <p className="text-sm text-destructive">{errors.formula.description.message}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Commission Limits */}
                <Card>
                    <CardHeader>
                        <CardTitle>Commission Limits</CardTitle>
                        <CardDescription>
                            Optional minimum and maximum commission amounts
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="min-commission">Minimum Commission ($)</Label>
                                <Input
                                    id="min-commission"
                                    type="number"
                                    step="0.01"
                                    {...register('min_commission', { valueAsNumber: true })}
                                    placeholder="0.00"
                                />
                                {errors.min_commission && (
                                    <p className="text-sm text-destructive">{errors.min_commission.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="max-commission">Maximum Commission ($)</Label>
                                <Input
                                    id="max-commission"
                                    type="number"
                                    step="0.01"
                                    {...register('max_commission', { valueAsNumber: true })}
                                    placeholder="0.00"
                                />
                                {errors.max_commission && (
                                    <p className="text-sm text-destructive">{errors.max_commission.message}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Effective Period */}
                <Card>
                    <CardHeader>
                        <CardTitle>Effective Period</CardTitle>
                        <CardDescription>
                            When this rule should be active
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Effective From *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {effectiveFromDate ? format(effectiveFromDate, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={effectiveFromDate}
                                            onSelect={(date) => date && setEffectiveFromDate(date)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label>Effective To (Optional)</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {effectiveToDate ? format(effectiveToDate, "PPP") : "No end date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={effectiveToDate}
                                            onSelect={setEffectiveToDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Restrictions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Restrictions</CardTitle>
                        <CardDescription>
                            Additional conditions or limitations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="restrictions-description">Restrictions Description</Label>
                            <Textarea
                                id="restrictions-description"
                                {...register('restrictions.description')}
                                placeholder="Describe any conditions or restrictions..."
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isDirty}
                            className="min-w-[120px]"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    </div>

                    {isDirty && (
                        <p className="text-sm text-amber-600">
                            You have unsaved changes
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}

// Loading skeleton component
function CommissionRuleEditSkeleton()
{
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            <div className="space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    );
}