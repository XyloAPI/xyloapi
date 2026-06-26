import type { DocTopic } from '../../types';

export const newsweekRoute: DocTopic = {
    id: 'newsweek',
    title: 'Newsweek',
    category: 'News',
    method: 'POST',
    path: '/api/news/newsweek',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news and features from Newsweek (newsweek.com). Returns up to 20 articles with title, high-res image, description, author, and publish date — resolved dynamically from Newsweek category channels and article pages.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Newsweek section.',
        options: [
          { value: 'us', label: 'U.S. News' },
          { value: 'world', label: 'World' },
          { value: 'opinion', label: 'Opinion' },
          { value: 'business', label: 'Business' },
          { value: 'tech-science', label: 'Tech & Science' },
          { value: 'sports', label: 'Sports' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'us'
    }
  };
