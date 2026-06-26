import type { DocTopic } from '../../types';

export const enhanceRoute: DocTopic = {
    id: 'enhance',
    title: 'AI Image Enhancer',
    category: 'Image Tools',
    method: 'POST',
    path: '/api/image-tool/enhance',
    pathTemplate: '/api/image-tool/:slug',
    description: 'Enhance your images online automatically using AI. Balances exposure, colors, contrast, and clarity instantly. Upload an image file or provide a direct image URL.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or image URL to process.' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
