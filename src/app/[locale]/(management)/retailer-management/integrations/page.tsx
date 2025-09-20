// app/(management)/retailer-management/integrations/page.tsx - Retailer integrations page

import { Suspense } from 'react';
import { Metadata } from 'next';
import { IntegrationsDashboard } from '@/components/features/integrations';
import { IntegrationsLoadingSkeleton } from '@/components/ui/loading';

export const metadata: Metadata = {
  title: 'Social Media Integrations - Retailer Hub',
  description: 'Connect your retailer social media accounts for content export and scheduling.'
};

export default function RetailerIntegrationsPage() {
  return (
    <Suspense fallback={<IntegrationsLoadingSkeleton />}>
      <IntegrationsDashboard entityType="retailer" />
    </Suspense>
  );
}