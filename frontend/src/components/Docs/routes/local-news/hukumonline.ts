import type { DocTopic } from '../../types';

export const hukumonlineRoute: DocTopic = {
    id: 'hukumonline',
    title: 'Hukumonline',
    category: 'Local News',
    method: 'POST',
    path: '/api/news/hukumonline',
    pathTemplate: '/api/news/:slug',
    description: 'Ambil berita hukum terbaru, analisis, komentar, dan pembaruan kampus dari Hukumonline (hukumonline.com) yang menembus perlindungan anti-scraping dengan simulasi browser tingkat lanjut.',
    parameters: [
      {
        name: 'category',
        type: 'select',
        required: true,
        desc: 'Pilih kategori berita Hukumonline.',
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
