import React from 'react';
import { NewsCard } from './NewsCard';
import type { NewsItem } from '../lib/newsApi';
import { ChevronDown } from 'lucide-react';

interface NewsGridProps {
  news: NewsItem[];
  view: 'grid' | 'list';
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function NewsGrid({ news, view, loading, hasMore, onLoadMore }: NewsGridProps) {
  return (
    <div className="space-y-8">
      <div className={`grid gap-6 ${
        view === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {news.map((newsItem) => (
          <NewsCard
            key={newsItem.id}
            {...newsItem}
            view={view}
          />
        ))}
      </div>
      
      {(hasMore || loading) && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <span className="flex items-center">
                Loading
                <ChevronDown className="ml-2 h-4 w-4 animate-bounce" />
              </span>
            ) : (
              <span className="flex items-center">
                Load More
                <ChevronDown className="ml-2 h-4 w-4" />
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}