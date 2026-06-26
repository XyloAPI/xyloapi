import type { DocTopic } from '../../types';

export const foxnewsRoute: DocTopic = {
    id: 'foxnews',
    title: 'Fox News',
    category: 'News',
    method: 'POST',
    path: '/api/news/foxnews',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news headlines from Fox News (foxnews.com) by category. Returns up to 25 articles with title, image, description, and publish date — powered by official Fox News RSS feeds.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Fox News category.',
        options: [
          { value: 'latest', label: 'Latest' },
          { value: 'national', label: 'National' },
          { value: 'world', label: 'World' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'science', label: 'Science' },
          { value: 'health', label: 'Health' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'sports', label: 'Sports' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'latest'
    }
  };
