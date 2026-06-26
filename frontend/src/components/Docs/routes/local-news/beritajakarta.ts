import type { DocTopic } from '../../types';

export const beritajakartaRoute: DocTopic = {
    id: 'beritajakarta',
    title: 'Berita Jakarta',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/beritajakarta',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch official news releases, policies, public services, and infrastructure developments in Jakarta from Berita Jakarta (beritajakarta.id).',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Berita Jakarta news category.',
        options: [
          { value: 'latest', label: 'Terbaru' },
          { value: 'ekonomi', label: 'Ekonomi' },
          { value: 'pembangunan', label: 'Pembangunan' },
          { value: 'pemerintahan', label: 'Pemerintahan' },
          { value: 'kesra', label: 'Kesejahteraan Rakyat' },
          { value: 'dprd', label: 'DPRD' },
          { value: 'siaran-pers', label: 'Siaran Pers' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'latest'
    }
  };
