import type { DocTopic } from '../../types';

export const kompastvRoute: DocTopic = {
    id: 'kompastv',
    title: 'Kompas TV',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/kompastv',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil video berita lokal terbaru dan acara bincang-bincang dari Kompas TV (kompas.tv) di Indonesia.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Kompas TV.',
        options: [
          { value: 'news', label: 'Berita Utama (News)' },
          { value: 'nasional', label: 'Nasional' },
          { value: 'regional', label: 'Regional' },
          { value: 'internasional', label: 'Internasional' },
          { value: 'ekonomi', label: 'Ekonomi' },
          { value: 'olahraga', label: 'Olahraga' },
          { value: 'lifestyle', label: 'Lifestyle' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'talkshow', label: 'Talkshow' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news'
    }
  };
