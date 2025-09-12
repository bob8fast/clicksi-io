// utils/zod-validation.ts
import { z } from 'zod';

/**
 * Pre-defined Zod schemas for common validations
 */
export const zodSchemas = {
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
  requiredString: (fieldName: string, message?: string) => 
    z.string().min(1, message || `${fieldName} is required`),
  url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number').optional(),
  postalCode: z.string().regex(/^[A-Za-z0-9\s-]{3,10}$/, 'Please enter a valid postal code').optional(),
};

/**
 * Helper to format Zod errors for display
 */
export const formatZodErrors = (error: z.ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return errors;
};

/**
 * Helper to validate a single field
 */
export const validateField = <T>(value: T, schema: z.ZodSchema<T>): string | null => {
  try {
    schema.parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Invalid value';
    }
    return 'Validation error';
  }
};

/**
 * Helper to create a refinement for cross-field validation
 */
export const createCrossFieldValidation = <T extends Record<string, any>>(
  validator: (data: T) => boolean,
  message: string,
  path: string[]
) => {
  return (data: T) => {
    if (!validator(data)) {
      throw new z.ZodError([{
        code: z.ZodIssueCode.custom,
        message,
        path,
      }]);
    }
    return data;
  };
};