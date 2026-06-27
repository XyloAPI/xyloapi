import type { DocTopic } from '../../types';

export const iphoneGalleryRoute: DocTopic = {
  id: 'iphonegallery',
  title: 'iPhone Gallery',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/iphonegallery',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate a high-fidelity iPhone photo gallery mockup displaying a custom image.',
  parameters: [
    { name: 'image', type: 'text', required: true, desc: 'Direct URL to the photo to display.' }
  ],
  payloadTemplate: {
    image: 'https://i.imgur.com/z0bVpgs.jpeg'
  }
};
