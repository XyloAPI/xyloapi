import type { DocTopic } from '../../types';

export const news24Route: DocTopic = {
    id: 'news24',
    title: 'News24',
    category: 'News',
    method: 'POST',
    path: '/api/news/news24',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news from News24 (news24.com), South Africa\'s leading news site. Returns up to 20 articles with title, description, and publish date. Note: images unavailable as news24.com enforces 429 rate-limiting on all server-side requests.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a News24 category.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'south-africa', label: 'South Africa' },
          { value: 'world', label: 'World' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'sport', label: 'Sport' },
          { value: 'technology', label: 'Technology' },
          { value: 'health', label: 'Health' },
          { value: 'entertainment', label: 'Entertainment' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
