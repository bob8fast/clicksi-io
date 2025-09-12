// config/entities/index.ts - Entity Configuration Registry

import { EntityConfig, EntityType } from '@/types/management';
import { brandConfig } from './brand.config';
import { creatorConfig } from './creator.config';
import { retailerConfig } from './retailer.config';
import { adminConfig } from './admin.config';

// Configuration registry - all entity configurations
export const entityConfigs: Partial<Record<EntityType, EntityConfig>> = {
  brand: brandConfig,
  creator: creatorConfig,
  retailer: retailerConfig,
  admin: adminConfig,
};

/**
 * Get entity configuration by type
 */
export function getEntityConfig(entityType: EntityType): EntityConfig | null {
  return entityConfigs[entityType] || null;
}

/**
 * Get all available entity configurations
 */
export function getAllEntityConfigs(): EntityConfig[] {
  return Object.values(entityConfigs).filter(Boolean) as EntityConfig[];
}

/**
 * Check if entity type is supported
 */
export function isEntitySupported(entityType: EntityType): boolean {
  return entityType in entityConfigs;
}