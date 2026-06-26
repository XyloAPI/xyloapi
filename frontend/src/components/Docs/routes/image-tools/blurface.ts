import type { DocTopic } from '../../types';

export const blurfaceRoute: DocTopic = {
    id: 'blurface',
    title: 'Blur Face Effect',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/blurface',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Automatically detect and blur all faces in an image online using AI-powered face detection. Upload an image file or provide a direct image URL.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' },
      { name: 'strength', type: 'number', required: false, desc: 'Blur strength from 1 to 2000. Default is 500.' }
    ],
    payloadTemplate: {
      image: '',
      strength: 500
    }
  };
