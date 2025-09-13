'use client'

import CalendlyWrapper from '@/components/integrations/Calendly/CalendlyWrapper';
import Modal from '@/components/integrations/Modal';
import TallyForm from '@/components/integrations/Tally/TallyForm';
import
{
    BrandDroplet,
    BrandFlower,
    BrandLeaf,
    BrandSparkle,
    FeatureAward,
    FeatureUsers,
    FeatureZap
} from '@/components/icons/ClicksiIcons';
import { Calendar, ChevronRight, Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const HomePage = () =>
{
    const tallyFormId = process.env.NEXT_PUBLIC_CONTACT_WITH_US_TALLY_FORM_ID || '';
    const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '';

    const [isTallyModalOpen, setIsTallyModalOpen] = useState(false);
    const [isCalendlyModalOpen, setIsCalendlyModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
    });
    const [modalDimensions, setModalDimensions] = useState({ width: 0, height: 0 });

    return (
        <div className="min-h-screen">
            {/* Hero Section - Full width background */}
            <section className="relative bg-gradient-to-b from-[#171717] to-[#090909]">
                <div className="container mx-auto px-6 lg:px-8 py-24 md:py-32">
                    <div className="max-w-6xl">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#EDECF8] mb-6 leading-tight">
                            Connect with <span className="text-[#D78E59]">Clicksi</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-[#828288] max-w-2xl mb-8 leading-relaxed">
                            Where Ukrainian beauty brands and creators unite to create impactful collaborations and unforgettable content
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => setIsJoinModalOpen(true)}
                                className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                            >
                                Explore Opportunities <ChevronRight size={20} />
                            </button>
                            <button
                                onClick={() => setIsTallyModalOpen(true)}
                                className="bg-transparent hover:bg-[#202020] text-[#EDECF8] font-bold py-3 px-8 rounded-lg border-2 border-[#575757] transition-colors flex items-center justify-center gap-2"
                            >
                                Learn More <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brands Section */}
            <section id="brands" className="bg-[#090909] py-20">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EDECF8] mb-6">
                            Trusted by Top Brands
                        </h2>
                        <p className="text-[#828288] text-lg max-w-2xl mx-auto">
                            We've partnered with industry leaders to bring the best opportunities to our creator community
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        <div className="group">
                            <div className="bg-[#171717] p-8 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-[#202020] group-hover:scale-105 border border-[#202020] shadow-lg">
                                <BrandDroplet className="w-20 h-20 mb-4" />
                                <span className="font-bold text-[#EDECF8] text-lg">YASA Beauty</span>
                            </div>
                        </div>

                        <div className="group">
                            <div className="bg-[#171717] p-8 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-[#202020] group-hover:scale-105 border border-[#202020] shadow-lg">
                                <BrandSparkle className="w-20 h-20 mb-4" />
                                <span className="font-bold text-[#EDECF8] text-lg">Mirra Cosmetics</span>
                            </div>
                        </div>

                        <div className="group">
                            <div className="bg-[#171717] p-8 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-[#202020] group-hover:scale-105 border border-[#202020] shadow-lg">
                                <BrandFlower className="w-20 h-20 mb-4" />
                                <span className="font-bold text-[#EDECF8] text-lg">Riche Cosmetics</span>
                            </div>
                        </div>

                        <div className="group">
                            <div className="bg-[#171717] p-8 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 group-hover:bg-[#202020] group-hover:scale-105 border border-[#202020] shadow-lg">
                                <BrandLeaf className="w-20 h-20 mb-4" />
                                <span className="font-bold text-[#EDECF8] text-lg">Ziaja Ukraine</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Creator Info Section */}
            <section id="creators" className="bg-[#171717] py-20">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EDECF8] mb-6">
                            For Creators, By Creators
                        </h2>
                        <p className="text-[#828288] text-lg max-w-2xl mx-auto">
                            Join our thriving community of content creators who are taking their brands to the next level
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                        <div className="bg-[#090909] p-8 rounded-2xl border border-[#202020] hover:border-[#575757] transition-all duration-300 shadow-lg">
                            <div className="w-16 h-16 bg-[#202020] rounded-xl flex items-center justify-center mb-6">
                                <FeatureUsers className="w-10 h-10 text-[#828288]" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-[#EDECF8]">Growing Community</h3>
                            <p className="text-[#828288] leading-relaxed">
                                Join thousands of creators who are building their brand and monetizing their content through our platform.
                            </p>
                        </div>

                        <div className="bg-[#090909] p-8 rounded-2xl border border-[#202020] hover:border-[#575757] transition-all duration-300 shadow-lg">
                            <div className="w-16 h-16 bg-[#202020] rounded-xl flex items-center justify-center mb-6">
                                <FeatureAward className="w-10 h-10 text-[#D78E59]" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-[#EDECF8]">Quality Partnerships</h3>
                            <p className="text-[#828288] leading-relaxed">
                                We curate brand deals that align with your content and values, ensuring authentic collaborations.
                            </p>
                        </div>

                        <div className="bg-[#090909] p-8 rounded-2xl border border-[#202020] hover:border-[#575757] transition-all duration-300 shadow-lg">
                            <div className="w-16 h-16 bg-[#202020] rounded-xl flex items-center justify-center mb-6">
                                <FeatureZap className="w-10 h-10 text-[#FFAA6C]" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-[#EDECF8]">Powerful Tools</h3>
                            <p className="text-[#828288] leading-relaxed">
                                Access analytics, collaboration management, and payment tools designed specifically for content creators.
                            </p>
                        </div>
                    </div>

                    {/* Creator spotlight */}
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-[#090909] rounded-2xl overflow-hidden border border-[#202020] shadow-xl">
                            <div className="flex flex-col md:flex-row">
                                <div className="md:w-1/2 p-8 md:p-12">
                                    <h3 className="text-3xl font-bold mb-6 text-[#EDECF8]">Creator Spotlight</h3>
                                    <p className="mb-8 text-[#828288] leading-relaxed">
                                        Our platform helped thousands of creators grow their audience and increase their revenue by an average of 40% within the first 6 months.
                                    </p>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-[#D78E59] mr-4"></div>
                                        <div>
                                            <p className="font-semibold text-[#EDECF8]">Sarah Johnson</p>
                                            <p className="text-[#575757]">Travel & Lifestyle Creator</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-1/2 p-8 md:p-12 bg-[#202020]">
                                    <div className="flex mb-6 gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg key={star} className="w-6 h-6 text-[#FFAA6C]" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-[#828288] italic mb-8 leading-relaxed">
                                        "Since joining Clicksi, I've collaborated with 3 major Ukrainian beauty brands that perfectly align with my content. The team made the process seamless, and I've seen a significant boost in engagement and income."
                                    </p>
                                    <button className="text-[#D78E59] font-semibold flex items-center hover:text-[#FFAA6C] transition-colors text-sm">
                                        Read the full story →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="bg-[#090909] py-20">
                <div className="container mx-auto px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#EDECF8] mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-[#828288] text-lg mb-10 leading-relaxed">
                            Whether you're a brand looking for creators or a creator seeking partnerships, we're here to help you succeed.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => setIsTallyModalOpen(true)}
                                className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] font-bold py-4 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                            >
                                <Mail size={20} />
                                Contact Us
                            </button>
                            <button
                                onClick={() => setIsCalendlyModalOpen(true)}
                                className="bg-transparent hover:bg-[#202020] text-[#EDECF8] font-bold py-4 px-8 rounded-lg border-2 border-[#575757] transition-colors flex items-center justify-center gap-2"
                            >
                                <Calendar size={20} />
                                Schedule a Call
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modals */}
            <Modal
                isOpen={isTallyModalOpen}
                onClose={() => setIsTallyModalOpen(false)}
                title="Get in Touch"
                setModalDimensions={setModalDimensions}
                maxWidthClass="max-w-2xl"
            >
                {isTallyModalOpen && (
                    <TallyForm
                        formId={tallyFormId}
                        title="Join Clicksi"
                        className="bg-[#202020] rounded-xl"
                        modalDimensions={modalDimensions}
                        alignLeft={false}
                        hideTitle={false}
                        transparentBackground={false}
                        onSubmit={(formData) =>
                        {
                            setUserData({
                                name: formData.name || formData.full_name || '',
                                email: formData.email || formData.email_address || ''
                            });

                            setTimeout(() =>
                            {
                                setIsTallyModalOpen(false);
                                toast.success('Thank you for connecting with Clicksi! We\'ll be in touch soon.');
                                setIsCalendlyModalOpen(true);
                            }, 1500);
                        }}
                    />
                )}
            </Modal>

            <Modal
                isOpen={isCalendlyModalOpen}
                onClose={() => setIsCalendlyModalOpen(false)}
                title="Schedule a Consultation"
                setModalDimensions={setModalDimensions}
                maxWidthClass="max-w-3xl"
            >
                <p className="text-[#828288] mb-6">
                    Book a 30-minute consultation with our team to discuss how Clicksi can help you grow.
                </p>
                <CalendlyWrapper
                    url={calendlyUrl}
                    modalDimensions={modalDimensions}
                    prefill={{
                        name: userData.name,
                        email: userData.email
                    }}
                />
            </Modal>

            <Modal
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
                title="Join Clicksi"
                setModalDimensions={setModalDimensions}
                maxWidthClass="max-w-2xl"
            >
                {isJoinModalOpen && (
                    <TallyForm
                        formId={tallyFormId}
                        title="Join Clicksi"
                        className="bg-[#202020] rounded-xl"
                        modalDimensions={modalDimensions}
                        alignLeft={false}
                        hideTitle={false}
                        transparentBackground={false}
                        onSubmit={(formData) =>
                        {
                            setUserData({
                                name: formData.name || formData.full_name || '',
                                email: formData.email || formData.email_address || ''
                            });

                            setTimeout(() =>
                            {
                                setIsJoinModalOpen(false);
                                toast.success('Thank you for joining Clicksi! We\'ll be in touch soon.');
                            }, 1500);
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default HomePage;