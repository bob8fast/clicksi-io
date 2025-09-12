'use client'

import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

interface FooterProps {
    className?: string;
}

const Footer = ({ className = '' }: FooterProps) =>
{
    // Since authentication is removed, always show guest links
    const isAuthenticated = false;

    // Footer links for authenticated users
    const authLinks = {
        platform: [
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/campaigns', label: 'Campaigns' },
            { href: '/analytics', label: 'Analytics' },
            { href: '/help', label: 'Help Center' },
        ],
        account: [
            { href: '/profile', label: 'Profile' },
            { href: '/settings', label: 'Settings' },
            { href: '/billing', label: 'Billing' },
            { href: '/referrals', label: 'Referrals' },
        ],
    };

    // Footer links for guests
    const guestLinks = {
        quickLinks: [
            { href: '/', label: 'Home' },
            { href: '/#brands', label: 'Brands' },
            { href: '/#creators', label: 'Creators' },
            { href: '/#contact', label: 'Contact' },
        ],
        legal: [
            { href: '/privacy-policy', label: 'Privacy Policy' },
            { href: '/terms-of-service', label: 'Terms of Service' },
            { href: '/cookie-policy', label: 'Cookie Policy' },
        ],
    };

    return (
        <footer className={`bg-[#090909] text-[#EDECF8] py-16 border-t border-[#202020] ${className}`}>
            <div className="container mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Logo and Description */}
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold text-[#EDECF8] mb-4">CLICKSI</h2>
                        <p className="text-[#828288] mb-6 leading-relaxed">
                            Where Ukrainian beauty brands and creators unite to create impactful collaborations and unforgettable content.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#828288] hover:text-[#D78E59] transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook size={24} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#828288] hover:text-[#D78E59] transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter size={24} />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#828288] hover:text-[#D78E59] transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram size={24} />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#828288] hover:text-[#D78E59] transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Links - Dynamic based on auth state */}
                    {isAuthenticated ? (
                        <>
                            <div>
                                <h3 className="text-lg font-bold mb-4 text-[#EDECF8]">Platform</h3>
                                <ul className="space-y-3">
                                    {authLinks.platform.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="text-[#828288] hover:text-[#D78E59] transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-4 text-[#EDECF8]">Account</h3>
                                <ul className="space-y-3">
                                    {authLinks.account.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="text-[#828288] hover:text-[#D78E59] transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <h3 className="text-lg font-bold mb-4 text-[#EDECF8]">Quick Links</h3>
                                <ul className="space-y-3">
                                    {guestLinks.quickLinks.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="text-[#828288] hover:text-[#D78E59] transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-4 text-[#EDECF8]">Legal</h3>
                                <ul className="space-y-3">
                                    {guestLinks.legal.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="text-[#828288] hover:text-[#D78E59] transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[#202020]">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-[#575757] text-sm">
                            © {new Date().getFullYear()} Clicksi. All rights reserved.
                        </p>
                        <p className="text-[#575757] text-sm">
                            Contact: <a href="mailto:tetiana.piatkovska@clicksi.io" className="text-[#D78E59] hover:text-[#FFAA6C] transition-colors">tetiana.piatkovska@clicksi.io</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;