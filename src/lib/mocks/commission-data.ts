// lib/mocks/commission-data.ts - Mock commission data for development

import {
  CommissionRuleScope,
  RuleState,
  CreatorTierLevel,
  ConflictType,
  type CommissionRuleResponse,
  type MockPartnership,
  type MockCampaign,
  type RuleConflictsResult,
  type FormulaKeywordsResponse,
  type FormulaValidationResponse,
  type FormulaTestResponse
} from '@/types/app/commission';

// Mock Partnerships Data
export const mockPartnerships: MockPartnership[] = [
  {
    id: 'partnership-1',
    brand_team_id: 'team-brand-1',
    retailer_team_id: 'team-retailer-1',
    status: 'active',
    who_requested: 'brand',
    created_at: '2024-01-15T10:00:00Z',
    partnership_name: 'Beauty Co × Premium Store'
  },
  {
    id: 'partnership-2',
    brand_team_id: 'team-brand-1',
    retailer_team_id: 'team-retailer-2',
    status: 'active',
    who_requested: 'retailer',
    created_at: '2024-02-01T14:30:00Z',
    partnership_name: 'Beauty Co × Fashion Hub'
  },
  {
    id: 'partnership-3',
    brand_team_id: 'team-brand-2',
    retailer_team_id: 'team-retailer-1',
    status: 'pending',
    who_requested: 'brand',
    created_at: '2024-07-01T09:15:00Z',
    partnership_name: 'Skincare Plus × Premium Store'
  }
];

// Mock Campaigns Data
export const mockCampaigns: MockCampaign[] = [
  // Brand Campaigns
  {
    id: 'campaign-brand-1',
    name: 'Summer Beauty Collection 2024',
    description: 'Exclusive summer skincare and makeup products',
    team_id: 'team-brand-1',
    status: 'active',
    start_date: '2024-06-01T00:00:00Z',
    end_date: '2024-08-31T23:59:59Z',
    campaign_type: 'exclusive'
  },
  {
    id: 'campaign-brand-2',
    name: 'Winter Skincare Launch',
    description: 'New winter moisturizer and serum collection',
    team_id: 'team-brand-1',
    status: 'active',
    start_date: '2024-12-01T00:00:00Z',
    end_date: '2024-02-28T23:59:59Z',
    campaign_type: 'general'
  },
  {
    id: 'campaign-brand-3',
    name: 'Organic Beauty Line',
    description: 'Premium organic and natural beauty products',
    team_id: 'team-brand-2',
    status: 'active',
    start_date: '2024-05-15T00:00:00Z',
    campaign_type: 'exclusive'
  },
  // Retailer Campaigns
  {
    id: 'campaign-retailer-1',
    name: 'Premium Store Beauty Week',
    description: 'Special promotion week for beauty products',
    team_id: 'team-retailer-1',
    status: 'active',
    start_date: '2024-07-15T00:00:00Z',
    end_date: '2024-07-22T23:59:59Z',
    campaign_type: 'general'
  },
  {
    id: 'campaign-retailer-2',
    name: 'Fashion Hub Creator Collab',
    description: 'Creator collaboration campaign',
    team_id: 'team-retailer-2',
    status: 'inactive',
    start_date: '2024-03-01T00:00:00Z',
    end_date: '2024-03-31T23:59:59Z',
    campaign_type: 'exclusive'
  }
];

// Mock Commission Rules Data
export const mockCommissionRules: CommissionRuleResponse[] = [
  {
    id: 'rule-1',
    name: 'Premium Beauty Products Commission',
    description: 'Higher commission rate for premium beauty products over $50',
    formula: {
      expression: 'order_value >= 50 ? order_value * 0.12 : order_value * 0.08',
      description: '12% for orders ≥$50, otherwise 8%'
    },
    scope: CommissionRuleScope.GeneralBusinessSpecificCommission,
    owner_team_id: 'team-brand-1',
    created_by_user_id: 'user-1',
    restrictions: {
      product_ids: ['product-1', 'product-2'],
      category_ids: ['skincare', 'makeup'],
      creator_tiers: [CreatorTierLevel.Gold, CreatorTierLevel.Platinum],
      min_order_value: 25,
      max_order_value: 500,
      description: 'Premium skincare and makeup products for Gold+ creators'
    },
    min_commission: 5,
    max_commission: 50,
    priority: 100,
    state: RuleState.Active,
    effective_from: '2024-01-01T00:00:00Z',
    effective_to: '2024-12-31T23:59:59Z',
    is_active: true,
    created_at: '2024-01-01T10:00:00Z',
    modified_at: '2024-01-15T14:30:00Z'
  },
  {
    id: 'rule-2',
    name: 'Summer Campaign Exclusive',
    description: 'Special commission for summer beauty collection',
    formula: {
      expression: 'order_value * 0.15',
      description: 'Flat 15% commission rate'
    },
    scope: CommissionRuleScope.ExclusiveCampaignCommission,
    campaign_id: 'campaign-brand-1',
    owner_team_id: 'team-brand-1',
    created_by_user_id: 'user-1',
    restrictions: {
      creator_tiers: [CreatorTierLevel.Silver, CreatorTierLevel.Gold, CreatorTierLevel.Platinum],
      min_order_value: 30,
      description: 'Summer collection for Silver+ creators'
    },
    min_commission: 10,
    max_commission: 100,
    priority: 200,
    state: RuleState.Active,
    effective_from: '2024-06-01T00:00:00Z',
    effective_to: '2024-08-31T23:59:59Z',
    is_active: true,
    created_at: '2024-05-15T09:00:00Z',
    modified_at: '2024-05-15T09:00:00Z'
  },
  {
    id: 'rule-3',
    name: 'Partnership Commission - Premium Store',
    description: 'Commission for Beauty Co and Premium Store partnership',
    formula: {
      expression: 'order_value * 0.10 + (quantity > 3 ? order_value * 0.02 : 0)',
      description: '10% base + 2% bonus for orders with >3 items'
    },
    scope: CommissionRuleScope.PartnershipDefinedCommission,
    owner_team_id: 'team-brand-1',
    created_by_user_id: 'user-1',
    restrictions: {
      min_order_value: 20,
      description: 'Partnership-specific commission structure'
    },
    min_commission: 3,
    max_commission: 80,
    priority: 150,
    state: RuleState.Active,
    effective_from: '2024-01-15T00:00:00Z',
    is_active: true,
    created_at: '2024-01-15T15:00:00Z',
    modified_at: '2024-01-15T15:00:00Z'
  },
  {
    id: 'rule-4',
    name: 'Draft Rule - New Product Launch',
    description: 'Commission for upcoming product launch',
    formula: {
      expression: 'order_value * 0.20',
      description: 'Premium 20% commission for new products'
    },
    scope: CommissionRuleScope.GeneralBusinessSpecificCommission,
    owner_team_id: 'team-brand-2',
    created_by_user_id: 'user-2',
    min_commission: 5,
    max_commission: 200,
    priority: 300,
    state: RuleState.Draft,
    effective_from: '2024-09-01T00:00:00Z',
    effective_to: '2024-11-30T23:59:59Z',
    is_active: false,
    created_at: '2024-07-20T11:00:00Z',
    modified_at: '2024-07-25T16:45:00Z'
  },
  {
    id: 'rule-5',
    name: 'Inactive Holiday Rule',
    description: 'Previous holiday season commission rule',
    formula: {
      expression: 'order_value * 0.18',
      description: 'Holiday season 18% commission'
    },
    scope: CommissionRuleScope.ExclusiveCampaignCommission,
    campaign_id: 'campaign-old-holiday',
    owner_team_id: 'team-brand-1',
    created_by_user_id: 'user-1',
    min_commission: 8,
    max_commission: 150,
    priority: 180,
    state: RuleState.Inactive,
    effective_from: '2023-11-01T00:00:00Z',
    effective_to: '2023-12-31T23:59:59Z',
    is_active: false,
    created_at: '2023-10-15T10:00:00Z',
    modified_at: '2024-01-05T09:30:00Z'
  }
];

// Mock Rule Conflicts Data
export const mockRuleConflicts: RuleConflictsResult = {
  has_conflicts: true,
  conflict_count: 2,
  conflicts: [
    {
      conflict_type: ConflictType.OverlappingTimePeriods,
      conflicting_rules: [mockCommissionRules[0], mockCommissionRules[1]],
      description: 'Rules have overlapping effective periods for the same product categories',
      severity: 'medium',
      resolution_suggestions: [
        'Adjust effective dates to avoid overlap',
        'Set different priority levels',
        'Modify product/category restrictions'
      ]
    },
    {
      conflict_type: ConflictType.RestrictionsOverlap,
      conflicting_rules: [mockCommissionRules[1], mockCommissionRules[2]],
      description: 'Similar creator tier restrictions may cause rule selection ambiguity',
      severity: 'low',
      resolution_suggestions: [
        'Specify more granular creator tier restrictions',
        'Adjust priority values to clarify rule precedence'
      ]
    }
  ],
  recommendations: [
    'Review rule priorities to ensure proper precedence',
    'Consider consolidating similar rules to reduce conflicts',
    'Test rule combinations with sample orders before activation'
  ]
};

// Mock Formula Security Data
export const mockFormulaKeywords: FormulaKeywordsResponse = {
  allowed_operators: [
    '+', '-', '*', '/', '%', '(', ')',
    '>', '<', '>=', '<=', '==', '!=',
    '?', ':', '&&', '||', '!'
  ],
  allowed_math_functions: [
    'Round', 'Max', 'Min', 'Abs', 'Ceiling', 'Floor'
  ],
  allowed_variables: [
    'total', 'order_value', 'price', 'quantity',
    'product_id', 'category_id', 'min_order_value', 'max_order_value'
  ],
  max_formula_length: 500,
  max_nesting_depth: 10
};

// Mock Formula Validation Responses
export const mockFormulaValidationResponses = {
  valid: {
    is_valid: true,
    security_violations: [],
    syntax_errors: [],
    warnings: []
  } as FormulaValidationResponse,

  invalid_syntax: {
    is_valid: false,
    security_violations: [],
    syntax_errors: [
      'Missing closing parenthesis at position 23',
      'Invalid operator sequence at position 15'
    ],
    warnings: ['Consider adding parentheses for clarity']
  } as FormulaValidationResponse,

  security_violation: {
    is_valid: false,
    security_violations: [
      'Blocked pattern "System." detected at position 10',
      'Unsafe function call detected'
    ],
    syntax_errors: [],
    warnings: []
  } as FormulaValidationResponse
};

// Mock Formula Test Response
export const mockFormulaTestResponse: FormulaTestResponse = {
  is_success: true,
  result: 15.50,
  expression: 'order_value * 0.15',
  variables: {
    order_value: 103.33,
    quantity: 2,
    product_id: 'product-1',
    category_id: 'skincare'
  },
  security_violations: []
};

// Utility functions for mock data
export const getPartnershipsByTeamId = (teamId: string): MockPartnership[] => {
  return mockPartnerships.filter(p => 
    p.brand_team_id === teamId || p.retailer_team_id === teamId
  );
};

export const getCampaignsByTeamId = (teamId: string): MockCampaign[] => {
  return mockCampaigns.filter(c => c.team_id === teamId);
};

export const getActivePartnershipsByTeamId = (teamId: string): MockPartnership[] => {
  return getPartnershipsByTeamId(teamId).filter(p => p.status === 'active');
};

export const getActiveCampaignsByTeamId = (teamId: string): MockCampaign[] => {
  return getCampaignsByTeamId(teamId).filter(c => c.status === 'active');
};

export const getRulesByTeamId = (teamId: string): CommissionRuleResponse[] => {
  return mockCommissionRules.filter(rule => rule.owner_team_id === teamId);
};

export const canCreateScope = (scope: CommissionRuleScope, teamId: string): boolean => {
  switch (scope) {
    case CommissionRuleScope.ExclusiveCampaignCommission:
      return getActiveCampaignsByTeamId(teamId).length > 0;
    case CommissionRuleScope.GeneralBusinessSpecificCommission:
    case CommissionRuleScope.PartnershipDefinedCommission:
      return getActivePartnershipsByTeamId(teamId).length > 0;
    default:
      return false;
  }
};

export const getScopeDisabledReason = (scope: CommissionRuleScope, _teamId: string): string => {
  switch (scope) {
    case CommissionRuleScope.ExclusiveCampaignCommission:
      return 'No active campaigns available. Create a campaign first.';
    case CommissionRuleScope.GeneralBusinessSpecificCommission:
    case CommissionRuleScope.PartnershipDefinedCommission:
      return 'No active partnerships available. Establish a partnership first.';
    default:
      return 'This scope is not available.';
  }
};