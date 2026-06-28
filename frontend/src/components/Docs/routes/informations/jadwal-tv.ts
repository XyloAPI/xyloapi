import type { DocTopic } from '../../types';

export const jadwal_tvRoute: DocTopic = {
  id: 'jadwal-tv',
  title: 'Jadwal TV Indonesia',
  category: 'Informations',
  method: 'GET',
  path: '/api/info/jadwal-tv',
  pathTemplate: '/api/info/:slug',
  description: 'Ambil jadwal program televisi hari ini untuk berbagai saluran nasional di Indonesia.',
  parameters: [
    { name: 'channel', type: 'text', required: false, desc: 'Nama saluran TV (contoh: transtv, rcti, sctv, trans7, gtv, antv, indosiar, metrotv, tvone, nettv, rtv, tvri, moji, inewstv).' }
  ],
  payloadTemplate: {
    channel: 'transtv'
  }
};
