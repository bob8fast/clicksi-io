// app/subscription/trial/page.tsx
'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTrialRequest, useSubscriptionPlans } from '@/hooks/api/subscription-hooks';
import { BusinessType } from '@/types/app/registration-schema';
import { CreateTrialRequestRequest, CreateTrialRequestSchema } from '@/types/app/subscription';
import { zodResolver } from '@hookform/resolvers/zod';
import
{
    ArrowLeft,
    CheckCircle,
    Clock,
    Crown,
    Send,
    Sparkles,
    Star
} from 'lucide-react';
// import { useSession } from 'next-auth/react'; // Removed auth
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Form schema based on the new CreateTrialRequestRequest type
const trialRequestSchema = CreateTrialRequestSchema.omit({ user_id: true });

type TrialRequestFormData = z.infer<typeof trialRequestSchema>;

const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-100 employees',
    '101-500 employees',
    '500+ employees',
];

const industries = [
    'Beauty & Cosmetics',
    'Fashion & Apparel',
    'Health & Wellness',
    'Luxury Goods',
    'Retail & E-commerce',
    'Other',
];

export default function TrialRequestPage()
{
    // Mock session data since auth is removed
    const _mockSession = { user_info: { user_id: 'mock-user-id', email: 'user@example.com' } };
    const router = useRouter();
    const createTrialRequest = useCreateTrialRequest();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType>('Brand');

    const { data: plans } = useSubscriptionPlans(selectedBusinessType);

    const form = useForm<TrialRequestFormData>({
        resolver: zodResolver(trialRequestSchema),
        defaultValues: {
            business_type: 'Brand',
            requested_plan_id: '',
            reason: '',
            company_size: '',
            expected_usage: '',
            industry: '',
            website: '',
            current_solution: '',
        },
    });

    const watchedBusinessType = form.watch('business_type');
    const watchedPlan = form.watch('requested_plan_id');

    // Update plans when business type changes
    useEffect(() =>
    {
        setSelectedBusinessType(watchedBusinessType);
        form.setValue('requested_plan_id', ''); // Reset selected plan
    }, [watchedBusinessType, form]);

    const selectedPlanDetails = plans?.find(p => p.id === watchedPlan);

    const onSubmit = async (data: TrialRequestFormData) =>
    {
        if (!_mockSession?.user_info)
        {
            toast.error('Please log in to submit a trial request');
            router.push('/sign-in?returnTo=/subscription/trial');
            return;
        }

        try
        {
            const trialRequest: CreateTrialRequestRequest = {
                user_id: _mockSession.user_info.user_id,
                requested_plan_id: data.requested_plan_id,
                business_type: data.business_type,
                reason: data.reason,
                company_size: data.company_size,
                expected_usage: data.expected_usage,
                industry: data.industry,
                website: data.website,
                current_solution: data.current_solution,
            };

            await createTrialRequest.mutateAsync(trialRequest);
            setIsSubmitted(true);
        } catch (_error)
        {
            // Error handling is in the hook
        }
    };

    if (isSubmitted)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>

                    <h1 className="text-3xl font-bold text-[#EDECF8] mb-4">
                        Trial Request Submitted!
                    </h1>

                    <p className="text-xl text-[#828288] mb-8">
                        Thank you for your interest in Clicksi. We&apos;ve received your trial request and our team will review it shortly.
                    </p>

                    <div className="bg-[#090909] rounded-xl p-6 border border-[#202020] mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="w-5 h-5 text-[#D78E59]" />
                            <h3 className="text-lg font-semibold text-[#EDECF8]">What happens next?</h3>
                        </div>
                        <div className="space-y-3 text-left">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-[#D78E59] rounded-full flex items-center justify-center text-[#171717] text-sm font-bold">1</div>
                                <div>
                                    <div className="text-[#EDECF8] font-medium">Review Process</div>
                                    <div className="text-[#828288] text-sm">Our team will review your request within 24 hours</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-[#D78E59] rounded-full flex items-center justify-center text-[#171717] text-sm font-bold">2</div>
                                <div>
                                    <div className="text-[#EDECF8] font-medium">Approval Notification</div>
                                    <div className="text-[#828288] text-sm">You&apos;ll receive an email with your trial access details</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-[#D78E59] rounded-full flex items-center justify-center text-[#171717] text-sm font-bold">3</div>
                                <div>
                                    <div className="text-[#EDECF8] font-medium">Start Your Trial</div>
                                    <div className="text-[#828288] text-sm">Begin exploring all the features of your selected plan</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Button
                            onClick={() => router.push('/dashboard')}
                            className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                        >
                            Go to Dashboard
                        </Button>
                        <Button
                            onClick={() => router.push('/subscription')}
                            variant="outline"
                            className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                        >
                            View Plans
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-[#EDECF8] mb-2">Request a Free Trial</h1>
                        <p className="text-[#828288]">
                            Tell us about your business and we&apos;ll set up a personalized trial for you
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-[#D78E59]" />
                                    Trial Request Form
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        {/* Business Type */}
                                        <FormField
                                            control={form.control}
                                            name="business_type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#EDECF8]">Business Type</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            className="grid grid-cols-2 gap-4"
                                                        >
                                                            <div className="flex items-center space-x-2 p-4 border border-[#575757] rounded-lg">
                                                                <RadioGroupItem value="Brand" id="brand" />
                                                                <div className="flex-1">
                                                                    <label htmlFor="brand" className="text-[#EDECF8] font-medium cursor-pointer">
                                                                        Beauty Brand
                                                                    </label>
                                                                    <p className="text-[#828288] text-sm">Connect with retailers and influencers</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2 p-4 border border-[#575757] rounded-lg">
                                                                <RadioGroupItem value="Retailer" id="retailer" />
                                                                <div className="flex-1">
                                                                    <label htmlFor="retailer" className="text-[#EDECF8] font-medium cursor-pointer">
                                                                        Retailer
                                                                    </label>
                                                                    <p className="text-[#828288] text-sm">Partner with beauty brands</p>
                                                                </div>
                                                            </div>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Website */}
                                        <FormField
                                            control={form.control}
                                            name="website"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#EDECF8]">Website (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="https://..."
                                                            className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="company_size"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#EDECF8]">Company Size</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                                                    <SelectValue placeholder="Select company size" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="bg-[#171717] border-[#575757]">
                                                                {companySizes.map((size) => (
                                                                    <SelectItem key={size} value={size}>
                                                                        {size}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="industry"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[#EDECF8]">Industry</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="bg-[#202020] border-[#575757] text-[#EDECF8]">
                                                                    <SelectValue placeholder="Select industry" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="bg-[#171717] border-[#575757]">
                                                                {industries.map((industry) => (
                                                                    <SelectItem key={industry} value={industry}>
                                                                        {industry}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Plan Selection */}
                                        <FormField
                                            control={form.control}
                                            name="requested_plan_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#EDECF8]">Requested Plan</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            className="space-y-3"
                                                        >
                                                            {plans?.map((plan) => (
                                                                <div
                                                                    key={plan.id}
                                                                    className={`flex items-center space-x-3 p-4 border rounded-lg ${plan.is_popular ? 'border-[#D78E59]' : 'border-[#575757]'
                                                                        }`}
                                                                >
                                                                    <RadioGroupItem value={plan.id} id={plan.id} />
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <label htmlFor={plan.id} className="text-[#EDECF8] font-medium cursor-pointer">
                                                                                {plan.name} Plan
                                                                            </label>
                                                                            {plan.is_popular && (
                                                                                <span className="bg-[#D78E59] text-[#171717] text-xs px-2 py-1 rounded font-medium">
                                                                                    Popular
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-[#828288] text-sm">${plan.monthly_price}/month</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Reason */}
                                        <FormField
                                            control={form.control}
                                            name="reason"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#EDECF8]">
                                                        Why do you want to try Clicksi?
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            className="bg-[#202020] border-[#575757] text-[#EDECF8] min-h-[100px]"
                                                            placeholder="Tell us about your goals and how Clicksi can help your business..."
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Expected Usage */}
                                        <FormField
                                            control={form.control}
                                            name="expected_usage"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#EDECF8]">
                                                        Expected Usage
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            className="bg-[#202020] border-[#575757] text-[#EDECF8] min-h-[80px]"
                                                            placeholder="How many connections do you plan to make? What campaigns are you planning?"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Current Solution */}
                                        <FormField
                                            control={form.control}
                                            name="current_solution"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[#EDECF8]">
                                                        Current Solution (Optional)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            className="bg-[#202020] border-[#575757] text-[#EDECF8] min-h-[60px]"
                                                            placeholder="What tools or methods are you currently using?"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="submit"
                                            disabled={createTrialRequest.isPending}
                                            className="w-full bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] font-semibold py-3"
                                        >
                                            {createTrialRequest.isPending ? (
                                                'Submitting...'
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Submit Trial Request
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Selected Plan Preview */}
                        {selectedPlanDetails && (
                            <Card className="bg-[#090909] border-[#D78E59]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                        <Crown className="w-5 h-5 text-[#D78E59]" />
                                        Selected Plan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-[#EDECF8] mb-2">
                                            {selectedPlanDetails.name} Plan
                                        </h3>
                                        <div className="text-3xl font-bold text-[#D78E59] mb-1">
                                            ${selectedPlanDetails.monthly_price}
                                        </div>
                                        <div className="text-[#828288] text-sm mb-4">per month</div>
                                        <div className="bg-[#202020] rounded-lg p-3">
                                            <div className="text-[#D78E59] font-semibold text-sm mb-1">
                                                {selectedPlanDetails.trial_days}-Day Free Trial
                                            </div>
                                            <div className="text-[#828288] text-xs">
                                                Full access to all features
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Benefits */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <Star className="w-5 h-5 text-[#FFAA6C]" />
                                    Trial Benefits
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-[#EDECF8] text-sm">Full feature access</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-[#EDECF8] text-sm">Priority support</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-[#EDECF8] text-sm">No commitment required</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-[#EDECF8] text-sm">Personal onboarding</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Info */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Need Help?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-[#828288] text-sm mb-4">
                                    Have questions about our plans or need assistance with your trial request?
                                </p>
                                <Button
                                    onClick={() => router.push('/contact')}
                                    variant="outline"
                                    className="w-full border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                >
                                    Contact Sales
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}