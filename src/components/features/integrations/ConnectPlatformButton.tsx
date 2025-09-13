// components/features/integrations/ConnectPlatformButton.tsx - Platform connection button

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SocialPlatform } from '@/types/app/integration-types';
import { EntityType } from '@/types/management';
import { useIntegrationHooks } from '@/hooks/api/integration-hooks';
import { 
  getPlatformIcon, 
  getPlatformColor, 
  getPlatformName,
  platformSupports 
} from '@/lib/platform-utils';
import { toast } from 'sonner';
import { Loader2, Calendar, Image, Video } from 'lucide-react';

interface ConnectPlatformButtonProps {
  platform: SocialPlatform;
  teamId: string;
  entityType: EntityType;
}

export const ConnectPlatformButton = ({ 
  platform, 
  teamId, 
  entityType 
}: ConnectPlatformButtonProps) => {
  const { initiateConnection } = useIntegrationHooks();
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleConnect = async () => {
    if (!teamId) {
      toast.error('Team ID is required to connect social media accounts');
      return;
    }
    
    setIsConnecting(true);
    try {
      const response = await initiateConnection().mutateAsync({
        teamId,
        platform,
        callback_url: `${window.location.origin}/integrations/callback`
      });
      
      // Security: Don't store OAuth state in frontend storage
      // State validation is handled by the backend API
      // Just redirect to OAuth provider
      window.location.href = response.authorization_url;
    } catch (error) {
      console.error('Failed to initiate connection:', error);
      toast.error('Failed to connect to ' + getPlatformName(platform));
      setIsConnecting(false);
    }
  };
  
  const PlatformIcon = getPlatformIcon(platform);
  const platformColor = getPlatformColor(platform);
  const platformName = getPlatformName(platform);
  
  // Platform capabilities for display
  const capabilities = [];
  if (platformSupports(platform, 'scheduling')) {
    capabilities.push({ icon: Calendar, label: 'Scheduling' });
  }
  if (platform === SocialPlatform.Instagram || platform === SocialPlatform.Facebook) {
    capabilities.push({ icon: Image, label: 'Images' });
  }
  if (platform === SocialPlatform.TikTok || platform === SocialPlatform.Instagram) {
    capabilities.push({ icon: Video, label: 'Videos' });
  }
  
  return (
    <Card 
      className={`hover:shadow-md transition-all cursor-pointer ${platformColor.hover} ${platformColor.border}`}
      onClick={handleConnect}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
        <div className={`p-3 rounded-full ${platformColor.bg}`}>
          <PlatformIcon className={`h-8 w-8 ${platformColor.text}`} />
        </div>
        
        <div className="text-center">
          <h3 className="font-medium">{platformName}</h3>
          <p className="text-sm text-muted-foreground">Connect your account</p>
        </div>
        
        {/* Platform capabilities */}
        {capabilities.length > 0 && (
          <div className="flex gap-1 text-xs text-muted-foreground">
            {capabilities.map((capability, index) => (
              <div key={capability.label} className="flex items-center">
                <capability.icon className="h-3 w-3 mr-1" />
                {capability.label}
                {index < capabilities.length - 1 && <span className="mx-1">•</span>}
              </div>
            ))}
          </div>
        )}
        
        <Button 
          disabled={isConnecting}
          className={`w-full ${platformColor.bg} ${platformColor.text} hover:opacity-90`}
          onClick={(e) => {
            e.stopPropagation();
            handleConnect();
          }}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            'Connect'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};