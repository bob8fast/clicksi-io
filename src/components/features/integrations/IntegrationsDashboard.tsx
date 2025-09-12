// components/features/integrations/IntegrationsDashboard.tsx - Main integrations dashboard

'use client';

// import { useSession } from 'next-auth/react'; // Removed auth
import { useIntegrationHooks } from '@/hooks/api/integration-hooks';
import { getEntityConfig } from '@/config/entities';
import { SocialConnectionCard } from './SocialConnectionCard';
import { ConnectPlatformButton } from './ConnectPlatformButton';
import { SocialPlatform } from '@/types/app/integration-types';
import { EntityType } from '@/types/management';
import { getAllPlatforms } from '@/lib/platform-utils';

interface IntegrationsDashboardProps {
  entityType: EntityType;
}

export const IntegrationsDashboard = ({ entityType }: IntegrationsDashboardProps) => {
  const { data: session } = useSession();
  const { getTeamConnections } = useIntegrationHooks();
  
  const teamId = session?.user_info?.team_id;
  const { data: connections, isLoading } = getTeamConnections(teamId);
  
  // Get entity-specific configuration for branding/context
  const entityConfig = getEntityConfig(entityType);
  
  const availablePlatforms = getAllPlatforms();
  const connectedPlatforms = connections?.map(c => c.platform) || [];
  const unconnectedPlatforms = availablePlatforms.filter(p => !connectedPlatforms.includes(p));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Social Media Integrations</h2>
        <p className="text-muted-foreground">
          Connect your {entityConfig?.entityLabel.toLowerCase()} social media accounts to enable content export and scheduling.
        </p>
      </div>
      
      {/* Connected Accounts */}
      {connections && connections.length > 0 && (
        <section>
          <h3 className="text-lg font-medium mb-4">Connected Accounts</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {connections.map((connection) => (
              <SocialConnectionCard key={connection.id} connection={connection} teamId={teamId} />
            ))}
          </div>
        </section>
      )}
      
      {/* Available Platforms */}
      {unconnectedPlatforms.length > 0 && (
        <section>
          <h3 className="text-lg font-medium mb-4">
            {connections && connections.length > 0 ? 'Connect More Platforms' : 'Available Platforms'}
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {unconnectedPlatforms.map((platform) => (
              <ConnectPlatformButton 
                key={platform} 
                platform={platform} 
                teamId={teamId || ''} 
                entityType={entityType}
              />
            ))}
          </div>
        </section>
      )}
      
      {/* Empty State */}
      {(!connections || connections.length === 0) && unconnectedPlatforms.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No Social Media Integrations</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Connect your social media accounts to start exporting and scheduling content across platforms.
          </p>
        </div>
      )}
      
      {/* Help Text */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium mb-2">About Social Media Integrations</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Connect multiple social media accounts for your {entityConfig?.entityLabel.toLowerCase()}</li>
          <li>• Export content to connected platforms with one click</li>
          <li>• Schedule posts for optimal engagement times</li>
          <li>• Track performance across all connected accounts</li>
        </ul>
      </div>
    </div>
  );
};