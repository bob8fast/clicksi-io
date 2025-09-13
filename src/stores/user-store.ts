import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPreferences
{
    onboardingCompleted: boolean;
    tourCompleted: Record<string, boolean>;
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
}

interface UserState
{
    preferences: UserPreferences;

    // Actions
    setOnboardingCompleted: (completed: boolean) => void;
    setTourCompleted: (section: string, completed: boolean) => void;
    setEmailNotifications: (enabled: boolean) => void;
    setPushNotifications: (enabled: boolean) => void;
    setMarketingEmails: (enabled: boolean) => void;
    resetUserPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
    onboardingCompleted: false,
    tourCompleted: {},
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            preferences: defaultPreferences,

            // Actions
            setOnboardingCompleted: (completed) => set((state) => ({
                preferences: { ...state.preferences, onboardingCompleted: completed }
            })),

            setTourCompleted: (section, completed) => set((state) => ({
                preferences: {
                    ...state.preferences,
                    tourCompleted: { ...state.preferences.tourCompleted, [section]: completed }
                }
            })),

            setEmailNotifications: (enabled) => set((state) => ({
                preferences: { ...state.preferences, emailNotifications: enabled }
            })),

            setPushNotifications: (enabled) => set((state) => ({
                preferences: { ...state.preferences, pushNotifications: enabled }
            })),

            setMarketingEmails: (enabled) => set((state) => ({
                preferences: { ...state.preferences, marketingEmails: enabled }
            })),

            resetUserPreferences: () => set({ preferences: defaultPreferences }),
        }),
        {
            name: 'user-storage',
        }
    )
);

// ============================================================================
// USER PREFERENCE HOOKS
// ============================================================================
export const useOnboarding = () =>
{
    return useUserStore((state) => ({
        completed: state.preferences.onboardingCompleted,
        setCompleted: state.setOnboardingCompleted,
    }));
};

export const useTour = () =>
{
    return useUserStore((state) => ({
        completed: state.preferences.tourCompleted,
        setCompleted: state.setTourCompleted,
        isCompleted: (section: string) => !!state.preferences.tourCompleted[section],
    }));
};

export const useNotificationPreferences = () =>
{
    return useUserStore((state) => ({
        email: state.preferences.emailNotifications,
        push: state.preferences.pushNotifications,
        marketing: state.preferences.marketingEmails,
        setEmail: state.setEmailNotifications,
        setPush: state.setPushNotifications,
        setMarketing: state.setMarketingEmails,
    }));
};