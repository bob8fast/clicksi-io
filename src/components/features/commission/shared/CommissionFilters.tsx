// components/features/commission/shared/CommissionFilters.tsx - Advanced Filtering Component

'use client';

import { useState } from 'react';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ActiveFilters, type ActiveFilter } from '@/components/ui/active-filters';

import { useCampaignsByTeam } from '@/hooks/api/commission-hooks';
import { CommissionRuleScope, RuleState, type CommissionRulesFilterRequest } from '@/types/app/commission';

interface CommissionFiltersProps {
  filters: CommissionRulesFilterRequest;
  onFiltersChange: (filters: Partial<CommissionRulesFilterRequest>) => void;
  teamId?: string;
}

export function CommissionFilters({ filters, onFiltersChange, teamId }: CommissionFiltersProps) {
  const [effectiveFromDate, setEffectiveFromDate] = useState<Date | undefined>(
    filters.effective_from ? new Date(filters.effective_from) : undefined
  );
  const [effectiveToDate, setEffectiveToDate] = useState<Date | undefined>(
    filters.effective_to ? new Date(filters.effective_to) : undefined
  );

  // Fetch campaigns for campaign filter
  const { data: campaigns } = useCampaignsByTeam(teamId || '');

  // Handle scope change
  const handleScopeChange = (scope: string) => {
    onFiltersChange({
      scope: scope === 'all' ? undefined : (scope as CommissionRuleScope)
    });
  };

  // Handle states change
  const handleStateToggle = (state: RuleState, checked: boolean) => {
    const currentStates = filters.states || [];
    const newStates = checked
      ? [...currentStates, state]
      : currentStates.filter(s => s !== state);
    
    onFiltersChange({
      states: newStates.length > 0 ? newStates : undefined
    });
  };

  // Handle campaign change
  const handleCampaignChange = (campaignId: string) => {
    onFiltersChange({
      campaign_id: campaignId === 'all' ? undefined : campaignId
    });
  };

  // Handle priority range change
  const handlePriorityChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value, 10) : undefined;
    onFiltersChange({
      [type === 'min' ? 'priority_min' : 'priority_max']: numValue
    });
  };

  // Handle date changes
  const handleEffectiveFromChange = (date: Date | undefined) => {
    setEffectiveFromDate(date);
    onFiltersChange({
      effective_from: date ? date.toISOString() : undefined
    });
  };

  const handleEffectiveToChange = (date: Date | undefined) => {
    setEffectiveToDate(date);
    onFiltersChange({
      effective_to: date ? date.toISOString() : undefined
    });
  };

  // Handle sort change
  const handleSortChange = (sortBy: string) => {
    const [sort_by, sort_order] = sortBy.split('-');
    onFiltersChange({
      sort_by: sort_by as any,
      sort_order: sort_order as 'asc' | 'desc'
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setEffectiveFromDate(undefined);
    setEffectiveToDate(undefined);
    onFiltersChange({
      scope: undefined,
      states: undefined,
      campaign_id: undefined,
      priority_min: undefined,
      priority_max: undefined,
      effective_from: undefined,
      effective_to: undefined,
      sort_by: 'priority',
      sort_order: 'desc'
    });
  };

  // Convert filters to ActiveFilter format
  const getActiveFilters = (): ActiveFilter[] => {
    const activeFilters: ActiveFilter[] = [];

    if (filters.scope) {
      activeFilters.push({
        key: 'scope',
        value: filters.scope.replace(/_/g, ' '),
        label: 'Scope'
      });
    }

    if (filters.states && filters.states.length > 0) {
      activeFilters.push({
        key: 'states',
        value: filters.states,
        label: 'State'
      });
    }

    if (filters.campaign_id && campaigns) {
      const campaign = campaigns.find(c => c.id === filters.campaign_id);
      if (campaign) {
        activeFilters.push({
          key: 'campaign_id',
          value: campaign.name,
          label: 'Campaign'
        });
      }
    }

    if (filters.priority_min) {
      activeFilters.push({
        key: 'priority_min',
        value: `Min: ${filters.priority_min}`,
        label: 'Priority'
      });
    }

    if (filters.priority_max) {
      activeFilters.push({
        key: 'priority_max',
        value: `Max: ${filters.priority_max}`,
        label: 'Priority'
      });
    }

    if (filters.effective_from) {
      activeFilters.push({
        key: 'effective_from',
        value: format(new Date(filters.effective_from), 'MMM d, yyyy'),
        label: 'From'
      });
    }

    if (filters.effective_to) {
      activeFilters.push({
        key: 'effective_to',
        value: format(new Date(filters.effective_to), 'MMM d, yyyy'),
        label: 'To'
      });
    }

    return activeFilters;
  };

  // Handle removing individual filters
  const handleRemoveFilter = (filterKey: string, value?: string) => {
    switch (filterKey) {
      case 'scope':
        handleScopeChange('all');
        break;
      case 'states':
        if (value) {
          handleStateToggle(value as RuleState, false);
        } else {
          onFiltersChange({ states: undefined });
        }
        break;
      case 'campaign_id':
        handleCampaignChange('all');
        break;
      case 'priority_min':
        handlePriorityChange('min', '');
        break;
      case 'priority_max':
        handlePriorityChange('max', '');
        break;
      case 'effective_from':
        handleEffectiveFromChange(undefined);
        break;
      case 'effective_to':
        handleEffectiveToChange(undefined);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      <ActiveFilters
        filters={getActiveFilters()}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={clearFilters}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Rule Scope Filter */}
        <div className="space-y-2">
          <Label>Rule Scope</Label>
          <Select
            value={filters.scope || 'all'}
            onValueChange={handleScopeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All scopes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scopes</SelectItem>
              <SelectItem value={CommissionRuleScope.ExclusiveCampaignCommission}>
                Exclusive Campaign
              </SelectItem>
              <SelectItem value={CommissionRuleScope.GeneralBusinessSpecificCommission}>
                General Business
              </SelectItem>
              <SelectItem value={CommissionRuleScope.PartnershipDefinedCommission}>
                Partnership Defined
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Campaign Filter */}
        {campaigns && campaigns.length > 0 && (
          <div className="space-y-2">
            <Label>Campaign</Label>
            <Select
              value={filters.campaign_id || 'all'}
              onValueChange={handleCampaignChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All campaigns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {campaigns.map(campaign => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Sort Order */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={`${filters.sort_by || 'priority'}-${filters.sort_order || 'desc'}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority-desc">Priority (High to Low)</SelectItem>
              <SelectItem value="priority-asc">Priority (Low to High)</SelectItem>
              <SelectItem value="name-asc">Name (A to Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z to A)</SelectItem>
              <SelectItem value="created_at-desc">Created (Newest)</SelectItem>
              <SelectItem value="created_at-asc">Created (Oldest)</SelectItem>
              <SelectItem value="modified_at-desc">Modified (Newest)</SelectItem>
              <SelectItem value="modified_at-asc">Modified (Oldest)</SelectItem>
              <SelectItem value="effective_from-desc">Effective Date (Newest)</SelectItem>
              <SelectItem value="effective_from-asc">Effective Date (Oldest)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority Range */}
        <div className="space-y-2">
          <Label>Priority Range</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.priority_min || ''}
              onChange={(e) => handlePriorityChange('min', e.target.value)}
              className="flex-1"
              min={1}
              max={1000}
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.priority_max || ''}
              onChange={(e) => handlePriorityChange('max', e.target.value)}
              className="flex-1"
              min={1}
              max={1000}
            />
          </div>
        </div>

        {/* Effective From Date */}
        <div className="space-y-2">
          <Label>Effective From</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {effectiveFromDate ? format(effectiveFromDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={effectiveFromDate}
                onSelect={handleEffectiveFromChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Effective To Date */}
        <div className="space-y-2">
          <Label>Effective To</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {effectiveToDate ? format(effectiveToDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={effectiveToDate}
                onSelect={handleEffectiveToChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Rule States */}
      <div className="space-y-3">
        <Label>Rule States</Label>
        <div className="flex flex-wrap gap-4">
          {Object.values(RuleState).map(state => (
            <div key={state} className="flex items-center space-x-2">
              <Checkbox
                id={`state-${state}`}
                checked={(filters.states || []).includes(state)}
                onCheckedChange={(checked) => handleStateToggle(state, checked === true)}
              />
              <Label
                htmlFor={`state-${state}`}
                className="text-sm font-normal capitalize cursor-pointer"
              >
                {state}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}