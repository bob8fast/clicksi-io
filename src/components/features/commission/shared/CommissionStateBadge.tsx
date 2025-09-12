// components/features/commission/shared/CommissionStateBadge.tsx - State Display Badge

'use client';

import { Badge } from '@/components/ui/badge';
import { RuleState } from '@/types/app/commission';

interface CommissionStateBadgeProps {
  state: RuleState;
  className?: string;
}

export function CommissionStateBadge({ state, className }: CommissionStateBadgeProps) {
  const getStateBadgeProps = (state: RuleState) => {
    switch (state) {
      case RuleState.Active:
        return {
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100',
          label: 'Active'
        };
      case RuleState.Draft:
        return {
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100',
          label: 'Draft'
        };
      case RuleState.Inactive:
        return {
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100',
          label: 'Inactive'
        };
      case RuleState.Archived:
        return {
          variant: 'outline' as const,
          className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100',
          label: 'Archived'
        };
      default:
        return {
          variant: 'outline' as const,
          className: '',
          label: state
        };
    }
  };

  const badgeProps = getStateBadgeProps(state);

  return (
    <Badge
      variant={badgeProps.variant}
      className={`${badgeProps.className} ${className || ''}`}
    >
      {badgeProps.label}
    </Badge>
  );
}