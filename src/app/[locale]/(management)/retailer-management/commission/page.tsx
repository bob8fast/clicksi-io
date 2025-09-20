// app/(management)/retailer-management/commission/page.tsx - Retailer Commission Rules List Page

import { Metadata } from 'next';
import { GenericManagementLayout } from '@/components/layout/management/GenericManagementLayout';
import { CommissionRulesContent } from '@/components/features/commission/rules/CommissionRulesContent';

export const metadata: Metadata = {
  title: 'Commission Rules - Retailer Hub',
  description: 'Manage commission rules for your retail partnerships and products'
};

export default async function RetailerCommissionRulesPage() {
  return (
      <GenericManagementLayout entityType="retailer">
        <CommissionRulesContent />
      </GenericManagementLayout>
  );
}