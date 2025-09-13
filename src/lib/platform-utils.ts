// lib/platform-utils.ts - Platform utility functions for social media integrations

import { SocialPlatform } from '@/types/app/integration-types';
import { Twitter, Instagram, Music, Facebook, LucideIcon } from 'lucide-react';

/**
 * Get the appropriate icon component for a social platform
 */
export const getPlatformIcon = (platform: SocialPlatform): LucideIcon => {
  switch (platform) {
    case SocialPlatform.X:
      return Twitter;
    case SocialPlatform.Instagram:
      return Instagram;
    case SocialPlatform.TikTok:
      return Music;
    case SocialPlatform.Facebook:
      return Facebook;
    default:
      return Twitter;
  }
};

/**
 * Get platform-specific colors for UI elements
 */
export const getPlatformColor = (platform: SocialPlatform) => {
  switch (platform) {
    case SocialPlatform.X:
      return { 
        bg: 'bg-slate-100 dark:bg-slate-800', 
        text: 'text-slate-900 dark:text-slate-100',
        border: 'border-slate-200 dark:border-slate-700',
        hover: 'hover:bg-slate-200 dark:hover:bg-slate-700'
      };
    case SocialPlatform.Instagram:
      return { 
        bg: 'bg-pink-100 dark:bg-pink-900/20', 
        text: 'text-pink-700 dark:text-pink-300',
        border: 'border-pink-200 dark:border-pink-800',
        hover: 'hover:bg-pink-200 dark:hover:bg-pink-900/30'
      };
    case SocialPlatform.TikTok:
      return { 
        bg: 'bg-red-100 dark:bg-red-900/20', 
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-200 dark:border-red-800',
        hover: 'hover:bg-red-200 dark:hover:bg-red-900/30'
      };
    case SocialPlatform.Facebook:
      return { 
        bg: 'bg-blue-100 dark:bg-blue-900/20', 
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800',
        hover: 'hover:bg-blue-200 dark:hover:bg-blue-900/30'
      };
    default:
      return { 
        bg: 'bg-gray-100 dark:bg-gray-800', 
        text: 'text-gray-700 dark:text-gray-300',
        border: 'border-gray-200 dark:border-gray-700',
        hover: 'hover:bg-gray-200 dark:hover:bg-gray-700'
      };
  }
};

/**
 * Get user-friendly platform name
 */
export const getPlatformName = (platform: SocialPlatform): string => {
  switch (platform) {
    case SocialPlatform.X:
      return 'X (Twitter)';
    case SocialPlatform.Instagram:
      return 'Instagram';
    case SocialPlatform.TikTok:
      return 'TikTok';
    case SocialPlatform.Facebook:
      return 'Facebook';
    default:
      return platform;
  }
};

/**
 * Get platform-specific URL patterns for validation
 */
export const getPlatformUrlPattern = (platform: SocialPlatform): RegExp => {
  switch (platform) {
    case SocialPlatform.X:
      return /^@?[A-Za-z0-9_]{1,15}$/;
    case SocialPlatform.Instagram:
      return /^@?[A-Za-z0-9_.]{1,30}$/;
    case SocialPlatform.TikTok:
      return /^@?[A-Za-z0-9_.]{2,24}$/;
    case SocialPlatform.Facebook:
      return /^@?[A-Za-z0-9.]{5,50}$/;
    default:
      return /^@?[A-Za-z0-9_.]{1,30}$/;
  }
};

/**
 * Format username for display (ensure @ prefix)
 */
export const formatUsername = (username: string, platform: SocialPlatform): string => {
  if (!username) return '';
  
  // Remove @ if present, then add it back for consistency
  const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
  
  // For Facebook, @ prefix is less common, so only add it if it matches the pattern
  if (platform === SocialPlatform.Facebook) {
    return cleanUsername;
  }
  
  return `@${cleanUsername}`;
};

/**
 * Get platform-specific connection status messages
 */
export const getConnectionStatusMessage = (
  platform: SocialPlatform, 
  isActive: boolean, 
  lastUsed?: string
): string => {
  const platformName = getPlatformName(platform);
  
  if (!isActive) {
    return `${platformName} connection is inactive. Please reconnect.`;
  }
  
  if (lastUsed) {
    const lastUsedDate = new Date(lastUsed);
    const daysSince = Math.floor((Date.now() - lastUsedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince === 0) {
      return `${platformName} connection is active. Used today.`;
    } else if (daysSince === 1) {
      return `${platformName} connection is active. Last used yesterday.`;
    } else if (daysSince < 7) {
      return `${platformName} connection is active. Last used ${daysSince} days ago.`;
    } else {
      return `${platformName} connection is active. Last used ${lastUsedDate.toLocaleDateString()}.`;
    }
  }
  
  return `${platformName} connection is active and ready to use.`;
};

/**
 * Get all available platforms as array
 */
export const getAllPlatforms = (): SocialPlatform[] => {
  return Object.values(SocialPlatform);
};

/**
 * Check if platform supports specific features
 */
export const platformSupports = (platform: SocialPlatform, feature: 'scheduling' | 'stories' | 'reels' | 'live'): boolean => {
  const features = {
    [SocialPlatform.X]: ['scheduling'],
    [SocialPlatform.Instagram]: ['scheduling', 'stories', 'reels', 'live'],
    [SocialPlatform.TikTok]: ['scheduling', 'live'],
    [SocialPlatform.Facebook]: ['scheduling', 'stories', 'live']
  };
  
  return features[platform]?.includes(feature) || false;
};