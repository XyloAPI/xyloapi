import type { DocTopic } from '../../types';

export const tangerangkotaRoute: DocTopic = {
    id: 'tangerangkota',
    title: 'Tangerang Kota',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/tangerangkota',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest news releases, announcements, and popular articles from the official Tangerang City portal (tangerangkota.go.id).',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Tangerang Kota news category.',
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
