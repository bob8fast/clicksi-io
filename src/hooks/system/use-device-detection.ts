// hooks/useDeviceDetection.ts
import { useIsSSR } from "@react-aria/ssr";
import { useEffect, useState } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceInfo
{
    isSSR: boolean;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    deviceType: DeviceType;
    windowWidth: number;
    windowHeight: number;
}

const BREAKPOINTS = {
    mobile: 640,
    tablet: 1024,
    desktop: 1280,
};

export const useDeviceDetection = (): DeviceInfo =>
{
    const isSSR = useIsSSR();

    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() =>
    {
        if (isSSR)
        {
            return {
                isSSR: true,
                isMobile: false,
                isTablet: false,
                isDesktop: false,
                deviceType: 'desktop',
                windowWidth: 0,
                windowHeight: 0,
            };
        }

        if (typeof window === 'undefined')
        {
            return {
                isSSR: false,
                isMobile: false,
                isTablet: false,
                isDesktop: true,
                deviceType: 'desktop',
                windowWidth: 0,
                windowHeight: 0,
            };
        }

        const width = window.innerWidth;
        const height = window.innerHeight;

        return {
            isSSR: false,
            isMobile: width < BREAKPOINTS.mobile,
            isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
            isDesktop: width >= BREAKPOINTS.tablet,
            deviceType: width < BREAKPOINTS.mobile ? 'mobile' :
                width < BREAKPOINTS.tablet ? 'tablet' : 'desktop',
            windowWidth: width,
            windowHeight: height,
        };
    });

    useEffect(() =>
    {
        const handleResize = () =>
        {
            const width = window.innerWidth;
            const height = window.innerHeight;

            setDeviceInfo({
                isSSR: false,
                isMobile: width < BREAKPOINTS.mobile,
                isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
                isDesktop: width >= BREAKPOINTS.tablet,
                deviceType: width < BREAKPOINTS.mobile ? 'mobile' :
                    width < BREAKPOINTS.tablet ? 'tablet' : 'desktop',
                windowWidth: width,
                windowHeight: height,
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return deviceInfo;
};

// Additional utility functions
export const isTouchDevice = (): boolean =>
{
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const getOrientation = (): 'portrait' | 'landscape' | null =>
{
    if (typeof window === 'undefined') return null;
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};