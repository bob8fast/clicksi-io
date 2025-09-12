// hooks/useDebounce.ts
import { useEffect, useState } from 'react';

/**
 * Hook to debounce a value, useful for search inputs
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T
{
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() =>
    {
        // Set up a timer to update the debounced value after the specified delay
        const timer = setTimeout(() =>
        {
            setDebouncedValue(value);
        }, delay);

        // Clean up the timer when the value or delay changes
        return () =>
        {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}