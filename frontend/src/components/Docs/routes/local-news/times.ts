import type { DocTopic } from '../../types';

export const timesRoute: DocTopic = {
    id: 'times',
    title: 'TIMES Indonesia',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/times',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest general, regional, and national news from TIMES Indonesia (timesindonesia.co.id). Returns up to 20 articles with title, link, description, publish date, source, and image using their authorized backend API.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a TIMES Indonesia news category.',
        options: [
          { value: 'latest', label: 'TIMES Terbaru' },
          { value: 'ekonomi', label: 'Ekonomi' },
          { value: 'politik', label: 'Politik' },
          { value: 'olahraga', label: 'Olahraga' },
          { value: 'tekno', label: 'Tekno' },
          { value: 'wisata', label: 'Wisata' },
          { value: 'pendidikan', label: 'Pendidikan' },
          { value: 'gaya-hidup', label: 'Gaya Hidup' },
          { value: 'kopi-times', label: 'Kopi TIMES' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'peristiwa-nasional', label: 'Peristiwa Nasional' },
          { value: 'peristiwa-daerah', label: 'Peristiwa Daerah' },
          { value: 'peristiwa-internasional', label: 'Peristiwa Internasional' },
          { value: 'english', label: 'English' },
          { value: 'pemerintahan', label: 'Pemerintahan' },
          { value: 'hukum-kriminal', label: 'Hukum dan Kriminal' },
          { value: 'religi', label: 'Religi' },
          { value: 'sosok', label: 'Sosok' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'latest'
    }
  };
