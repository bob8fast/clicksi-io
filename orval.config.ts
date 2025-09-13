// orval.config.ts

// https://orval.dev/reference/configuration/output
// custom fetch https://github.com/orval-labs/orval/blob/master/samples/next-app-with-fetch/custom-fetch.ts
// React Query v5 compatible configuration with best practices

import { defineConfig } from 'orval';

// Base paths and common settings
const PATHS = {
    mutator: './src/lib/orval/orval-fetch.ts',
    outputBase: 'src/gen/api',
    inputBase: './_api_docs',
    schemas: 'src/gen/api/types/',
    zod: 'src/gen/api/zod',
    mocks: 'src/gen/api/mocks',
} as const;

// Cache strategies based on data freshness requirements (React Query v5)
const CACHE_STRATEGIES = {
    // For real-time/frequently changing content (notifications, live data)
    realtime: {
        staleTime: 30 * 1000,         // 30 seconds
        gcTime: 2 * 60 * 1000,        // 2 minutes
        refetchInterval: 60 * 1000,   // Auto-refetch every minute
    },
    // For frequently changing content (content, feeds)
    dynamic: {
        staleTime: 2 * 60 * 1000,     // 2 minutes
        gcTime: 10 * 60 * 1000,       // 10 minutes
    },
    // For moderately changing data (auth, users, settings)
    moderate: {
        staleTime: 5 * 60 * 1000,     // 5 minutes
        gcTime: 15 * 60 * 1000,       // 15 minutes
    },
    // For stable data (products, catalogs, reference data)
    stable: {
        staleTime: 15 * 60 * 1000,    // 15 minutes
        gcTime: 60 * 60 * 1000,       // 1 hour
    },
    // For rarely changing data (app config, static content)
    static: {
        staleTime: 60 * 60 * 1000,    // 1 hour
        gcTime: 24 * 60 * 60 * 1000,  // 24 hours
    },
} as const;

// Enhanced query configuration with React Query v5 best practices
const createQueryConfig = (
    cacheStrategy: keyof typeof CACHE_STRATEGIES,
    options: {
        customRetry?: boolean;
        suspense?: boolean;
        throwOnError?: boolean;
        refetchInterval?: number;
        networkMode?: 'online' | 'always' | 'offlineFirst';
    } = {}
) => ({
    // Hook Generation Options - Generate all useful hooks
    useQuery: true,                           // Generate useQuery hooks
    useMutation: true,                        // Generate useMutation hooks for POST/PUT/DELETE
    useInfinite: true,                        // Generate useInfiniteQuery hooks for pagination
    useSuspenseQuery: options.suspense || false,  // Generate useSuspenseQuery hooks conditionally
    useSuspenseInfiniteQuery: false,          // Keep disabled unless specifically needed
    usePrefetch: true,                        // Generate prefetch functions for better UX

    // Query Configuration
    // useInfiniteQueryParam: 'cursor',          // Parameter name for infinite queries (cursor pagination)

    // Custom Options Functions
    queryOptions: {
        path: './src/lib/orval/custom-query-options.ts',
        name: 'customQueryOptions',
    },
    // mutationOptions: {
    //     path: './src/lib/orval/custom-query-options.ts', 
    //     name: 'customMutationOptions',
    // },

    // Query Key Management
    shouldExportQueryKey: true,               // Export query key factories for manual cache management
    shouldSplitQueryKey: true,                // Split query keys for better cache granularity

    // Hook Exports
    shouldExportMutatorHooks: true,           // Export mutator hooks for custom usage
    shouldExportHttpClient: false,            // Don't export HTTP client (use mutator instead)

    // React Query Configuration
    signal: true,                             // Enable AbortController signal support
    version: 5 as const,                      // Explicitly target React Query v5
});

// Base hooks configuration
const baseHooks = {
    afterAllFilesWrite: 'prettier --write',
};

// Strong typing for service types
type ServiceType = 'auth' | 'gateway';
type CacheStrategyType = keyof typeof CACHE_STRATEGIES;
type NetworkMode = 'online' | 'always' | 'offlineFirst';

// Enhanced service configuration options with strong typing
interface ServiceOptions
{
    hasTransformer?: boolean;
    hasDocs?: boolean;
    hasMocks?: boolean;
    suspense?: boolean;
    throwOnError?: boolean;
    networkMode?: NetworkMode;
    refetchInterval?: number;
}

// Service configuration interface with strong typing
interface ServiceConfig
{
    serviceType: ServiceType;
    jsonFileName: string;
    cacheStrategy: CacheStrategyType;
    options?: ServiceOptions;
}

// Factory function for service configuration (unified for auth and gateway)
const createServiceConfig = (
    serviceName: string,
    serviceType: ServiceType,
    jsonFileName: string,
    cacheStrategy: CacheStrategyType,
    options: ServiceOptions = {}
): Options => ({
    output: {
        mode: 'tags' as const,
        schemas: PATHS.schemas,
        namingConvention: 'snake_case' as const,
        client: 'react-query' as const,
        httpClient: 'fetch' as const,
        allParamsOptional: true,
        prettier: true,
        target: `${PATHS.outputBase}/hooks/${serviceName}`,
        ...(options.hasDocs && {
            // Somewhy it doesn`t work
            // docs: {
            //     theme: 'default',
            //     out: `.src/gen/api/docs-markdown/${serviceName}`,
            //     //plugin: ['typedoc-plugin-coverage'],
            //     disableSources: true,
            // },
        }),
        ...(options.hasMocks && {
            // Investigate later how it works
            // mock: {
            //     indexMockFiles: true,
            //     type: 'msw',
            // },
        }),
        // https://orval.dev/reference/configuration/output#urlencodeparameters
        urlEncodeParameters: true,

        // example: `content_management/api/v1/media`; for baseUrl: serviceName,
        // because of we use swagger for ocelot, the correct urls already added
        // baseUrl: serviceName,

        // https://orval.dev/reference/configuration/output#coercetypes
        // coerceTypes: true,
        override: {
            // https://orval.dev/reference/configuration/output#enumgenerationtype
            enumGenerationType: 'const',
            // https://orval.dev/reference/configuration/output#usenamedparameters
            useNamedParameters: true,
            
            fetch: {
                // https://orval.dev/guides/fetch-client#return-original-defined-return-type
                includeHttpResponseReturnType: false,
            },

            mutator: {
                path: PATHS.mutator,
                name: serviceType === 'auth' ? 'authServiceCustomFetch' : 'gatewayServiceCustomFetch',
            },

            // https://orval.dev/reference/configuration/output#components
            // components: {
            //     responses: {
            //         suffix: 'Response',
            //     },
            //     parameters: {
            //         suffix: 'Params',
            //     },
            //     requestBodies: {
            //         suffix: 'Bodies',
            //     },
            // },

            // https://orval.dev/reference/configuration/output#formdata

            // https://orval.dev/reference/configuration/output#usedeprecatedoperations
            // useTypeOverInterfaces: true,

            // https://orval.dev/reference/configuration/output#usedeprecatedoperations
            // useDeprecatedOperations: true,

            query: createQueryConfig(cacheStrategy, {
                customRetry: serviceType === 'auth', // Auth services get custom retry
                suspense: options.suspense,
                throwOnError: options.throwOnError,
                refetchInterval: options.refetchInterval,
                networkMode: options.networkMode,
            }),
        },
    },
    input: {
        target: `${PATHS.inputBase}/${jsonFileName}`,
        ...(options.hasTransformer && {
            // Need further investigation
            // example of built url `/v${version}/api/v1/accounts/change-password` 
            // override: {
            //     transformer: 'src/lib/orval/transformer/add-version.js',
            // },
        }),
    },
    hooks: baseHooks,
});

// Factory function for Zod schema generation (workaround from official docs)
const createZodConfig = (serviceName: string, jsonFileName: string): Options => ({
    input: {
        target: `${PATHS.inputBase}/${jsonFileName}`,
    },
    output: {
        mode: 'single' as const,
        client: 'zod' as const,
        target: `${PATHS.zod}`,
        fileExtension: '.zod.ts',
    },
    hooks: baseHooks,
});

// Service definitions with comprehensive configuration and strong typing
const services: Record<string, ServiceConfig> = {
    // AUTH SERVICE - Critical authentication endpoints
    auth_service: {
        serviceType: 'gateway',
        jsonFileName: 'AuthService.json',
        cacheStrategy: 'moderate',
        options: {
            // hasTransformer: true,    // Version transformer
            // hasDocs: true,           // Generate documentation
            throwOnError: true,      // Throw errors for error boundaries
            networkMode: 'online',   // Require network for auth
        }
    },

    // CONTENT MANAGEMENT - Dynamic content that changes frequently
    content_management: {
        serviceType: 'gateway',
        jsonFileName: 'ContentManagement.json',
        cacheStrategy: 'dynamic',
        options: {
            //   hasTransformer: true,    // Version transformer
            //  hasDocs: true,           // Generate documentation
            throwOnError: true,      // Throw errors for error boundaries
            networkMode: 'offlineFirst',   // Require network for auth
            suspense: false,         // Keep false for loading states
        }
    },

    conversion_management: {
        serviceType: 'gateway',
        jsonFileName: 'ConversionManagement.json',
        cacheStrategy: 'dynamic',
        options: {
            //   hasTransformer: true,    // Version transformer
            //  hasDocs: true,           // Generate documentation
            throwOnError: true,      // Throw errors for error boundaries
            networkMode: 'offlineFirst',   // Require network for auth
            suspense: false,         // Keep false for loading states
        }
    },

    link_management: {
        serviceType: 'gateway',
        jsonFileName: 'LinkManagement.json',
        cacheStrategy: 'dynamic',
        options: {
            //   hasTransformer: true,    // Version transformer
            //  hasDocs: true,           // Generate documentation
            throwOnError: true,      // Throw errors for error boundaries
            networkMode: 'offlineFirst',   // Require network for auth
            suspense: false,         // Keep false for loading states
        }
    },

    notifications: {
        serviceType: 'gateway',
        jsonFileName: 'Notifications.json',
        cacheStrategy: 'dynamic',
        options: {
            //   hasTransformer: true,    // Version transformer
            //  hasDocs: true,           // Generate documentation
            throwOnError: true,      // Throw errors for error boundaries
            networkMode: 'offlineFirst',   // Require network for auth
            suspense: false,         // Keep false for loading states
        }
    },

    // PRODUCT CATALOG - Relatively stable product data
    product_catalog: {
        serviceType: 'gateway',
        jsonFileName: 'ProductCatalog.json',
        cacheStrategy: 'stable',
        options: {
            //  hasTransformer: true,    // Version transformer
            // hasDocs: true,           // Generate documentation
            throwOnError: true,      // Throw errors for error boundaries
            networkMode: 'offlineFirst', // Can work offline
        }
    },

    // USER MANAGEMENT - Moderate change frequency
    user_management: {
        serviceType: 'gateway',
        jsonFileName: 'UserManagement.json',
        cacheStrategy: 'moderate',
        options: {
            // hasTransformer: true,    // Version transformer
            // hasDocs: true,           // Generate documentation
            throwOnError: true,      // Throw errors for error boundaries
        }
    },

} as const satisfies Record<string, ServiceConfig>;

export default defineConfig({
    // Generate main API hooks for each service
    // @ts-ignore - TypeScript issue with reduce typing
    ...Object.entries(services).reduce((acc, [serviceName, config]) =>
    {
        acc[serviceName] = createServiceConfig(
            serviceName,
            config.serviceType,
            config.jsonFileName,
            config.cacheStrategy,
            config.options
        );
        return acc;
    }, {} as Record<string, Options>),

    // Generate Zod schemas for ALL services (validation)
    // Requires additional investigation, it works but generates not very useful parts
    // ...Object.entries(services).reduce((acc, [serviceName, config]) =>
    // {
    //     acc[`${serviceName}_zod`] = createZodConfig(serviceName, config.jsonFileName);
    //     return acc;
    // }, {} as Record<string, Options>),
});

type ConfigExternal = Parameters<typeof defineConfig>[0];

// @ts-ignore
type UnwrapAsync<T> = T extends ((...args: any[]) => infer R)
    ? UnwrapAsync<R>
    : T extends Promise<infer U>
    ? U
    : T;

type Config = UnwrapAsync<ConfigExternal>;
type OptionsExport = Config[keyof Config];
type Options = UnwrapAsync<OptionsExport>;

// Export for external use
export
{
    CACHE_STRATEGIES, createServiceConfig, createZodConfig, PATHS,
    services
};

// Export types for external use
export type {
    CacheStrategyType,
    NetworkMode, ServiceConfig, ServiceOptions, ServiceType
};

