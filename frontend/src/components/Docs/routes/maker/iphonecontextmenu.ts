import type { DocTopic } from '../../types';

export const iphoneContextMenuRoute: DocTopic = {
  id: 'iphonecontextmenu',
  title: 'iPhone Context Menu',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/iphonecontextmenu',
  pathTemplate: '/api/maker/:slug',
  description: 'Generate an iPhone long-press haptic touch context menu mockup with custom options.',
  parameters: [
    { name: 'image', type: 'text', required: true, desc: 'Direct URL to the image to display.' }
  ],
  payloadTemplate: {
    image: 'https://i.imgur.com/z0bVpgs.jpeg'
  }
};
