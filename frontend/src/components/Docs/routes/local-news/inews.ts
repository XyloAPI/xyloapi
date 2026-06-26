import type { DocTopic } from '../../types';

export const inewsRoute: DocTopic = {
    id: 'inews',
    title: 'iNews',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/inews',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest local news, sports, business, lifestyle, and regional updates from iNews (inews.id) in Indonesia. Returns up to 20 articles with title, link, description, publish date, source, and image content.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select an iNews category.',
        options: [
          { value: 'news', label: 'News Utama' },
          { value: 'nasional', label: 'Nasional' },
          { value: 'internasional', label: 'Internasional' },
          { value: 'megapolitan', label: 'Megapolitan' },
          { value: 'finance', label: 'Finance' },
          { value: 'sport', label: 'Sport' },
          { value: 'soccer', label: 'Soccer' },
          { value: 'lifestyle', label: 'Lifestyle' },
          { value: 'travel', label: 'Travel' },
          { value: 'otomotif', label: 'Otomotif' },
          { value: 'techno', label: 'Techno' },
          { value: 'regional', label: 'Regional' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news'
    }
  };
