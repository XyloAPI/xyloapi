import type { DocTopic } from '../../types';

export const cnnindonesiaRoute: DocTopic = {
    id: 'cnnindonesia',
    title: 'CNN Indonesia',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/cnnindonesia',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita lokal terbaru dari CNN Indonesia (cnnindonesia.com). Mengembalikan hingga 20 artikel dengan judul, tautan, deskripsi, dan media dari feed RSS real-time.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih sub-portal berita CNN Indonesia.',
        options: [
          { value: 'nasional', label: 'CNN Indonesia Nasional' },
          { value: 'internasional', label: 'CNN Indonesia Internasional' },
          { value: 'ekonomi', label: 'CNN Indonesia Ekonomi' },
          { value: 'olahraga', label: 'CNN Indonesia Olahraga' },
          { value: 'teknologi', label: 'CNN Indonesia Teknologi' },
          { value: 'hiburan', label: 'CNN Indonesia Hiburan' },
          { value: 'gaya-hidup', label: 'CNN Indonesia Gaya Hidup' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'nasional'
    }
  };
