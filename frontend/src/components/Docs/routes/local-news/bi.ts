import type { DocTopic } from '../../types';

export const biRoute: DocTopic = {
    id: 'bi',
    title: 'Bank Indonesia (BI)',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/bi',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil rilis berita resmi terbaru, pembaruan kebijakan, dan pernyataan ekonomi dari Bank Indonesia (bi.go.id) dengan ekstraksi deskripsi yang rapi dan penanganan retry.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Bank Indonesia.',
        options: [
          { value: 'news-release', label: 'News Release' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news-release'
    }
  };
