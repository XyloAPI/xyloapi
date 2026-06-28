import type { DocTopic } from '../../types';

export const inilahRoute: DocTopic = {
    id: 'inilah',
    title: 'Inilah.com',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/inilah',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita politik, ekonomi, olahraga, dan hiburan terbaru dari Inilah.com. Mengembalikan hingga 20 artikel dengan gambar dan detail lainnya melalui analisis tata letak react-query.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Inilah.com.',
        options: [
          { value: 'latest', label: 'Inilah Terbaru' },
          { value: 'news', label: 'News' },
          { value: 'arena', label: 'Arena (Olahraga)' },
          { value: 'hangout', label: 'Hangout' },
          { value: 'ototekno', label: 'Ototekno' },
          { value: 'empati', label: 'Empati' },
          { value: 'gallery', label: 'Gallery' },
          { value: 'kanal', label: 'Kanal' },
          { value: 'market', label: 'Market (Ekonomi)' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'latest'
    }
  };
