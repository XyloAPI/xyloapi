import type { DocTopic } from '../../types';

export const tanggalJadianRoute: DocTopic = {
  id: 'tanggal-jadian',
  title: 'Tanggal Jadian',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/tanggal-jadian',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menganalisis makna, karakteristik, serta potensi masa depan hubungan percintaan atau pernikahan berdasarkan hari jadian atau tanggal pernikahan menurut numerologi.',
  parameters: [
    { name: 'tgl', type: 'text', required: true, desc: 'Tanggal jadian/pernikahan (1-31).' },
    { name: 'bln', type: 'text', required: true, desc: 'Bulan jadian/pernikahan (1-12).' },
    { name: 'thn', type: 'text', required: true, desc: 'Tahun jadian/pernikahan (4 digit).' }
  ],
  payloadTemplate: {
    tgl: '1',
    bln: '1',
    thn: '1999'
  }
};
