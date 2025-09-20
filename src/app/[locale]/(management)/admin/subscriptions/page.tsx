// app/admin/subscriptions/page.tsx
'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useSubscriptionHooks } from '@/hooks/api/subscription-hooks';
import { BusinessType } from '@/types/app/registration-schema';
import
{
    PermissionUtils,
    SubscriptionPermissions
} from '@/types/app/subscription';
import { SubscriptionPlanDto } from '@/types';
import { UserManagementDomainDTOsCreateSubscriptionPlanRequest } from '@/gen/api/types/user_management_domain_dt_os_create_subscription_plan_request';
import { zodResolver } from '@hookform/resolvers/zod';
import
{
    Check,
    Crown,
    Edit,
    Filter,
    Plus,
    Save,
    Search,
    Trash2,
    Users,
    X
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const planFormSchema = z.object({
    name: z.string().min(1, 'Plan name is required'),
    business_type: z.enum(['Brand', 'Retailer']),
    monthly_price: z.number().min(0, 'Price must be positive'),
    yearly_price: z.number().min(0, 'Price must be positive'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    max_connections: z.number().min(-1, 'Use -1 for unlimited'),
    max_invites: z.number().min(-1, 'Use -1 for unlimited'),
    max_products: z.number().min(-1, 'Use -1 for unlimited'),
    api_calls_per_month: z.number().min(0, 'API calls must be positive'),
    is_popular: z.boolean(),
    trial_days: z.number().min(0).max(365),
    sort_order: z.number().min(0),
    // Permission flags
    basicAnalytics: z.boolean(),
    advancedAnalytics: z.boolean(),
    customReports: z.boolean(),
    dataExport: z.boolean(),
    basicConnections: z.boolean(),
    unlimitedConnections: z.boolean(),
    basicInvites: z.boolean(),
    unlimitedInvites: z.boolean(),
    basicCampaigns: z.boolean(),
    advancedCampaigns: z.boolean(),
    campaignAnalytics: z.boolean(),
    basicSupport: z.boolean(),
    prioritySupport: z.boolean(),
    dedicatedManager: z.boolean(),
    customBranding: z.boolean(),
    whiteLabel: z.boolean(),
    customDomain: z.boolean(),
    basicApiAccess: z.boolean(),
    advancedApiAccess: z.boolean(),
    webhookSupport: z.boolean(),
    thirdPartyIntegrations: z.boolean(),
    basicProducts: z.boolean(),
    unlimitedProducts: z.boolean(),
    productAnalytics: z.boolean(),
    advancedPermissions: z.boolean(),
    auditLogs: z.boolean(),
    ssoIntegration: z.boolean(),
    customContracts: z.boolean(),
    onPremiseDeployment: z.boolean(),
});

type PlanFormData = z.infer<typeof planFormSchema>;

interface PlanEditorProps
{
    plan?: SubscriptionPlanDto;
    onSave: (plan: UserManagementDomainDTOsCreateSubscriptionPlanRequest) => void;
    onCancel: () => void;
}

function PlanEditor({ plan, onSave, onCancel }: PlanEditorProps)
{
    // Convert existing permissions to feature flags if editing
    const existingFeatures = plan ? PermissionUtils.toFeatureFlags(plan.permissions) : {};

    const form = useForm<PlanFormData>({
        resolver: zodResolver(planFormSchema),
        defaultValues: plan ? {
            name: plan.name,
            business_type: plan.business_type,
            monthly_price: plan.monthly_price,
            yearly_price: plan.yearly_price,
            description: plan.description,
            max_connections: plan.max_connections,
            max_invites: plan.max_invites,
            max_products: plan.max_products,
            api_calls_per_month: plan.api_calls_per_month,
            is_popular: plan.is_popular,
            trial_days: plan.trial_days,
            sort_order: 0, // Default sort order
            // Permission flags from existing plan
            ...existingFeatures,
        } : {
            name: '',
            business_type: 'Brand',
            monthly_price: 49,
            yearly_price: 490,
            description: '',
            max_connections: 5,
            max_invites: 10,
            max_products: 100,
            api_calls_per_month: 1000,
            is_popular: false,
            trial_days: 14,
            sort_order: 0,
            // Default permissions for basic plan
            basicAnalytics: true,
            advancedAnalytics: false,
            customReports: false,
            dataExport: false,
            basicConnections: true,
            unlimitedConnections: false,
            basicInvites: true,
            unlimitedInvites: false,
            basicCampaigns: true,
            advancedCampaigns: false,
            campaignAnalytics: false,
            basicSupport: true,
            prioritySupport: false,
            dedicatedManager: false,
            customBranding: false,
            whiteLabel: false,
            customDomain: false,
            basicApiAccess: false,
            advancedApiAccess: false,
            webhookSupport: false,
            thirdPartyIntegrations: false,
            basicProducts: true,
            unlimitedProducts: false,
            productAnalytics: false,
            advancedPermissions: false,
            auditLogs: false,
            ssoIntegration: false,
            customContracts: false,
            onPremiseDeployment: false,
        },
    });

    const onSubmit = (data: PlanFormData) =>
    {
        // Convert form data to permissions bitfield
        let permissions = SubscriptionPermissions.None;

        // Add permissions based on form data
        if (data.basicAnalytics) permissions |= SubscriptionPermissions.BasicAnalytics;
        if (data.advancedAnalytics) permissions |= SubscriptionPermissions.AdvancedAnalytics;
        if (data.customReports) permissions |= SubscriptionPermissions.CustomReports;
        if (data.dataExport) permissions |= SubscriptionPermissions.DataExport;
        if (data.basicConnections) permissions |= SubscriptionPermissions.BasicConnections;
        if (data.unlimitedConnections) permissions |= SubscriptionPermissions.UnlimitedConnections;
        if (data.basicInvites) permissions |= SubscriptionPermissions.BasicInvites;
        if (data.unlimitedInvites) permissions |= SubscriptionPermissions.UnlimitedInvites;
        if (data.basicCampaigns) permissions |= SubscriptionPermissions.BasicCampaigns;
        if (data.advancedCampaigns) permissions |= SubscriptionPermissions.AdvancedCampaigns;
        if (data.campaignAnalytics) permissions |= SubscriptionPermissions.CampaignAnalytics;
        if (data.basicSupport) permissions |= SubscriptionPermissions.BasicSupport;
        if (data.prioritySupport) permissions |= SubscriptionPermissions.PrioritySupport;
        if (data.dedicatedManager) permissions |= SubscriptionPermissions.DedicatedManager;
        if (data.customBranding) permissions |= SubscriptionPermissions.CustomBranding;
        if (data.whiteLabel) permissions |= SubscriptionPermissions.WhiteLabel;
        if (data.customDomain) permissions |= SubscriptionPermissions.CustomDomain;
        if (data.basicApiAccess) permissions |= SubscriptionPermissions.BasicApiAccess;
        if (data.advancedApiAccess) permissions |= SubscriptionPermissions.AdvancedApiAccess;
        if (data.webhookSupport) permissions |= SubscriptionPermissions.WebhookSupport;
        if (data.thirdPartyIntegrations) permissions |= SubscriptionPermissions.ThirdPartyIntegrations;
        if (data.basicProducts) permissions |= SubscriptionPermissions.BasicProducts;
        if (data.unlimitedProducts) permissions |= SubscriptionPermissions.UnlimitedProducts;
        if (data.productAnalytics) permissions |= SubscriptionPermissions.ProductAnalytics;
        if (data.advancedPermissions) permissions |= SubscriptionPermissions.AdvancedPermissions;
        if (data.auditLogs) permissions |= SubscriptionPermissions.AuditLogs;
        if (data.ssoIntegration) permissions |= SubscriptionPermissions.SsoIntegration;
        if (data.customContracts) permissions |= SubscriptionPermissions.CustomContracts;
        if (data.onPremiseDeployment) permissions |= SubscriptionPermissions.OnPremiseDeployment;

        const planData: UserManagementDomainDTOsCreateSubscriptionPlanRequest = {
            name: data.name,
            business_type: data.business_type,
            monthly_price: data.monthly_price,
            yearly_price: data.yearly_price,
            description: data.description,
            permissions: permissions,
            max_connections: data.max_connections,
            max_invites: data.max_invites,
            max_products: data.max_products,
            api_calls_per_month: data.api_calls_per_month,
            is_popular: data.is_popular,
            trial_days: data.trial_days,
            sort_order: data.sort_order,
        };

        onSave(planData);
    };

    const permissionGroups = [
        {
            title: 'Analytics & Reporting',
            permissions: [
                { key: 'basicAnalytics', label: 'Basic Analytics' },
                { key: 'advancedAnalytics', label: 'Advanced Analytics' },
                { key: 'customReports', label: 'Custom Reports' },
                { key: 'dataExport', label: 'Data Export' },
            ]
        },
        {
            title: 'Connections & Invitations',
            permissions: [
                { key: 'basicConnections', label: 'Basic Connections' },
                { key: 'unlimitedConnections', label: 'Unlimited Connections' },
                { key: 'basicInvites', label: 'Basic Invitations' },
                { key: 'unlimitedInvites', label: 'Unlimited Invitations' },
            ]
        },
        {
            title: 'Campaign Management',
            permissions: [
                { key: 'basicCampaigns', label: 'Basic Campaigns' },
                { key: 'advancedCampaigns', label: 'Advanced Campaigns' },
                { key: 'campaignAnalytics', label: 'Campaign Analytics' },
            ]
        },
        {
            title: 'Support & Service',
            permissions: [
                { key: 'basicSupport', label: 'Basic Support' },
                { key: 'prioritySupport', label: 'Priority Support' },
                { key: 'dedicatedManager', label: 'Dedicated Manager' },
            ]
        },
        {
            title: 'Branding & Customization',
            permissions: [
                { key: 'customBranding', label: 'Custom Branding' },
                { key: 'whiteLabel', label: 'White Label' },
                { key: 'customDomain', label: 'Custom Domain' },
            ]
        },
        {
            title: 'API & Integrations',
            permissions: [
                { key: 'basicApiAccess', label: 'Basic API Access' },
                { key: 'advancedApiAccess', label: 'Advanced API Access' },
                { key: 'webhookSupport', label: 'Webhook Support' },
                { key: 'thirdPartyIntegrations', label: 'Third-party Integrations' },
            ]
        },
        {
            title: 'Products & Commerce',
            permissions: [
                { key: 'basicProducts', label: 'Basic Products' },
                { key: 'unlimitedProducts', label: 'Unlimited Products' },
                { key: 'productAnalytics', label: 'Product Analytics' },
            ]
        },
        {
            title: 'Enterprise Features',
            permissions: [
                { key: 'advancedPermissions', label: 'Advanced Permissions' },
                { key: 'auditLogs', label: 'Audit Logs' },
                { key: 'ssoIntegration', label: 'SSO Integration' },
                { key: 'customContracts', label: 'Custom Contracts' },
                { key: 'onPremiseDeployment', label: 'On-Premise Deployment' },
            ]
        },
    ];

    return (
        <Card className="bg-[#090909] border-[#202020]">
            <CardHeader>
                <CardTitle className="text-[#EDECF8]">
                    {plan ? 'Edit Plan' : 'Create New Plan'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#EDECF8]">Plan Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                placeholder="e.g., Basic, Standard, Premium"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="business_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#EDECF8]">Business Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-[#171717] border-[#575757]">
                                                <SelectItem value="Brand">Brand</SelectItem>
                                                <SelectItem value="Retailer">Retailer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <FormField
                                control={form.control}
                                name="monthly_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#EDECF8]">Monthly Price ($)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="yearly_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#EDECF8]">Yearly Price ($)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="trial_days"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#EDECF8]">Trial Days</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="sort_order"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#EDECF8]">Sort Order</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#EDECF8]">Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                            placeholder="Describe this plan..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Limits */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <FormField
                                control={form.control}
                                name="max_connections"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#EDECF8]">Max Connections</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                placeholder="-1 for unlimited"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="max_invites"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#EDECF8]">Max Monthly Invites</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                placeholder="-1 for unlimited"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="max_products"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#EDECF8]">Max Products</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                placeholder="-1 for unlimited"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="api_calls_per_month"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#EDECF8]">API Calls/Month</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Plan Settings */}
                        <FormField
                            control={form.control}
                            name="is_popular"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between space-y-0 rounded-lg border border-[#575757] p-4">
                                    <FormLabel className="text-[#EDECF8]">Mark as Popular Plan</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Permission Groups */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-[#EDECF8]">Plan Permissions</h3>
                            {permissionGroups.map((group) => (
                                <div key={group.title} className="space-y-4">
                                    <h4 className="text-md font-medium text-[#EDECF8] border-b border-[#575757] pb-2">
                                        {group.title}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {group.permissions.map((permission) => (
                                            <FormField
                                                key={permission.key}
                                                control={form.control}
                                                name={permission.key as keyof PlanFormData}
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between space-y-0 rounded-lg border border-[#575757] p-3">
                                                        <FormLabel className="text-[#EDECF8] text-sm">{permission.label}</FormLabel>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value as boolean}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Plan
                            </Button>
                            <Button
                                type="button"
                                onClick={onCancel}
                                variant="outline"
                                className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

function PlanCard({ plan, onEdit, onDelete }: {
    plan: SubscriptionPlanDto;
    onEdit: (plan: SubscriptionPlanDto) => void;
    onDelete: (planId: string) => void;
})
{
    const savings = Math.round(((plan.monthly_price * 12 - plan.yearly_price) / (plan.monthly_price * 12)) * 100);
    const features = PermissionUtils.toFeatureFlags(plan.permissions);

    return (
        <Card className={`bg-[#090909] border-2 transition-all ${plan.is_popular ? 'border-[#D78E59]' : 'border-[#202020]'
            }`}>
            {plan.is_popular && (
                <div className="bg-[#D78E59] text-[#171717] text-center py-2 font-semibold text-sm">
                    Most Popular
                </div>
            )}

            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                            {plan.name}
                            <Badge className="bg-[#575757] text-[#EDECF8]">
                                {plan.business_type}
                            </Badge>
                        </CardTitle>
                        <p className="text-[#828288] text-sm mt-1">{plan.description}</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Pricing */}
                <div className="text-center">
                    <div className="text-3xl font-bold text-[#EDECF8]">${plan.monthly_price}</div>
                    <div className="text-[#828288] text-sm">per month</div>
                    {savings > 0 && (
                        <div className="text-[#D78E59] text-sm">
                            Save {savings}% with yearly billing
                        </div>
                    )}
                </div>

                {/* Key Features */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[#828288]">Connections</span>
                        <span className="text-[#EDECF8] font-medium">
                            {plan.max_connections === -1 ? 'Unlimited' : plan.max_connections}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[#828288]">Monthly Invites</span>
                        <span className="text-[#EDECF8] font-medium">
                            {plan.max_invites === -1 ? 'Unlimited' : plan.max_invites}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[#828288]">Trial Period</span>
                        <span className="text-[#EDECF8] font-medium">{plan.trial_days} days</span>
                    </div>
                </div>

                {/* Feature List */}
                <div className="space-y-1">
                    {Object.entries(features).slice(0, 5).map(([key, value]) =>
                    {
                        if (typeof value === 'boolean')
                        {
                            return (
                                <div key={key} className="flex items-center gap-2 text-sm">
                                    {value ? (
                                        <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <X className="w-4 h-4 text-red-500" />
                                    )}
                                    <span className={value ? "text-[#EDECF8]" : "text-[#575757]"}>
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </span>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-[#575757]">
                    <Button
                        onClick={() => onEdit(plan)}
                        size="sm"
                        className="flex-1 bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button
                        onClick={() => onDelete(plan.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminSubscriptionManagementPage()
{
    const subscriptionHooks = useSubscriptionHooks();
    const { data: plans = [], isLoading } = subscriptionHooks.getSubscriptionPlans();
    const createPlan = subscriptionHooks.createSubscriptionPlan();
    const updatePlan = subscriptionHooks.updateSubscriptionPlan();
    const deletePlan = subscriptionHooks.deleteSubscriptionPlan();

    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanDto | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [businessTypeFilter, setBusinessTypeFilter] = useState<'all' | BusinessType>('all');

    const filteredPlans = plans.filter(plan =>
    {
        const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plan.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = businessTypeFilter === 'all' || plan.business_type === businessTypeFilter;
        return matchesSearch && matchesType;
    });

    const brandPlans = filteredPlans.filter(p => p.business_type === 'Brand');
    const retailerPlans = filteredPlans.filter(p => p.business_type === 'Retailer');

    const handleSavePlan = async (planData: UserManagementDomainDTOsCreateSubscriptionPlanRequest) =>
    {
        try
        {
            if (selectedPlan)
            {
                await updatePlan.mutateAsync({ planId: selectedPlan.id, data: planData });
            } else
            {
                await createPlan.mutateAsync(planData);
            }
            setSelectedPlan(null);
            setIsCreating(false);
        } catch (error)
        {
            // Error handling is in the hooks
        }
    };

    const handleDeletePlan = async (planId: string) =>
    {
        if (confirm('Are you sure you want to delete this plan?'))
        {
            try
            {
                await deletePlan.mutateAsync(planId);
            } catch (error)
            {
                // Error handling is in the hook
            }
        }
    };

    if (isLoading)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-[#202020] rounded w-1/3"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-64 bg-[#202020] rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isCreating || selectedPlan)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto">
                    <PlanEditor
                        plan={selectedPlan || undefined}
                        onSave={handleSavePlan}
                        onCancel={() =>
                        {
                            setSelectedPlan(null);
                            setIsCreating(false);
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#EDECF8] mb-2">Subscription Plans</h1>
                        <p className="text-[#828288]">Create and manage subscription plans for brands and retailers</p>
                    </div>
                    <Button
                        onClick={() => setIsCreating(true)}
                        className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Plan
                    </Button>
                </div>

                {/* Filters */}
                <Card className="bg-[#090909] border-[#202020] mb-8">
                    <CardHeader>
                        <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-[#575757]" />
                                <Input
                                    placeholder="Search plans..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-[#202020] border-[#575757] text-[#EDECF8]"
                                />
                            </div>

                            <Select value={businessTypeFilter} onValueChange={(value) => setBusinessTypeFilter(value as any)}>
                                <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                    <SelectValue placeholder="All Business Types" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#171717] border-[#575757]">
                                    <SelectItem value="all">All Business Types</SelectItem>
                                    <SelectItem value="Brand">Brands</SelectItem>
                                    <SelectItem value="Retailer">Retailers</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Plans */}
                <Tabs defaultValue="brands" className="space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-2 bg-[#202020]">
                        <TabsTrigger value="brands" className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-[#171717]">
                            Brand Plans ({brandPlans.length})
                        </TabsTrigger>
                        <TabsTrigger value="retailers" className="data-[state=active]:bg-[#D78E59] data-[state=active]:text-[#171717]">
                            Retailer Plans ({retailerPlans.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="brands" className="space-y-6">
                        {brandPlans.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {brandPlans.map((plan) => (
                                    <PlanCard
                                        key={plan.id}
                                        plan={plan}
                                        onEdit={setSelectedPlan}
                                        onDelete={handleDeletePlan}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardContent className="p-12 text-center">
                                    <Crown className="w-12 h-12 text-[#575757] mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-[#EDECF8] mb-2">No brand plans found</h3>
                                    <p className="text-[#828288] mb-4">
                                        {searchQuery || businessTypeFilter !== 'all'
                                            ? 'Try adjusting your filters.'
                                            : 'Create your first brand subscription plan.'
                                        }
                                    </p>
                                    <Button
                                        onClick={() => setIsCreating(true)}
                                        className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                    >
                                        Create Brand Plan
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="retailers" className="space-y-6">
                        {retailerPlans.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {retailerPlans.map((plan) => (
                                    <PlanCard
                                        key={plan.id}
                                        plan={plan}
                                        onEdit={setSelectedPlan}
                                        onDelete={handleDeletePlan}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardContent className="p-12 text-center">
                                    <Users className="w-12 h-12 text-[#575757] mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-[#EDECF8] mb-2">No retailer plans found</h3>
                                    <p className="text-[#828288] mb-4">
                                        {searchQuery || businessTypeFilter !== 'all'
                                            ? 'Try adjusting your filters.'
                                            : 'Create your first retailer subscription plan.'
                                        }
                                    </p>
                                    <Button
                                        onClick={() => setIsCreating(true)}
                                        className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                    >
                                        Create Retailer Plan
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}