import type { DocTopic } from '../../types';

export const pakustadRoute: DocTopic = {
  id: 'pakustad',
  title: 'Pak Ustad Meme',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/pakustad',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate customized "Pak Ustad" meme board images.',
  parameters: [
    { name: 'isi', type: 'textarea', required: true, desc: 'The text message to display on the board (maximum 68 characters).' },
    {
      name: 'option',
      type: 'select',
      required: false,
      desc: 'The template layout variant. type1 (square 554x554) or type2 (tall 720x1065). Defaults to "type1".',
      options: ['type1', 'type2']
    }
  ],
  payloadTemplate: {
    isi: 'Pak ustad, apa hukumnya ngatain jomblo?',
    option: 'type1'
  }
};
