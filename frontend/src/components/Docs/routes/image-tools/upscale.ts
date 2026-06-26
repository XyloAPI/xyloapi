import type { DocTopic } from '../../types';

export const upscaleRoute: DocTopic = {
    id: 'upscale',
    title: 'Image Upscaler',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/upscale',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Upscale and enhance low-resolution images instantly using advanced super-resolution AI. Upload an image file or provide a direct image URL.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
