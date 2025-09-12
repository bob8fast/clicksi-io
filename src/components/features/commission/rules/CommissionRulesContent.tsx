// components/features/commission/rules/CommissionRulesContent.tsx - Main Commission Rules List Content

'use client';

import { useState, useMemo, useEffect } from 'react';
// import { useSession } from 'next-auth/react'; // Removed auth
import { Plus, Search, Filter, RefreshCw } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/custom/empty-state';

import { useCommissionHooks } from '@/hooks/api/commission-hooks';
import { CommissionRulesList } from './CommissionRulesList';
import { CommissionFilters } from '../shared/CommissionFilters';
import { RuleConflictsAlert } from './RuleConflictsAlert';

import type { CommissionRulesFilterRequest } from '@/types/app/commission';

export function CommissionRulesContent() {
  // const { data: session } = useSession(); // Removed auth
  const session = null; // Mock session - auth removed
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<CommissionRulesFilterRequest>({
    page: 1,
    page_size: 20,
    sort_by: 'priority',
    sort_order: 'desc'
  });

  const commissionHooks = useCommissionHooks();

  // Get current team ID from session
  const currentTeamId = session?.user_info?.team_id;
  
  // Set team filter when session is loaded
  useEffect(() => {
    if (currentTeamId && !filters.owner_team_id) {
      setFilters(prev => ({
        ...prev,
        owner_team_id: currentTeamId
      }));
    }
  }, [currentTeamId, filters.owner_team_id]);

  // Fetch commission rules with current filters
  const {
    data: rulesResponse,
    isLoading,
    error,
    refetch
  } = commissionHooks.getRules(filters);

  // Fetch conflicts for current team
  const {
    data: conflicts,
    isLoading: isLoadingConflicts,
    refetch: refetchConflicts
  } = commissionHooks.getConflicts(currentTeamId || '');

  // Manual conflict detection
  const detectConflictsMutation = commissionHooks.detectConflicts();

  // Get entity type from session for create link
  const entityType = session?.user_info?.business_type?.toLowerCase();
  const createHref = entityType === 'brand' 
    ? '/brand-management/commission/create'
    : '/retailer-management/commission/create';

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm || undefined,
      page: 1 // Reset to first page when searching
    }));
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: Partial<CommissionRulesFilterRequest>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filtering
    }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Handle manual conflict detection
  const handleDetectConflicts = async () => {
    if (!currentTeamId) return;
    
    try {
      await detectConflictsMutation.mutateAsync(currentTeamId);
    } catch (error) {
      console.error('Failed to detect conflicts:', error);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    refetch();
    refetchConflicts();
  };

  // Computed values
  const hasResults = rulesResponse && rulesResponse.items.length > 0;
  const hasFilters = !!(filters.search || filters.scope || filters.states?.length);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Rules</CardTitle>
            <CardDescription>
              {error.message || 'Failed to load commission rules'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRefresh} variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Commission Rules</h1>
          <p className="text-muted-foreground">
            Manage commission rules for your products and partnerships
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDetectConflicts}
            disabled={detectConflictsMutation.isPending || !currentTeamId}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${detectConflictsMutation.isPending ? 'animate-spin' : ''}`} />
            Check Conflicts
          </Button>
          <Button asChild>
            <Link href={createHref}>
              <Plus className="w-4 h-4 mr-2" />
              Create Rule
            </Link>
          </Button>
        </div>
      </div>

      {/* Conflicts Alert */}
      {currentTeamId && (
        <RuleConflictsAlert
          teamId={currentTeamId}
          conflicts={conflicts}
          isLoading={isLoadingConflicts}
        />
      )}

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search commission rules..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filter Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-muted' : ''}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {hasFilters && (
                  <span className="ml-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                    {[
                      filters.search,
                      filters.scope,
                      filters.states?.length
                    ].filter(Boolean).length}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t">
              <CommissionFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                teamId={currentTeamId}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {isLoading ? (
        <LoadingState 
          message="Loading commission rules..."
          description="Please wait while we fetch your commission rules."
        />
      ) : !hasResults ? (
        <EmptyState
          title={hasFilters ? 'No rules match your filters' : 'No commission rules yet'}
          description={hasFilters 
            ? 'Try adjusting your search terms or filters to find the rules you\'re looking for.'
            : 'Create your first commission rule to start managing commissions for your products.'
          }
        >
          {hasFilters ? (
            <Button 
              variant="outline"
              onClick={() => {
                setFilters({
                  page: 1,
                  page_size: 20,
                  sort_by: 'priority',
                  sort_order: 'desc',
                  owner_team_id: currentTeamId
                });
                setShowFilters(false);
              }}
            >
              Clear Filters
            </Button>
          ) : (
            <Button asChild>
              <Link href={createHref}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Rule
              </Link>
            </Button>
          )}
        </EmptyState>
      ) : (
        <CommissionRulesList
          rules={rulesResponse.items}
          pagination={{
            currentPage: rulesResponse.page_number,
            totalPages: rulesResponse.total_pages,
            totalItems: rulesResponse.total_count,
            hasNext: rulesResponse.has_next_page,
            hasPrevious: rulesResponse.has_previous_page,
            pageSize: rulesResponse.page_size
          }}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}