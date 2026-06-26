import type { DocTopic } from '../../types';

export const okezoneRoute: DocTopic = {
    id: 'okezone',
    title: 'Okezone',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/okezone',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest general, techno, and sports news from Okezone (okezone.com) in Indonesia. Returns up to 20 articles with title, link, description, publish date, source, and image using sindikasi RSS feeds with concurrent metadata resolution.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select an Okezone news category.',
        options: [
          { value: 'breaking', label: 'Okezone Breaking News' },
          { value: 'news', label: 'Okezone News' },
          { value: 'international', label: 'Okezone Internasional' },
          { value: 'lifestyle', label: 'Okezone Lifestyle' },
          { value: 'techno', label: 'Okezone Techno' },
          { value: 'sports', label: 'Okezone Sports' },
          { value: 'economy', label: 'Okezone Economy' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'breaking'
    }
  };
