import type { DocTopic } from '../../types';

export const sharpenRoute: DocTopic = {
    id: 'sharpen',
    title: 'Sharpen Image',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/sharpen',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Sharpen the details of your images online with adjustable intensity. Upload an image file or provide a direct image URL.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' },
      { name: 'intensity', type: 'number', required: false, desc: 'Sharpen intensity from 0 to 100. Default is 50.' }
    ],
    payloadTemplate: {
      image: '',
      intensity: 50
    }
  };
