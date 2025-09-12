import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[])
{
    return twMerge(clsx(inputs))
}

export function stringToBoolean(str: string)
{
    return str.toLowerCase() === 'true';
}

/**
 * Helper function to safely work with enum values that might be passed as strings
 * @param value The value to convert (can be string or enum)
 * @param enumType The enum type to convert to
 * @returns The proper enum value
 */
export function toEnum<T extends object>(value: string | T[keyof T], enumType: T): T[keyof T]
{
    // If the value is already a valid enum value (number), return it
    if (Object.values(enumType).includes(value as T[keyof T]))
    {
        return value as T[keyof T];
    }

    // If it's a string that matches an enum key, return the corresponding enum value
    if (typeof value === 'string' && Object.keys(enumType).includes(value))
    {
        return enumType[value as keyof T] as T[keyof T];
    }

    // If it's a string that matches an enum value, return it
    const enumValues = Object.values(enumType) as unknown as string[];
    if (typeof value === 'string' && enumValues.includes(value))
    {
        return value as unknown as T[keyof T];
    }

    // Return undefined or throw an error based on your preference
    console.warn(`Invalid enum value: ${value} for enum type`, enumType);
    return Object.values(enumType)[0] as T[keyof T]; // Return first value as default
}


// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string
{
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

// Format date
export function formatDate(date: string | Date): string
{
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(date));
}

// Format relative time
export function formatRelativeTime(date: string | Date): string
{
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return formatDate(date);
}

// Generate SKU
export function generateSKU(brandCode: string, category: string, sequence: number): string
{
    const categoryCode = category.substring(0, 3).toUpperCase();
    const sequenceStr = sequence.toString().padStart(3, '0');
    return `${brandCode}-${categoryCode}-${sequenceStr}`;
}

// Validate image URL
export function isValidImageUrl(url: string): boolean
{
    try
    {
        const validUrl = new URL(url);
        return validUrl.protocol === 'http:' || validUrl.protocol === 'https:';
    } catch {
        return false;
    }
}

// Calculate stock percentage
export function calculateStockPercentage(current: number, threshold: number): number
{
    if (threshold === 0) return 100;
    return Math.min((current / threshold) * 100, 100);
}

// Get stock status
export function getStockStatus(current: number, threshold: number): 'high' | 'medium' | 'low' | 'out'
{
    if (current === 0) return 'out';
    if (current <= threshold * 0.5) return 'low';
    if (current <= threshold) return 'medium';
    return 'high';
}