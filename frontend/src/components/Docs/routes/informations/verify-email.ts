import type { DocTopic } from '../../types';

export const verifyemailRoute: DocTopic = {
  id: 'verify-email',
  title: 'Validate Email Address',
  category: 'Email Tools',
  method: 'GET',
  path: '/api/info/verify-email',
  pathTemplate: '/api/info/:slug',
  description: 'Validasi dan verifikasi apakah alamat email ada dan dapat menerima pesan email.',
  parameters: [
    { name: 'email', type: 'text', required: true, desc: 'Alamat email yang akan diverifikasi (contoh: example@gmail.com).' }
  ],
  payloadTemplate: {
    email: 'me.lvi.ng.om.ez.640@gmail.com'
  }
};
