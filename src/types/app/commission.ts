// types/app/commission.ts - Commission-specific types and Zod schemas

import { z } from 'zod';

// Commission Rule Enums
export enum CommissionRuleScope {
  ExclusiveCampaignCommission = 'exclusive_campaign_commission',
  GeneralBusinessSpecificCommission = 'general_business_specific_commission',
  PartnershipDefinedCommission = 'partnership_defined_commission'
}

export enum RuleState {
  Draft = 'draft',
  Active = 'active',
  Inactive = 'inactive',
  Archived = 'archived'
}

export enum CommissionPayer {
  Brand = 'brand',
  Retailer = 'retailer'
}

export enum CreatorTierLevel {
  Bronze = 'bronze',
  Silver = 'silver',
  Gold = 'gold',
  Platinum = 'platinum'
}

export enum ConflictType {
  SameCampaignTarget = 'same_campaign_target',
  OverlappingTimePeriods = 'overlapping_time_periods',
  RestrictionsOverlap = 'restrictions_overlap',
  TeamOwnershipConflict = 'team_ownership_conflict',
  CommissionLimitConflict = 'commission_limit_conflict'
}

// Commission Rule Interfaces
export interface CommissionFormulaResponse {
  expression: string;
  description: string;
}

export interface CommissionRuleRestrictionsResponse {
  product_ids?: string[];
  category_ids?: string[];
  creator_tiers?: CreatorTierLevel[];
  min_order_value?: number;
  max_order_value?: number;
  description: string;
}

export interface CommissionRuleResponse {
  id: string;
  name: string;
  description: string;
  formula: CommissionFormulaResponse;
  scope: CommissionRuleScope;
  campaign_id?: string;
  owner_team_id: string;
  created_by_user_id: string;
  restrictions?: CommissionRuleRestrictionsResponse;
  min_commission?: number;
  max_commission?: number;
  priority: number;
  state: RuleState;
  effective_from: string; // ISO date string
  effective_to?: string; // ISO date string
  is_active: boolean;
  created_at: string; // ISO date string
  modified_at: string; // ISO date string
}

export interface CommissionRulesListResponse {
  items: CommissionRuleResponse[];
  total_count: number;
  page_number: number;
  page_size: number;
  has_next_page: boolean;
  has_previous_page: boolean;
  total_pages: number;
}

export interface CommissionRuleStateChangeResponse {
  rule_id: string;
  previous_state: RuleState;
  new_state: RuleState;
  changed_at: string; // ISO date string
  changed_by: string; // User ID
}

// Filter and Request Interfaces
export interface CommissionRulesFilterRequest {
  search?: string;
  owner_team_id?: string;
  scope?: CommissionRuleScope;
  states?: RuleState[];
  campaign_id?: string;
  priority_min?: number;
  priority_max?: number;
  effective_from?: string; // ISO date string
  effective_to?: string; // ISO date string
  created_by?: string;
  sort_by?: 'priority' | 'name' | 'created_at' | 'modified_at' | 'effective_from';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export interface CreateCommissionRuleRequest {
  name: string;
  description: string;
  formula: {
    expression: string;
    description: string;
  };
  scope: CommissionRuleScope;
  campaign_id?: string;
  restrictions?: {
    product_ids?: string[];
    category_ids?: string[];
    creator_tiers?: CreatorTierLevel[];
    min_order_value?: number;
    max_order_value?: number;
    description: string;
  };
  min_commission?: number;
  max_commission?: number;
  priority: number;
  effective_from: string; // ISO date string
  effective_to?: string; // ISO date string
}

export interface UpdateCommissionRuleRequest extends CreateCommissionRuleRequest {
  id: string;
}

// Formula Security Interfaces
export interface FormulaKeywordsResponse {
  allowed_operators: string[];
  allowed_math_functions: string[];
  allowed_variables: string[];
  max_formula_length: number;
  max_nesting_depth: number;
}

export interface ValidateFormulaRequest {
  expression: string;
}

export interface FormulaValidationResponse {
  is_valid: boolean;
  security_violations: string[];
  syntax_errors: string[];
  warnings: string[];
}

export interface TestFormulaRequest {
  expression: string;
  variables: Record<string, any>;
}

export interface FormulaTestResponse {
  is_success: boolean;
  result?: number;
  error_message?: string;
  security_violations: string[];
  expression: string;
  variables: Record<string, any>;
}

// Rule Conflicts Interfaces
export interface RuleConflict {
  conflict_type: ConflictType;
  conflicting_rules: CommissionRuleResponse[];
  description: string;
  severity: 'low' | 'medium' | 'high';
  resolution_suggestions: string[];
}

export interface RuleConflictsResult {
  has_conflicts: boolean;
  conflict_count: number;
  conflicts: RuleConflict[];
  recommendations: string[];
}

// Mock Data Interfaces for Development
export interface MockPartnership {
  id: string;
  brand_team_id: string;
  retailer_team_id: string;
  status: 'active' | 'pending' | 'inactive';
  who_requested: 'brand' | 'retailer';
  created_at: string;
  partnership_name: string;
}

export interface MockCampaign {
  id: string;
  name: string;
  description: string;
  team_id: string;
  status: 'active' | 'inactive' | 'ended';
  start_date: string;
  end_date?: string;
  campaign_type: 'exclusive' | 'general';
}

// Form Data Schemas with Zod Validation

// Commission Rule Form Schema
export const commissionFormulaSchema = z.object({
  expression: z.string()
    .min(1, 'Formula expression is required')
    .max(500, 'Formula expression cannot exceed 500 characters'),
  description: z.string()
    .min(1, 'Formula description is required')
    .max(1000, 'Description cannot exceed 1000 characters')
});

export const commissionRuleRestrictionsSchema = z.object({
  product_ids: z.array(z.string()).optional(),
  category_ids: z.array(z.string()).optional(),
  creator_tiers: z.array(z.nativeEnum(CreatorTierLevel)).optional(),
  min_order_value: z.number().min(0, 'Minimum order value must be positive').optional(),
  max_order_value: z.number().min(0, 'Maximum order value must be positive').optional(),
  description: z.string().min(1, 'Restrictions description is required')
}).refine((data) => {
  if (data.min_order_value && data.max_order_value) {
    return data.min_order_value <= data.max_order_value;
  }
  return true;
}, {
  message: 'Minimum order value must be less than or equal to maximum order value',
  path: ['max_order_value']
});

export const commissionRuleFormSchema = z.object({
  name: z.string()
    .min(1, 'Rule name is required')
    .max(100, 'Name cannot exceed 100 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(1000, 'Description cannot exceed 1000 characters'),
  formula: commissionFormulaSchema,
  scope: z.nativeEnum(CommissionRuleScope, {
    errorMap: () => ({ message: 'Please select a valid rule scope' })
  }),
  campaign_id: z.string().optional(),
  restrictions: commissionRuleRestrictionsSchema.optional(),
  min_commission: z.number().min(0, 'Minimum commission must be positive').optional(),
  max_commission: z.number().min(0, 'Maximum commission must be positive').optional(),
  priority: z.number()
    .min(1, 'Priority must be at least 1')
    .max(1000, 'Priority cannot exceed 1000'),
  effective_from: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Please provide a valid effective from date'),
  effective_to: z.string().optional().refine((val) => {
    if (!val) return true;
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Please provide a valid effective to date')
}).refine((data) => {
  if (data.min_commission && data.max_commission) {
    return data.min_commission <= data.max_commission;
  }
  return true;
}, {
  message: 'Minimum commission must be less than or equal to maximum commission',
  path: ['max_commission']
}).refine((data) => {
  if (data.effective_to) {
    const fromDate = new Date(data.effective_from);
    const toDate = new Date(data.effective_to);
    return fromDate <= toDate;
  }
  return true;
}, {
  message: 'Effective from date must be before effective to date',
  path: ['effective_to']
});

// Form Data Types
export type CommissionRuleFormData = z.infer<typeof commissionRuleFormSchema>;
export type CommissionFormulaFormData = z.infer<typeof commissionFormulaSchema>;
export type CommissionRuleRestrictionsFormData = z.infer<typeof commissionRuleRestrictionsSchema>;

// Filter Form Schema
export const commissionRulesFilterSchema = z.object({
  search: z.string().optional(),
  scope: z.nativeEnum(CommissionRuleScope).optional(),
  states: z.array(z.nativeEnum(RuleState)).optional(),
  campaign_id: z.string().optional(),
  priority_min: z.number().min(1).optional(),
  priority_max: z.number().min(1).optional(),
  effective_from: z.string().optional(),
  effective_to: z.string().optional(),
  created_by: z.string().optional(),
  sort_by: z.enum(['priority', 'name', 'created_at', 'modified_at', 'effective_from']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).optional(),
  page_size: z.number().min(1).max(100).optional()
});

export type CommissionRulesFilterFormData = z.infer<typeof commissionRulesFilterSchema>;

// Utility type transformers
export const transformFormDataToCreateRequest = (
  formData: CommissionRuleFormData
): CreateCommissionRuleRequest => ({
  ...formData,
  // Transform any form-specific fields if needed
});

export const transformResponseToFormData = (
  response: CommissionRuleResponse
): CommissionRuleFormData => ({
  name: response.name,
  description: response.description,
  formula: response.formula,
  scope: response.scope,
  campaign_id: response.campaign_id,
  restrictions: response.restrictions,
  min_commission: response.min_commission,
  max_commission: response.max_commission,
  priority: response.priority,
  effective_from: response.effective_from,
  effective_to: response.effective_to
});