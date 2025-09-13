'use client'

import useResizeObserver from '@react-hook/resize-observer';
import { useWindowSize } from '@react-hook/window-size';
import { X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

interface ModalProps
{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    setModalDimensions?: (dimensions: { width: number; height: number }) => void;
    maxWidthClass?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    setModalDimensions,
    maxWidthClass = 'max-w-2xl'
}) =>
{
    // https://github.com/vercel/next.js/discussions/63836
    if (typeof window === "undefined")
    {
        return (<></>);
    }

    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [windowWidth, windowHeight] = useWindowSize();

    // Calculate responsive modal dimensions based on window size
    const calculateDimensions = () =>
    {
        const padding = 32; // 16px on each side
        const headerHeight = 76; // Approximate header height
        const maxModalHeight = windowHeight * 0.9; // 90% of window height
        const maxModalWidth = windowWidth - (padding * 2);

        // Content area dimensions
        const contentMaxHeight = maxModalHeight - headerHeight - padding;
        const contentMaxWidth = maxModalWidth - (padding * 2);

        return {
            maxHeight: contentMaxHeight,
            maxWidth: contentMaxWidth,
            modalMaxHeight: maxModalHeight
        };
    };

    // Observe content size changes
    useResizeObserver(contentRef, (entry) =>
    {
        const { width, height } = entry.contentRect;
        const dimensions = {
            width: Math.round(width),
            height: Math.round(height)
        };

        // Pass dimensions to parent if callback provided
        if (setModalDimensions)
        {
            setModalDimensions(dimensions);
        }
    });

    // Pass proper dimensions when modal opens
    useEffect(() =>
    {
        if (setModalDimensions)
        {
            if (isOpen)
            {
                const dims = calculateDimensions();
                // Pass the actual content area height available for the iframe
                setModalDimensions({
                    width: Math.round(dims.maxWidth),
                    height: Math.round(dims.maxHeight)
                });
            }
        }

    }, [isOpen, windowWidth, windowHeight]);

    useEffect(() =>
    {
        if (isOpen)
        {
            document.body.style.overflow = 'hidden';
        } else
        {
            document.body.style.overflow = 'unset';
        }

        return () =>
        {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() =>
    {
        const handleEscape = (e: KeyboardEvent) =>
        {
            if (e.key === 'Escape' && isOpen)
            {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const dimensions = calculateDimensions();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-75"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                ref={modalRef}
                className={`relative bg-[#171717] border border-[#575757] rounded-2xl w-full ${maxWidthClass} flex flex-col shadow-2xl overflow-hidden`}
                style={{
                    maxHeight: `${dimensions.modalMaxHeight}px`,
                    maxWidth: windowWidth < 640 ? '100%' : undefined
                }}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-[#575757] flex-shrink-0">
                    <h2 className="text-2xl font-bold text-[#EDECF8]">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-[#202020] transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={24} className="text-[#828288]" />
                    </button>
                </div>

                {/* Content - Remove overflow to prevent double scrolling */}
                <div
                    ref={contentRef}
                    className="p-6 flex-1 min-h-0 overflow-hidden"
                    style={{
                        minHeight: `${dimensions.maxHeight}px`,
                    }}
                >
                    {/* Clone children and pass dimensions if they accept them */}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;