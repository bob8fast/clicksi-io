/**
 * Simple API Error Handling
 * 
 * Provides clean, direct error handling for ProblemDetails responses
 * without complex wrappers or abstractions.
 */

import { ProblemDetails } from '@/types';

// =============================================================================
// ERROR CLASSIFICATION
// =============================================================================

export const ErrorTypes = {
    NETWORK: 'NETWORK_ERROR',
    AUTHENTICATION: 'AUTH_ERROR', 
    AUTHORIZATION: 'FORBIDDEN_ERROR',
    VALIDATION: 'VALIDATION_ERROR',
    RATE_LIMIT: 'RATE_LIMIT_ERROR',
    SERVER: 'SERVER_ERROR',
    NOT_FOUND: 'NOT_FOUND_ERROR',
    CONFLICT: 'CONFLICT_ERROR',
    UNKNOWN: 'UNKNOWN_ERROR'
} as const;

export type ErrorType = typeof ErrorTypes[keyof typeof ErrorTypes];

/**
 * Classify error based on status code and error details
 */
export const classifyError = (statusCode: number, error?: unknown): ErrorType => {
    const apiError = error as {
        response?: { data?: { code?: string } };
        code?: string;
        message?: string;
    };
    
    const errorCode = apiError?.code || apiError?.response?.data?.code;
    
    // Network/connection errors
    if (apiError?.message === 'Network Error' || errorCode === 'NETWORK_ERROR' || !statusCode) {
        return ErrorTypes.NETWORK;
    }
    
    // Status code based classification
    switch (statusCode) {
        case 401:
            return ErrorTypes.AUTHENTICATION;
        case 403:
            return ErrorTypes.AUTHORIZATION;
        case 404:
            return ErrorTypes.NOT_FOUND;
        case 409:
            return ErrorTypes.CONFLICT;
        case 422:
        case 400:
            return ErrorTypes.VALIDATION;
        case 429:
            return ErrorTypes.RATE_LIMIT;
        case 500:
        case 502:
        case 503:
        case 504:
            return ErrorTypes.SERVER;
        default:
            return ErrorTypes.UNKNOWN;
    }
};

/**
 * Generate user-friendly error messages
 */
export const generateErrorMessage = (statusCode: number, responseData?: unknown, context?: string): string => {
    const errorType = classifyError(statusCode);
    const contextPrefix = context ? `${context}: ` : '';
    
    // Try to extract specific error message from API response
    const apiError = responseData as {
        message?: string;
        error?: string;
    };
    const apiMessage = apiError?.message || apiError?.error;
    
    switch (errorType) {
        case ErrorTypes.NETWORK:
            return `${contextPrefix}Connection failed. Please check your internet connection and try again.`;
            
        case ErrorTypes.AUTHENTICATION:
            return `${contextPrefix}Please sign in to continue.`;
            
        case ErrorTypes.AUTHORIZATION:
            return `${contextPrefix}You don't have permission to perform this action.`;
            
        case ErrorTypes.VALIDATION:
            // For validation errors, prefer API message as it contains field-specific info
            return apiMessage || `${contextPrefix}Please check your input and try again.`;
            
        case ErrorTypes.RATE_LIMIT:
            return `${contextPrefix}Too many requests. Please wait a moment and try again.`;
            
        case ErrorTypes.NOT_FOUND:
            return `${contextPrefix}The requested resource was not found.`;
            
        case ErrorTypes.CONFLICT:
            return apiMessage || `${contextPrefix}This action conflicts with existing data.`;
            
        case ErrorTypes.SERVER:
            return `${contextPrefix}Server error occurred. Our team has been notified.`;
            
        default:
            return apiMessage || `${contextPrefix}An unexpected error occurred. Please try again.`;
    }
};

/**
 * Custom error class for ProblemDetails responses
 */
export class ProblemDetailsError extends Error {
    public readonly problemDetails: ProblemDetails;
    public readonly statusCode?: number;

    constructor(problemDetails: ProblemDetails, statusCode?: number) {
        // Create user-friendly error message
        const message = ProblemDetailsError.extractMessage(problemDetails);
        super(message);
        
        this.name = 'ProblemDetailsError';
        this.problemDetails = problemDetails;
        this.statusCode = statusCode;

        // Maintains proper stack trace (V8 only)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ProblemDetailsError);
        }
    }

    /**
     * Extract user-friendly message from ProblemDetails
     */
    private static extractMessage(problemDetails: ProblemDetails): string {
        // Use the API's message if available
        if (problemDetails.message) {
            return problemDetails.message;
        }
        
        // Handle errors array
        if (problemDetails.errors && Array.isArray(problemDetails.errors) && problemDetails.errors.length > 0) {
            return problemDetails.errors.join(', ');
        }
        
        // Fallback to other fields
        return problemDetails.title || problemDetails.detail || 'An error occurred';
    }

    /**
     * Get validation errors as key-value pairs for form handling
     */
    getValidationErrors(): Record<string, string> {
        const errors: Record<string, string> = {};
        
        if (this.problemDetails.has_validation_errors && this.problemDetails.validation_errors) {
            Object.entries(this.problemDetails.validation_errors).forEach(([field, fieldErrors]) => {
                if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                    errors[field] = fieldErrors[0];
                }
            });
        }
        
        return errors;
    }
}

/**
 * Check if response is a ProblemDetails object
 */
export function isProblemDetails(response: any): response is ProblemDetails {
    return response && 
           typeof response === 'object' && 
           'success' in response &&
           typeof response.success === 'boolean';
}

/**
 * Throws ProblemDetailsError if response contains ProblemDetails
 * Otherwise returns the response unchanged
 */
export function throwOnProblemDetails<T>(response: T): T {
    if (isProblemDetails(response)) {
        throw new ProblemDetailsError(response);
    }
    return response;
}