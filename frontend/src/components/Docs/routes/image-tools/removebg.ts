import type { DocTopic } from '../../types';

export const removebgRoute: DocTopic = {
    id: 'removebg',
    title: 'Remove Background',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/removebg',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Remove backgrounds from images instantly and automatically using advanced AI segmentation. Upload an image file or provide a direct image URL.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
