import type { DocTopic } from '../../types';

export const macLookupRoute: DocTopic = {
  id: 'mac-lookup',
  title: 'MAC Address Lookup',
  category: 'Cyber Security Tools',
  method: 'GET',
  path: '/api/info/mac-lookup',
  pathTemplate: '/api/info/:slug',
  description: 'Cari detail organisasi, registri blok, status pribadi, dan riwayat record untuk alamat MAC apa pun.',
  parameters: [
    { name: 'mac', type: 'text', required: true, desc: 'Alamat MAC yang akan dicari (contoh: 40-A8-F0-4F-50-9E atau 40:A8:F0:4F:50:9E).' }
  ],
  payloadTemplate: {
    mac: '40-A8-F0-4F-50-9E'
  }
};
