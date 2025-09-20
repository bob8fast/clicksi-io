// app/(main)/integrations/callback/page.tsx - OAuth callback page

import { Suspense } from 'react';
import { Metadata } from 'next';
import { OAuthCallbackHandler } from '@/components/features/integrations';
import { LoadingState } from '@/components/ui/loading';

export const metadata: Metadata = {
  title: 'Connecting Account...',
  description: 'Processing social media account connection.'
};

export default function IntegrationsCallbackPage() {
  return (
    <Suspense fallback={
      <LoadingState 
        message="Connecting Account..."
        description="Please wait while we complete your social media connection."
        size="large"
        fullScreen={true}
      />
    }>
      <OAuthCallbackHandler />
    </Suspense>
  );
}