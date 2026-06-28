import type { DocTopic } from '../../types';

export const antaranewsRoute: DocTopic = {
    id: 'antaranews',
    title: 'Antara News',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/antaranews',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita lokal terbaru dari Antara News (antaranews.com) di Indonesia. Mengembalikan hingga 20 artikel dengan judul, tautan, deskripsi, tanggal terbit, sumber, dan media melalui feed RSS real-time.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih sub-portal berita Antara News.',
        options: [
          { value: 'top-news', label: 'Antara Top News' },
          { value: 'politik', label: 'Antara Politik' },
          { value: 'ekonomi', label: 'Antara Ekonomi & Bisnis' },
          { value: 'metro', label: 'Antara Metro Jakarta' },
          { value: 'olahraga', label: 'Antara Olahraga' },
          { value: 'hiburan', label: 'Antara Hiburan' },
          { value: 'tekno', label: 'Antara Tekno' },
          { value: 'otomotif', label: 'Antara Otomotif' },
          { value: 'lifestyle', label: 'Antara Lifestyle' },
          { value: 'warta-bumi', label: 'Antara Warta Bumi' },
          { value: 'humaniora', label: 'Antara Humaniora' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top-news'
    }
  };
