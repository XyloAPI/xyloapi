import type { DocTopic } from '../../types';

export const inilahRoute: DocTopic = {
    id: 'inilah',
    title: 'Inilah.com',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/inilah',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest political, economic, sports, and entertainment news from Inilah.com. Returns up to 20 articles with title, link, description, publish date, source, and image using dehydrated react-query layout analysis.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select an Inilah.com news category.',
        options: [
          { value: 'latest', label: 'Inilah Terbaru' },
          { value: 'news', label: 'News' },
          { value: 'arena', label: 'Arena (Olahraga)' },
          { value: 'hangout', label: 'Hangout' },
          { value: 'ototekno', label: 'Ototekno' },
          { value: 'empati', label: 'Empati' },
          { value: 'gallery', label: 'Gallery' },
          { value: 'kanal', label: 'Kanal' },
          { value: 'market', label: 'Market (Ekonomi)' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'latest'
    }
  };
