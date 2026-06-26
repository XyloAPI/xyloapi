import type { DocTopic } from '../../types';

export const usatodayRoute: DocTopic = {
    id: 'usatoday',
    title: 'USA Today',
    category: 'News',
    method: 'POST',
    path: '/api/news/usatoday',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch national, politics, sports, and entertainment news from USA Today (usatoday.com). Returns up to 20 articles with title, link, description, source, and publish date by crawling real-time article listings dynamically.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a USA Today news section.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'national', label: 'National News' },
          { value: 'politics', label: 'Politics' },
          { value: 'world', label: 'World News' },
          { value: 'sports', label: 'Sports' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'business', label: 'Business & Money' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
