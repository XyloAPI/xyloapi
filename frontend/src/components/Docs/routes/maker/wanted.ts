import type { DocTopic } from '../../types';

export const wantedRoute: DocTopic = {
  id: 'wanted',
  title: 'Wanted Poster',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/wanted',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate high-fidelity wanted posters.',
  parameters: [
    { name: 'image', type: 'text', required: true, desc: 'Direct URL to the target person image.' }
  ],
  payloadTemplate: {
    image: 'https://i.imgur.com/z0bVpgs.jpeg'
  }
};
