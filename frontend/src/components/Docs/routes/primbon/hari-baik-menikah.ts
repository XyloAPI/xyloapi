import type { DocTopic } from '../../types';

export const hariBaikMenikahRoute: DocTopic = {
  id: 'hari-baik-menikah',
  title: 'Hari Baik Menikah',
  category: 'Primbon',
  method: 'POST',
  path: '/api/primbon/hari-baik-menikah',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menghitung hari-hari baik yang disarankan untuk pernikahan berdasarkan weton kedua pasangan menurut Primbon Jawa.',
  parameters: [
    {
      name: 'birth1',
      type: 'text',
      required: true,
      desc: 'Tanggal lahir Anda (format: YYYY-MM-DD, contoh: 2000-05-01).'
    },
    {
      name: 'birth2',
      type: 'text',
      required: true,
      desc: 'Tanggal lahir pasangan (format: YYYY-MM-DD, contoh: 2001-08-17).'
    }
  ],
  payloadTemplate: {
    birth1: '2000-05-01',
    birth2: '2001-08-17'
  }
};
