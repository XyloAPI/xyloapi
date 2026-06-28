import type { DocTopic } from '../../types';

export const ramalanKartuRoute: DocTopic = {
  id: 'ramalan-kartu',
  title: 'Ramalan Kartu Lenormand',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/ramalan-kartu',
  pathTemplate: '/api/primbon/:slug',
  description: 'Membaca ramalan menggunakan kartu Lenormand.',
  parameters: [
    { name: 'name', type: 'text', required: true, desc: 'Nama Anda.' },
    { name: 'gender', type: 'select', required: true, desc: 'Jenis kelamin Anda.', options: [{ value: 'm', label: 'Pria' }, { value: 'f', label: 'Wanita' }] }
  ],
  payloadTemplate: {
    name: 'upin',
    gender: 'm'
  }
};
