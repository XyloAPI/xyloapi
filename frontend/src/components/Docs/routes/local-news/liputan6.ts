import type { DocTopic } from '../../types';

export const liputan6Route: DocTopic = {
    id: 'liputan6',
    title: 'Liputan6 News',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/liputan6',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest local news from Liputan6 (liputan6.com) in Indonesia. Returns up to 20 articles with title, link, description, publish date, source, and media content by crawling real-time sub-portal article indices.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Liputan6 news sub-portal.',
        options: [
          { value: 'news', label: 'Liputan6 News' },
          { value: 'bisnis', label: 'Liputan6 Bisnis (Economy)' },
          { value: 'bola', label: 'Liputan6 Bola (Sports)' },
          { value: 'showbiz', label: 'Liputan6 Showbiz (Celebrity/Movie)' },
          { value: 'otomotif', label: 'Liputan6 Otomotif' },
          { value: 'tekno', label: 'Liputan6 Tekno' },
          { value: 'health', label: 'Liputan6 Health' },
          { value: 'lifestyle', label: 'Liputan6 Lifestyle' },
          { value: 'global', label: 'Liputan6 Global' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news'
    }
  };
