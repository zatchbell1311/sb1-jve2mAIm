import React from 'react';
import { Newspaper, Search, LayoutGrid, List, RefreshCw } from 'lucide-react';

const categories = ['Technology', 'Business', 'Science', 'Health', 'Entertainment', 'Sports'];

interface HeaderProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  isRefreshing: boolean;
}

export function Header({ 
  selectedCategory, 
  onCategoryChange, 
  onSearch, 
  view, 
  onViewChange,
  isRefreshing 
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Newspaper className="h-8 w-8 text-indigo-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">AI News Hub</h1>
            {isRefreshing && (
              <RefreshCw className="ml-3 h-4 w-4 text-indigo-600 animate-spin" />
            )}
          </div>
          
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search news..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onViewChange('grid')}
                className={`p-2 rounded ${
                  view === 'grid'
                    ? 'bg-white shadow-sm text-indigo-600'
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => onViewChange('list')}
                className={`p-2 rounded ${
                  view === 'list'
                    ? 'bg-white shadow-sm text-indigo-600'
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
                title="List view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <nav className="flex space-x-4 py-4 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => onCategoryChange('All')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}