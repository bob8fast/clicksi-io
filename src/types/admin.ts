// types/admin.ts
import { BusinessType, UserRole } from '@/types';

export interface UserFilters {
  search: string;
  role?: UserRole;
  verificationStatus?: VerificationStatus;
  businessType?: BusinessType;
  isActive?: boolean;
  sortBy: 'createdAt' | 'firstName' | 'lastName' | 'email' | 'lastLoginAt';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected' | 'NotRequired';

export interface AdminFilters {
  search: string;
  accessLevel?: 'Standard' | 'Elevated' | 'SuperAdmin';
  isActive?: boolean;
  sortBy: 'createdAt' | 'firstName' | 'lastName' | 'email' | 'lastLoginAt';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface UpdateUserVerificationRequest {
  user_id: string;
  verification_status: VerificationStatus;
  rejection_reason?: string;
  notes?: string;
}