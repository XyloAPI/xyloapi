import type { DocTopic } from '../../types';

export const cnnindonesiaRoute: DocTopic = {
    id: 'cnnindonesia',
    title: 'CNN Indonesia',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/cnnindonesia',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest local news from CNN Indonesia (cnnindonesia.com). Returns up to 20 articles with title, link, description, publish date, source, and media content by reading real-time RSS feeds.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a CNN Indonesia news sub-portal.',
        options: [
          { value: 'nasional', label: 'CNN Indonesia Nasional' },
          { value: 'internasional', label: 'CNN Indonesia Internasional' },
          { value: 'ekonomi', label: 'CNN Indonesia Ekonomi' },
          { value: 'olahraga', label: 'CNN Indonesia Olahraga' },
          { value: 'teknologi', label: 'CNN Indonesia Teknologi' },
          { value: 'hiburan', label: 'CNN Indonesia Hiburan' },
          { value: 'gaya-hidup', label: 'CNN Indonesia Gaya Hidup' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'nasional'
    }
  };
