import type { DocTopic } from '../../types';

export const tempoRoute: DocTopic = {
    id: 'tempo',
    title: 'Tempo',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/tempo',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest local news from Tempo (tempo.co) in Indonesia. Returns up to 20 articles with title, link, description, publish date, source, and image by reading real-time RSS feeds.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Tempo news category.',
        options: [
          { value: 'nasional', label: 'Tempo Nasional' },
          { value: 'bisnis', label: 'Tempo Bisnis' },
          { value: 'metro', label: 'Tempo Metro' },
          { value: 'dunia', label: 'Tempo Dunia' },
          { value: 'bola', label: 'Tempo Bola' },
          { value: 'tekno', label: 'Tempo Tekno' },
          { value: 'otomotif', label: 'Tempo Otomotif' },
          { value: 'seleb', label: 'Tempo Seleb' },
          { value: 'gaya', label: 'Tempo Gaya Hidup' },
          { value: 'kolom', label: 'Tempo Kolom' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'nasional'
    }
  };
