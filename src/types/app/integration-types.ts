// types/app/integration-types.ts - Integration type definitions

import { EntityType } from '@/types/management';

export enum SocialPlatform {
  X = 'X',
  Instagram = 'Instagram', 
  TikTok = 'TikTok',
  Facebook = 'Facebook'
}

export interface SocialConnection {
  id: string;
  platform: SocialPlatform;
  external_username: string;
  display_name: string;
  connected_at: string;
  last_used_at?: string;
  is_active: boolean;
  avatar_url?: string;
}

export interface OAuthInitiateRequest {
  teamId: string;
  platform: SocialPlatform;
  callback_url: string;
}

export interface OAuthInitiateResponse {
  authorization_url: string;
  state: string;
}

export interface OAuthCompleteRequest {
  code: string;
  state: string;
}

export interface OAuthCompleteResponse {
  success: boolean;
  platform: SocialPlatform;
  entityType: EntityType;
  connection: SocialConnection;
}

export interface PlatformCapabilities {
  platform: SocialPlatform;
  supports_posting: boolean;
  supports_scheduling: boolean;
  max_file_size_mb: number;
  supported_formats: string[];
}

export interface ConnectionValidationResult {
  is_valid: boolean;
  last_checked: string;
  error_message?: string;
}

export interface RemoveConnectionRequest {
  teamId: string;
  connectionId: string;
}

export interface RemoveConnectionResponse {
  success: boolean;
}

// Team social connections list response
export interface TeamConnectionsResponse {
  connections: SocialConnection[];
  total_count: number;
}

// Integration-related error types
export interface IntegrationError {
  code: string;
  message: string;
  platform?: SocialPlatform;
}