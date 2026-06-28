import type { DocTopic } from '../../types';

export const tangerangkotaRoute: DocTopic = {
    id: 'tangerangkota',
    title: 'Tangerang Kota',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/tangerangkota',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil rilis berita terbaru, pengumuman, dan artikel populer dari portal resmi Kota Tangerang (tangerangkota.go.id).',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Tangerang Kota.',
        options: [
          { value: 'latest', label: 'Terbaru' },
          { value: 'populer', label: 'Populer' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'latest'
    }
  };
