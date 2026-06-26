import type { DocTopic } from '../../types';

export const abcRoute: DocTopic = {
    id: 'abc',
    title: 'ABC News',
    category: 'News',
    method: 'POST',
    path: '/api/news/abc',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest headlines from ABC News (abcnews.go.com) by category. Returns up to 25 articles with title, image, description, and publish date — powered by official ABC News RSS feeds.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select an ABC News category.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'us', label: 'US News' },
          { value: 'politics', label: 'Politics' },
          { value: 'world', label: 'World News' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'health', label: 'Health' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'sport', label: 'Sport' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
