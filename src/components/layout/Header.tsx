'use client'

// import RegisterModal from '@/components/features/auth/RegisterModal'; // Removed auth
// import SignInModal from '@/components/features/auth/SignInModal'; // Removed auth
import { ClicksiLogo } from '@/components/icons/ClicksiIcons';
import MobileMenu from '@/components/layout/MobileMenu';
import FullscreenSearch from '@/components/layout/search/FullscreenSearch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getRoleBasedMenuItems } from '@/config/menu-config';
import { useDeviceDetection } from '@/hooks/system/use-device-detection';
import { NavBarItem } from '@/types/page-types';
import
{
    Bell,
    ChevronDown,
    Home,
    LogOut,
    Menu,
    Package,
    Search,
    SearchX,
    Settings,
    TrendingUp,
    User,
    Users,
    X
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

const Header = () =>
{
    // Mock session since next-auth is removed
    const session = null;
    const { isMobile, windowWidth } = useDeviceDetection();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const router = useRouter();
    const previousWindowWidthRef = useRef(windowWidth);
    // Since authentication is removed, always treat as unauthenticated
    const isAuthenticated = false;

    // Define breakpoints for groups
    const isLargeScreen = windowWidth >= 1280; // Group 1: Full menu + search bar + auth
    const isMediumScreen = windowWidth >= 768 && windowWidth < 1280; // Group 2: Search icon + auth + menu icon
    const isSmallScreen = windowWidth < 768; // Group 3: Search icon + menu icon

    // Close all overlays on route change
    useEffect(() =>
    {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
    }, [router]);

    // Handle window resize to close inappropriate menus
    useEffect(() =>
    {
        const previousWidth = previousWindowWidthRef.current;

        // Check if we've crossed a breakpoint
        const wasLargeScreen = previousWidth >= 1280;
        const wasMediumScreen = previousWidth >= 768 && previousWidth < 1280;
        const wasSmallScreen = previousWidth < 768;

        // Close menus if they're not supported on the new screen size
        if ((wasLargeScreen && !isLargeScreen) ||
            (wasMediumScreen && !isMediumScreen) ||
            (wasSmallScreen && !isSmallScreen))
        {

            // Close search if moving to large screen (which has integrated search)
            if (isLargeScreen && isSearchOpen)
            {
                setIsSearchOpen(false);
            }

            // Close desktop menu if moving away from medium screen
            if (!isMediumScreen && isMenuOpen && wasMediumScreen)
            {
                setIsMenuOpen(false);
            }

            // Close mobile menu if moving away from small screen
            if (!isSmallScreen && isMenuOpen && wasSmallScreen)
            {
                setIsMenuOpen(false);
            }

            // Close mobile search if moving to large screen
            if (isLargeScreen && isSearchOpen)
            {
                setIsSearchOpen(false);
            }
        }

        previousWindowWidthRef.current = windowWidth;
    }, [windowWidth, isLargeScreen, isMediumScreen, isSmallScreen, isMenuOpen, isSearchOpen]);

    const handleSignOut = async () =>
    {
        // Sign out functionality removed with next-auth
        console.log('Sign out functionality removed');
        router.push('/');
    };

    // Handle mutually exclusive menu/search
    const handleSearchToggle = () =>
    {
        if (isMenuOpen) setIsMenuOpen(false);
        setIsSearchOpen(!isSearchOpen);
    };

    const handleMenuToggle = () =>
    {
        if (isSearchOpen) setIsSearchOpen(false);
        setIsMenuOpen(!isMenuOpen);
    };

    // Memoized search button to avoid duplication
    const searchButton = useMemo(() => (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleSearchToggle}
            className="text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
        >
            {isSearchOpen ? <SearchX size={20} /> : <Search size={20} />}
        </Button>
    ), [isSearchOpen, handleSearchToggle]);

    // Navigation items
    const authNavItems: NavBarItem[] = [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/campaigns', label: 'Campaigns', icon: TrendingUp },
        { href: '/analytics', label: 'Analytics', icon: Package },
        { href: '/messages', label: 'Messages', icon: Users },
    ];

    const guestNavItems: NavBarItem[] = [
        {
            href: '/',
            label: 'Home',
            submenu: []
        },
        {
            href: '/#brands',
            label: 'Brands',
            submenu: [
                { href: '/', label: 'Beauty & Cosmetics' },
                { href: '/', label: 'Wellness & Health' },
                { href: '/', label: 'Fashion & Style' },
                // { href: '/brands/beauty', label: 'Beauty & Cosmetics' },
                // { href: '/brands/wellness', label: 'Wellness & Health' },
                // { href: '/brands/fashion', label: 'Fashion & Style' },
            ]
        },
        {
            href: '/#creators',
            label: 'Creators',
            submenu: [
                { href: '/', label: 'Influencers' },
                { href: '/', label: 'Bloggers' },
                { href: '/', label: 'Success Stories' },
                // { href: '/creators/influencers', label: 'Influencers' },
                // { href: '/creators/bloggers', label: 'Bloggers' },
                // { href: '/creators/success-stories', label: 'Success Stories' },
            ]
        },
        {
            href: '/#contact',
            label: 'Contact',
            submenu: []
        },
                {
            href: '/faq',
            label: 'FAQ',
            submenu: []
        },
        {
            href: '/demo-menu',
            label: 'Demo',
            submenu: []
        },
    ];

    const navItems = isAuthenticated ? authNavItems : guestNavItems;

    // Get role-based menu items using shared config (empty since no session)
    const roleBasedMenuItems = getRoleBasedMenuItems(null, null);

    // Auth Group Component
    const AuthGroup = () => (
        <>
            {isAuthenticated ? (
                <>
                    {/* Search Icon - Always visible for all screen sizes when authenticated */}
                    {searchButton}

                    {/* Notifications */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                            >
                                <Bell size={20} />
                                {notifications.length > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 bg-[#D78E59] text-xs">
                                        {notifications.length}
                                    </Badge>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-[#171717] border-[#575757] w-80">
                            <div className="p-4">
                                <h3 className="font-semibold text-[#EDECF8] mb-3">Notifications</h3>
                                {notifications.length === 0 ? (
                                    <p className="text-[#828288] text-sm">No new notifications</p>
                                ) : (
                                    <div>Notification items here</div>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* User Menu */}
                    <Popover open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex items-center space-x-2 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                            >
                                <User size={20} />
                                {isLargeScreen && (
                                    <span className="font-medium">
                                        Account
                                    </span>
                                )}
                                <ChevronDown size={16} />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-[#171717] border-[#575757] w-56 p-0">
                            <div className="py-2">
                                {/* Role-based menu items */}
                                {roleBasedMenuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center px-4 py-2 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] transition-colors"
                                    >
                                        <item.icon size={16} className="mr-2" />
                                        {item.label}
                                    </Link>
                                ))}

                                {roleBasedMenuItems.length > 0 && (
                                    <div className="my-2 border-t border-[#575757]" />
                                )}

                                <Link
                                    href="/profile"
                                    className="flex items-center px-4 py-2 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] transition-colors"
                                >
                                    <User size={16} className="mr-2" />
                                    Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="flex items-center px-4 py-2 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] transition-colors"
                                >
                                    <Settings size={16} className="mr-2" />
                                    Settings
                                </Link>
                                <div className="my-2 border-t border-[#575757]" />
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center w-full px-4 py-2 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] transition-colors"
                                >
                                    <LogOut size={16} className="mr-2" />
                                    Sign Out
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </>
            ) : (
                <>
                    {/* Search Icon for guests */}
                    {searchButton}

                    {/* Sign In button - only show on large screens */}
                    {isLargeScreen && (
                        <Button
                            onClick={() => setIsLoginModalOpen(true)}
                            variant="ghost"
                            className="text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                        >
                            Sign In
                        </Button>
                    )}
                    <Button
                        onClick={() => router.push('/register')}
                        className="bg-[#D78E59] hover:bg-[#FFAA6C] text-[#171717] font-semibold"
                    >
                        Join Now
                    </Button>
                </>
            )}
        </>
    );

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#090909] border-b border-[#202020]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex justify-between items-center h-16">
                        {/* Logo - Always visible */}
                        <Link href={isAuthenticated ? '/dashboard' : '/'} className="flex items-center">
                            <ClicksiLogo className="h-8 w-auto text-[#EDECF8]" />
                        </Link>

                        {/* Group 1: Full menu + auth (Large screens) */}
                        {isLargeScreen && (
                            <>
                                {/* Navigation Links */}
                                <div className="flex items-center space-x-8 ml-8">
                                    {navItems.map((item) => (
                                        item.submenu && item.submenu.length > 0 ? (
                                            <Popover key={item.href}>
                                                <PopoverTrigger asChild>
                                                    <button className="flex items-center text-[#828288] hover:text-[#EDECF8] text-lg font-semibold transition-all duration-200">
                                                        {item.label}
                                                        <ChevronDown className="ml-1 h-4 w-4" />
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="bg-[#171717] border-[#575757] w-56 p-0">
                                                    <div className="py-2">
                                                        {item.submenu.map((subItem) => (
                                                            <Link
                                                                key={subItem.href}
                                                                href={subItem.href}
                                                                className="block px-4 py-2 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] transition-colors"
                                                            >
                                                                {subItem.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        ) : (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="text-[#828288] hover:text-[#EDECF8] text-lg font-semibold transition-all duration-200 relative group"
                                            >
                                                {item.icon && <item.icon className="inline-block mr-2 h-5 w-5" />}
                                                {item.label}
                                                <span className="absolute bottom-[-4px] left-0 right-0 h-[2px] bg-[#D78E59] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center"></span>
                                            </Link>
                                        )
                                    ))}
                                </div>

                                {/* Spacer */}
                                <div className="flex-1" />

                                {/* Auth Group */}
                                <div className="flex items-center space-x-4">
                                    <AuthGroup />
                                </div>
                            </>
                        )}

                        {/* Group 2: Auth + menu icon (Medium screens) */}
                        {isMediumScreen && (
                            <div className="flex items-center space-x-4">
                                <AuthGroup />

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleMenuToggle}
                                    className="text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                >
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </Button>
                            </div>
                        )}

                        {/* Group 3: Auth + menu icon (Small screens/Mobile) */}
                        {isSmallScreen && (
                            <div className="flex items-center space-x-3">
                                <AuthGroup />

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleMenuToggle}
                                    className="text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020]"
                                >
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            {/* Full-screen Search - Used for all screen sizes */}
            <FullscreenSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Mobile Menu (for small and medium screens) */}
            {(isSmallScreen || isMediumScreen) && (
                <MobileMenu
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    navItems={navItems}
                    isAuthenticated={isAuthenticated}
                    onLoginClick={() => router.push('/sign-in')}
                    onRegisterClick={() => router.push('/register')}
                />
            )}

            {/* Auth modals removed - using page navigation instead */}
        </>
    );
};

export default Header;