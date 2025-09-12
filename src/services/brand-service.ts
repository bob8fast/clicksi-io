// services/brand-service.ts
import { getBrand, getBrands, getBrandByTeam } from '@/gen/api/hooks/user_management/brands';

/**
 * Brand service for server-side operations
 * Provides methods for fetching brand data in server components
 */
export const brandService = {
  /**
   * Get a single brand by ID
   */
  getBrand: async (brandId: string) => {
    try {
      const response = await getBrand({ brandId });
      return response;
    } catch (error) {
      console.error('Error fetching brand:', error);
      return null;
    }
  },

  /**
   * Get all brands with optional parameters
   */
  getBrands: async (params?: any) => {
    try {
      const response = await getBrands(params);
      return response;
    } catch (error) {
      console.error('Error fetching brands:', error);
      return null;
    }
  },

  /**
   * Get brand by team ID
   */
  getBrandByTeam: async (teamId: string) => {
    try {
      const response = await getBrandByTeam({ teamId });
      return response;
    } catch (error) {
      console.error('Error fetching brand by team:', error);
      return null;
    }
  },
};