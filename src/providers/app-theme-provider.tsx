// providers/ThemeProvider.tsx
'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { ThemeProvider as NextThemesProvider, ThemeProviderProps, useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// use together with <ThemeToggle />
export function AppThemeProvider({ children, ...props }: ThemeProviderProps)
{
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem disableTransitionOnChange
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
}


export const useAppTheme = () =>
{
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();

    // Only render theme-dependent UI after mounting to avoid hydration mismatch
    useEffect(() =>
    {
        setMounted(true);
    }, []);

    return {
        theme,
        setTheme,
        resolvedTheme,
        systemTheme,
        mounted, // Use this to conditionally render theme-dependent UI
    };
};

// components/ThemeToggle.tsx
export function ThemeToggle()
{
    const { theme, setTheme, mounted } = useAppTheme();

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted)
    {
        return (
            <div className="w-10 h-10 rounded-md border border-gray-200 animate-pulse" />
        );
    }

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={() => setTheme('light')}
                className={`p-2 rounded-md ${theme === 'light'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
            >
                <Sun size={16} />
            </button>

            <button
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-md ${theme === 'dark'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
            >
                <Moon size={16} />
            </button>

            <button
                onClick={() => setTheme('system')}
                className={`p-2 rounded-md ${theme === 'system'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
            >
                <Monitor size={16} />
            </button>
        </div>
    );
}

export function ThemeSelector()
{
    const { theme, setTheme, mounted } = useAppTheme();

    if (!mounted)
    {
        return (
            <select className="w-24 h-8 rounded border animate-pulse" disabled>
                <option>Loading...</option>
            </select>
        );
    }

    return (
        <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="px-3 py-1 rounded border bg-white dark:bg-gray-800 text-black dark:text-white"
        >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    );
}