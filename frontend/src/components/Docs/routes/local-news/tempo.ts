import type { DocTopic } from '../../types';

export const tempoRoute: DocTopic = {
    id: 'tempo',
    title: 'Tempo',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/tempo',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita lokal terbaru dari Tempo (tempo.co) di Indonesia. Mengembalikan hingga 20 artikel menggunakan feed RSS real-time.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Tempo.',
        options: [
          { value: 'nasional', label: 'Tempo Nasional' },
          { value: 'bisnis', label: 'Tempo Bisnis' },
          { value: 'metro', label: 'Tempo Metro' },
          { value: 'dunia', label: 'Tempo Dunia' },
          { value: 'bola', label: 'Tempo Bola' },
          { value: 'tekno', label: 'Tempo Tekno' },
          { value: 'otomotif', label: 'Tempo Otomotif' },
          { value: 'seleb', label: 'Tempo Seleb' },
          { value: 'gaya', label: 'Tempo Gaya Hidup' },
          { value: 'kolom', label: 'Tempo Kolom' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'nasional'
    }
  };
