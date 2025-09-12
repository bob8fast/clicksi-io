import { create } from 'zustand';
import { GeolocationStatus } from './types';

interface LocationData
{
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: number;
}

interface SessionState
{
    // Geolocation
    geolocationPermission: GeolocationStatus;
    location?: LocationData;

    // Connection
    isOnline: boolean;
    lastActivity: number;

    // Performance
    pageLoadTime?: number;
    errorCount: number;

    // Actions
    setGeolocationPermission: (status: GeolocationStatus) => void;
    setLocation: (location: Omit<LocationData, 'timestamp'>) => void;
    setIsOnline: (online: boolean) => void;
    updateLastActivity: () => void;
    setPageLoadTime: (time: number) => void;
    incrementErrorCount: () => void;
    clearSession: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
    // Default values (not persisted)
    geolocationPermission: 'unknown',
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    lastActivity: Date.now(),
    errorCount: 0,

    // Actions
    setGeolocationPermission: (status) => set({ geolocationPermission: status }),

    setLocation: (location) => set({
        location: { ...location, timestamp: Date.now() }
    }),

    setIsOnline: (online) => set({ isOnline: online }),
    updateLastActivity: () => set({ lastActivity: Date.now() }),
    setPageLoadTime: (time) => set({ pageLoadTime: time }),
    incrementErrorCount: () => set((state) => ({ errorCount: state.errorCount + 1 })),

    clearSession: () => set({
        geolocationPermission: 'unknown',
        location: undefined,
        lastActivity: Date.now(),
        errorCount: 0,
        pageLoadTime: undefined,
    }),
}));

// ============================================================================
// SESSION HOOKS
// ============================================================================
export const useGeolocation = () =>
{
    return useSessionStore((state) => ({
        permission: state.geolocationPermission,
        location: state.location,
        setPermission: state.setGeolocationPermission,
        setLocation: state.setLocation,
    }));
};

export const useConnectivity = () =>
{
    return useSessionStore((state) => ({
        isOnline: state.isOnline,
        lastActivity: state.lastActivity,
        setIsOnline: state.setIsOnline,
        updateActivity: state.updateLastActivity,
    }));
};

export const usePerformance = () =>
{
    return useSessionStore((state) => ({
        pageLoadTime: state.pageLoadTime,
        errorCount: state.errorCount,
        setPageLoadTime: state.setPageLoadTime,
        incrementErrors: state.incrementErrorCount,
    }));
};