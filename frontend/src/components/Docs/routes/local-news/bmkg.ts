import type { DocTopic } from '../../types';

export const bmkgRoute: DocTopic = {
    id: 'bmkg',
    title: 'BMKG News',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/bmkg',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest weather, climate, geophysics, and activities news from BMKG (bmkg.go.id) in Indonesia. Returns up to 12 articles with title, link, description, publish date, source, and image by crawling real-time sub-portal article indices.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a BMKG news category.',
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
