import type { DocTopic } from '../../types';

export const aljazeeraRoute: DocTopic = {
    id: 'aljazeera',
    title: 'Al Jazeera',
    category: 'News',
    method: 'POST',
    path: '/api/news/aljazeera',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil artikel berita terbaru dari Al Jazeera (aljazeera.com) berdasarkan kategori. Mengembalikan hingga 20 artikel dengan judul, gambar, deskripsi, dan tanggal terbit.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Al Jazeera.',
        options: [
          { value: 'news', label: 'News' },
          { value: 'sport', label: 'Sport' },
          { value: 'economy', label: 'Economy' },
          { value: 'features', label: 'Features' },
          { value: 'opinion', label: 'Opinion' },
          { value: 'video', label: 'Video' },
          { value: 'liveblog', label: 'Live Blog' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news'
    }
  };
