const BOOKMARK_KEY = 'ai_news_bookmarks';

export interface BookmarkedNews {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  publishedAt: Date;
  url: string;
}

export function getBookmarks(): BookmarkedNews[] {
  const bookmarks = localStorage.getItem(BOOKMARK_KEY);
  return bookmarks ? JSON.parse(bookmarks) : [];
}

export function saveBookmark(news: BookmarkedNews): void {
  const bookmarks = getBookmarks();
  const updatedBookmarks = [...bookmarks, news];
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updatedBookmarks));
}

export function removeBookmark(id: string): void {
  const bookmarks = getBookmarks();
  const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updatedBookmarks));
}

export function isBookmarked(id: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some(bookmark => bookmark.id === id);
}