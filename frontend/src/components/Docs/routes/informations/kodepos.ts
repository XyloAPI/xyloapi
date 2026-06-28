import type { DocTopic } from '../../types';

export const kodeposRoute: DocTopic = {
  id: 'kodepos',
  title: 'Indonesian Postal Code',
  category: 'Informations',
  method: 'GET',
  path: '/api/info/kodepos',
  pathTemplate: '/api/info/:slug',
  description: 'Cari kode pos Indonesia berdasarkan nomor kode pos atau nama area (provinsi, kabupaten, kecamatan, desa).',
  parameters: [
    { name: 'query', type: 'text', required: true, desc: 'Kueri pencarian (contoh: nama area atau digit kode pos).' },
    { name: 'limit', type: 'text', required: false, desc: 'Kueri pencarian (contoh: nama area atau digit kode pos).' }
  ],
  payloadTemplate: {
    query: '',
    limit: '50'
  }
};
