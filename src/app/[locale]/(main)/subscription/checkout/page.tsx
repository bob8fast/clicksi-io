// app/subscription/checkout/page.tsx
'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCreateSubscription, useSubscriptionPlans } from '@/hooks/api/subscription-hooks';
import
{
    CreateSubscriptionRequest,
    PermissionUtils,
    getBillingCycleEnum
} from '@/types/app/subscription';
import
{
    ArrowLeft,
    Calendar,
    Check,
    CreditCard,
    Lock,
    Mail,
    Shield,
    User
} from 'lucide-react';
// import { useSession } from 'next-auth/react'; // Removed auth
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PaymentFormData
{
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
    email: string;
    billingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
}

export default function CheckoutPage()
{
    // Mock session data since auth is removed
    const mockSession = {
        user_info: {
            user_id: 'mock-user-id',
            email: 'user@example.com',
            name: 'Mock User'
        }
    };
    const router = useRouter();
    const searchParams = useSearchParams();
    const createSubscription = useCreateSubscription();

    const planId = searchParams.get('plan');
    const billingCycle = (searchParams.get('billing') as 'monthly' | 'yearly') || 'monthly';
    const isUpgrade = searchParams.get('upgrade') === 'true';

    const { data: plans } = useSubscriptionPlans();
    const selectedPlan = plans?.find(p => p.id === planId);

    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState<PaymentFormData>({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        email: mockSession.user_info.email,
        billingAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'US',
        },
    });

    useEffect(() =>
    {
        if (!planId || !selectedPlan)
        {
            router.push('/subscription');
        }
    }, [planId, selectedPlan, router]);

    useEffect(() =>
    {
        setFormData(prev => ({ ...prev, email: mockSession.user_info.email }));
    }, [mockSession.user_info.email]);

    if (!selectedPlan)
    {
        return (
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-[#828288]">Loading...</p>
                </div>
            </div>
        );
    }

    const price = billingCycle === 'yearly' ? selectedPlan.yearly_price : selectedPlan.monthly_price;
    const monthlyPrice = billingCycle === 'yearly' ? selectedPlan.yearly_price / 12 : selectedPlan.monthly_price;
    const savings = billingCycle === 'yearly' ? Math.round(((selectedPlan.monthly_price * 12 - selectedPlan.yearly_price) / (selectedPlan.monthly_price * 12)) * 100) : 0;
    const tax = Math.round(price * 0.08 * 100) / 100; // 8% tax
    const total = price + tax;

    // Convert permissions to feature flags
    const features = PermissionUtils.toFeatureFlags(selectedPlan.permissions);

    const handleInputChange = (field: string, value: string) =>
    {
        if (field.startsWith('billingAddress.'))
        {
            const addressField = field.split('.')[1];
            setFormData(prev => ({
                ...prev,
                billingAddress: {
                    ...prev.billingAddress,
                    [addressField]: value,
                },
            }));
        } else
        {
            setFormData(prev => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const formatCardNumber = (value: string) =>
    {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4)
        {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length)
        {
            return parts.join(' ');
        } else
        {
            return v;
        }
    };

    const formatExpiryDate = (value: string) =>
    {
        const v = value.replace(/\D/g, '');
        if (v.length >= 2)
        {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    const handleSubmit = async (e: React.FormEvent) =>
    {
        e.preventDefault();

        // Auth check removed - proceed with mock data

        if (paymentMethod === 'card')
        {
            if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName)
            {
                toast.error('Please fill in all payment details');
                return;
            }
        }

        setIsProcessing(true);

        try
        {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            const subscriptionRequest: CreateSubscriptionRequest = {
                user_id: mockSession.user_info.user_id,
                plan_id: selectedPlan.id,
                billing_cycle: getBillingCycleEnum(billingCycle),
                payment_method_id: paymentMethod === 'card' ? 'pm_mock_payment_method' : 'pm_paypal_mock',
                trial_requested: false,
            };

            await createSubscription.mutateAsync(subscriptionRequest);

            toast.success('Subscription successful! Welcome to your new plan!');
            router.push('/subscription/success?plan=' + selectedPlan.id);
        } catch (_error)
        {
            toast.error('Payment failed. Please try again.');
            setIsProcessing(false);
        }
    };

    const handlePayPalPayment = async () =>
    {
        // Auth check removed - proceed with mock data

        setIsProcessing(true);
        // Simulate PayPal flow
        setTimeout(async () =>
        {
            try
            {
                const subscriptionRequest: CreateSubscriptionRequest = {
                    user_id: mockSession.user_info.user_id,
                    plan_id: selectedPlan.id,
                    billing_cycle: getBillingCycleEnum(billingCycle),
                    payment_method_id: 'pm_paypal_mock',
                    trial_requested: false,
                };

                await createSubscription.mutateAsync(subscriptionRequest);

                toast.success('Subscription successful! Welcome to your new plan!');
                router.push('/subscription/success?plan=' + selectedPlan.id);
            } catch (_error)
            {
                toast.error('Payment failed. Please try again.');
                setIsProcessing(false);
            }
        }, 2000);
    };

    return (
        <div className="container mx-auto px-6 lg:px-8 py-8">
            <div className="max-w-6xl mx-auto">
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
                        <h1 className="text-3xl font-bold text-[#EDECF8]">
                            {isUpgrade ? 'Upgrade Your Plan' : 'Complete Your Subscription'}
                        </h1>
                        <p className="text-[#828288]">
                            {isUpgrade ? 'Upgrade to unlock more features' : 'Start your free trial today'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Payment Form */}
                    <div className="space-y-6">
                        {/* Payment Method Selection */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Payment Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={paymentMethod} onValueChange={(value: 'card' | 'paypal') => setPaymentMethod(value)}>
                                    <div className="flex items-center space-x-2 p-4 border border-[#575757] rounded-lg">
                                        <RadioGroupItem value="card" id="card" />
                                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" />
                                                Credit or Debit Card
                                            </div>
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 p-4 border border-[#575757] rounded-lg">
                                        <RadioGroupItem value="paypal" id="paypal" />
                                        <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-[#0070ba] rounded text-white text-xs flex items-center justify-center font-bold">P</div>
                                                PayPal
                                            </div>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        {/* Payment Form */}
                        {paymentMethod === 'card' ? (
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardHeader>
                                    <CardTitle className="text-[#EDECF8]">Payment Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <Label htmlFor="email" className="text-[#EDECF8]">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-[#575757]" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className="pl-10 bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                    placeholder="your@email.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="cardholderName" className="text-[#EDECF8]">Cardholder Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-[#575757]" />
                                                <Input
                                                    id="cardholderName"
                                                    value={formData.cardholderName}
                                                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                                                    className="pl-10 bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                    placeholder="John Doe"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="cardNumber" className="text-[#EDECF8]">Card Number</Label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-[#575757]" />
                                                <Input
                                                    id="cardNumber"
                                                    value={formData.cardNumber}
                                                    onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                                                    className="pl-10 bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                    placeholder="1234 5678 9012 3456"
                                                    maxLength={19}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="expiryDate" className="text-[#EDECF8]">Expiry Date</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-[#575757]" />
                                                    <Input
                                                        id="expiryDate"
                                                        value={formData.expiryDate}
                                                        onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                                                        className="pl-10 bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        placeholder="MM/YY"
                                                        maxLength={5}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="cvv" className="text-[#EDECF8]">CVV</Label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-[#575757]" />
                                                    <Input
                                                        id="cvv"
                                                        value={formData.cvv}
                                                        onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                                                        className="pl-10 bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        placeholder="123"
                                                        maxLength={4}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="bg-[#575757]" />

                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-[#EDECF8]">Billing Address</h3>

                                            <div>
                                                <Label htmlFor="street" className="text-[#EDECF8]">Street Address</Label>
                                                <Input
                                                    id="street"
                                                    value={formData.billingAddress.street}
                                                    onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                                                    className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                    placeholder="123 Main St"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="city" className="text-[#EDECF8]">City</Label>
                                                    <Input
                                                        id="city"
                                                        value={formData.billingAddress.city}
                                                        onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        placeholder="New York"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="state" className="text-[#EDECF8]">State</Label>
                                                    <Input
                                                        id="state"
                                                        value={formData.billingAddress.state}
                                                        onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                                                        className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                        placeholder="NY"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="zipCode" className="text-[#EDECF8]">ZIP Code</Label>
                                                <Input
                                                    id="zipCode"
                                                    value={formData.billingAddress.zipCode}
                                                    onChange={(e) => handleInputChange('billingAddress.zipCode', e.target.value)}
                                                    className="bg-[#202020] border-[#575757] text-[#EDECF8]"
                                                    placeholder="10001"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] font-semibold py-3"
                                        >
                                            {isProcessing ? 'Processing...' : `Subscribe for $${total.toFixed(2)}`}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="bg-[#090909] border-[#202020]">
                                <CardContent className="p-6 text-center">
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-[#0070ba] rounded-full flex items-center justify-center mx-auto">
                                            <span className="text-white font-bold text-2xl">P</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-[#EDECF8]">Pay with PayPal</h3>
                                        <p className="text-[#828288]">
                                            You&apos;ll be redirected to PayPal to complete your payment securely.
                                        </p>
                                        <Button
                                            onClick={handlePayPalPayment}
                                            disabled={isProcessing}
                                            className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white font-semibold py-3"
                                        >
                                            {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)} with PayPal`}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Security Notice */}
                        <div className="flex items-center gap-2 text-[#575757] text-sm">
                            <Shield className="w-4 h-4" />
                            <span>Your payment information is encrypted and secure</span>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#D78E59] rounded-lg flex items-center justify-center">
                                        <span className="text-[#171717] font-bold text-sm">{selectedPlan.name[0]}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-[#EDECF8]">{selectedPlan.name} Plan</h3>
                                        <p className="text-[#828288] text-sm">{selectedPlan.business_type} subscription</p>
                                        <p className="text-[#828288] text-sm">{selectedPlan.description}</p>
                                    </div>
                                </div>

                                <Separator className="bg-[#575757]" />

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-[#828288]">
                                            {selectedPlan.name} Plan ({billingCycle})
                                        </span>
                                        <span className="text-[#EDECF8]">${price}</span>
                                    </div>

                                    {billingCycle === 'yearly' && savings > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#D78E59]">Annual discount ({savings}%)</span>
                                            <span className="text-[#D78E59]">
                                                -${(selectedPlan.monthly_price * 12 - selectedPlan.yearly_price).toFixed(2)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span className="text-[#828288]">Tax</span>
                                        <span className="text-[#EDECF8]">${tax}</span>
                                    </div>
                                </div>

                                <Separator className="bg-[#575757]" />

                                <div className="flex justify-between font-semibold text-lg">
                                    <span className="text-[#EDECF8]">Total</span>
                                    <span className="text-[#EDECF8]">${total.toFixed(2)}</span>
                                </div>

                                {billingCycle === 'yearly' && (
                                    <div className="text-center text-sm text-[#575757]">
                                        Equivalent to ${monthlyPrice.toFixed(2)}/month
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Features Included */}
                        <Card className="bg-[#090909] border-[#202020]">
                            <CardHeader>
                                <CardTitle className="text-[#EDECF8]">What&apos;s Included</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#D78E59]" />
                                        <span className="text-[#828288] text-sm">
                                            {selectedPlan.max_connections === -1 ? 'Unlimited' : selectedPlan.max_connections} connections
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#D78E59]" />
                                        <span className="text-[#828288] text-sm">
                                            {selectedPlan.max_invites === -1 ? 'Unlimited' : selectedPlan.max_invites} monthly invites
                                        </span>
                                    </div>
                                    {features.analytics && (
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-[#D78E59]" />
                                            <span className="text-[#828288] text-sm">Analytics dashboard</span>
                                        </div>
                                    )}
                                    {features.prioritySupport && (
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-[#D78E59]" />
                                            <span className="text-[#828288] text-sm">Priority support</span>
                                        </div>
                                    )}
                                    {(features.basicApiAccess || features.advancedApiAccess) && (
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-[#D78E59]" />
                                            <span className="text-[#828288] text-sm">API access</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Trial Notice */}
                        <div className="bg-[#202020] rounded-lg p-4 border border-[#575757]">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-[#D78E59] rounded-full flex items-center justify-center flex-shrink-0">
                                    <Check className="w-4 h-4 text-[#171717]" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[#EDECF8] mb-1">
                                        {selectedPlan.trial_days}-Day Free Trial
                                    </h4>
                                    <p className="text-[#828288] text-sm">
                                        Start your free trial today. You won&apos;t be charged until after your trial period ends.
                                        Cancel anytime during the trial with no commitment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}