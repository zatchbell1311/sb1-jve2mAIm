import { mockNews } from './mockData';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_ENDPOINT = 'https://newsapi.org/v2';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  publishedAt: Date;
  url: string;
  originalContent?: string;
}

export async function fetchNews(category: string = 'All', page: number = 1): Promise<NewsItem[]> {
  if (!NEWS_API_KEY) {
    console.warn('News API key not found. Please add VITE_NEWS_API_KEY to your .env file.');
    return mockNews;
  }

  try {
    const params = new URLSearchParams({
      apiKey: NEWS_API_KEY,
      country: 'us',
      pageSize: '10',
      page: page.toString(),
      ...(category !== 'All' && { category: category.toLowerCase() })
    });

    const response = await fetch(`${NEWS_API_ENDPOINT}/top-headlines?${params}`);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return data.articles.map((article: any) => ({
      id: article.url,
      title: article.title || 'Untitled',
      summary: article.description || article.content || 'No description available',
      imageUrl: article.urlToImage || `https://source.unsplash.com/800x600/?${category.toLowerCase()}`,
      category: category,
      publishedAt: new Date(article.publishedAt || Date.now()),
      url: article.url,
      originalContent: article.content
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}