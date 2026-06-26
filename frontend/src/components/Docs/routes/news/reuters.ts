import type { DocTopic } from '../../types';

export const reutersRoute: DocTopic = {
    id: 'reuters',
    title: 'Reuters',
    category: 'News',
    method: 'POST',
    path: '/api/news/reuters',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news from Reuters (reuters.com) by category. Returns up to 20 articles with title, description, and publish date. Note: article images are not available as reuters.com returns 401 for all server-side requests.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Reuters news category.',
        options: [
          { value: 'top', label: 'Top News' },
          { value: 'world', label: 'World' },
          { value: 'business', label: 'Business' },
          { value: 'markets', label: 'Markets' },
          { value: 'technology', label: 'Technology' },
          { value: 'science', label: 'Science' },
          { value: 'sports', label: 'Sports' },
          { value: 'lifestyle', label: 'Lifestyle' },
          { value: 'legal', label: 'Legal' },
          { value: 'health', label: 'Health' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
