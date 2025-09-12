'use client'

import { useRouter } from 'next/navigation';
import { SearchDefaultState, SearchResultsState } from '.';
import { useSearchData } from './hooks/useSearchData';

interface SearchDropdownProps
{
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    onItemClick: (url: string) => void;
    onClose?: () => void;
}

export default function SearchDropdown({
    searchQuery,
    onSearchQueryChange,
    onItemClick,
    onClose,
}: SearchDropdownProps)
{
    const router = useRouter();

    // Use real search data from APIs with grouped results
    const {
        groupedSearchResults,
        shouldSearch,
        debouncedSearchQuery,
        isLoading,
        isError,
        recentSearches,
        addToRecentSearches,
        popularSearches
    } = useSearchData(searchQuery);

    // Note: URL updates removed from dropdown - only for separate search page

    const handleItemClick = (url: string, query?: string) =>
    {
        // Add to recent searches if it's a search query
        if (query)
        {
            addToRecentSearches(query);
        }

        // Use Next.js router for navigation
        router.push(url);
        onItemClick(url);
        if (onClose) onClose();
    };

    const handlePopularSearchClick = (term: string) =>
    {
        addToRecentSearches(term);
        onSearchQueryChange(term);
    };

    // Show default state only when there's no search input (empty string)
    // Show search results when there's any input (even 1 character)
    const showDefaultState = searchQuery.length === 0;
    const showSearchResults = searchQuery.length > 0;

    return (
        <div className={`flex flex-col h-full`}>
            {showSearchResults ? (
                // Search Results View - Show immediately when user starts typing
                <SearchResultsState
                    searchQuery={searchQuery}
                    debouncedSearchQuery={debouncedSearchQuery}
                    groupedSearchResults={groupedSearchResults}
                    isLoading={isLoading}
                    isError={isError}
                    shouldSearch={shouldSearch}
                    onItemClick={handleItemClick}
                />
            ) : (
                // Default State - Recent searches + Popular searches (fixed at bottom)
                <SearchDefaultState
                    recentSearches={recentSearches}
                    popularSearches={popularSearches}
                    onRecentSearchClick={(query) =>
                    {
                        onSearchQueryChange(query);
                        // Don't close the dropdown when selecting recent search
                    }}
                    onPopularSearchClick={handlePopularSearchClick}
                />
            )}
        </div>
    );
}