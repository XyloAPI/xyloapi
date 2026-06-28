import type { DocTopic } from '../../types';

export const pingRoute: DocTopic = {
  id: 'ping',
  title: 'Ping Domain',
  category: 'IP Tools',
  method: 'GET',
  path: '/api/info/ping',
  pathTemplate: '/api/info/:slug',
  description: 'Lakukan Ping ke domain atau alamat IP dan kembalikan latensi RTT, IP ter-resolve, packet loss, serta statistik min/avg/max.',
  parameters: [
    { name: 'domain', type: 'text', required: true, desc: 'Domain atau alamat IP yang akan di-ping (contoh: google.com atau 8.8.8.8).' }
  ],
  payloadTemplate: {
    domain: 'google.com'
  }
};
