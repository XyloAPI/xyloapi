import type { DocTopic } from '../../types';

export const fakeCanonRoute: DocTopic = {
  id: 'fakecanon',
  title: 'Fake Canon Viewfinder',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/fakecanon',
  pathTemplate: '/api/maker/:slug',
  description: 'Hasilkan mockup tangkapan layar viewfinder kamera Canon DSLR yang realistis dengan foto Anda di dalamnya.',
  parameters: [
    { name: 'image', type: 'text', required: true, desc: 'Direct URL to the image to display.' }
  ],
  payloadTemplate: {
    image: 'https://i.imgur.com/N8NOQ5F.jpeg'
  }
};
