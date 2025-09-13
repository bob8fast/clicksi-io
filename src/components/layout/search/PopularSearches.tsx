'use client'

import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface PopularSearchesProps {
  popularSearches: string[];
  onPopularSearchClick: (term: string) => void;
  expandedHeight?: number;
  collapsedHeight?: number;
  className?: string;
}

export default function PopularSearches({
  popularSearches,
  onPopularSearchClick,
  expandedHeight = 280,
  collapsedHeight = 60,
  className = ""
}: PopularSearchesProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Calculate header height (padding + content)
  const headerHeight = 58; // p-4 pb-2 + button height
  const contentHeight = expandedHeight - headerHeight;
  
  return (
    <div 
      className={`flex-shrink-0 bg-[#171717] rounded-t-lg border-t border-[#575757] transition-all duration-300 flex flex-col ${className}`}
      style={{ 
        height: isExpanded ? `${expandedHeight}px` : `${collapsedHeight}px`,
        maxHeight: isExpanded ? `${expandedHeight}px` : `${collapsedHeight}px`,
        minHeight: `${collapsedHeight}px`
      }}
    >
      {/* Header with collapse/expand button - Fixed height */}
      <div className="flex items-center justify-between p-4 pb-2 flex-shrink-0" style={{ height: `${headerHeight}px` }}>
        <h3 className="text-sm font-semibold text-[#828288]">Popular Searches</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-[#202020] rounded-md transition-colors text-[#828288] hover:text-[#EDECF8]"
          aria-label={isExpanded ? 'Collapse popular searches' : 'Expand popular searches'}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {/* Popular searches content - ScrollArea with viewport-respecting height */}
      {isExpanded && (
        <div 
          style={{ 
            height: `${contentHeight}px`,
            maxHeight: `${contentHeight}px`
          }}
        >
          <ScrollArea className="h-full" type="always">
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => onPopularSearchClick(term)}
                    className="px-4 py-2 bg-[#202020] hover:bg-[#575757] text-[#828288] hover:text-[#EDECF8] rounded-full text-base transition-colors mb-2"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}