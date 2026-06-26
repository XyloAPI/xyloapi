import type { DocTopic } from '../../types';

export const solarizeRoute: DocTopic = {
    id: 'solarize',
    title: 'Solarize Effect',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/solarize',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Invert colors of an image above a specified brightness threshold to create a surreal solarized effect. Upload an image file or provide a direct image URL.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' },
      { name: 'threshold', type: 'number', required: false, desc: 'Brightness threshold from 0 to 255. Default is 128.' }
    ],
    payloadTemplate: {
      image: '',
      threshold: 128
    }
  };
