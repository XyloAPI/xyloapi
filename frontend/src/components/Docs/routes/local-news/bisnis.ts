import type { DocTopic } from '../../types';

export const bisnisRoute: DocTopic = {
    id: 'bisnis',
    title: 'Bisnis.com',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/bisnis',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest economic and general news from Bisnis.com in Indonesia. Returns up to 20 articles with title, link, publish date, source, and image by parsing sub-portal article listings.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Bisnis.com news category.',
        options: [
          { value: 'ekonomi', label: 'Bisnis Ekonomi' },
          { value: 'finansial', label: 'Bisnis Finansial' },
          { value: 'market', label: 'Bisnis Market' },
          { value: 'teknologi', label: 'Bisnis Teknologi' },
          { value: 'otomotif', label: 'Bisnis Otomotif' },
          { value: 'bola', label: 'Bisnis Bola' },
          { value: 'kabar24', label: 'Bisnis Kabar24' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'ekonomi'
    }
  };
