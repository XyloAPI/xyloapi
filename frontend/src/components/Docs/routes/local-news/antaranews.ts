import type { DocTopic } from '../../types';

export const antaranewsRoute: DocTopic = {
    id: 'antaranews',
    title: 'Antara News',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/antaranews',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest local news from Antara News (antaranews.com) in Indonesia. Returns up to 20 articles with title, link, description, publish date, source, and media content by reading real-time RSS feeds.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select an Antara News sub-portal.',
        options: [
          { value: 'top-news', label: 'Antara Top News' },
          { value: 'politik', label: 'Antara Politik' },
          { value: 'ekonomi', label: 'Antara Ekonomi & Bisnis' },
          { value: 'metro', label: 'Antara Metro Jakarta' },
          { value: 'olahraga', label: 'Antara Olahraga' },
          { value: 'hiburan', label: 'Antara Hiburan' },
          { value: 'tekno', label: 'Antara Tekno' },
          { value: 'otomotif', label: 'Antara Otomotif' },
          { value: 'lifestyle', label: 'Antara Lifestyle' },
          { value: 'warta-bumi', label: 'Antara Warta Bumi' },
          { value: 'humaniora', label: 'Antara Humaniora' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top-news'
    }
  };
