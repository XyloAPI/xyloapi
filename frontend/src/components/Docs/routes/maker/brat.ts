import type { DocTopic } from '../../types';

export const bratRoute: DocTopic = {
  id: 'brat',
  title: 'Brat Generator',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/brat',
  pathTemplate: '/api/maker/:slug',
  description: 'Buat gambar sampul album ala Brat dengan teks kustom dan latar belakang hijau limau.',
  parameters: [
    { name: 'text', type: 'text', required: true, desc: 'The text message to display on the Brat image.' }
  ],
  payloadTemplate: {
    text: ''
  }
};
