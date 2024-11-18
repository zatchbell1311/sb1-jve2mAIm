import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { NewsGrid } from './components/NewsGrid';
import { fetchNews, NewsItem } from './lib/newsApi';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { useDebounce } from './hooks/useDebounce';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchNewsData = useCallback(async (resetPage: boolean = false) => {
    const currentPage = resetPage ? 1 : page;
    if (currentPage === 1) setLoading(true);
    setError(null);
    
    try {
      const newsData = await fetchNews(selectedCategory, currentPage);
      setNews(prev => currentPage === 1 ? newsData : [...prev, ...newsData]);
      setHasMore(newsData.length === 10);
    } catch (err) {
      setError('Failed to fetch news. Please try again later.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedCategory, page]);

  // Initial fetch and refresh interval
  useEffect(() => {
    fetchNewsData(true);

    // Refresh every 60 seconds
    const refreshInterval = setInterval(() => {
      setIsRefreshing(true);
      fetchNewsData(true);
    }, 60000);

    return () => clearInterval(refreshInterval);
  }, [selectedCategory]);

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
    setNews([]);
  }, [selectedCategory]);

  // Filter news based on search
  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    item.summary.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSearch={setSearchQuery}
        view={view}
        onViewChange={setView}
        isRefreshing={isRefreshing}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && page === 1 ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            <NewsGrid
              news={filteredNews}
              view={view}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
            
            {filteredNews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No news articles found matching your criteria.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;