import type { DocTopic } from '../../types';

export const detikRoute: DocTopic = {
    id: 'detik',
    title: 'Detik News',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/detik',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest local news from Detik (detik.com) in Indonesia. Returns up to 20 articles with title, link, description, publish date, source, and media content by crawling real-time sub-portal article indices.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Detik news sub-portal.',
        options: [
          { value: 'news', label: 'Detik News' },
          { value: 'finance', label: 'Detik Finance' },
          { value: 'inet', label: 'Detik Inet (Tech)' },
          { value: 'hot', label: 'Detik Hot (Celebrity/Movie)' },
          { value: 'sport', label: 'Detik Sport' },
          { value: 'health', label: 'Detik Health' },
          { value: 'travel', label: 'Detik Travel' },
          { value: 'oto', label: 'Detik Oto (Automotive)' }
        ]
      } as any
    ],
  };
