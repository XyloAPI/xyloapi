import type { DocTopic } from '../../types';

export const washingtonpostRoute: DocTopic = {
    id: 'washingtonpost',
    title: 'The Washington Post',
    category: 'News',
    method: 'POST',
    path: '/api/news/washingtonpost',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest headlines from The Washington Post (washingtonpost.com) via Google News index. Returns up to 20 articles with title, description, and publish date. Note: article images are not available due to WaPo paywall restrictions.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Washington Post news category.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'world', label: 'World' },
          { value: 'politics', label: 'Politics' },
          { value: 'us', label: 'US News' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'health', label: 'Health & Science' },
          { value: 'climate', label: 'Climate' },
          { value: 'sport', label: 'Sport' },
          { value: 'entertainment', label: 'Entertainment' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
