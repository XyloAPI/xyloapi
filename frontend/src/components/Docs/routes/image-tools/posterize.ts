import type { DocTopic } from '../../types';

export const posterizeRoute: DocTopic = {
    id: 'posterize',
    title: 'Posterize Effect',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/posterize',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Reduce the number of colors in your image to create a retro, artistic posterized effect. Upload an image file or provide a direct image URL.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' },
      { name: 'color_levels', type: 'number', required: false, desc: 'Number of color levels from 2 to 256. Default is 8.' }
    ],
    payloadTemplate: {
      image: '',
      color_levels: 8
    }
  };
