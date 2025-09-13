// hooks/api/commission-hooks.ts - Commission API hooks following category-hooks pattern

import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
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

import { CommissionMockService } from '@/services/mocks/commission-mock.service';

// Query Keys
const COMMISSION_QUERY_KEYS = {
  all: ['commission'] as const,
  rules: () => [...COMMISSION_QUERY_KEYS.all, 'rules'] as const,
  rulesList: (filters?: CommissionRulesFilterRequest) => 
    [...COMMISSION_QUERY_KEYS.rules(), 'list', filters] as const,
  rulesDetail: (id: string) => [...COMMISSION_QUERY_KEYS.rules(), 'detail', id] as const,
  conflicts: (teamId: string) => [...COMMISSION_QUERY_KEYS.all, 'conflicts', teamId] as const,
  formulaSecurity: () => [...COMMISSION_QUERY_KEYS.all, 'formula-security'] as const,
  formulaKeywords: () => [...COMMISSION_QUERY_KEYS.formulaSecurity(), 'keywords'] as const,
  partnerships: (teamId: string) => [...COMMISSION_QUERY_KEYS.all, 'partnerships', teamId] as const,
  campaigns: (teamId: string) => [...COMMISSION_QUERY_KEYS.all, 'campaigns', teamId] as const,
};

/**
 * Commission hooks with optimized caching and error handling
 * Following the same pattern as category-hooks.ts
 */
export const useCommissionHooks = () => {
  const queryClient = useQueryClient();

  const commissionHooks = {
    // Query hooks with predefined cache times
    getRules: (filters?: CommissionRulesFilterRequest) => {
      return useQuery({
        queryKey: COMMISSION_QUERY_KEYS.rulesList(filters),
        queryFn: () => CommissionMockService.getCommissionRules(filters),
        staleTime: 5 * 60 * 1000,        // 5 minutes
        gcTime: 10 * 60 * 1000,          // 10 minutes (React Query v5)
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
      });
    },

    getRuleById: (id: string) => {
      return useQuery({
        queryKey: COMMISSION_QUERY_KEYS.rulesDetail(id),
        queryFn: () => CommissionMockService.getCommissionRule(id),
        staleTime: 5 * 60 * 1000,        // 5 minutes
        gcTime: 10 * 60 * 1000,          // 10 minutes
        enabled: !!id,
        refetchOnWindowFocus: false,
        retry: 2
      });
    },

    getConflicts: (teamId: string) => {
      return useQuery({
        queryKey: COMMISSION_QUERY_KEYS.conflicts(teamId),
        queryFn: () => CommissionMockService.detectRuleConflicts(teamId),
        staleTime: 2 * 60 * 1000,        // 2 minutes - conflicts should be checked frequently
        gcTime: 5 * 60 * 1000,           // 5 minutes
        enabled: !!teamId,
        refetchOnWindowFocus: false,
        retry: 1
      });
    },

    getFormulaKeywords: () => {
      return useQuery({
        queryKey: COMMISSION_QUERY_KEYS.formulaKeywords(),
        queryFn: () => CommissionMockService.getFormulaKeywords(),
        staleTime: 30 * 60 * 1000,       // 30 minutes - keywords rarely change
        gcTime: 60 * 60 * 1000,          // 1 hour
        refetchOnWindowFocus: false,
        retry: 2
      });
    },

    getPartnershipsByTeam: (teamId: string) => {
      return useQuery({
        queryKey: COMMISSION_QUERY_KEYS.partnerships(teamId),
        queryFn: () => CommissionMockService.getPartnershipsByTeamId(teamId),
        staleTime: 5 * 60 * 1000,        // 5 minutes
        gcTime: 10 * 60 * 1000,          // 10 minutes
        enabled: !!teamId,
        refetchOnWindowFocus: false,
        retry: 2
      });
    },

    getCampaignsByTeam: (teamId: string) => {
      return useQuery({
        queryKey: COMMISSION_QUERY_KEYS.campaigns(teamId),
        queryFn: () => CommissionMockService.getCampaignsByTeamId(teamId),
        staleTime: 5 * 60 * 1000,        // 5 minutes
        gcTime: 10 * 60 * 1000,          // 10 minutes
        enabled: !!teamId,
        refetchOnWindowFocus: false,
        retry: 2
      });
    },

    // Mutation hooks with cache invalidation
    createRule: () => {
      return useMutation({
        mutationFn: (data: CreateCommissionRuleRequest) => 
          CommissionMockService.createCommissionRule(data),
        onSuccess: (newRule) => {
          // Invalidate rules lists to show new rule
          queryClient.invalidateQueries({ 
            queryKey: COMMISSION_QUERY_KEYS.rules() 
          });
          
          // Invalidate conflicts since new rule might create conflicts
          if (newRule.owner_team_id) {
            queryClient.invalidateQueries({ 
              queryKey: COMMISSION_QUERY_KEYS.conflicts(newRule.owner_team_id) 
            });
          }
        },
        onError: (error) => {
          console.error('Failed to create commission rule:', error);
        }
      });
    },

    updateRule: () => {
      return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCommissionRuleRequest }) => 
          CommissionMockService.updateCommissionRule(id, data),
        onSuccess: (updatedRule) => {
          // Update the specific rule in cache
          queryClient.setQueryData(
            COMMISSION_QUERY_KEYS.rulesDetail(updatedRule.id),
            updatedRule
          );
          
          // Invalidate rules lists to reflect changes
          queryClient.invalidateQueries({ 
            queryKey: COMMISSION_QUERY_KEYS.rules() 
          });
          
          // Invalidate conflicts since rule changes might affect conflicts
          if (updatedRule.owner_team_id) {
            queryClient.invalidateQueries({ 
              queryKey: COMMISSION_QUERY_KEYS.conflicts(updatedRule.owner_team_id) 
            });
          }
        },
        onError: (error) => {
          console.error('Failed to update commission rule:', error);
        }
      });
    },

    updateRuleState: () => {
      return useMutation({
        mutationFn: ({ id, state }: { id: string; state: RuleState }) => 
          CommissionMockService.updateCommissionRuleState(id, state),
        onSuccess: (stateChange) => {
          // Invalidate rules lists to reflect state changes
          queryClient.invalidateQueries({ 
            queryKey: COMMISSION_QUERY_KEYS.rules() 
          });
          
          // Invalidate rule detail to show updated state
          queryClient.invalidateQueries({ 
            queryKey: COMMISSION_QUERY_KEYS.rulesDetail(stateChange.rule_id) 
          });
          
          // Invalidate conflicts since state changes might affect conflicts
          queryClient.invalidateQueries({ 
            predicate: (query) => 
              query.queryKey[0] === 'commission' && 
              query.queryKey[1] === 'conflicts'
          });
        },
        onError: (error) => {
          console.error('Failed to update commission rule state:', error);
        }
      });
    },

    deleteRule: () => {
      return useMutation({
        mutationFn: (id: string) => CommissionMockService.deleteCommissionRule(id),
        onSuccess: (_, deletedId) => {
          // Remove the rule from cache
          queryClient.removeQueries({ 
            queryKey: COMMISSION_QUERY_KEYS.rulesDetail(deletedId) 
          });
          
          // Invalidate rules lists
          queryClient.invalidateQueries({ 
            queryKey: COMMISSION_QUERY_KEYS.rules() 
          });
          
          // Invalidate all conflicts since rule deletion might resolve conflicts
          queryClient.invalidateQueries({ 
            predicate: (query) => 
              query.queryKey[0] === 'commission' && 
              query.queryKey[1] === 'conflicts'
          });
        },
        onError: (error) => {
          console.error('Failed to delete commission rule:', error);
        }
      });
    },

    // Formula validation mutations
    validateFormula: () => {
      return useMutation({
        mutationFn: (request: ValidateFormulaRequest) => 
          CommissionMockService.validateFormula(request),
        retry: 1,
        onError: (error) => {
          console.error('Formula validation failed:', error);
        }
      });
    },

    testFormula: () => {
      return useMutation({
        mutationFn: (request: TestFormulaRequest) => 
          CommissionMockService.testFormula(request),
        retry: 1,
        onError: (error) => {
          console.error('Formula test failed:', error);
        }
      });
    },

    // Manual conflict detection
    detectConflicts: () => {
      return useMutation({
        mutationFn: (teamId: string) => 
          CommissionMockService.detectRuleConflicts(teamId),
        onSuccess: (result, teamId) => {
          // Update conflicts cache with fresh data
          queryClient.setQueryData(
            COMMISSION_QUERY_KEYS.conflicts(teamId),
            result
          );
        },
        onError: (error) => {
          console.error('Conflict detection failed:', error);
        }
      });
    },

    // Cache invalidation utilities
    invalidateCache: {
      all: () => {
        queryClient.invalidateQueries({ 
          queryKey: COMMISSION_QUERY_KEYS.all 
        });
      },
      rules: (filters?: CommissionRulesFilterRequest) => {
        if (filters) {
          queryClient.invalidateQueries({ 
            queryKey: COMMISSION_QUERY_KEYS.rulesList(filters) 
          });
        } else {
          queryClient.invalidateQueries({ 
            queryKey: COMMISSION_QUERY_KEYS.rules() 
          });
        }
      },
      ruleDetail: (id: string) => {
        queryClient.invalidateQueries({ 
          queryKey: COMMISSION_QUERY_KEYS.rulesDetail(id) 
        });
      },
      conflicts: (teamId: string) => {
        queryClient.invalidateQueries({ 
          queryKey: COMMISSION_QUERY_KEYS.conflicts(teamId) 
        });
      },
      partnerships: (teamId: string) => {
        queryClient.invalidateQueries({ 
          queryKey: COMMISSION_QUERY_KEYS.partnerships(teamId) 
        });
      },
      campaigns: (teamId: string) => {
        queryClient.invalidateQueries({ 
          queryKey: COMMISSION_QUERY_KEYS.campaigns(teamId) 
        });
      }
    },

    // Cache management utilities
    prefetchRules: async (filters?: CommissionRulesFilterRequest) => {
      return queryClient.prefetchQuery({
        queryKey: COMMISSION_QUERY_KEYS.rulesList(filters),
        queryFn: () => CommissionMockService.getCommissionRules(filters),
        staleTime: 5 * 60 * 1000
      });
    },

    prefetchRuleDetail: async (id: string) => {
      return queryClient.prefetchQuery({
        queryKey: COMMISSION_QUERY_KEYS.rulesDetail(id),
        queryFn: () => CommissionMockService.getCommissionRule(id),
        staleTime: 5 * 60 * 1000
      });
    },

    prefetchConflicts: async (teamId: string) => {
      return queryClient.prefetchQuery({
        queryKey: COMMISSION_QUERY_KEYS.conflicts(teamId),
        queryFn: () => CommissionMockService.detectRuleConflicts(teamId),
        staleTime: 2 * 60 * 1000
      });
    },

    // Optimistic updates
    optimisticUpdateRuleState: (id: string, newState: RuleState) => {
      queryClient.setQueryData(
        COMMISSION_QUERY_KEYS.rulesDetail(id),
        (oldData: CommissionRuleResponse | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            state: newState,
            is_active: newState === RuleState.Active,
            modified_at: new Date().toISOString()
          };
        }
      );
    }
  };

  return commissionHooks;
};

// Export query keys for external use
export { COMMISSION_QUERY_KEYS };

// Individual hook exports for component-specific usage
export const useCommissionRules = (filters?: CommissionRulesFilterRequest) => {
  const hooks = useCommissionHooks();
  return hooks.getRules(filters);
};

export const useCommissionRule = (id: string) => {
  const hooks = useCommissionHooks();
  return hooks.getRuleById(id);
};

export const useCommissionConflicts = (teamId: string) => {
  const hooks = useCommissionHooks();
  return hooks.getConflicts(teamId);
};

export const useFormulaKeywords = () => {
  const hooks = useCommissionHooks();
  return hooks.getFormulaKeywords();
};

export const usePartnershipsByTeam = (teamId: string) => {
  const hooks = useCommissionHooks();
  return hooks.getPartnershipsByTeam(teamId);
};

export const useCampaignsByTeam = (teamId: string) => {
  const hooks = useCommissionHooks();
  return hooks.getCampaignsByTeam(teamId);
};