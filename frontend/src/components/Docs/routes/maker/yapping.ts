import type { DocTopic } from '../../types';

export const yappingRoute: DocTopic = {
  id: 'yapping',
  title: 'Yapping Certificate',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/yapping',
  pathTemplate: '/api/maker/:slug',
  description: 'Buat gambar Sertifikat Yapping yang humoris dengan nama penerima kustom.',
  parameters: [
    { name: 'name', type: 'text', required: true, desc: 'Recipient name to write on the certificate.' }
  ],
  payloadTemplate: {
    name: 'Ahmad Yapper Pratama'
  }
};
