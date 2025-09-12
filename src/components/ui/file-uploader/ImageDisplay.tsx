// ImageDisplay.tsx
'use client'

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

import { BaseSignedUrlResponse } from './types/file-uploader.types';

interface ImageDisplayProps {
    imageId?: string | null;
    imageIds?: string[];
    onGetSignedUrls: (imageIds: string[]) => Promise<BaseSignedUrlResponse>;
    alt?: string;
    className?: string;
    fallback?: React.ReactNode;
    cacheKey?: string;
    priority?: boolean;
    sizes?: string;
    fill?: boolean;
    width?: number;
    height?: number;
    // Image optimization props
    quality?: number;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
}

/**
 * Standalone Image Display Component with S3 Signed URL Integration
 * 
 * Features:
 * - Automatic signed URL fetching and caching
 * - React Query integration for TTL-based refresh
 * - Single image or bulk image support
 * - Fallback component for missing/failed images
 * - Next.js Image optimization
 * - Loading states and error handling
 * 
 * Usage:
 * ```tsx
 * // Single image
 * <ImageDisplay
 *     imageId={user.profile_image_id}
 *     onGetSignedUrls={async (ids) => {
 *         const profileHooks = useProfileHooks();
 *         const { mutateAsync } = profileHooks.getImageSignedUrls();
 *         return mutateAsync({ data: { image_storage_paths: ids } });
 *     }}
 *     alt="Profile image"
 *     className="w-24 h-24 rounded-full"
 *     fallback={<DefaultAvatarIcon />}
 * />
 * 
 * // Multiple images
 * <ImageDisplay
 *     imageIds={category.gallery_image_ids}
 *     onGetSignedUrls={categoryHooks.getSignedUrlsQuery}
 *     alt="Category gallery"
 *     cacheKey={`category-${category.id}`}
 * />
 * ```
 */
export const ImageDisplay: React.FC<ImageDisplayProps> = ({
    imageId,
    imageIds,
    onGetSignedUrls,
    alt = '',
    className = '',
    fallback = null,
    cacheKey,
    priority = false,
    sizes = '100vw',
    fill = false,
    width,
    height,
    quality = 75,
    placeholder = 'empty',
    blurDataURL
}) => {
    const [imageError, setImageError] = useState(false);
    const queryClient = useQueryClient();

    // Determine which image IDs to fetch
    const effectiveImageIds = imageIds || (imageId ? [imageId] : []);
    const hasImages = effectiveImageIds.length > 0;

    // Create cache key
    const queryCacheKey = cacheKey || ['signed-urls', effectiveImageIds.sort().join(',')];

    // Fetch signed URLs with React Query
    const {
        data: signedUrlResponse,
        isLoading,
        error,
        isError
    } = useQuery({
        queryKey: [queryCacheKey],
        queryFn: () => onGetSignedUrls(effectiveImageIds),
        enabled: hasImages && !imageError,
        
        // Smart stale/refetch timing based on backend TTL
        staleTime: (data) => {
            if (!data?.expires_at) return 5 * 60 * 1000; // 5 min default
            
            const expiresAt = new Date(data.expires_at);
            const now = new Date();
            const timeUntilExpiry = expiresAt.getTime() - now.getTime();
            
            // Refresh when 25% of TTL remains (proactive refresh)
            return Math.max(timeUntilExpiry * 0.75, 30 * 1000); // Min 30 seconds
        },
        
        // Background refetch when URLs are about to expire
        refetchInterval: (data) => {
            if (!data?.expires_at) return false;
            
            const expiresAt = new Date(data.expires_at);
            const now = new Date();
            const timeUntilExpiry = expiresAt.getTime() - now.getTime();
            
            // Start background refresh when 50% of TTL remains
            if (timeUntilExpiry < (data.ttl_seconds || 3600) * 500) {
                return 60 * 1000; // Check every minute when close to expiry
            }
            
            return false; // No background refresh needed
        },
        
        // Retry on failure
        retry: (failureCount, error) => failureCount < 3,
        
        // Keep old URLs while fetching new ones
        keepPreviousData: true,
    });

    // Get the first image URL (for single image display)
    const imageUrl = signedUrlResponse?.urls?.[0]?.url;

    // Handle image load error
    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    // Reset error when imageId changes
    useEffect(() => {
        setImageError(false);
    }, [imageId, imageIds]);

    // Show fallback if no images, error, or failed to load
    if (!hasImages || imageError || isError || !imageUrl) {
        return fallback ? <>{fallback}</> : null;
    }

    // Show loading state
    if (isLoading) {
        return (
            <Skeleton 
                className={className}
                style={fill ? {} : { width, height }}
            />
        );
    }

    // Render image with Next.js optimization
    return (
        <Image
            src={imageUrl}
            alt={alt}
            className={className}
            priority={priority}
            sizes={sizes}
            fill={fill}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            quality={quality}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            onError={handleImageError}
        />
    );
};

export default ImageDisplay;