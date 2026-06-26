import type { DocTopic } from '../../types';

export const guardianRoute: DocTopic = {
    id: 'guardian',
    title: 'The Guardian',
    category: 'News',
    method: 'POST',
    path: '/api/news/guardian',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news from The Guardian (theguardian.com) by category. Returns up to 25 articles with title, high-res image (1200px), description, author, and publish date — powered by official Guardian RSS feeds.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Guardian news category.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'world', label: 'World' },
          { value: 'us', label: 'US News' },
          { value: 'uk', label: 'UK News' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'science', label: 'Science' },
          { value: 'environment', label: 'Environment' },
          { value: 'sport', label: 'Sport' },
          { value: 'culture', label: 'Culture' },
          { value: 'society', label: 'Society' },
          { value: 'opinion', label: 'Opinion' },
          { value: 'lifestyle', label: 'Life & Style' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'world'
    }
  };
