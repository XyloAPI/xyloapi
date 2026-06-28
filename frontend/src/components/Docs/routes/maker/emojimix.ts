import type { DocTopic } from '../../types';

export const emojimixRoute: DocTopic = {
  id: 'emojimix',
  title: 'Emojimix Generator',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/emojimix',
  pathTemplate: '/api/maker/:slug',
  description: 'Campurkan dua emoji menjadi satu gambar unik.',
  parameters: [
    { name: 'text', type: 'text', required: true, desc: 'Two emojis to combine (e.g. 😂😭).' }
  ],
  payloadTemplate: {
    text: '😂😭'
  }
};
