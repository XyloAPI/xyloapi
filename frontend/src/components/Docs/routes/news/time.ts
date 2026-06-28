import type { DocTopic } from '../../types';

export const timeRoute: DocTopic = {
    id: 'time',
    title: 'TIME Magazine',
    category: 'News',
    method: 'POST',
    path: '/api/news/time',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita terbaru dari Majalah TIME (time.com). Mengembalikan hingga 25 artikel. Gambar diambil dari thumbnail video atau og:image.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita TIME.',
        options: [
          { value: 'top', label: 'Top Stories' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
