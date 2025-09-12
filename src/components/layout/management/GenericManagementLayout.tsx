// components/layout/management/GenericManagementLayout.tsx - Main Management Layout

'use client';

import { getEntityConfig } from '@/config/entities';
import { useManagementStore } from '@/stores/management-store';
import { EntityConfig, EntityType } from '@/types/management';
import { ReactNode, useMemo } from 'react';
import { AccessGuard } from './AccessGuard';
import { ManagementLayoutProvider } from './ManagementLayoutProvider';
import { ResponsiveWrapper } from './ResponsiveWrapper';

interface GenericManagementLayoutProps
{
    entityType: EntityType;
    children: ReactNode;
    customConfig?: Partial<EntityConfig>;
}

/**
 * Generic Management Layout - Main orchestrator component
 * Handles configuration loading, access control, and responsive behavior
 */
export function GenericManagementLayout({
    entityType,
    children,
    customConfig
}: GenericManagementLayoutProps)
{
    const setEntityConfig = useManagementStore(state => state.setEntityConfig);

    // Merge default config with custom overrides
    const config = useMemo(() =>
    {
        const defaultConfig = getEntityConfig(entityType);
        if (!defaultConfig)
        {
            throw new Error(`No configuration found for entity type: ${entityType}`);
        }

        const mergedConfig: EntityConfig = {
            ...defaultConfig,
            ...customConfig,
            // Deep merge navigation items if provided
            navigationItems: customConfig?.navigationItems || defaultConfig.navigationItems,
            // Deep merge branding if provided
            branding: {
                ...defaultConfig.branding,
                ...customConfig?.branding,
            },
            // Deep merge layout options if provided
            layoutOptions: {
                ...defaultConfig.layoutOptions,
                ...customConfig?.layoutOptions,
            }
        };

        // Update store with current config
        setEntityConfig(mergedConfig);

        return mergedConfig;
    }, [entityType, customConfig, setEntityConfig]);

    return (
        <ManagementLayoutProvider config={config}>
            <AccessGuard>
                <ResponsiveWrapper>
                    {children}
                </ResponsiveWrapper>
            </AccessGuard>
        </ManagementLayoutProvider>
    );
}