// utils/orval-fetch.ts
import { isProblemDetails, ProblemDetailsError, generateErrorMessage } from '@/lib/error-handling/api-error-handler';

type ServiceType = 'AUTH_SERVICE' | 'GATEWAY_SERVICE';

interface FetchConfig
{
    serviceType: ServiceType;
}

// Content types that should be handled as blobs (for downloads)
const BLOB_CONTENT_TYPES = [
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/rtf',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation',

    // Archives
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/gzip',
    'application/x-tar',

    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
    'image/ico',

    // Videos
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
    'video/ogg',

    // Audio
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
    'audio/aac',

    // Other binary formats
    'application/octet-stream',
    'application/x-binary',
];

// NOTE: Supports cases where `content-type` is other than `json`
const getBody = <T>(c: Response): Promise<T> =>
{
    const contentType = c.headers.get('content-type');

    // Handle JSON and problem+json (from your original code)
    if (contentType && (contentType.includes('application/json') || contentType.includes('application/problem+json')))
    {
        return c.json();
    }

    // Check if content type should be handled as blob
    if (contentType && BLOB_CONTENT_TYPES.some(type => contentType.includes(type)))
    {
        return c.blob() as Promise<T>;
    }

    return c.text() as Promise<T>;
};

// Single configurable URL builder
const getUrl = (relativePath: string, serviceType: ServiceType): string =>
{
    let baseUrl: string;
    switch (serviceType)
    {
        case 'AUTH_SERVICE':
            if (!process.env.NEXT_PUBLIC_AUTH_SERVER_URL)
            {
                throw new Error("NEXT_PUBLIC_AUTH_SERVER_URL is missing.");
            }

            baseUrl = process.env.NEXT_PUBLIC_AUTH_SERVER_URL;
            break;
        case 'GATEWAY_SERVICE':
            if (!process.env.NEXT_PUBLIC_API_GATEWAY_URL)
            {
                throw new Error("NEXT_PUBLIC_API_GATEWAY_URL is missing.");
            }

            baseUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
            break;
        default:
            throw new Error(`Unknown service type: ${serviceType}`);
    }

    // Create URL by combining base URL with the relative path
    const requestUrl = new URL(relativePath, baseUrl);
    return requestUrl.toString();
};

// Unified headers handler
const getHeaders = async (headers?: HeadersInit, body?: any): Promise<HeadersInit> =>
{
    // Convert HeadersInit to a plain object to avoid type issues
    const normalizedHeaders: Record<string, string> = {};

    if (headers)
    {
        if (headers instanceof Headers)
        {
            headers.forEach((value, key) =>
            {
                normalizedHeaders[key] = value;
            });
        } else if (Array.isArray(headers))
        {
            headers.forEach(([key, value]) =>
            {
                normalizedHeaders[key] = value;
            });
        } else
        {
            Object.assign(normalizedHeaders, headers);
        }
    }

    // Note: Authentication removed - requests will be made without auth tokens

    // Add Content-Type for JSON requests (but not for FormData)
    if (!(body instanceof FormData) && body && !normalizedHeaders['Content-Type'] && !normalizedHeaders['content-type'])
    {
        normalizedHeaders['Content-Type'] = 'application/json';
    }

    return normalizedHeaders;
};

// Extract filename from Content-Disposition header (from your original code)
const extractFilename = (contentDisposition: string | null): string | null =>
{
    if (!contentDisposition) return null;

    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    return filenameMatch ? filenameMatch[1].replace(/"/g, '') : null;
};

// Core custom fetch function - used by both services
const createCustomFetch = (config: FetchConfig) =>
{
    return async <T>(relativePath: string, options: RequestInit): Promise<T> =>
    {
        try
        {
            const requestUrl = getUrl(relativePath, config.serviceType);
            const requestHeaders = await getHeaders(options.headers, options.body);

            const requestInit: RequestInit = {
                ...options,
                headers: requestHeaders,
            };

            const response = await fetch(requestUrl, requestInit);

            // Handle 204 No Content (from your original code)
            if (response.status === 204)
            {
                return {
                    status: response.status,
                    data: undefined,
                    headers: response.headers
                } as T;
            }

            // Check for non-2xx status codes first
            if (!response.ok)
            {
                // Try to get the response body for error details
                const data = await getBody(response);
                
                // If it's ProblemDetails, throw ProblemDetailsError
                if (isProblemDetails(data))
                {
                    throw new ProblemDetailsError(data, response.status);
                }
                
                // Otherwise generate a user-friendly message
                const errorMessage = generateErrorMessage(response.status, data);
                throw new Error(errorMessage);
            }

            // Use getBody to handle different content types
            const data = await getBody(response);

            // For blob responses, create file download object
            if (data instanceof Blob)
            {
                const contentDisposition = response.headers.get('Content-Disposition');
                const _filename = extractFilename(contentDisposition) || 'document';
                
                return data as T;
            }

            // Return consistent format matching your original customFetch example
            return data as T;

        } catch (error)
        {
            throw new Error(
                error instanceof Error
                    ? error.message
                    : 'Network error occurred'
            );
        }
    };
};

// Export specific fetch functions for Orval
const authServiceCustomFetchInternal = createCustomFetch({ serviceType: 'AUTH_SERVICE' });
const gatewayServiceCustomFetchInternal = createCustomFetch({ serviceType: 'GATEWAY_SERVICE' });

export const authServiceCustomFetch = async <T>(
    url: string,
    options: RequestInit,
): Promise<T> =>
{
    return authServiceCustomFetchInternal(url, options);
};

export const gatewayServiceCustomFetch = async <T>(
    url: string,
    options: RequestInit,
): Promise<T> =>
{
    return gatewayServiceCustomFetchInternal(url, options);
};