import type { DocTopic } from '../../types';

export const myipRoute: DocTopic = {
  id: 'myip',
  title: 'My IP Location',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/myip',
  pathTemplate: '/api/info/:slug',
  description: 'Deteksi otomatis dan cari informasi geolokasi untuk alamat IP panggilan Anda sendiri. Tidak memerlukan parameter.',
  parameters: [],
  payloadTemplate: {}
};
