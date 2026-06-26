import type { DocTopic } from '../../types';

export const cnbcRoute: DocTopic = {
    id: 'cnbc',
    title: 'CNBC Indonesia',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/cnbc',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest business, market, investment, and general news from CNBC Indonesia (cnbcindonesia.com). Returns up to 20 articles with title, link, description, publish date, source, and image using official RSS feeds.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a CNBC Indonesia news category.',
        options: [
          { value: 'all', label: 'CNBC Terbaru' },
          { value: 'news', label: 'CNBC News' },
          { value: 'market', label: 'CNBC Market' },
          { value: 'tech', label: 'CNBC Tech' },
          { value: 'syariah', label: 'CNBC Syariah' },
          { value: 'lifestyle', label: 'CNBC Lifestyle' },
          { value: 'entrepreneur', label: 'CNBC Entrepreneur' },
          { value: 'opini', label: 'CNBC Opini' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'all'
    }
  };
