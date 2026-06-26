import type { DocTopic } from '../../types';

export const skynewsRoute: DocTopic = {
    id: 'skynews',
    title: 'Sky News',
    category: 'News',
    method: 'POST',
    path: '/api/news/skynews',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news from Sky News (news.sky.com) by category. Returns up to 20 articles with title, high-res image (1920×1080), description, and publish date — powered by official Sky News RSS feeds.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Sky News category.',
        options: [
          { value: 'home', label: 'Home' },
          { value: 'uk', label: 'UK' },
          { value: 'world', label: 'World' },
          { value: 'us', label: 'US' },
          { value: 'business', label: 'Business' },
          { value: 'politics', label: 'Politics' },
          { value: 'technology', label: 'Technology' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'strange', label: 'Strange News' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'home'
    }
  };
