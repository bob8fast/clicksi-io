// app/(management)/retailer-management/commission/[ruleId]/page.tsx - Commission Rule Detail Page

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GenericManagementLayout } from '@/components/layout/management/GenericManagementLayout';
import { CommissionRuleDetailContent } from '@/components/features/commission/rules/CommissionRuleDetailContent';

type Props = {
  params: Promise<{ ruleId: string }>;
};

// Generate metadata for the commission rule detail page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ruleId } = await params;
  
  return {
    title: `Commission Rule ${ruleId} - Retailer Hub`,
    description: 'View and manage commission rule details',
  };
}

export default async function CommissionRuleDetailPage({ params }: Props) {
  const { ruleId } = await params;

  // Basic validation - ensure ruleId exists
  if (!ruleId) {
    notFound();
  }

  return (
      <GenericManagementLayout entityType="retailer">
        <CommissionRuleDetailContent ruleId={ruleId} />
      </GenericManagementLayout>
  );
}