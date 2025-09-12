// hooks/use-geolocation.ts
import { Location } from '@/types/app/registration-schema';
import { useCallback } from 'react';

interface GeolocationOptions
{
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}

export const useGeolocation = () =>
{
    const getLocation = useCallback(async (options?: GeolocationOptions): Promise<Location | null> =>
    {
        return new Promise((resolve) =>
        {
            if (!navigator.geolocation)
            {
                console.warn('Geolocation is not supported by this browser');
                resolve(null);
                return;
            }

            const defaultOptions: GeolocationOptions = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000,
                ...options,
            };

            navigator.geolocation.getCurrentPosition(
                (position) =>
                {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) =>
                {
                    console.warn('Geolocation error:', error.message);
                    resolve(null);
                },
                defaultOptions
            );
        });
    }, []);

    const watchLocation = useCallback((
        callback: (location: Location | null) => void,
        options?: GeolocationOptions
    ): (() => void) | null =>
    {
        if (!navigator.geolocation)
        {
            console.warn('Geolocation is not supported by this browser');
            return null;
        }

        const defaultOptions: GeolocationOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
            ...options,
        };

        const watchId = navigator.geolocation.watchPosition(
            (position) =>
            {
                callback({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) =>
            {
                console.warn('Geolocation error:', error.message);
                callback(null);
            },
            defaultOptions
        );

        return () =>
        {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return {
        getLocation,
        watchLocation,
    };
};