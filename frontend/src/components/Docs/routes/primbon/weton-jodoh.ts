import type { DocTopic } from '../../types';

export const wetonJodohRoute: DocTopic = {
  id: 'weton-jodoh',
  title: 'Weton Jodoh',
  category: 'Primbon',
  method: 'POST',
  path: '/api/primbon/weton-jodoh',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menghitung kecocokan weton pasangan berdasarkan tanggal lahir dan jenis kelamin menggunakan sistem Primbon Jawa. Menampilkan weton, neptu, dan kategori kecocokan (Ratu, Pegat, Tinari, dll).',
  parameters: [
    {
      name: 'birth1',
      type: 'text',
      required: true,
      desc: 'Tanggal lahir Anda (format: YYYY-MM-DD, contoh: 2000-05-01).'
    },
    {
      name: 'gender1',
      type: 'select',
      required: true,
      desc: 'Jenis kelamin Anda.',
      options: [
        { value: 'Laki-laki', label: 'Laki-laki' },
        { value: 'Perempuan', label: 'Perempuan' }
      ]
    },
    {
      name: 'birth2',
      type: 'text',
      required: true,
      desc: 'Tanggal lahir pasangan (format: YYYY-MM-DD, contoh: 2001-08-17).'
    },
    {
      name: 'gender2',
      type: 'select',
      required: true,
      desc: 'Jenis kelamin pasangan.',
      options: [
        { value: 'Perempuan', label: 'Perempuan' },
        { value: 'Laki-laki', label: 'Laki-laki' }
      ]
    }
  ],
  payloadTemplate: {
    birth1: '2000-05-01',
    gender1: 'Laki-laki',
    birth2: '2001-08-17',
    gender2: 'Perempuan'
  }
};
