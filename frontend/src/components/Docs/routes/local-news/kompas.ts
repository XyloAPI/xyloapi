import type { DocTopic } from '../../types';

export const kompasRoute: DocTopic = {
    id: 'kompas',
    title: 'Kompas News',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/kompas',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest local news from Kompas (kompas.com) in Indonesia. Returns up to 20 articles with title, link, description, publish date, source, and media content by crawling real-time sub-portal article indices.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Kompas news sub-portal.',
        options: [
          { value: 'news', label: 'Kompas News' },
          { value: 'nasional', label: 'Kompas Nasional' },
          { value: 'regional', label: 'Kompas Regional' },
          { value: 'megapolitan', label: 'Kompas Megapolitan' },
          { value: 'money', label: 'Kompas Money (Economy)' },
          { value: 'tekno', label: 'Kompas Tekno' },
          { value: 'bola', label: 'Kompas Bola (Sports)' },
          { value: 'otomotif', label: 'Kompas Otomotif' },
          { value: 'lifestyle', label: 'Kompas Lifestyle' },
          { value: 'travel', label: 'Kompas Travel' },
          { value: 'global', label: 'Kompas Global' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news'
    }
  };
