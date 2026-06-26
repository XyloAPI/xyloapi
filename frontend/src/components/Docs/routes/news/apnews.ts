import type { DocTopic } from '../../types';

export const apnewsRoute: DocTopic = {
    id: 'apnews',
    title: 'AP News',
    category: 'News',
    method: 'POST',
    path: '/api/news/apnews',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news from AP News (apnews.com) by category. Returns up to 20 articles with title, image, description, and publish date.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select an AP News category.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'world', label: 'World News' },
          { value: 'us', label: 'US News' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'health', label: 'Health' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'sports', label: 'Sports' },
          { value: 'science', label: 'Science' },
          { value: 'oddities', label: 'Oddities' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
