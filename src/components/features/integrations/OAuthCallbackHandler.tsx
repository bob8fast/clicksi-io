// components/features/integrations/OAuthCallbackHandler.tsx - OAuth callback processing

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useIntegrationHooks } from '@/hooks/api/integration-hooks';
import { toast } from 'sonner';
import { EntityType } from '@/types/management';

enum CallbackState {
  Processing = 'processing',
  Success = 'success',
  Error = 'error'
}

export const OAuthCallbackHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<CallbackState>(CallbackState.Processing);
  const [message, setMessage] = useState('Processing connection...');
  const { completeOAuthFlow } = useIntegrationHooks();
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        
        // Check for OAuth errors
        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }
        
        if (!code || !state) {
          throw new Error('Missing required OAuth parameters');
        }
        
        // Use mock hook to complete OAuth flow
        const result = await completeOAuthFlow().mutateAsync({
          code,
          state
        });
        
        setState(CallbackState.Success);
        setMessage(`Successfully connected your ${result.platform} account!`);
        
        // Show success toast and redirect after delay
        toast.success('Social media account connected successfully!');
        setTimeout(() => {
          // Redirect back to the appropriate management portal
          const redirectMap :Record<string, string> = {
            brand: '/brand-management/integrations',
            creator: '/creator-management/integrations', 
            retailer: '/retailer-management/integrations',
          };
          router.push(redirectMap[result.entityType] || '/brand-management/integrations');
        }, 2000);
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        setState(CallbackState.Error);
        setMessage(error instanceof Error ? error.message : 'Connection failed');
        toast.error('Failed to connect social media account');
      }
    };
    
    handleCallback();
  }, [searchParams, router, completeOAuthFlow]);
  
  const getIcon = () => {
    switch (state) {
      case CallbackState.Processing:
        return <Loader2 className="h-16 w-16 animate-spin text-blue-500" />;
      case CallbackState.Success:
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case CallbackState.Error:
        return <XCircle className="h-16 w-16 text-red-500" />;
    }
  };
  
  const getTitle = () => {
    switch (state) {
      case CallbackState.Processing:
        return 'Connecting Account';
      case CallbackState.Success:
        return 'Connection Successful';
      case CallbackState.Error:
        return 'Connection Failed';
    }
  };
  
  const getDescription = () => {
    switch (state) {
      case CallbackState.Processing:
        return 'Please wait while we complete your social media connection...';
      case CallbackState.Success:
        return 'Your social media account has been successfully connected. You will be redirected shortly.';
      case CallbackState.Error:
        return 'We encountered an issue while connecting your account. Please try again or contact support if the problem persists.';
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
          {getIcon()}
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">{getTitle()}</h2>
            <p className="text-muted-foreground max-w-sm">{getDescription()}</p>
          </div>
          
          {/* Specific message from callback processing */}
          {message && message !== getDescription() && (
            <p className="text-sm text-center text-muted-foreground italic">
              {message}
            </p>
          )}
          
          {/* Action buttons */}
          {state === CallbackState.Error && (
            <div className="flex gap-2 w-full">
              <Button 
                onClick={() => router.push('/brand-management/integrations')} 
                variant="outline"
                className="flex-1"
              >
                Back to Integrations
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                className="flex-1"
              >
                Try Again
              </Button>
            </div>
          )}
          
          {state === CallbackState.Success && (
            <Button 
              onClick={() => router.push('/brand-management/integrations')} 
              className="w-full"
            >
              Continue to Integrations
            </Button>
          )}
          
          {/* Processing indicator */}
          {state === CallbackState.Processing && (
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};