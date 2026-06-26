import type { DocTopic } from '../../types';

export const pixelateRoute: DocTopic = {
    id: 'pixelate',
    title: 'Pixelate Effect',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/pixelate',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Create a cool retro 8-bit blocky pixelation effect on your photos instantly. Upload an image file or provide a direct image URL, and adjust the optional pixel size parameter.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' },
      { name: 'pixel_size', type: 'number', required: false, desc: 'Pixel block size from 2 to 100. Default is 10.' }
    ],
    payloadTemplate: {
      image: '',
      pixel_size: 10
    }
  };
