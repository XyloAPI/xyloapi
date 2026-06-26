import type { DocTopic } from '../../types';

export const round_cornersRoute: DocTopic = {
    id: 'round-corners',
    title: 'Round Corners',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/round-corners',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Round the corners of your images online. Customize the corner radius to create smooth, rounded edges on your photos.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' },
      { name: 'radius', type: 'number', required: false, desc: 'Corner radius in pixels (e.g. 30) or percentage (e.g. "25%"). Default is 30.' }
    ],
    payloadTemplate: {
      image: '',
      radius: 30
    }
  };
