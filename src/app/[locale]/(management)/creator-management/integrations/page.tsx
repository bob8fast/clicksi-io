// app/(management)/creator-management/integrations/page.tsx - Creator integrations page

import { Suspense } from 'react';
import { Metadata } from 'next';
import { IntegrationsDashboard } from '@/components/features/integrations';
import { IntegrationsLoadingSkeleton } from '@/components/ui/loading';

export const metadata: Metadata = {
  title: 'Social Media Integrations - Creator Studio',
  description: 'Connect your creator social media accounts for content export and scheduling.'
};

export default function CreatorIntegrationsPage() {
  return (
    <Suspense fallback={<IntegrationsLoadingSkeleton />}>
      <IntegrationsDashboard entityType="creator" />
    </Suspense>
  );
}