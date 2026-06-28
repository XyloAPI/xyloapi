import type { DocTopic } from '../../types';

export const fengShuiRoute: DocTopic = {
  id: 'feng-shui',
  title: 'Feng Shui (Angka Kua)',
  category: 'Primbon',
  method: 'GET',
  path: '/api/primbon/feng-shui',
  pathTemplate: '/api/primbon/:slug',
  description: 'Menghitung Feng Shui Angka Kua.',
  parameters: [
    { name: 'nama', type: 'text', required: true, desc: 'Nama Anda.' },
    { name: 'gender', type: 'select', required: true, desc: 'Jenis kelamin Anda.', options: [{ value: '1', label: 'Laki-laki' }, { value: '0', label: 'Perempuan' }] },
    { name: 'tahun', type: 'text', required: true, desc: 'Tahun lahir Anda (4 digit).' }
  ],
  payloadTemplate: {
    nama: 'jarwo',
    gender: '1',
    tahun: '2000'
  }
};
