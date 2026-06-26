import type { DocTopic } from '../../types';

export const nprRoute: DocTopic = {
    id: 'npr',
    title: 'NPR',
    category: 'News',
    method: 'POST',
    path: '/api/news/npr',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news from NPR (npr.org) by topic. Returns up to 20 articles with title, image, description, author, and publish date — powered by official NPR RSS feeds.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select an NPR topic.',
        options: [
          { value: 'news', label: 'News' },
          { value: 'world', label: 'World' },
          { value: 'national', label: 'National' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'science', label: 'Science' },
          { value: 'health', label: 'Health' },
          { value: 'arts', label: 'Arts' },
          { value: 'books', label: 'Books' },
          { value: 'education', label: 'Education' },
          { value: 'law', label: 'Law' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news'
    }
  };
