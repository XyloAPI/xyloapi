import type { DocTopic } from '../../types';

export const usnewsRoute: DocTopic = {
    id: 'usnews',
    title: 'U.S. News',
    category: 'News',
    method: 'POST',
    path: '/api/news/usnews',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news and rankings from U.S. News & World Report (usnews.com). Returns up to 20 articles with title, link, description, source, and publish date — utilizing Google News RSS query fallback to bypass rate limits and WAF protections.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a U.S. News section.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'national', label: 'National News' },
          { value: 'politics', label: 'Politics' },
          { value: 'world', label: 'World News' },
          { value: 'business', label: 'Business' },
          { value: 'health', label: 'Health' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
