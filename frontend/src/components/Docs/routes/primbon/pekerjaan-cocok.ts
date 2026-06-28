import type { DocTopic } from '../../types';

export const pekerjaanCocokRoute: DocTopic = {
  id: 'pekerjaan-cocok',
  title: 'Pekerjaan yang Cocok',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/pekerjaan-cocok',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menganalisis bidang pekerjaan, profesi, atau karir yang paling cocok dan berpotensi sukses berdasarkan weton kelahiran Anda.',
  parameters: [
    { name: 'tgl', type: 'text', required: true, desc: 'Tanggal lahir Anda (1-31).' },
    { name: 'bln', type: 'text', required: true, desc: 'Bulan lahir Anda (1-12).' },
    { name: 'thn', type: 'text', required: true, desc: 'Tahun lahir Anda (4 digit).' }
  ],
  payloadTemplate: {
    tgl: '1',
    bln: '1',
    thn: '1999'
  }
};
