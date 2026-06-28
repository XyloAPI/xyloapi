import type { DocTopic } from '../../types';

export const wsjRoute: DocTopic = {
    id: 'wsj',
    title: 'The Wall Street Journal',
    category: 'News',
    method: 'POST',
    path: '/api/news/wsj',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita terbaru dari The Wall Street Journal (wsj.com) berdasarkan kategori. Gambar artikel tidak tersedia karena paywall.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita WSJ.',
        options: [
          { value: 'top', label: 'Top News' },
          { value: 'business', label: 'Business' },
          { value: 'tech', label: 'Technology' },
          { value: 'politics', label: 'Politics' },
          { value: 'opinion', label: 'Opinion' },
          { value: 'world', label: 'World' },
          { value: 'economy', label: 'Economy' },
          { value: 'finance', label: 'Finance' },
          { value: 'us', label: 'US News' },
          { value: 'sports', label: 'Sports' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
