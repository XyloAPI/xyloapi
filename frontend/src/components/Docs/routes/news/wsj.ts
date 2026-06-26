import type { DocTopic } from '../../types';

export const wsjRoute: DocTopic = {
    id: 'wsj',
    title: 'The Wall Street Journal',
    category: 'News',
    method: 'POST',
    path: '/api/news/wsj',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news from The Wall Street Journal (wsj.com) by category. Returns up to 20 articles with title, description, and publish date. Note: article images are not available as wsj.com is behind a hard paywall (HTTP 401 for all server-side requests).',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a WSJ category.',
        options: [
          { value: 'top', label: 'Top News' },
          { value: 'business', label: 'Business' },
          { value: 'tech', label: 'Technology' },
          { value: 'politics', label: 'Politics' },
          { value: 'opinion', label: 'Opinion' },
          { value: 'world', label: 'World' },
          { value: 'economy', label: 'Economy' },
          { value: 'finance', label: 'Finance' },
          { value: 'us', label: 'US News' },
          { value: 'sports', label: 'Sports' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
