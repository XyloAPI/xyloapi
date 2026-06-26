import type { DocTopic } from '../../types';

export const bloombergRoute: DocTopic = {
    id: 'bloomberg',
    title: 'Bloomberg',
    category: 'News',
    method: 'POST',
    path: '/api/news/bloomberg',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news from Bloomberg (bloomberg.com) by category. Returns up to 25 articles with title, high-res image (1200px), description, author, and publish date — powered by official Bloomberg RSS feeds.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Bloomberg category.',
        options: [
          { value: 'markets', label: 'Markets' },
          { value: 'technology', label: 'Technology' },
          { value: 'politics', label: 'Politics' },
          { value: 'economics', label: 'Economics' },
          { value: 'industries', label: 'Industries' },
          { value: 'green', label: 'Green' },
          { value: 'bview', label: 'Bloomberg View' },
          { value: 'businessweek', label: 'Businessweek' },
          { value: 'pursuits', label: 'Pursuits' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'markets'
    }
  };
