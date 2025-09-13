"use client"

import * as PopoverPrimitive from "@radix-ui/react-popover"
import * as React from "react"

import { cn } from "@/lib/utils"

function Popover({
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>)
{
    return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>)
{
    return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
    className,
    align = "center",
    sideOffset = 4,
    isWrappedByPortal = true,
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & {
    // By default it should be disabled - especially when we call Popover component from Modal, in some cases Popover modal={true} helps to solve most of issues
    // https://github.com/shadcn-ui/ui/issues/1511#issuecomment-1784645453

    // but in particular cases it could be used like when focus is moved to Top point of container
    /* 
    https://github.com/shadcn-ui/ui/discussions/4175 
    https://github.com/shadcn-ui/ui/discussions/4175#discussioncomment-13136620
    */
    isWrappedByPortal?: boolean;
})
{

    const popover = (
        <PopoverPrimitive.Content
            data-slot="popover-content"
            align={align}
            sideOffset={sideOffset}
            className={cn(
                "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
                className
            )}
            {...props}
        />
    )

    if (isWrappedByPortal == false)
    {
        // https://github.com/shadcn-ui/ui/issues/1511#issuecomment-1784645453
        return popover;
    }

    return (
        <PopoverPrimitive.Portal>
            {popover}
        </PopoverPrimitive.Portal>
    )
}

function PopoverAnchor({
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>)
{
    return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger }

