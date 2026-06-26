import type { DocTopic } from '../../types';

export const blurRoute: DocTopic = {
    id: 'blur',
    title: 'Blur Image',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/blur',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Blur the entire image with a custom blur radius. Upload an image file or provide a direct image URL.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' },
      { name: 'radius', type: 'number', required: false, desc: 'Blur radius from 1 to 50. Default is 10.' }
    ],
    payloadTemplate: {
      image: '',
      radius: 10
    }
  };
