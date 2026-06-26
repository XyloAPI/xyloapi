import type { DocTopic } from '../../types';

export const timeRoute: DocTopic = {
    id: 'time',
    title: 'TIME Magazine',
    category: 'News',
    method: 'POST',
    path: '/api/news/time',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch the latest news from TIME Magazine (time.com). Returns up to 25 articles with title, image, description, author, and publish date. Images are extracted from video thumbnails or fetched concurrently via og:image.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'TIME Magazine currently exposes a single unified feed.',
        options: [
          { value: 'top', label: 'Top Stories' },
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'top'
    }
  };
