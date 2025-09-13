"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

function Dialog({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>)
{
    return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>)
{
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>)
{
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>)
{
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>)
{
    return (
        <DialogPrimitive.Overlay
            data-slot="dialog-overlay"
            className={cn(
                "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
                className
            )}
            {...props}
        />
    )
}

function DialogContent({
    className,
    children,
    closeButtonProps,
    useWideLayout = false,
    showCloseButton = false,
    useCustomWidth = false,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
    closeButtonProps?: React.ComponentProps<typeof DialogPrimitive.Close>;
    useWideLayout?: boolean;
    showCloseButton?: boolean;
    useCustomWidth?: boolean;
})
{
    return (
        <DialogPortal data-slot="dialog-portal">
            <DialogOverlay />
            <DialogPrimitive.Content
                data-slot="dialog-content"
                className={cn(
                    "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-1rem)] translate-x-[-50%] translate-y-[-50%] gap-2 rounded-lg border shadow-lg duration-200 overflow-auto",
                    // Reduced padding for better space utilization
                    "p-2 sm:p-4",
                    // Only apply default width constraints if useCustomWidth is false
                    !useCustomWidth && [
                        // Default sizing for regular dialogs (like login)
                        !useWideLayout && "sm:max-w-lg",
                        // Apply wide layout styles when useWideLayout is true
                        useWideLayout && "w-[95vw] sm:w-[90vw] sm:max-w-2xl md:w-[85vw] md:max-w-5xl lg:w-[80vw] lg:max-w-6xl xl:max-w-7xl",
                    ],
                    // iPad specific adjustments
                    "max-h-[95vh] sm:max-h-[90vh]",
                    className
                )}
                {...props}
            >
                {children}
                {/* Only show close button if explicitly requested */}
                {showCloseButton && (
                    <DialogPrimitive.Close
                        className={cn(
                            "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-7",
                            closeButtonProps?.className
                        )}
                        {...closeButtonProps}
                    >
                        <XIcon />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPortal>
    )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">)
{
    return (
        <div
            data-slot="dialog-header"
            className={cn("flex flex-col gap-1.5 text-center", className)}
            {...props}
        />
    )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">)
{
    return (
        <div
            data-slot="dialog-footer"
            className={cn(
                "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3",
                className
            )}
            {...props}
        />
    )
}

function DialogTitle({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>)
{
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn("text-xl md:text-2xl leading-7 font-semibold tracking-tight", className)}
            {...props}
        />
    )
}

function DialogDescription({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>)
{
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn("text-muted-foreground text-sm leading-6", className)}
            {...props}
        />
    )
}

export
{
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger
}
