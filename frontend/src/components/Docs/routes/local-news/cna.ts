import type { DocTopic } from '../../types';

export const cnaRoute: DocTopic = {
    id: 'cna',
    title: 'CNA Indonesia',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/cna',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest local news, economy, lifestyle, and regional updates from CNA Indonesia (cna.id). Returns up to 20 articles with title, link, description, publish date, source, and image content.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a CNA Indonesia category.',
        options: [
          { value: 'news', label: 'Berita Utama' },
          { value: 'terbaru', label: 'Terbaru' },
          { value: 'asia', label: 'Asia' },
          { value: 'indonesia', label: 'Indonesia' },
          { value: 'lifestyle', label: 'Lifestyle' },
          { value: 'trending', label: 'Trending' },
          { value: 'pilihan-editor', label: 'Pilihan Editor' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'indonesia'
    }
  };
