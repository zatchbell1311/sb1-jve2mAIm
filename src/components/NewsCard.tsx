import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, RefreshCw, Share2, Bookmark, BookmarkCheck } from 'lucide-react';
import { rewriteContent } from '../lib/aiService';
import { isBookmarked as checkIsBookmarked, saveBookmark, removeBookmark } from '../lib/bookmarkService';

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  publishedAt: Date;
  url: string;
  originalContent?: string;
  view: 'grid' | 'list';
}

export function NewsCard({ id, title, summary, imageUrl, category, publishedAt, url, originalContent, view }: NewsCardProps) {
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewrittenSummary, setRewrittenSummary] = useState(summary);
  const [isBookmarked, setIsBookmarked] = useState(() => checkIsBookmarked(id));
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleRewrite = async () => {
    if (!originalContent || isRewriting) return;
    
    setIsRewriting(true);
    try {
      const rewritten = await rewriteContent(originalContent);
      setRewrittenSummary(rewritten);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleBookmark = () => {
    if (isBookmarked) {
      removeBookmark(id);
    } else {
      saveBookmark({
        id,
        title,
        summary: rewrittenSummary,
        imageUrl,
        category,
        publishedAt,
        url,
      });
    }
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: rewrittenSummary,
          url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const cardClass = view === 'grid'
    ? 'flex flex-col'
    : 'flex flex-col md:flex-row md:items-center md:space-x-6';

  return (
    <article className={`bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl ${cardClass}`}>
      <div className={`relative ${view === 'grid' ? 'h-48' : 'h-48 md:w-72'} overflow-hidden`}>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {category}
        </span>
      </div>
      
      <div className="flex-1 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600">
          <a href={url} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {rewrittenSummary}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {formatDistanceToNow(publishedAt, { addSuffix: true })}
          </span>
          
          <div className="flex items-center gap-4">
            {originalContent && (
              <button
                onClick={handleRewrite}
                disabled={isRewriting}
                className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
                title="Rewrite with AI"
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isRewriting ? 'animate-spin' : ''}`} />
                {isRewriting ? 'Rewriting...' : 'Rewrite'}
              </button>
            )}
            
            <button
              onClick={handleBookmark}
              className="text-gray-500 hover:text-indigo-600"
              title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
            
            <button
              onClick={handleShare}
              className="text-gray-500 hover:text-indigo-600"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
              title="Read full article"
            >
              Read more
              <ExternalLink className="ml-1 w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}