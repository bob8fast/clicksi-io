'use client'

import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, Search } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  type: 'Creator' | 'Brand' | 'Product' | 'Category';
  url: string;
  description: string;
  imageUrl?: string;
}

interface GroupedSearchResults {
  creators: SearchResult[];
  brands: SearchResult[];
  products: SearchResult[];
  categories: SearchResult[];
}

interface SearchResultsStateProps {
  searchQuery: string;
  debouncedSearchQuery: string;
  groupedSearchResults: GroupedSearchResults;
  isLoading: boolean;
  isError: boolean;
  shouldSearch: boolean;
  onItemClick: (url: string, query?: string) => void;
}

export default function SearchResultsState({
  searchQuery,
  debouncedSearchQuery,
  groupedSearchResults,
  isLoading,
  isError,
  shouldSearch,
  onItemClick
}: SearchResultsStateProps) {
  return (
    <div className="h-full">
      {/* ScrollArea with full height - no headers to account for in search results */}
      <ScrollArea className="h-full">
        <div className="p-4">
          {/* Minimum character requirement message */}
          {searchQuery.length > 0 && searchQuery.length < 3 && (
            <div className="flex items-center justify-center py-8">
              <div className="text-[#828288] text-sm">Type at least 3 characters to search</div>
            </div>
          )}
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-[#828288] text-sm">Searching...</div>
            </div>
          )}
          
          {/* Error State */}
          {isError && (
            <div className="flex items-center justify-center py-8">
              <div className="text-[#ff6b6b] text-sm">Search temporarily unavailable</div>
            </div>
          )}
          
          {/* Grouped Search Results */}
          {!isLoading && !isError && shouldSearch && (
            <>
              {/* Creators Section */}
              {groupedSearchResults.creators.length > 0 && (
                <SearchResultSection
                  title="Creators"
                  results={groupedSearchResults.creators}
                  onItemClick={onItemClick}
                  onViewAllClick={() => onItemClick(`/creators?search=${encodeURIComponent(debouncedSearchQuery)}`)}
                  debouncedSearchQuery={debouncedSearchQuery}
                />
              )}

              {/* Brands Section */}
              {groupedSearchResults.brands.length > 0 && (
                <SearchResultSection
                  title="Brands"
                  results={groupedSearchResults.brands}
                  onItemClick={onItemClick}
                  onViewAllClick={() => onItemClick(`/brands?search=${encodeURIComponent(debouncedSearchQuery)}`)}
                  debouncedSearchQuery={debouncedSearchQuery}
                />
              )}

              {/* Products Section */}
              {groupedSearchResults.products.length > 0 && (
                <SearchResultSection
                  title="Products"
                  results={groupedSearchResults.products}
                  onItemClick={onItemClick}
                  onViewAllClick={() => onItemClick(`/products?search=${encodeURIComponent(debouncedSearchQuery)}`)}
                  debouncedSearchQuery={debouncedSearchQuery}
                />
              )}

              {/* Categories Section */}
              {groupedSearchResults.categories.length > 0 && (
                <SearchResultSection
                  title="Categories"
                  results={groupedSearchResults.categories}
                  onItemClick={onItemClick}
                  onViewAllClick={() => onItemClick(`/categories?search=${encodeURIComponent(debouncedSearchQuery)}`)}
                  debouncedSearchQuery={debouncedSearchQuery}
                />
              )}

              {/* No Results Found */}
              {(groupedSearchResults.creators.length === 0 && 
                groupedSearchResults.brands.length === 0 && 
                groupedSearchResults.products.length === 0 && 
                groupedSearchResults.categories.length === 0) && (
                  <div className="text-center py-8">
                    <p className="text-[#828288] mb-2">No results found for "{debouncedSearchQuery}"</p>
                    <p className="text-[#575757] text-sm">Try searching for brands, creators, or products</p>
                  </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// Helper component for search result sections
interface SearchResultSectionProps {
  title: string;
  results: SearchResult[];
  onItemClick: (url: string, query?: string) => void;
  onViewAllClick: () => void;
  debouncedSearchQuery: string;
}

function SearchResultSection({ 
  title, 
  results, 
  onItemClick, 
  onViewAllClick, 
  debouncedSearchQuery 
}: SearchResultSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#828288]">{title}</h3>
        <button 
          onClick={onViewAllClick}
          className="text-xs text-[#D78E59] hover:text-[#FFAA6C]"
        >
          View All
        </button>
      </div>
      {results.map((item) => (
        <button
          key={item.id}
          onClick={() => onItemClick(item.url, debouncedSearchQuery)}
          className="w-full flex items-center justify-between p-3 hover:bg-[#202020] rounded-lg transition-colors group mb-2"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 bg-[#575757] flex-shrink-0 flex items-center justify-center ${
              item.type === 'Creator' ? 'rounded-full' : 
              item.type === 'Brand' ? 'rounded-lg' : 
              item.type === 'Product' ? 'rounded' : 
              'rounded'
            }`}>
              {item.type === 'Product' ? (
                <Search className="h-4 w-4 text-[#EDECF8]" />
              ) : item.type === 'Category' ? (
                <span className="text-[#EDECF8] text-xs">📂</span>
              ) : (
                <span className="text-[#EDECF8] text-xs font-medium">
                  {item.title.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="text-left">
              <div className="text-[#EDECF8] font-medium">{item.title}</div>
              <div className="text-[#575757] text-sm">{item.description}</div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-[#575757] group-hover:text-[#828288] flex-shrink-0" />
        </button>
      ))}
    </div>
  );
}