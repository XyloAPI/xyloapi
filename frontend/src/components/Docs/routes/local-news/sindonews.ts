import type { DocTopic } from '../../types';

export const sindonewsRoute: DocTopic = {
    id: 'sindonews',
    title: 'Sindonews',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/sindonews',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita lokal terbaru dari Sindonews (sindonews.com) di Indonesia. Mengembalikan hingga 20 artikel melalui feed RSS real-time.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih sub-portal berita Sindonews.',
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
