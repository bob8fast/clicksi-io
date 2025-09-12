// app/subscription/success/page.tsx
'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptionPlans } from '@/hooks/api/subscription-hooks';
import
{
    ArrowRight,
    BarChart3,
    Calendar,
    CheckCircle,
    Crown,
    Download,
    Gift,
    Mail,
    Star,
    Users,
    Zap
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

const features = [
    {
        icon: Users,
        title: 'Connect with Partners',
        description: 'Start building relationships with brands and retailers',
        action: 'Browse Partners',
        link: '/partners',
    },
    {
        icon: BarChart3,
        title: 'Track Your Performance',
        description: 'Monitor your campaigns and engagement metrics',
        action: 'View Analytics',
        link: '/analytics',
    },
    {
        icon: Mail,
        title: 'Send Invitations',
        description: 'Invite potential partners to collaborate',
        action: 'Send Invites',
        link: '/invites',
    },
    {
        icon: Zap,
        title: 'Launch Campaigns',
        description: 'Create and manage marketing campaigns',
        action: 'Create Campaign',
        link: '/campaigns/create',
    },
];

const nextSteps = [
    {
        icon: Users,
        title: 'Complete Your Profile',
        description: 'Add your business information and preferences',
        action: 'Complete Profile',
        link: '/profile/edit',
    },
    {
        icon: Star,
        title: 'Explore the Platform',
        description: 'Take a tour of all available features',
        action: 'Start Tour',
        link: '/onboarding',
    },
    {
        icon: Mail,
        title: 'Connect with Support',
        description: 'Get help from our customer success team',
        action: 'Contact Support',
        link: '/contact',
    },
];

function SuccessPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planId = searchParams.get('plan');

    const { data: plans } = useSubscriptionPlans();
    const [confetti, setConfetti] = useState(true);

    // Find the selected plan from all plans
    const selectedPlan = plans?.find(p => p.id === planId);

    const nextSteps = [
        {
            icon: BarChart3,
            title: 'Complete Your Profile',
            description: 'Add your brand details to attract better partnerships',
            action: 'Edit Profile',
            link: '/profile',
        },
        {
            icon: Users,
            title: 'Browse Partners',
            description: 'Discover brands and retailers in your niche',
            action: 'Browse Now',
            link: '/partners',
        },
        {
            icon: Mail,
            title: 'Send Your First Invite',
            description: 'Start building your network with collaboration invites',
            action: 'Send Invites',
            link: '/invites',
        },
    ];

    useEffect(() =>
    {
        // Remove confetti after animation
        const timer = setTimeout(() => setConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#171717] to-[#090909] relative overflow-hidden">
            {/* Confetti Animation */}
            {confetti && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-bounce"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 3}s`,
                            }}
                        >
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: ['#D78E59', '#FFAA6C', '#EDECF8', '#575757'][Math.floor(Math.random() * 4)],
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="container mx-auto px-6 lg:px-8 py-8 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Success Header */}
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-16 h-16 text-white" />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-[#EDECF8] mb-4">
                            Welcome to Clicksi!
                        </h1>

                        <p className="text-xl text-[#828288] max-w-2xl mx-auto mb-6">
                            Your subscription to the <span className="text-[#D78E59] font-semibold">{selectedPlan.name} Plan</span> is now active.
                            Let&apos;s get you started on your journey to successful brand partnerships.
                        </p>

                        <div className="flex items-center justify-center gap-2 text-[#575757]">
                            <Crown className="w-5 h-5 text-[#D78E59]" />
                            <span>You&apos;re now on the {selectedPlan.name} plan</span>
                        </div>
                    </div>

                    {/* Plan Details */}
                    <Card className="bg-[#090909] border-[#D78E59] mb-12">
                        <CardHeader>
                            <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                <Gift className="w-5 h-5 text-[#D78E59]" />
                                Your Plan Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-[#D78E59] rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <Users className="w-8 h-8 text-[#171717]" />
                                    </div>
                                    <div className="text-2xl font-bold text-[#EDECF8] mb-1">
                                        {selectedPlan.max_connections === -1 ? 'Unlimited' : selectedPlan.max_connections}
                                    </div>
                                    <div className="text-[#828288] text-sm">Connections</div>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-[#FFAA6C] rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <Mail className="w-8 h-8 text-[#171717]" />
                                    </div>
                                    <div className="text-2xl font-bold text-[#EDECF8] mb-1">
                                        {selectedPlan.max_invites === -1 ? 'Unlimited' : selectedPlan.max_invites}
                                    </div>
                                    <div className="text-[#828288] text-sm">Monthly Invites</div>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-[#575757] rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <Calendar className="w-8 h-8 text-[#EDECF8]" />
                                    </div>
                                    <div className="text-2xl font-bold text-[#EDECF8] mb-1">
                                        {selectedPlan.trial_days}
                                    </div>
                                    <div className="text-[#828288] text-sm">Free Trial Days</div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-[#575757] text-center">
                                <p className="text-[#828288] mb-4">
                                    You won&apos;t be charged during your {selectedPlan.trial_days}-day free trial.
                                    Cancel anytime with no commitment.
                                </p>
                                <Button
                                    onClick={() => router.push('/subscription/manage')}
                                    variant="outline"
                                    className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                >
                                    Manage Subscription
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* What You Can Do Now */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-[#EDECF8] text-center mb-8">
                            What You Can Do Now
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <Card key={index} className="bg-[#090909] border-[#202020] hover:border-[#575757] transition-colors">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-[#202020] rounded-xl flex items-center justify-center">
                                                <feature.icon className="w-6 h-6 text-[#D78E59]" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-[#EDECF8] mb-2">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-[#828288] mb-4">
                                                    {feature.description}
                                                </p>
                                                <Button
                                                    onClick={() => router.push(feature.link)}
                                                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717]"
                                                >
                                                    {feature.action}
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Next Steps */}
                    <Card className="bg-[#090909] border-[#202020] mb-12">
                        <CardHeader>
                            <CardTitle className="text-[#EDECF8] text-center">
                                Recommended Next Steps
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {nextSteps.map((step, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-[#202020] rounded-lg hover:bg-[#575757] transition-colors">
                                        <div className="w-8 h-8 bg-[#D78E59] rounded-full flex items-center justify-center text-[#171717] font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <step.icon className="w-6 h-6 text-[#D78E59]" />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-[#EDECF8]">{step.title}</h4>
                                            <p className="text-[#828288] text-sm">{step.description}</p>
                                        </div>
                                        <Button
                                            onClick={() => router.push(step.link)}
                                            size="sm"
                                            variant="outline"
                                            className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                        >
                                            {step.action}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Receipt/Invoice */}
                    <Card className="bg-[#090909] border-[#202020] mb-12">
                        <CardHeader>
                            <CardTitle className="text-[#EDECF8] flex items-center gap-2">
                                <Download className="w-5 h-5" />
                                Subscription Receipt
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-[#EDECF8] mb-1">
                                        {selectedPlan.name} Plan Subscription
                                    </h3>
                                    <p className="text-[#828288] text-sm">
                                        Your receipt has been sent to your email address
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                    onClick={() => window.open('/invoices/latest.pdf', '_blank')}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Receipt
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* CTA Section */}
                    <div className="text-center">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-2xl font-bold text-[#EDECF8] mb-4">
                                Ready to Start Building Partnerships?
                            </h2>
                            <p className="text-[#828288] mb-8">
                                Your journey to successful brand collaborations begins now.
                                Let&apos;s help you make the most of your Clicksi subscription.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    onClick={() => router.push('/dashboard')}
                                    className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] font-semibold px-8 py-3"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                                <Button
                                    onClick={() => router.push('/onboarding')}
                                    variant="outline"
                                    className="border-[#575757] text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] px-8 py-3"
                                >
                                    Take Platform Tour
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SubscriptionSuccessPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-6 lg:px-8 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-[#828288]">Loading...</p>
                </div>
            </div>
        }>
            <SuccessPageContent />
        </Suspense>
    );
}