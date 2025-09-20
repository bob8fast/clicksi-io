// app/(management)/brand-management/commission/[ruleId]/edit/page.tsx - Edit Commission Rule Page

import { CommissionRuleEditContent } from '@/components/features/commission/rules/CommissionRuleEditContent';
import { GenericManagementLayout } from '@/components/layout/management/GenericManagementLayout';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ ruleId: string }>;
};

// Generate metadata for the commission rule edit page
export async function generateMetadata({ params }: Props): Promise<Metadata>
{
    const { ruleId } = await params;

    return {
        title: `Edit Commission Rule ${ruleId} - Brand Portal`,
        description: 'Edit commission rule settings and parameters',
    };
}

export default async function EditCommissionRulePage({ params }: Props)
{
    const { ruleId } = await params;

    // Basic validation - ensure ruleId exists
    if (!ruleId)
    {
        notFound();
    }

    return (
        <GenericManagementLayout entityType="brand">
            <CommissionRuleEditContent ruleId={ruleId} />
        </GenericManagementLayout>
    );
}