// components/ui/responsive-modal.tsx
'use client'

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDeviceDetection } from '@/hooks/system/use-device-detection';
import { X } from 'lucide-react';
import React from 'react';

interface ResponsiveModalProps
{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
    height?: 'auto' | 'screen' | '90vh' | '80vh' | '70vh' | '60vh';
    footer?: React.ReactNode;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    scrollable?: boolean;
    className?: string;
    useWideLayout?: boolean;
}

export default function ResponsiveModal({
    isOpen,
    onClose,
    title,
    description,
    children,
    icon,
    maxWidth = 'lg',
    height = '80vh',
    footer,
    showCloseButton = true,
    closeOnOverlayClick = true,
    scrollable = true,
    className = '',
    useWideLayout = false
}: ResponsiveModalProps)
{
    const { isMobile } = useDeviceDetection();

    const maxWidthClasses = {
        'sm': 'max-w-sm',
        'md': 'max-w-md',
        'lg': 'max-w-lg',
        'xl': 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl'
    };

    // Determine final width classes based on useWideLayout
    const getWidthClasses = () =>
    {
        if (useWideLayout)
        {
            return 'w-[95vw] sm:w-[90vw] sm:max-w-2xl md:w-[85vw] md:max-w-5xl lg:w-[80vw] lg:max-w-6xl xl:max-w-7xl';
        }
        return maxWidthClasses[maxWidth];
    };

    const heightClasses = {
        'auto': 'h-auto',
        'screen': 'h-screen',
        '90vh': 'h-[90vh]',
        '80vh': 'h-[80vh]',
        '70vh': 'h-[70vh]',
        '60vh': 'h-[60vh]'
    };

    const isAutoHeight = height === 'auto';

    const contentElement = (
        <div className={`flex flex-col ${isAutoHeight ? '' : 'h-full'} ${className}`}>
            {/* Content Area */}
            <div className={`${isAutoHeight ? '' : 'flex-1 min-h-0 overflow-hidden'}`}>
                {scrollable ? (
                    <ScrollArea className={`${isAutoHeight ? '' : 'h-full'}`}>
                        <div className="p-4 sm:p-5 pt-0 sm:pt-0">
                            {children}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className={`p-4 sm:p-5 pt-0 sm:pt-0 ${isAutoHeight ? '' : 'h-full'} overflow-hidden`}>
                        {children}
                    </div>
                )}
            </div>

            {/* Footer */}
            {footer && (
                <div className="flex-shrink-0 border-t border-[#202020] p-4 sm:p-5">
                    {footer}
                </div>
            )}
        </div>
    );

    if (isMobile)
    {
        return (
            <Drawer
                open={isOpen}
                onOpenChange={closeOnOverlayClick ? onClose : undefined}
            >
                <DrawerContent className={`bg-[#171717] border-[#575757] text-[#EDECF8] ${heightClasses[height]} flex flex-col`}>
                    <DrawerHeader className="flex-shrink-0 px-3 py-3 sm:px-4 sm:py-4 relative">
                        {/* Close button positioned absolutely */}
                        {showCloseButton && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="absolute top-3 right-3 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] h-8 w-8 z-10"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}

                        {/* Title and description with proper spacing for close button */}
                        <div className={`${showCloseButton ? 'pr-10' : ''}`}>
                            <DrawerTitle className="flex items-center space-x-2 text-[#EDECF8] text-lg leading-6">
                                {icon}
                                <span className="truncate">{title}</span>
                            </DrawerTitle>
                            {description && (
                                <DrawerDescription className="text-[#828288] mt-2 text-sm leading-5">
                                    {description}
                                </DrawerDescription>
                            )}
                        </div>
                    </DrawerHeader>
                    <div className="flex-1 min-h-0 overflow-hidden">
                        {contentElement}
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={closeOnOverlayClick ? onClose : undefined}
        >
            <DialogContent
                className={`${getWidthClasses()} ${heightClasses[height]} bg-[#171717] border-[#575757] text-[#EDECF8] flex flex-col p-0 gap-0`}
                showCloseButton={false}
                useWideLayout={useWideLayout}
                useCustomWidth={!useWideLayout} // Tell DialogContent to respect our width classes
            >
                {/* Close button positioned absolutely */}
                {showCloseButton && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute top-4 right-4 text-[#828288] hover:text-[#EDECF8] hover:bg-[#202020] h-8 w-8 z-50"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}

                <DialogHeader className="flex-shrink-0 p-4 sm:p-5 pb-3 sm:pb-4 relative">
                    {/* Title and description with proper spacing for close button */}
                    <div className={`${showCloseButton ? 'pr-12' : ''}`}>
                        <DialogTitle className="flex items-start space-x-2 text-[#EDECF8] text-left leading-7">
                            {icon}
                            <span className="break-words">{title}</span>
                        </DialogTitle>
                        {description && (
                            <DialogDescription className="text-[#828288] mt-2 text-left leading-6">
                                {description}
                            </DialogDescription>
                        )}
                    </div>
                </DialogHeader>
                <div className={`${isAutoHeight ? '' : 'flex-1 min-h-0 overflow-hidden'}`}>
                    {contentElement}
                </div>
            </DialogContent>
        </Dialog>
    );
}