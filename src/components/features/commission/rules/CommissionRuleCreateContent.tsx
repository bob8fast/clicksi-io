// components/features/commission/rules/CommissionRuleCreateContent.tsx - Create Commission Rule Form

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
import { Textarea } from '@/components/ui/textarea';

import { useCommissionHooks } from '@/hooks/api/commission-hooks';
import { commissionRuleFormSchema, CommissionRuleScope, CommissionRuleFormData, CreateCommissionRuleRequest } from '@/types/app/commission';
import { getEntityType } from '@/types/management';
// import { useSession } from 'next-auth/react'; // Removed auth
import { FormulaEditor, type FormulaData } from '../formulas/FormulaEditor';

export function CommissionRuleCreateContent()
{
    const router = useRouter();
    const { data: session } = useSession();
    const entityType = getEntityType(session?.user_info);

    const [effectiveFromDate, setEffectiveFromDate] = useState<Date>(new Date());
    const [effectiveToDate, setEffectiveToDate] = useState<Date | undefined>();
    // Removed variables state - not part of the API schema

    const commissionHooks = useCommissionHooks();
    const createRuleMutation = commissionHooks.createRule();

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CommissionRuleFormData>({
        resolver: zodResolver(commissionRuleFormSchema),
        defaultValues: {
            name: '',
            description: '',
            scope: CommissionRuleScope.GeneralBusinessSpecificCommission,
            priority: 100,
            formula: {
                expression: 'sale_amount * 0.05',
                description: '5% commission on sale amount',
                // variables removed - not part of API schema
            },
            effective_from: new Date().toISOString(),
            min_commission: undefined,
            max_commission: undefined,
            restrictions: {
                description: '',
                product_ids: [],
                category_ids: [],
                creator_tiers: [],
                min_order_value: undefined,
                max_order_value: undefined
            }
        },
    });

    const scope = watch('scope');
    const formulaExpression = watch('formula.expression');

    // Handle form submission
    const onSubmit = async (data: CommissionRuleFormData) =>
    {
        try
        {
            // Transform form data to API request format
            const requestData: CreateCommissionRuleRequest = {
                ...data,
                effective_from: effectiveFromDate.toISOString(),
                effective_to: effectiveToDate?.toISOString(),
                // formula is already in correct format from form
            };

            const newRule = await createRuleMutation.mutateAsync(requestData);

            toast.success('Commission rule created successfully');
            router.push(`/${entityType}-management/commission/${newRule.id}`);
        } catch (error)
        {
            toast.error('Failed to create commission rule');
        }
    };

    // Variable management functions removed - not part of API schema

    // All variable management functions removed

    // getSuggestedFormulas moved to FormulaEditor component

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Create Commission Rule</h1>
                <p className="text-muted-foreground">
                    Define a new commission calculation rule for your team.
                </p>
            </div>

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
                                            {format(effectiveFromDate, "PPP")}
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
                <div className="flex items-center gap-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-[120px]"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Rule'}
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
            </form>
        </div>
    );
}