// services/base-api.service.ts

export type ApiResponse<T = unknown> = {
    success: boolean;
    data?: T | null;
    message?: string;
    errors?: string[];
    has_validation_errors?: boolean;
    validation_errors?: Record<string, string[]>;
};

export interface FileDownloadResponse
{
    blob: Blob;
    filename: string;
}

export abstract class BaseApiService
{
    protected readonly baseUrl: string;

    constructor(baseUrl: string)
    {
        this.baseUrl = baseUrl;
    }

    protected async getAuthHeaders(): Promise<HeadersInit>
    {
        const headers: HeadersInit = {};
        // Note: Authentication removed - requests will be made without auth tokens
        return headers;
    }

    /**
     * Basic HTTP request method
     */
    protected async makeRequest(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<Response>
    {
        try
        {
            const headers = await this.getAuthHeaders();
            const url = this.buildUrl(endpoint);

            const requestHeaders: HeadersInit = {
                ...headers,
                ...options.headers,
            };

            const response = await fetch(url, {
                ...options,
                headers: requestHeaders,
            });

            return response;
        } catch (error)
        {
            throw new Error(
                error instanceof Error
                    ? error.message
                    : 'Network error occurred'
            );
        }
    }

    /**
     * JSON API call with automatic response parsing
     */
    protected async apiJsonCall<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>>
    {
        try
        {
            // Add Content-Type for JSON requests (but not for FormData)
            const requestHeaders: any = { ...options.headers };
            if (!(options.body instanceof FormData) && options.body)
            {
                requestHeaders['Content-Type'] = 'application/json';
            }

            const response = await this.makeRequest(endpoint, {
                ...options,
                headers: requestHeaders,
            });

            // Handle 204 No Content
            if (response.status === 204)
            {
                return {
                    success: true,
                    data: undefined as T
                };
            }

            const contentType = response.headers.get('content-type');

            // Parse response data
            let data;
            if (contentType?.includes('application/json') || contentType?.includes('application/problem+json'))
            {
                data = await response.json();
            } else
            {
                data = await response.text();
            }

            if (!response.ok)
            {
                return {
                    success: false,
                    message: data?.detail || data?.error || data?.title || data?.message || `HTTP ${response.status}`,
                    data: data
                };
            }

            return {
                success: true,
                data: data
            };
        } catch (error)
        {
            console.error('API call failed:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Request failed'
            };
        }
    }

    /**
     * File download with automatic blob handling
     */
    protected async downloadCall(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<FileDownloadResponse>>
    {
        try
        {
            const response = await this.makeRequest(endpoint, options);

            if (!response.ok)
            {
                // Try to parse error message from response
                const contentType = response.headers.get('content-type');
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

                if (contentType?.includes('application/json'))
                {
                    try
                    {
                        const errorData = await response.json();
                        errorMessage = errorData?.message || errorData?.error || errorData?.title || errorMessage;
                    } catch (_parseError)
                    {
                        // Fallback to status text if JSON parsing fails
                    }
                }

                return {
                    success: false,
                    message: errorMessage
                };
            }

            const blob = await response.blob();
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = this.extractFilename(contentDisposition) || 'document';

            return {
                success: true,
                data: { blob, filename }
            };
        } catch (error)
        {
            console.error('Download failed:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Download failed'
            };
        }
    }

    /**
     * Build the full URL for a given endpoint
     */
    protected abstract buildUrl(endpoint: string): string;

    /**
     * Extract filename from Content-Disposition header
     */
    protected extractFilename(contentDisposition: string | null): string | null
    {
        if (!contentDisposition) return null;

        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        return filenameMatch ? filenameMatch[1].replace(/"/g, '') : null;
    }

    /**
     * Build query string from parameters object
     */
    protected buildQueryString(params: Record<string, any>): string
    {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) =>
        {
            if (value !== undefined && value !== null && value !== '')
            {
                searchParams.append(key, String(value));
            }
        });

        const queryString = searchParams.toString();
        return queryString ? `?${queryString}` : '';
    }

    /**
     * Utility method for session refresh (removed NextAuth dependency)
     */
    async refreshSession(): Promise<void>
    {
        // Note: Session refresh functionality removed with NextAuth
        console.log('Session refresh no longer available - NextAuth removed');
    }
}