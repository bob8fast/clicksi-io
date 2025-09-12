// CategoryImage component - shared component for displaying category images with proper signed URLs
'use client'

import { Skeleton } from '@/components/ui';
import { useCategoryHooks } from '@/hooks/api';
import Image from 'next/image';
import React from 'react';

interface CategoryImageProps {
    imageId: string | null | undefined;
    alt: string;
    className?: string;
    fill?: boolean;
    sizes?: string;
    width?: number;
    height?: number;
    onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    showLoadingState?: boolean;
}

const CategoryImage = React.memo(({
    imageId,
    alt,
    className = '',
    fill = false,
    sizes,
    width,
    height,
    onError,
    showLoadingState = true
}: CategoryImageProps) => {
    const [imageUrl, setImageUrl] = React.useState<string | null | undefined>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);
    
    const categoryHooks = useCategoryHooks();
    const { mutateAsync: getImageUrls } = categoryHooks.getImageUrls();

    React.useEffect(() => {
        if (!imageId) {
            setImageUrl(null);
            setIsLoading(false);
            setHasError(false);
            return;
        }

        setIsLoading(true);
        setHasError(false);
        
        getImageUrls({ data: { image_storage_paths: [imageId] } })
            .then(response => {
                if (response.image_urls) {
                    const urls = response.image_urls || [];
                    if (urls.length > 0) {
                        setImageUrl(urls[0].url);
                    } else {
                        setImageUrl(null);
                        setHasError(true);
                    }
                } else {
                    setImageUrl(null);
                    setHasError(true);
                }
            })
            .catch(error => {
                console.error('Failed to fetch image URL:', error);
                setImageUrl(null);
                setHasError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [imageId, getImageUrls]);

    // Show loading state if enabled and loading
    if (showLoadingState && isLoading) {
        return (
            <Skeleton className={`${className} flex items-center justify-center`}>
                <div className="w-4 h-4 bg-[#575757] rounded"></div>
            </Skeleton>
        );
    }

    // Don't render anything if no image ID, no URL, or has error
    if (!imageId || !imageUrl || hasError) {
        return null;
    }

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        setHasError(true);
        if (onError) {
            onError(e);
        }
    };

    // Render the image
    const imageProps = {
        src: imageUrl,
        alt,
        className,
        onError: handleError,
        ...(fill ? { fill: true } : {}),
        ...(sizes ? { sizes } : {}),
        ...(width && height ? { width, height } : {})
    };

    return <Image {...imageProps} />;
});

CategoryImage.displayName = 'CategoryImage';

export default CategoryImage;