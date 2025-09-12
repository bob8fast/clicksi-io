// services/mocks/commission-mock.service.ts - Mock API service for commission development

import {
  type CommissionRulesFilterRequest,
  type CommissionRulesListResponse,
  type CommissionRuleResponse,
  type CreateCommissionRuleRequest,
  type UpdateCommissionRuleRequest,
  type CommissionRuleStateChangeResponse,
  type RuleConflictsResult,
  type FormulaKeywordsResponse,
  type ValidateFormulaRequest,
  type FormulaValidationResponse,
  type TestFormulaRequest,
  type FormulaTestResponse,
  type MockPartnership,
  type MockCampaign,
  RuleState
} from '@/types/app/commission';

import {
  mockCommissionRules,
  mockRuleConflicts,
  mockFormulaKeywords,
  mockFormulaValidationResponses,
  mockFormulaTestResponse,
  // mockPartnerships,
  // mockCampaigns,
  getRulesByTeamId,
  getPartnershipsByTeamId,
  getCampaignsByTeamId
} from '@/lib/mocks/commission-data';

// Simulate API delay
const delay = (ms: number = 500): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Error simulation helper
const simulateError = (errorRate: number = 0.1): void => {
  if (Math.random() < errorRate) {
    throw new Error('Simulated API error - please retry');
  }
};

export class CommissionMockService {
  private static rules: CommissionRuleResponse[] = [...mockCommissionRules];

  // Commission Rules API Mock
  static async getCommissionRules(
    filters: CommissionRulesFilterRequest = {}
  ): Promise<CommissionRulesListResponse> {
    await delay(300);
    simulateError(0.05); // 5% error rate

    let filteredRules = [...this.rules];

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredRules = filteredRules.filter(rule =>
        rule.name.toLowerCase().includes(searchTerm) ||
        rule.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.owner_team_id) {
      filteredRules = filteredRules.filter(rule =>
        rule.owner_team_id === filters.owner_team_id
      );
    }

    if (filters.scope) {
      filteredRules = filteredRules.filter(rule => rule.scope === filters.scope);
    }

    if (filters.states && filters.states.length > 0) {
      filteredRules = filteredRules.filter(rule =>
        filters.states!.includes(rule.state)
      );
    }

    if (filters.campaign_id) {
      filteredRules = filteredRules.filter(rule =>
        rule.campaign_id === filters.campaign_id
      );
    }

    if (filters.priority_min) {
      filteredRules = filteredRules.filter(rule =>
        rule.priority >= filters.priority_min!
      );
    }

    if (filters.priority_max) {
      filteredRules = filteredRules.filter(rule =>
        rule.priority <= filters.priority_max!
      );
    }

    if (filters.effective_from) {
      filteredRules = filteredRules.filter(rule =>
        new Date(rule.effective_from) >= new Date(filters.effective_from!)
      );
    }

    if (filters.effective_to) {
      filteredRules = filteredRules.filter(rule =>
        !rule.effective_to || new Date(rule.effective_to) <= new Date(filters.effective_to!)
      );
    }

    if (filters.created_by) {
      filteredRules = filteredRules.filter(rule =>
        rule.created_by_user_id === filters.created_by
      );
    }

    // Apply sorting
    if (filters.sort_by) {
      filteredRules.sort((a, b) => {
        let aVal: any, bVal: any;
        
        switch (filters.sort_by) {
          case 'priority':
            aVal = a.priority;
            bVal = b.priority;
            break;
          case 'name':
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
            break;
          case 'created_at':
            aVal = new Date(a.created_at);
            bVal = new Date(b.created_at);
            break;
          case 'modified_at':
            aVal = new Date(a.modified_at);
            bVal = new Date(b.modified_at);
            break;
          case 'effective_from':
            aVal = new Date(a.effective_from);
            bVal = new Date(b.effective_from);
            break;
          default:
            return 0;
        }

        if (aVal < bVal) return filters.sort_order === 'desc' ? 1 : -1;
        if (aVal > bVal) return filters.sort_order === 'desc' ? -1 : 1;
        return 0;
      });
    }

    // Apply pagination
    const page = filters.page || 1;
    const pageSize = filters.page_size || 20;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const totalCount = filteredRules.length;
    const paginatedRules = filteredRules.slice(startIndex, endIndex);

    return {
      items: paginatedRules,
      total_count: totalCount,
      page_number: page,
      page_size: pageSize,
      has_next_page: endIndex < totalCount,
      has_previous_page: page > 1,
      total_pages: Math.ceil(totalCount / pageSize)
    };
  }

  static async getCommissionRule(id: string): Promise<CommissionRuleResponse> {
    await delay(200);
    simulateError(0.05);

    const rule = this.rules.find(r => r.id === id);
    if (!rule) {
      throw new Error(`Commission rule with ID ${id} not found`);
    }

    return rule;
  }

  static async createCommissionRule(
    data: CreateCommissionRuleRequest
  ): Promise<CommissionRuleResponse> {
    await delay(800);
    simulateError(0.1);

    const now = new Date().toISOString();
    const newRule: CommissionRuleResponse = {
      id: `rule-${Date.now()}`,
      ...data,
      owner_team_id: data.owner_team_id || 'current-team-id', // Should come from session
      created_by_user_id: 'current-user-id', // Should come from session
      state: RuleState.Draft,
      is_active: false,
      created_at: now,
      modified_at: now
    };

    this.rules.push(newRule);
    return newRule;
  }

  static async updateCommissionRule(
    id: string,
    data: UpdateCommissionRuleRequest
  ): Promise<CommissionRuleResponse> {
    await delay(600);
    simulateError(0.1);

    const ruleIndex = this.rules.findIndex(r => r.id === id);
    if (ruleIndex === -1) {
      throw new Error(`Commission rule with ID ${id} not found`);
    }

    const existingRule = this.rules[ruleIndex];
    const updatedRule: CommissionRuleResponse = {
      ...existingRule,
      ...data,
      modified_at: new Date().toISOString()
    };

    this.rules[ruleIndex] = updatedRule;
    return updatedRule;
  }

  static async updateCommissionRuleState(
    id: string,
    newState: RuleState
  ): Promise<CommissionRuleStateChangeResponse> {
    await delay(400);
    simulateError(0.05);

    const rule = this.rules.find(r => r.id === id);
    if (!rule) {
      throw new Error(`Commission rule with ID ${id} not found`);
    }

    const previousState = rule.state;
    rule.state = newState;
    rule.is_active = newState === RuleState.Active;
    rule.modified_at = new Date().toISOString();

    return {
      rule_id: id,
      previous_state: previousState,
      new_state: newState,
      changed_at: rule.modified_at,
      changed_by: 'current-user-id'
    };
  }

  static async deleteCommissionRule(id: string): Promise<void> {
    await delay(300);
    simulateError(0.05);

    const ruleIndex = this.rules.findIndex(r => r.id === id);
    if (ruleIndex === -1) {
      throw new Error(`Commission rule with ID ${id} not found`);
    }

    this.rules.splice(ruleIndex, 1);
  }

  // Rule Conflicts API Mock
  static async detectRuleConflicts(teamId: string): Promise<RuleConflictsResult> {
    await delay(400);
    simulateError(0.05);

    // Simple conflict simulation - in real implementation, this would be complex logic
    const teamRules = getRulesByTeamId(teamId);
    const activeRules = teamRules.filter(rule => rule.state === RuleState.Active);

    if (activeRules.length > 3) {
      return {
        ...mockRuleConflicts,
        conflicts: mockRuleConflicts.conflicts.filter(conflict =>
          conflict.conflicting_rules.some(rule =>
            teamRules.some(teamRule => teamRule.id === rule.id)
          )
        )
      };
    }

    return {
      has_conflicts: false,
      conflict_count: 0,
      conflicts: [],
      recommendations: ['No conflicts detected for current team rules']
    };
  }

  // Formula Security API Mock
  static async getFormulaKeywords(): Promise<FormulaKeywordsResponse> {
    await delay(200);
    simulateError(0.02);

    return mockFormulaKeywords;
  }

  static async validateFormula(
    request: ValidateFormulaRequest
  ): Promise<FormulaValidationResponse> {
    await delay(300);
    simulateError(0.05);

    const expression = request.expression.toLowerCase();

    // Simple validation simulation
    if (expression.includes('system') || expression.includes('eval')) {
      return mockFormulaValidationResponses.security_violation;
    }

    if (expression.includes('((') && !expression.includes('))')) {
      return mockFormulaValidationResponses.invalid_syntax;
    }

    if (expression.length > mockFormulaKeywords.max_formula_length) {
      return {
        is_valid: false,
        security_violations: [],
        syntax_errors: [`Formula exceeds maximum length of ${mockFormulaKeywords.max_formula_length} characters`],
        warnings: []
      };
    }

    return mockFormulaValidationResponses.valid;
  }

  static async testFormula(request: TestFormulaRequest): Promise<FormulaTestResponse> {
    await delay(500);
    simulateError(0.05);

    // Simple test simulation - would evaluate the actual formula in real implementation
    try {
      return {
        ...mockFormulaTestResponse,
        expression: request.expression,
        variables: request.variables
      };
    } catch (_error) {
      return {
        is_success: false,
        error_message: 'Formula evaluation failed',
        expression: request.expression,
        variables: request.variables,
        security_violations: []
      };
    }
  }

  // Mock UserManagement API calls for partnerships and campaigns
  static async getPartnershipsByTeamId(teamId: string): Promise<MockPartnership[]> {
    await delay(250);
    simulateError(0.03);

    return getPartnershipsByTeamId(teamId);
  }

  static async getCampaignsByTeamId(teamId: string): Promise<MockCampaign[]> {
    await delay(200);
    simulateError(0.03);

    return getCampaignsByTeamId(teamId);
  }

  // Utility methods for testing
  static resetMockData(): void {
    this.rules = [...mockCommissionRules];
  }

  static addMockRule(rule: CommissionRuleResponse): void {
    this.rules.push(rule);
  }

  static removeMockRule(id: string): void {
    const index = this.rules.findIndex(r => r.id === id);
    if (index !== -1) {
      this.rules.splice(index, 1);
    }
  }
}

// Export individual functions for easier testing
export const {
  getCommissionRules,
  getCommissionRule,
  createCommissionRule,
  updateCommissionRule,
  updateCommissionRuleState,
  deleteCommissionRule,
  detectRuleConflicts,
  getFormulaKeywords,
  validateFormula,
  testFormula,
  getPartnershipsByTeamId,
  getCampaignsByTeamId
} = CommissionMockService;