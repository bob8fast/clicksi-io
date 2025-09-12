'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CookiePolicyPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#090909] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <Card className="bg-[#171717] border-[#575757]">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-[#EDECF8]">Cookie Policy</CardTitle>
                        <p className="text-[#828288] mt-2">Last updated: {new Date().toLocaleDateString()}</p>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none">
                        <div className="space-y-6 text-[#EDECF8]">
                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-[#D78E59]">1. Introduction</h2>
                                <p className="text-[#828288] mb-4">
                                    This Cookie Policy explains how Clicksi ("we", "us", or "our") uses cookies and similar technologies 
                                    to recognize you when you visit our website at clicksi.io. It explains what these technologies are and 
                                    why we use them, as well as your rights to control our use of them.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-[#D78E59]">2. What are cookies?</h2>
                                <p className="text-[#828288] mb-4">
                                    Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
                                    Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, 
                                    as well as to provide reporting information.
                                </p>
                                <p className="text-[#828288] mb-4">
                                    Cookies set by the website owner (in this case, Clicksi) are called "first party cookies". Cookies set by 
                                    parties other than the website owner are called "third party cookies". Third party cookies enable third party 
                                    features or functionality to be provided on or through the website (e.g. like advertising, interactive content 
                                    and analytics).
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-[#D78E59]">3. Why do we use cookies?</h2>
                                <p className="text-[#828288] mb-4">
                                    We use first and third party cookies for several reasons. Some cookies are required for technical reasons in 
                                    order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. 
                                    Other cookies also enable us to track and target the interests of our users to enhance the experience on our 
                                    website. Third parties serve cookies through our website for advertising, analytics and other purposes.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-[#D78E59]">4. Types of cookies we use</h2>
                                
                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold mb-3 text-[#FFAA6C]">Essential cookies</h3>
                                    <p className="text-[#828288] mb-2">
                                        These cookies are strictly necessary to provide you with services available through our website and to use 
                                        some of its features, such as access to secure areas.
                                    </p>
                                    <ul className="list-disc pl-6 text-[#828288] space-y-2">
                                        <li>Authentication cookies</li>
                                        <li>Security cookies</li>
                                        <li>User preference cookies</li>
                                    </ul>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold mb-3 text-[#FFAA6C]">Analytics cookies</h3>
                                    <p className="text-[#828288] mb-2">
                                        These cookies collect information that is used either in aggregate form to help us understand how our 
                                        website is being used or how effective our marketing campaigns are, or to help us customize our website 
                                        for you.
                                    </p>
                                    <ul className="list-disc pl-6 text-[#828288] space-y-2">
                                        <li>Google Analytics cookies</li>
                                        <li>Performance monitoring cookies</li>
                                        <li>User behavior tracking cookies</li>
                                    </ul>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold mb-3 text-[#FFAA6C]">Advertising cookies</h3>
                                    <p className="text-[#828288] mb-2">
                                        These cookies are used to make advertising messages more relevant to you. They perform functions like 
                                        preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for 
                                        advertisers, and in some cases selecting advertisements that are based on your interests.
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold mb-3 text-[#FFAA6C]">Social Media cookies</h3>
                                    <p className="text-[#828288] mb-2">
                                        These cookies are used when you share information using a social media sharing button or "like" button 
                                        on our website or you link your account or engage with our content on or through a social networking 
                                        website such as Facebook, Twitter or Instagram.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-[#D78E59]">5. How can you control cookies?</h2>
                                <p className="text-[#828288] mb-4">
                                    You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by 
                                    setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select 
                                    which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly 
                                    necessary to provide you with services.
                                </p>
                                <p className="text-[#828288] mb-4">
                                    You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject 
                                    cookies, you may still use our website though your access to some functionality and areas of our website 
                                    may be restricted.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-[#D78E59]">6. Updates to this Cookie Policy</h2>
                                <p className="text-[#828288] mb-4">
                                    We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies 
                                    we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy 
                                    regularly to stay informed about our use of cookies and related technologies.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-[#D78E59]">7. Contact us</h2>
                                <p className="text-[#828288] mb-4">
                                    If you have any questions about our use of cookies or other technologies, please contact us at:
                                </p>
                                <div className="bg-[#202020] p-4 rounded-lg border border-[#575757]">
                                    <p className="text-[#EDECF8]">Clicksi</p>
                                    <p className="text-[#828288]">Email: <a href="mailto:privacy@clicksi.io" className="text-[#D78E59] hover:text-[#FFAA6C]">privacy@clicksi.io</a></p>
                                    <p className="text-[#828288]">Address: [Your Company Address]</p>
                                </div>
                            </section>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <p className="text-[#828288] text-sm">
                        See also: {' '}
                        <Link href="/privacy-policy" className="text-[#D78E59] hover:text-[#FFAA6C]">
                            Privacy Policy
                        </Link>
                        {' | '}
                        <Link href="/terms-of-service" className="text-[#D78E59] hover:text-[#FFAA6C]">
                            Terms of Service
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}