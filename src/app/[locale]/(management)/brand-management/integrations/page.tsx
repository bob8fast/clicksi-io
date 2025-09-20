// app/(management)/brand-management/integrations/page.tsx - Brand integrations page

import { Suspense } from 'react';
import { Metadata } from 'next';
import { IntegrationsDashboard } from '@/components/features/integrations';
import { IntegrationsLoadingSkeleton } from '@/components/ui/loading';

export const metadata: Metadata = {
  title: 'Social Media Integrations - Brand Management',
  description: 'Connect your brand social media accounts for content export and scheduling.'
};

export default function BrandIntegrationsPage() {
  return (
    <Suspense fallback={<IntegrationsLoadingSkeleton />}>
      <IntegrationsDashboard entityType="brand" />
    </Suspense>
  );
}