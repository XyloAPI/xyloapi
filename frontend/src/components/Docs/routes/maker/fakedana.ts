import type { DocTopic } from '../../types';

export const fakedanaRoute: DocTopic = {
  id: 'fakedana',
  title: 'Fake Dana',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/fakedana',
  pathTemplate: '/api/maker/:slug',
  description: 'Hasilkan mockup halaman saldo Dana simulasi yang terlihat realistis.',
  parameters: [
    { name: 'nominal', type: 'text', required: true, desc: 'The mock balance amount (e.g. 150000 or 2500000).' }
  ],
  payloadTemplate: {
    nominal: '150000'
  }
};
