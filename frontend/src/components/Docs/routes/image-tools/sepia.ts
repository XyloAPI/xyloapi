import type { DocTopic } from '../../types';

export const sepiaRoute: DocTopic = {
    id: 'sepia',
    title: 'Sepia Effect',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/sepia',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Apply a classic, warm, vintage sepia tone filter to your images instantly. Upload an image file or provide a direct image URL, and adjust the optional intensity parameter.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' },
      { name: 'intensity', type: 'number', required: false, desc: 'Sepia effect intensity (amount) from 0 to 100. Default is 80.' }
    ],
    payloadTemplate: {
      image: '',
      intensity: 80
    }
  };
