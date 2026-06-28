import type { DocTopic } from '../../types';

export const sertifikatTololRoute: DocTopic = {
  id: 'sertifikat-tolol',
  title: 'Sertifikat Tolol',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/sertifikat-tolol',
  pathTemplate: '/api/maker/:slug',
  description: 'Buat gambar sertifikat humor Indonesia dengan nama penerima kustom.',
  parameters: [
    { name: 'name', type: 'text', required: true, desc: 'Full name to print on the certificate.' }
  ],
  payloadTemplate: {
    name: 'PATRICK STAR'
  }
};
