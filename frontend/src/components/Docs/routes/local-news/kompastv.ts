import type { DocTopic } from '../../types';

export const kompastvRoute: DocTopic = {
    id: 'kompastv',
    title: 'Kompas TV',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/kompastv',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest local news and talkshow videos from Kompas TV (kompas.tv) in Indonesia. Returns up to 20 articles with title, link, description, publish date, source, and media content.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Kompas TV news category.',
        options: [
          { value: 'news', label: 'Berita Utama (News)' },
          { value: 'nasional', label: 'Nasional' },
          { value: 'regional', label: 'Regional' },
          { value: 'internasional', label: 'Internasional' },
          { value: 'ekonomi', label: 'Ekonomi' },
          { value: 'olahraga', label: 'Olahraga' },
          { value: 'lifestyle', label: 'Lifestyle' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'talkshow', label: 'Talkshow' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'news'
    }
  };
