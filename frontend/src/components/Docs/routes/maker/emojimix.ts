import type { DocTopic } from '../../types';

export const emojimixRoute: DocTopic = {
  id: 'emojimix',
  title: 'Emojimix Generator',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/emojimix',
  pathTemplate: '/api/maker/:slug',
  description: 'Mix two emojis together into a single Google Gboard Emoji Kitchen style image.',
  parameters: [
    { name: 'text', type: 'text', required: true, desc: 'Two emojis to combine (e.g. 😂😭).' }
  ],
  payloadTemplate: {
    text: '😂😭'
  }
};
