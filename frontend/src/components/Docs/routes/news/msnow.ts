import type { DocTopic } from '../../types';

export const msnowRoute: DocTopic = {
    id: 'msnow',
    title: 'MS NOW (MSNBC)',
    category: 'News',
    method: 'POST',
    path: '/api/news/msnow',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news from MS NOW / MSNBC (ms.now) by category. Returns up to 20 articles with title, image, description, author, and publish date.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select an MS NOW category.',
        options: [
          { value: 'latest', label: 'Latest' },
          { value: 'news', label: 'News' },
          { value: 'politics', label: 'Politics' },
          { value: 'opinion', label: 'Opinion' },
          { value: 'world', label: 'World' },
          { value: 'business', label: 'Business' },
          { value: 'health', label: 'Health' },
          { value: 'culture', label: 'Culture' },
          { value: 'sports', label: 'Sports' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news'
    }
  };
