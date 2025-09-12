import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Notification, NotificationPosition } from './types';

interface UIState
{
    // Theme & Appearance
    language: Language;

    // Layout
    sidebarCollapsed: boolean;
    sidebarWidth: number;
    sidebarPinned: boolean;

    // Notifications
    notifications: Notification[];
    notificationPosition: NotificationPosition;
    notificationsEnabled: boolean;

    // Modals
    modalStack: string[];

    // Actions
    setLanguage: (language: Language) => void;

    // Sidebar actions
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    setSidebarWidth: (width: number) => void;
    setSidebarPinned: (pinned: boolean) => void;

    // Notification actions
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
    setNotificationPosition: (position: NotificationPosition) => void;
    setNotificationsEnabled: (enabled: boolean) => void;

    // Modal actions
    pushModal: (modalId: string) => void;
    popModal: () => void;
    clearModalStack: () => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set, _get) => ({
            // Default values
            theme: 'system',
            language: 'en',
            sidebarCollapsed: false,
            sidebarWidth: 280,
            sidebarPinned: false,
            notifications: [],
            notificationPosition: 'bottom-right',
            notificationsEnabled: true,
            modalStack: [],

            // Theme & Language actions
            setLanguage: (language) => set({ language }),

            // Sidebar actions
            toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
            setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
            setSidebarWidth: (width) => set({ sidebarWidth: Math.max(200, Math.min(400, width)) }),
            setSidebarPinned: (pinned) => set({ sidebarPinned: pinned }),

            // Notification actions
            addNotification: (notification) => set((state) => ({
                notifications: [...state.notifications, {
                    ...notification,
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                }]
            })),

            removeNotification: (id) => set((state) => ({
                notifications: state.notifications.filter(n => n.id !== id)
            })),

            clearNotifications: () => set({ notifications: [] }),
            setNotificationPosition: (position) => set({ notificationPosition: position }),
            setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

            // Modal actions
            pushModal: (modalId) => set((state) => ({
                modalStack: [...state.modalStack, modalId]
            })),

            popModal: () => set((state) => ({
                modalStack: state.modalStack.slice(0, -1)
            })),

            clearModalStack: () => set({ modalStack: [] }),
        }),
        {
            name: 'ui-storage',
            partialize: (state) => ({
                language: state.language,
                sidebarCollapsed: state.sidebarCollapsed,
                sidebarWidth: state.sidebarWidth,
                sidebarPinned: state.sidebarPinned,
                notificationPosition: state.notificationPosition,
                notificationsEnabled: state.notificationsEnabled,
                // Don't persist notifications and modals (session data)
            }),
        }
    )
);


// ============================================================================
// THEME HOOKS
// ============================================================================
export const useLanguage = () =>
{
    return useUIStore((state) => ({
        language: state.language,
        setLanguage: state.setLanguage,
    }));
};

// ============================================================================
// SIDEBAR HOOKS
// ============================================================================
export const useSidebar = () =>
{
    return useUIStore((state) => ({
        collapsed: state.sidebarCollapsed,
        width: state.sidebarWidth,
        pinned: state.sidebarPinned,
        effectiveWidth: state.sidebarCollapsed ? 64 : state.sidebarWidth,
        toggle: state.toggleSidebar,
        setCollapsed: state.setSidebarCollapsed,
        setWidth: state.setSidebarWidth,
        setPinned: state.setSidebarPinned,
    }));
};

export const useSidebarCollapsed = () =>
{
    return useUIStore((state) => state.sidebarCollapsed);
};


// ============================================================================
// NOTIFICATION HOOKS
// ============================================================================
export const useNotifications = () =>
{
    return useUIStore((state) => ({
        notifications: state.notifications,
        position: state.notificationPosition,
        enabled: state.notificationsEnabled,
        add: state.addNotification,
        remove: state.removeNotification,
        clear: state.clearNotifications,
        setPosition: state.setNotificationPosition,
        setEnabled: state.setNotificationsEnabled,
    }));
};

export const useNotificationActions = () =>
{
    return useUIStore((state) => ({
        add: state.addNotification,
        remove: state.removeNotification,
        clear: state.clearNotifications,
    }));
};

// ============================================================================
// MODAL HOOKS
// ============================================================================
export const useModals = () =>
{
    return useUIStore((state) => ({
        stack: state.modalStack,
        current: state.modalStack[state.modalStack.length - 1],
        hasModals: state.modalStack.length > 0,
        push: state.pushModal,
        pop: state.popModal,
        clear: state.clearModalStack,
    }));
};

export const useModalStack = () =>
{
    return useUIStore((state) => state.modalStack);
};
