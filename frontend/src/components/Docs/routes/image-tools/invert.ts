import type { DocTopic } from '../../types';

export const invertRoute: DocTopic = {
    id: 'invert',
    title: 'Invert Colors',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/invert',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Invert colors of an image to their exact opposites to create a striking "negative" photo effect. Upload an image file or provide a direct image URL.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
