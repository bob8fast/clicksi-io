"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle()
{
    const [mounted, setMounted] = useState(false);
    const { theme = 'dark', setTheme } = useTheme();

    // Avoid hydration mismatch
    useEffect(() =>
    {
        setMounted(true);
    }, []);

    if (!mounted)
    {
        return (
            <button
                className="p-2 rounded-lg text-[var(--color-gray-2)] hover:text-[var(--color-light)] hover:bg-[var(--color-accent)] transition-colors"
                aria-label="Loading theme"
                disabled
            >
                <Moon size={20} />
            </button>
        );
    }

    const getIcon = () =>
    {
        switch (theme)
        {
            case "dark":
                return <Moon size={20} />;
            case "light":
                return <Sun size={20} />;
        }
    };

    const getNextTheme = () =>
    {
        if (theme === "dark") return "light";

        return "dark";
    };

    return (
        <button
            onClick={() => setTheme(getNextTheme())}
            className="p-2 rounded-lg text-[var(--color-gray-2)] hover:text-[var(--color-light)] hover:bg-[var(--color-accent)] transition-colors"
            aria-label={`Switch to ${getNextTheme()} theme`}
        >
            {getIcon()}
        </button>
    );
}