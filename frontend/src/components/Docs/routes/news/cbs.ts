import type { DocTopic } from '../../types';

export const cbsRoute: DocTopic = {
    id: 'cbs',
    title: 'CBS News',
    category: 'News',
    method: 'POST',
    path: '/api/news/cbs',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news from CBS News (cbsnews.com) by category. Returns up to 25 articles with title, image (1200x630), description, and publish date — powered by official CBS News RSS feeds.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a CBS News category.',
        options: [
          { value: 'main', label: 'Main / Top Stories' },
          { value: 'us', label: 'US' },
          { value: 'world', label: 'World' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'health', label: 'Health' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'science', label: 'Science' },
          { value: 'sports', label: 'Sports' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'main'
    }
  };
