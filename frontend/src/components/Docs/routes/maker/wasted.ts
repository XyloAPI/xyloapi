import type { DocTopic } from '../../types';

export const wastedRoute: DocTopic = {
  id: 'wasted',
  title: 'Wasted Screen',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/wasted',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate GTA-style Wasted screen overlays.',
  parameters: [
    { name: 'image', type: 'text', required: true, desc: 'Direct URL to the target person image.' }
  ],
  payloadTemplate: {
    image: 'https://i.imgur.com/z0bVpgs.jpeg'
  }
};
