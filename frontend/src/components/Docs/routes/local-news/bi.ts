import type { DocTopic } from '../../types';

export const biRoute: DocTopic = {
    id: 'bi',
    title: 'Bank Indonesia (BI)',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/bi',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest official news releases, policy updates, and economic statements from Bank Indonesia (bi.go.id) with clean description extraction and retry handler.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Bank Indonesia news category.',
        options: [
          { value: 'news-release', label: 'News Release' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news-release'
    }
  };
