import type { DocTopic } from '../../types';

export const kompasRoute: DocTopic = {
    id: 'kompas',
    title: 'Kompas News',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/kompas',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita lokal terbaru dari Kompas (kompas.com) di Indonesia. Mengembalikan hingga 20 artikel dengan indeks artikel yang dipindai secara real-time.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih sub-portal berita Kompas.',
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
