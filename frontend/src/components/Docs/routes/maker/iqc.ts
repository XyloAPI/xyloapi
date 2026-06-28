import type { DocTopic } from '../../types';

export const iqcRoute: DocTopic = {
  id: 'iqc',
  title: 'iPhone Quoted',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/iqc',
  pathTemplate: '/api/maker/:slug',
  description: 'Hasilkan mockup tangkapan layar obrolan iMessage iPhone yang realistis.',
  parameters: [
    { name: 'text', type: 'text', required: true, desc: 'The text message inside the quote chat bubble.' }
  ],
  payloadTemplate: {
    text: 'Ayo belajar coding!'
  }
};
