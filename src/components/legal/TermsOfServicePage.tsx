'use client'

import { ClicksiLogo } from '@/components/icons/ClicksiIcons';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const TermsOfServicePage = () =>
{
    return (
        <div className="min-h-screen bg-[#171717] flex flex-col">
            {/* Content */}
            <div className="flex-grow">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
                    <h1 className="text-5xl font-bold text-[#EDECF8] mb-8">Terms of Service</h1>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-[#828288] mb-6">
                            <strong>Effective Date: January 1, 2025</strong>
                        </p>

                        <section className="mb-10">
                            <h2 className="text-3xl font-bold text-[#EDECF8] mb-4">1. Acceptance of Terms</h2>
                            <p className="text-[#828288] mb-4 leading-relaxed">
                                By accessing or using Clicksi's platform and services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-3xl font-bold text-[#EDECF8] mb-4">2. Description of Services</h2>
                            <p className="text-[#828288] mb-4">
                                Clicksi provides a platform that connects beauty brands with content creators for marketing collaborations, sponsorships, and promotional campaigns. Our services include:
                            </p>
                            <ul className="list-disc pl-6 text-[#828288] mb-4 space-y-2">
                                <li>Matching brands with suitable content creators</li>
                                <li>Facilitating communication and negotiations</li>
                                <li>Managing collaboration workflows</li>
                                <li>Providing analytics and reporting tools</li>
                                <li>Processing payments between parties</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-3xl font-bold text-[#EDECF8] mb-4">3. User Accounts</h2>
                            <h3 className="text-2xl font-semibold text-[#EDECF8] mb-3">Account Registration</h3>
                            <p className="text-[#828288] mb-4">
                                To use certain features of our platform, you must create an account. You agree to:
                            </p>
                            <ul className="list-disc pl-6 text-[#828288] mb-6 space-y-2">
                                <li>Provide accurate and complete information</li>
                                <li>Maintain the security of your account credentials</li>
                                <li>Promptly update any changes to your information</li>
                                <li>Be responsible for all activities under your account</li>
                            </ul>

                            <h3 className="text-2xl font-semibold text-[#EDECF8] mb-3">Account Types</h3>
                            <ul className="list-disc pl-6 text-[#828288] mb-4 space-y-2">
                                <li><strong className="text-[#EDECF8]">Brand Accounts:</strong> For businesses seeking content creators</li>
                                <li><strong className="text-[#EDECF8]">Creator Accounts:</strong> For individuals creating content</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-3xl font-bold text-[#EDECF8] mb-4">4. User Conduct</h2>
                            <p className="text-[#828288] mb-4">You agree not to:</p>
                            <ul className="list-disc pl-6 text-[#828288] mb-4 space-y-2">
                                <li>Violate any applicable laws or regulations</li>
                                <li>Infringe on intellectual property rights</li>
                                <li>Post false, misleading, or fraudulent content</li>
                                <li>Harass, abuse, or harm other users</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Use our platform for illegal or unauthorized purposes</li>
                                <li>Circumvent our fee structure</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-3xl font-bold text-[#EDECF8] mb-4">5. Content and Intellectual Property</h2>
                            <h3 className="text-2xl font-semibold text-[#EDECF8] mb-3">User Content</h3>
                            <p className="text-[#828288] mb-4 leading-relaxed">
                                You retain ownership of content you post on our platform. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content for platform operations.
                            </p>

                            <h3 className="text-2xl font-semibold text-[#EDECF8] mb-3">Platform Content</h3>
                            <p className="text-[#828288] mb-4 leading-relaxed">
                                All platform content, including design, text, graphics, and software, is owned by Clicksi and protected by intellectual property laws.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-3xl font-bold text-[#EDECF8] mb-4">6. Payments and Fees</h2>
                            <h3 className="text-2xl font-semibold text-[#EDECF8] mb-3">Service Fees</h3>
                            <p className="text-[#828288] mb-4">
                                Clicksi charges service fees for successful collaborations facilitated through our platform. Current fee structure:
                            </p>
                            <ul className="list-disc pl-6 text-[#828288] mb-6 space-y-2">
                                <li>Platform fee: 15% of collaboration value</li>
                                <li>Payment processing fees may apply</li>
                            </ul>

                            <h3 className="text-2xl font-semibold text-[#EDECF8] mb-3">Payment Terms</h3>
                            <ul className="list-disc pl-6 text-[#828288] mb-4 space-y-2">
                                <li>Brands pay through our secure payment system</li>
                                <li>Creators receive payments after successful campaign completion</li>
                                <li>All payments are subject to our fee structure</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-3xl font-bold text-[#EDECF8] mb-4">7. Disclaimers and Limitations</h2>
                            <h3 className="text-2xl font-semibold text-[#EDECF8] mb-3">Platform Role</h3>
                            <p className="text-[#828288] mb-4">
                                Clicksi acts as an intermediary platform. We are not responsible for:
                            </p>
                            <ul className="list-disc pl-6 text-[#828288] mb-6 space-y-2">
                                <li>The quality of collaborations between users</li>
                                <li>Content created by users</li>
                                <li>Disputes between brands and creators</li>
                                <li>Compliance with advertising regulations</li>
                            </ul>

                            <h3 className="text-2xl font-semibold text-[#EDECF8] mb-3">Service Availability</h3>
                            <p className="text-[#828288] mb-4 leading-relaxed">
                                We strive for continuous service but do not guarantee uninterrupted access. Services are provided "as is" without warranties.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-3xl font-bold text-[#EDECF8] mb-4">8. Indemnification</h2>
                            <p className="text-[#828288] mb-4 leading-relaxed">
                                You agree to indemnify and hold harmless Clicksi, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of our services or violation of these Terms.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-3xl font-bold text-[#EDECF8] mb-4">9. Dispute Resolution</h2>
                            <p className="text-[#828288] mb-4">
                                Any disputes arising from these Terms or your use of our services shall be resolved through:
                            </p>
                            <ol className="list-decimal pl-6 text-[#828288] mb-4 space-y-2">
                                <li>Good faith negotiations</li>
                                <li>Mediation, if negotiations fail</li>
                                <li>Binding arbitration, as a last resort</li>
                            </ol>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-3xl font-bold text-[#EDECF8] mb-4">10. Account Termination</h2>
                            <p className="text-[#828288] mb-4 leading-relaxed">
                                We reserve the right to suspend or terminate accounts that violate these Terms. Users may also close their accounts at any time.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-3xl font-bold text-[#EDECF8] mb-4">11. Modifications to Terms</h2>
                            <p className="text-[#828288] mb-4 leading-relaxed">
                                We may update these Terms periodically. Continued use of our services after changes constitutes acceptance of the modified Terms.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-3xl font-bold text-[#EDECF8] mb-4">12. Governing Law</h2>
                            <p className="text-[#828288] mb-4 leading-relaxed">
                                These Terms are governed by the laws of Ukraine, without regard to conflict of law principles.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-3xl font-bold text-[#EDECF8] mb-4">13. Contact Information</h2>
                            <p className="text-[#828288] mb-4">
                                For questions about these Terms, please contact us at:
                            </p>
                            <div className="bg-[#090909] p-6 rounded-xl border border-[#202020]">
                                <p className="text-[#828288]">
                                    <strong className="text-[#EDECF8]">Clicksi</strong><br />
                                    Email: <a href="mailto:tetiana.piatkovska@clicksi.io" className="text-[#D78E59] hover:text-[#FFAA6C]">tetiana.piatkovska@clicksi.io</a><br />
                                    Address: Kyiv, Ukraine
                                </p>
                            </div>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-3xl font-bold text-[#EDECF8] mb-4">14. Entire Agreement</h2>
                            <p className="text-[#828288] mb-4 leading-relaxed">
                                These Terms constitute the entire agreement between you and Clicksi regarding the use of our services.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;