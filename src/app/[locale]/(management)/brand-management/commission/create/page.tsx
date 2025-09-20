// app/(management)/brand-management/commission/create/page.tsx - Create Commission Rule Page

export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { GenericManagementLayout } from '@/components/layout/management/GenericManagementLayout';
import { CommissionRuleCreateContent } from '@/components/features/commission/rules/CommissionRuleCreateContent';

export const metadata: Metadata = {
  title: 'Create Commission Rule - Brand Portal',
  description: 'Create a new commission rule for your brand products'
};

export default async function CreateCommissionRulePage() {
  return (
      <GenericManagementLayout entityType="brand">
        <CommissionRuleCreateContent />
      </GenericManagementLayout>
  );
}