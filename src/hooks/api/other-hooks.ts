// hooks/api/other-hooks.ts
// Contains remaining hooks that don't fit into specific categories

import
{
    useGetModerationActions,
    useGetModerationQueue,
    useGetReport,
    useGetReports,
    useModerateContent,
    useResolveReport,
} from '@/gen/api/hooks/content_management/moderation';

import
{
    useCancelNotification,
    useGetNotification,
    useGetNotificationStats,
    useGetUserNotifications,
    useScheduleNotification,
    useScheduleTeamNotification,
} from '@/gen/api/hooks/notifications/notifications';

import { useReportContent } from '@/gen/api/hooks/content_management/engagement';
import
{
    useGetDeviceTokens,
    useRegisterDeviceToken,
    useRemoveDeviceToken,
    useRemoveDeviceTokenByString,
} from '@/gen/api/hooks/notifications/device-tokens';

/**
 * Moderation hooks
 */
export const useModerationHooks = () => ({
    getQueue: useGetModerationQueue,
    getActions: useGetModerationActions,
    getReports: useGetReports,
    getReport: useGetReport,
    moderateContent: useModerateContent(),
    reportContent: useReportContent(),
    resolveReport: useResolveReport(),
});



/**
 * Notification hooks
 */
export const useNotificationHooks = () => ({
    getUserNotifications: useGetUserNotifications,
    get: useGetNotification,
    getStats: useGetNotificationStats,
    schedule: useScheduleNotification(),
    scheduleTeam: useScheduleTeamNotification(),
    cancel: useCancelNotification(),
});

/**
 * Device token hooks
 */
export const useDeviceTokenHooks = () => ({
    get: useGetDeviceTokens,
    register: useRegisterDeviceToken(),
    remove: useRemoveDeviceToken(),
    removeByString: useRemoveDeviceTokenByString(),
});