import type { DocTopic } from '../../types';

export const cnnRoute: DocTopic = {
    id: 'cnn',
    title: 'CNN',
    category: 'News',
    method: 'POST',
    path: '/api/news/cnn',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita utama dan artikel terbaru dari CNN (edition.cnn.com) berdasarkan kategori. Mengembalikan hingga 20 artikel dengan judul, gambar, deskripsi, dan tanggal terbit.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih sub-portal berita CNN.',
        options: [
          { value: 'top', label: 'Top Stories' },
          { value: 'world', label: 'World' },
          { value: 'us', label: 'US' },
          { value: 'business', label: 'Business' },
          { value: 'politics', label: 'Politics' },
          { value: 'health', label: 'Health' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'sport', label: 'Sport' },
          { value: 'technology', label: 'Technology' },
          { value: 'travel', label: 'Travel' },
          { value: 'asia', label: 'Asia' },
          { value: 'europe', label: 'Europe' },
          { value: 'middleeast', label: 'Middle East' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
