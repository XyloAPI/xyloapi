import type { DocTopic } from '../../types';

export const bisnisRoute: DocTopic = {
    id: 'bisnis',
    title: 'Bisnis.com',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/bisnis',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita ekonomi dan umum terbaru dari Bisnis.com di Indonesia. Mengembalikan hingga 20 artikel dengan judul, tautan, tanggal terbit, sumber, dan gambar.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Bisnis.com.',
        options: [
          { value: 'ekonomi', label: 'Bisnis Ekonomi' },
          { value: 'finansial', label: 'Bisnis Finansial' },
          { value: 'market', label: 'Bisnis Market' },
          { value: 'teknologi', label: 'Bisnis Teknologi' },
          { value: 'otomotif', label: 'Bisnis Otomotif' },
          { value: 'bola', label: 'Bisnis Bola' },
          { value: 'kabar24', label: 'Bisnis Kabar24' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'ekonomi'
    }
  };
