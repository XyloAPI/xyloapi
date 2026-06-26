import type { DocTopic } from '../../types';

export const mediaindonesiaRoute: DocTopic = {
    id: 'mediaindonesia',
    title: 'Media Indonesia',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/mediaindonesia',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest economic, political, human rights, and sports news from Media Indonesia (mediaindonesia.com) with image and date parsing.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Media Indonesia news category.',
        options: [
          { value: 'latest', label: 'Terbaru' },
          { value: 'ekonomi', label: 'Ekonomi' },
          { value: 'politik-dan-hukum', label: 'Politik dan Hukum' },
          { value: 'humaniora', label: 'Humaniora' },
          { value: 'megapolitan', label: 'Megapolitan' },
          { value: 'nusantara', label: 'Nusantara' },
          { value: 'internasional', label: 'Internasional' },
          { value: 'olahraga', label: 'Olahraga' },
          { value: 'teknologi', label: 'Teknologi' },
          { value: 'hiburan', label: 'Hiburan' },
          { value: 'premium', label: 'Premium' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'latest'
    }
  };
