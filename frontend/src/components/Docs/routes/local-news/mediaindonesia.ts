import type { DocTopic } from '../../types';

export const mediaindonesiaRoute: DocTopic = {
    id: 'mediaindonesia',
    title: 'Media Indonesia',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/mediaindonesia',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita ekonomi, politik, hak asasi manusia, dan olahraga terbaru dari Media Indonesia (mediaindonesia.com) beserta parsing gambar dan tanggal.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Media Indonesia.',
        options: [
          { value: 'latest', label: 'Terbaru' },
          { value: 'ekonomi', label: 'Ekonomi' },
          { value: 'politik-dan-hukum', label: 'Politik dan Hukum' },
          { value: 'humaniora', label: 'Humaniora' },
          { value: 'megapolitan', label: 'Megapolitan' },
          { value: 'nusantara', label: 'Nusantara' },
          { value: 'internasional', label: 'Internasional' },
          { value: 'olahraga', label: 'Olahraga' },
          { value: 'teknologi', label: 'Teknologi' },
          { value: 'hiburan', label: 'Hiburan' },
          { value: 'premium', label: 'Premium' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'latest'
    }
  };
