'use client'

import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import SearchDropdown from './SearchDropdown';

interface FullscreenSearchProps
{
    isOpen: boolean;
    onClose: () => void;
    enableAnimations?: boolean; // Configurable animations as requested
}

export default function FullscreenSearch({ isOpen, onClose, enableAnimations = true }: FullscreenSearchProps)
{
    const [searchTerm, setSearchTerm] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const mobileSearchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollPositionRef = useRef(0);
    const router = useRouter();

    const handleClearSearch = () =>
    {
        setSearchTerm('');
        if (inputRef.current)
        {
            inputRef.current.focus();
        }
    };

    const handleSearchItemClick = (url: string) =>
    {
        router.push(url);
        handleClose();
    };

    const handleSubmit = (e: React.FormEvent) =>
    {
        e.preventDefault();
        if (searchTerm.trim())
        {
            router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
            handleClose();
        }
    };

    // Enhanced close handler with animation support
    const handleClose = () =>
    {
        if (enableAnimations)
        {
            setIsAnimating(true);
            setTimeout(() =>
            {
                onClose();
                setIsAnimating(false);
            }, 200); // Animation duration
        } else
        {
            onClose();
        }
    };

    // Handle slide-down gesture
    const handleSlideDown = () =>
    {
        handleClose();
    };

    // Handle ESC key to close
    useEffect(() =>
    {
        const handleKeyDown = (e: KeyboardEvent) =>
        {
            if (e.key === 'Escape' && isOpen)
            {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, enableAnimations]);

    // Improved body scroll prevention
    useEffect(() =>
    {
        if (isOpen)
        {
            // Capture the current scroll position
            scrollPositionRef.current = window.scrollY;

            // Create a style element to handle scrollbar width
            const style = document.createElement('style');
            style.id = 'mobile-search-scroll-fix';
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

            style.innerHTML = `
        body {
          position: fixed !important;
          top: -${scrollPositionRef.current}px !important;
          width: 100% !important;
          padding-right: ${scrollbarWidth}px !important;
          overflow: hidden !important;
        }
      `;

            document.head.appendChild(style);
        } else
        {
            // Remove the style element
            const styleElement = document.getElementById('mobile-search-scroll-fix');
            if (styleElement)
            {
                styleElement.remove();
            }

            // Restore scroll position after a short delay to prevent visual jump
            requestAnimationFrame(() =>
            {
                window.scrollTo({
                    top: scrollPositionRef.current,
                    behavior: 'instant'
                });
            });
        }

        return () =>
        {
            // Cleanup
            const styleElement = document.getElementById('mobile-search-scroll-fix');
            if (styleElement)
            {
                styleElement.remove();
            }
        };
    }, [isOpen]);

    // Auto-focus input when opened
    useEffect(() =>
    {
        if (isOpen && inputRef.current)
        {
            // Slight delay to ensure the component is fully rendered
            setTimeout(() =>
            {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Animation classes based on configuration
    const animationClasses = enableAnimations
        ? `transform transition-transform duration-200 ease-out ${isAnimating ? 'translate-y-full' : 'translate-y-0'
        }`
        : '';

    return (
        <div className={`fixed inset-0 bg-[#090909] z-50 top-16 ${animationClasses}`} ref={mobileSearchRef}>
            <div className="flex flex-col h-full">
                {/* Enhanced Search Header with navigation controls */}
                <div className="border-b border-[#202020] bg-[#090909]">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">

                        {/* Header with centered title and back button */}
                        <div className="flex items-center justify-between mb-4">
                            {/* Empty space for balance */}
                            <div className="w-16"></div>

                            {/* Centered search title */}
                            <h2 className="text-lg font-semibold text-[#EDECF8]">Search</h2>

                            {/* Glass-morphism style Done button */}
                            <button
                                onClick={handleClose}
                                className="group relative flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-[#EDECF8]  hover:border-white/30 transition-all duration-200 hover:shadow-2xl"
                                aria-label="Close search"
                            >
                                <span className="text-sm font-medium">Close</span>
                                <div className="w-5 h-5 rounded-full bg-[#D78E59] flex items-center justify-center group-hover:bg-[#FFAA6C] transition-colors">
                                    <X size={12} className="text-[#090909]" />
                                </div>
                            </button>
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSubmit}>
                            <div className="relative">
                                <Input
                                    ref={inputRef}
                                    placeholder="Search brands, creators, products..."
                                    className="w-full bg-[#202020] border-[#575757] text-[#EDECF8] placeholder:text-[#575757] pr-20 selection:bg-[#D78E59] selection:text-[#171717] text-lg py-3"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            className="p-2 text-[#828288] hover:text-[#EDECF8] transition-colors rounded-lg hover:bg-[#575757]"
                                            onClick={handleClearSearch}
                                            aria-label="Clear search"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="p-2 text-[#828288] hover:text-[#EDECF8] transition-colors rounded-lg hover:bg-[#575757]"
                                        aria-label="Search"
                                    >
                                        <Search size={20} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Content Area - Using enhanced SearchDropdown with flex-1 */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1 min-h-0">
                    <SearchDropdown
                        searchQuery={searchTerm}
                        onSearchQueryChange={setSearchTerm}
                        onItemClick={handleSearchItemClick}
                        onClose={handleClose}
                    />
                </div>
            </div>
        </div>
    );
}