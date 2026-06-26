import type { DocTopic } from '../../types';

export const sindonewsRoute: DocTopic = {
    id: 'sindonews',
    title: 'Sindonews',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/sindonews',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest local news from Sindonews (sindonews.com) in Indonesia. Returns up to 20 articles with title, link, description, publish date, source, and media content by reading real-time RSS feeds.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Sindonews sub-portal.',
        options: [
          { value: 'latest', label: 'Sindonews Terbaru' },
          { value: 'nasional', label: 'Sindonews Nasional' },
          { value: 'daerah', label: 'Sindonews Daerah' },
          { value: 'ekbis', label: 'Sindonews Ekbis (Economy)' },
          { value: 'international', label: 'Sindonews International' },
          { value: 'sports', label: 'Sindonews Sports' },
          { value: 'tekno', label: 'Sindonews Tekno' },
          { value: 'otomotif', label: 'Sindonews Otomotif' },
          { value: 'lifestyle', label: 'Sindonews Lifestyle' },
          { value: 'kalam', label: 'Sindonews Kalam (Religious/Hikmah)' },
          { value: 'edukasi', label: 'Sindonews Edukasi' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'latest'
    }
  };
