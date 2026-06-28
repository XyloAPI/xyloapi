import type { DocTopic } from '../../types';

export const nhlRoute: DocTopic = {
    id: 'nhl',
    title: 'NHL News',
    category: 'News',
    method: 'POST',
    path: '/api/news/nhl',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita dan cerita terbaru dari NHL (nhl.com). Mengembalikan hingga 20 artikel dengan gambar, ringkasan, dan tanggal terbit.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita NHL.',
        options: [
          { value: 'nhl', label: 'NHL News (league-wide)' },
          { value: 'all', label: 'All Stories (includes team content)' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'nhl'
    }
  };
