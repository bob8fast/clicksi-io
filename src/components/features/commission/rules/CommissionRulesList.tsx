// components/features/commission/rules/CommissionRulesList.tsx - Commission Rules List with Cards

'use client';

import { CommissionRuleCard } from './CommissionRuleCard';
import { SimplePagination } from '@/components/ui/custom/simple-paginations';

import type { CommissionRuleResponse } from '@/types/app/commission';
import { EntityType } from '@/types/management';

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
}

interface CommissionRulesListProps {
  rules: CommissionRuleResponse[];
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export function CommissionRulesList({
  rules,
  pagination,
  onPageChange
}: CommissionRulesListProps) {
  if (rules.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Rules Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rules.map((rule) => (
          <CommissionRuleCard
            key={rule.id}
            rule={rule}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-medium">
              {(pagination.currentPage - 1) * pagination.pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}
            </span>{' '}
            of{' '}
            <span className="font-medium">{pagination.totalItems}</span>{' '}
            rules
          </div>
          
          <SimplePagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}