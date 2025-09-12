// components/ui/switch.tsx
"use client"

import * as SwitchPrimitive from "@radix-ui/react-switch"
import * as React from "react"

import { cn } from "@/lib/utils"

function Switch({
    className,
    ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>)
{
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            className={cn(
                "peer data-[state=checked]:bg-[var(--color-orange)] data-[state=unchecked]:bg-[var(--color-gray-1)] focus-visible:border-[var(--color-orange)] focus-visible:ring-[var(--color-orange)]/50 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className={cn(
                    "bg-[var(--color-light)] pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
                )}
            />
        </SwitchPrimitive.Root>
    )
}

export { Switch }
