import type { DocTopic } from '../../types';

export const nytimesRoute: DocTopic = {
    id: 'nytimes',
    title: 'The New York Times',
    category: 'News',
    method: 'POST',
    path: '/api/news/nytimes',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news from The New York Times (nytimes.com) by category. Returns up to 25 articles with title, image, description, author, and publish date — powered by official NYT RSS feeds with high-res media:content images.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a New York Times category.',
        options: [
          { value: 'home', label: 'Home Page' },
          { value: 'world', label: 'World' },
          { value: 'us', label: 'US' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'science', label: 'Science' },
          { value: 'health', label: 'Health' },
          { value: 'arts', label: 'Arts' },
          { value: 'opinion', label: 'Opinion' },
          { value: 'climate', label: 'Climate' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'home'
    }
  };
