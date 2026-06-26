import type { DocTopic } from '../../types';

export const euronewsRoute: DocTopic = {
    id: 'euronews',
    title: 'Euronews',
    category: 'News',
    method: 'POST',
    path: '/api/news/euronews',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch multi-language pan-European news from Euronews (euronews.com). Returns up to 20 articles with title, link, description, source, and publish date by parsing their official XML feeds directly.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Euronews news section.',
        options: [
          { value: 'top', label: 'Latest News' },
          { value: 'news', label: 'News' },
          { value: 'business', label: 'Business' },
          { value: 'sport', label: 'Sport' },
          { value: 'next', label: 'Next (Tech)' },
          { value: 'travel', label: 'Travel' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
