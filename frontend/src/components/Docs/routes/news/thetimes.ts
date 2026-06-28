import type { DocTopic } from '../../types';

export const thetimesRoute: DocTopic = {
    id: 'thetimes',
    title: 'The Times',
    category: 'News',
    method: 'POST',
    path: '/api/news/thetimes',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita terbaru dari The Times (thetimes.com) berdasarkan kategori. Gambar tidak tersedia karena paywall.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita The Times.',
        options: [
          { value: 'top', label: 'Top News' },
          { value: 'uk', label: 'UK News' },
          { value: 'world', label: 'World' },
          { value: 'politics', label: 'Politics' },
          { value: 'business', label: 'Business' },
          { value: 'technology', label: 'Technology' },
          { value: 'health', label: 'Health' },
          { value: 'culture', label: 'Culture' },
          { value: 'sport', label: 'Sport' },
          { value: 'comment', label: 'Comment' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
