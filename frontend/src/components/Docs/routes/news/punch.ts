import type { DocTopic } from '../../types';

export const punchRoute: DocTopic = {
    id: 'punch',
    title: 'The Punch',
    category: 'News',
    method: 'POST',
    path: '/api/news/punch',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest, featured, politics, sports, business, and metro news from The Punch (punchng.com) in Nigeria. Returns up to 20 articles with title, link, description, publish date, source, and media content directly from their official RSS feeds.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a section from The Punch.',
        options: [
          { value: 'latest', label: 'Latest News' },
          { value: 'featured', label: 'Featured Stories' },
          { value: 'news', label: 'General News' },
          { value: 'politics', label: 'Politics' },
          { value: 'sports', label: 'Sports' },
          { value: 'business', label: 'Business & Economy' },
          { value: 'metro', label: 'Metro Plus' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'latest'
    }
  };
