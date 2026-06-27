import type { DocTopic } from '../../types';

export const fakeCanonRoute: DocTopic = {
  id: 'fakecanon',
  title: 'Fake Canon Viewfinder',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/fakecanon',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate realistic, tilted Canon DSLR camera viewfinder mockup screenshots with your photo aligned in the viewport.',
  parameters: [
    { name: 'image', type: 'text', required: true, desc: 'Direct URL to the image to display.' }
  ],
  payloadTemplate: {
    image: 'https://i.imgur.com/N8NOQ5F.jpeg'
  }
};
