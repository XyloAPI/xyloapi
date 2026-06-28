import type { DocTopic } from '../../types';

export const bmkgRoute: DocTopic = {
    id: 'bmkg',
    title: 'BMKG News',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/bmkg',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita cuaca, iklim, geofisika, dan aktivitas terbaru dari BMKG (bmkg.go.id) di Indonesia. Mengembalikan hingga 12 artikel dengan detail lengkap dari indeks portal berita mereka.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita BMKG.',
        options: [
          { value: 'all', label: 'BMKG Semua Berita' },
          { value: 'utama', label: 'BMKG Berita Utama' },
          { value: 'kegiatan', label: 'BMKG Berita Kegiatan' },
          { value: 'daerah', label: 'BMKG Berita Daerah' },
          { value: 'kegiatan-internasional', label: 'BMKG Kegiatan Internasional' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'all'
    }
  };
