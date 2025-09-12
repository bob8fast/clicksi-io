// app/(management)/retailer-management/commission/create/page.tsx - Create Commission Rule Page

import { Metadata } from 'next';
import { GenericManagementLayout } from '@/components/layout/management/GenericManagementLayout';
import { CommissionRuleCreateContent } from '@/components/features/commission/rules/CommissionRuleCreateContent';
// import { useSession } from 'next-auth/react'; // Removed auth

export const metadata: Metadata = {
  title: 'Create Commission Rule - Retailer Hub',
  description: 'Create a new commission rule for your retail operations'
};

export default async function CreateCommissionRulePage() {
  return (
      <GenericManagementLayout entityType="retailer">
        <CommissionRuleCreateContent />
      </GenericManagementLayout>
  );
}