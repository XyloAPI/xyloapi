import type { DocTopic } from '../../types';

export const iphoneContextMenuRoute: DocTopic = {
  id: 'iphonecontextmenu',
  title: 'iPhone Context Menu',
  category: 'Maker',
  method: 'GET',
  path: '/api/maker/iphonecontextmenu',
  pathTemplate: '/api/maker/:slug',
  description: 'Buat mockup menu konteks haptic touch (tekan lama) ala iPhone dengan opsi kustom.',
  parameters: [
    { name: 'image', type: 'text', required: true, desc: 'Direct URL to the image to display.' }
  ],
  payloadTemplate: {
    image: 'https://i.imgur.com/z0bVpgs.jpeg'
  }
};
