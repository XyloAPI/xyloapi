import type { DocTopic } from '../../types';

export const detikRoute: DocTopic = {
    id: 'detik',
    title: 'Detik News',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/detik',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita lokal terbaru dari Detik (detik.com) di Indonesia. Mengembalikan hingga 20 artikel melalui pemindaian indeks artikel real-time.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih sub-portal berita Detik.',
        options: [
          { value: 'news', label: 'Detik News' },
          { value: 'finance', label: 'Detik Finance' },
          { value: 'inet', label: 'Detik Inet (Tech)' },
          { value: 'hot', label: 'Detik Hot (Celebrity/Movie)' },
          { value: 'sport', label: 'Detik Sport' },
          { value: 'health', label: 'Detik Health' },
          { value: 'travel', label: 'Detik Travel' },
          { value: 'oto', label: 'Detik Oto (Automotive)' }
        ]
      } as any
    ],
  };
