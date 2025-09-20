// app/(management)/retailer-management/commission/[ruleId]/edit/page.tsx - Edit Commission Rule Page

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GenericManagementLayout } from '@/components/layout/management/GenericManagementLayout';
import { CommissionRuleEditContent } from '@/components/features/commission/rules/CommissionRuleEditContent';

type Props = {
  params: Promise<{ ruleId: string }>;
};

// Generate metadata for the commission rule edit page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ruleId } = await params;
  
  return {
    title: `Edit Commission Rule ${ruleId} - Retailer Hub`,
    description: 'Edit commission rule settings and parameters',
  };
}

export default async function EditCommissionRulePage({ params }: Props) {
  const { ruleId } = await params;

  // Basic validation - ensure ruleId exists
  if (!ruleId) {
    notFound();
  }

  return (
      <GenericManagementLayout entityType="retailer">
        <CommissionRuleEditContent ruleId={ruleId} />
      </GenericManagementLayout>
  );
}