import type { DocTopic } from '../../types';

export const terkiniRoute: DocTopic = {
    id: 'terkini',
    title: 'Terkini News',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/terkini',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita lokal terbaru, ekonomi, gaya hidup, olahraga, dan tekno dari Terkini News (terkini.id) di Indonesia.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Terkini News.',
        options: [
          { value: 'news', label: 'News' },
          { value: 'ekobis', label: 'Ekobis' },
          { value: 'lifestyle', label: 'Lifestyle' },
          { value: 'hiburan', label: 'Hiburan' },
          { value: 'bola', label: 'Bola' },
          { value: 'cekfakta', label: 'Cek Fakta' },
          { value: 'health', label: 'Health' },
          { value: 'tekno', label: 'Tekno' },
          { value: 'komunitas', label: 'Komunitas' },
          { value: 'milenial', label: 'Milenial' },
          { value: 'ragam', label: 'Ragam' },
          { value: 'kolom', label: 'Kolom' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news'
    }
  };
