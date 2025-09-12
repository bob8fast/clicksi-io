// providers/QueryProvider.tsx
'use client';

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import React, { useState } from 'react';

interface QueryProviderProps
{
    children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps)
{
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Default staleTime of 5 minutes
                        staleTime: 5 * 60 * 1000,
                        // Default cache time of 10 minutes
                        gcTime: 10 * 60 * 1000,
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            })
    );

    // Create a persister for query caching
    const persister = createSyncStoragePersister({
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        key: 'app-cache',
        // https://tanstack.com/query/latest/docs/framework/react/plugins/createSyncStoragePersister#options
        // throttleTime: 1000, // Save to storage at most once per second
        // serialize: (data) => JSON.stringify(data),
        // deserialize: (data) => JSON.parse(data),
    });

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister,
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                buster: 'v1', // Version key to invalidate cache on app updates
            }}
        >
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </PersistQueryClientProvider>
    );
}