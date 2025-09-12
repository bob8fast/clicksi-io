export type GeolocationStatus = 'granted' | 'denied' | 'unknown';
export type Language = 'en' | 'uk' | 'ru';
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface Notification
{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    timestamp: number;
    duration?: number;
    persistent?: boolean;
}