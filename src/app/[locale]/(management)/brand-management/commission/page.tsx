// app/(management)/brand-management/commission/page.tsx - Brand Commission Rules List Page

import { Metadata } from 'next';
import { GenericManagementLayout } from '@/components/layout/management/GenericManagementLayout';
import { CommissionRulesContent } from '@/components/features/commission/rules/CommissionRulesContent';

export const metadata: Metadata = {
  title: 'Commission Rules - Brand Portal',
  description: 'Manage commission rules for your brand products and partnerships'
};

export default async function BrandCommissionRulesPage() {
  return (
      <GenericManagementLayout entityType="brand">
        <CommissionRulesContent />
      </GenericManagementLayout>
  );
}