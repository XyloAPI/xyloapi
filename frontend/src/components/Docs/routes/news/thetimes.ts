import type { DocTopic } from '../../types';

export const thetimesRoute: DocTopic = {
    id: 'thetimes',
    title: 'The Times',
    category: 'News',
    method: 'POST',
    path: '/api/news/thetimes',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news from The Times (thetimes.com) by category. Returns up to 20 articles with title, description, and publish date. Note: images are not available as thetimes.com is behind a hard paywall (HTTP 403).',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a The Times category.',
        options: [
          { value: 'top', label: 'Top News' },
          { value: 'uk', label: 'UK News' },
          { value: 'world', label: 'World' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'health', label: 'Health' },
          { value: 'culture', label: 'Culture' },
          { value: 'sport', label: 'Sport' },
          { value: 'comment', label: 'Comment' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
