import type { DocTopic } from '../../types';

export const nasanewsRoute: DocTopic = {
    id: 'nasanews',
    title: 'NASA News',
    category: 'News',
    method: 'POST',
    path: '/api/news/nasa',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita sains terbaru, rilis pers, dan cerita pilihan langsung dari NASA (nasa.gov). Terintegrasi langsung dengan API REST NASA.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita NASA.',
        options: [
          { value: 'releases', label: 'News Releases' },
          { value: 'news', label: 'General News' },
          { value: 'featured', label: 'Featured News' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'releases'
    }
  };
