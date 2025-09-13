// components/features/integrations/SocialConnectionCard.tsx - Individual social connection card

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { SocialConnection } from '@/types/app/integration-types';
import { useIntegrationHooks } from '@/hooks/api/integration-hooks';
import { 
  getPlatformIcon, 
  getPlatformColor, 
  getConnectionStatusMessage 
} from '@/lib/platform-utils';
import { toast } from 'sonner';
import { Loader2, Shield, ShieldAlert } from 'lucide-react';

interface SocialConnectionCardProps {
  connection: SocialConnection;
  teamId?: string;
}

export const SocialConnectionCard = ({ connection, teamId }: SocialConnectionCardProps) => {
  const { removeConnection, validateConnection } = useIntegrationHooks();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  
  const handleRemove = async () => {
    if (!teamId) return;
    
    setIsRemoving(true);
    try {
      await removeConnection().mutateAsync({
        teamId,
        connectionId: connection.id
      });
      toast.success('Social media account disconnected successfully');
    } catch (error) {
      console.error('Failed to remove connection:', error);
      toast.error('Failed to disconnect account. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };
  
  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const result = await validateConnection().mutateAsync(connection.id);
      if (result.is_valid) {
        toast.success('Connection is valid and working properly');
      } else {
        toast.error(result.error_message || 'Connection validation failed');
      }
    } catch (error) {
      console.error('Failed to validate connection:', error);
      toast.error('Failed to validate connection. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };
  
  const PlatformIcon = getPlatformIcon(connection.platform);
  const platformColor = getPlatformColor(connection.platform);
  const statusMessage = getConnectionStatusMessage(
    connection.platform, 
    connection.is_active, 
    connection.last_used_at
  );
  
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={connection.avatar_url} />
            <AvatarFallback className={`${platformColor.bg} ${platformColor.text}`}>
              <PlatformIcon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{connection.display_name}</div>
            <div className="text-sm text-muted-foreground">{connection.external_username}</div>
          </div>
          <Badge 
            variant={connection.is_active ? "default" : "destructive"}
            className="ml-auto"
          >
            {connection.is_active ? (
              <>
                <Shield className="h-3 w-3 mr-1" />
                Active
              </>
            ) : (
              <>
                <ShieldAlert className="h-3 w-3 mr-1" />
                Inactive
              </>
            )}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Status message */}
          <p className="text-sm text-muted-foreground">
            {statusMessage}
          </p>
          
          {/* Connection details */}
          <div className="text-xs text-muted-foreground">
            Connected {new Date(connection.connected_at).toLocaleDateString()}
            {connection.last_used_at && (
              <span className="ml-2">
                • Last used {new Date(connection.last_used_at).toLocaleDateString()}
              </span>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleValidate}
                disabled={isValidating}
              >
                {isValidating ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Validate'
                )}
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    disabled={isRemoving}
                  >
                    {isRemoving ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Removing...
                      </>
                    ) : (
                      'Remove'
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Connection</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove the connection to <strong>{connection.display_name}</strong>? 
                      This will revoke access and you'll need to reconnect to use this account again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRemove}
                      disabled={isRemoving}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isRemoving ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Removing...
                        </>
                      ) : (
                        'Remove Connection'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};