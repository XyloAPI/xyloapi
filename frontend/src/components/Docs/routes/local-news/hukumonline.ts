import type { DocTopic } from '../../types';

export const hukumonlineRoute: DocTopic = {
    id: 'hukumonline',
    title: 'Hukumonline',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/hukumonline',
    pathTemplate: '/api/news/:slug',
    description: 'Fetch latest legal news, analyses, commentaries, and campus updates from Hukumonline (hukumonline.com) bypassing anti-scraping protections via advanced browser impersonation.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Select a Hukumonline news category.',
        options: [
          { value: 'latest', label: 'Berita Terbaru' },
          { value: 'utama', label: 'Berita Utama' },
          { value: 'kolom', label: 'Kolom Opini' },
          { value: 'profil', label: 'Profil Tokoh / Firma' },
          { value: 'kabar-kampus', label: 'Kabar Kampus' },
          { value: 'isu-hangat', label: 'Isu Hangat' },
          { value: 'jeda', label: 'Jeda' }
        ]
      } as any
    ],
    payloadTemplate: {
      category: 'latest'
    }
  };
