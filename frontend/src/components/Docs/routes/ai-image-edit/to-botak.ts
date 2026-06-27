import type { DocTopic } from '../../types';

export const toBotakRoute: DocTopic = {
    id: 'to-botak',
    title: 'To Botak (Make Bald)',
    category: 'AI Image Edit',
    method: 'POST',
    path: '/api/ai-image-edit/to-botak',
    pathTemplate: '/api/ai-image-edit/:slug',
    description: 'Transform hair into baldness using advanced AI image editing. Upload an image file or provide a direct image URL.',
    parameters: [
      { name: 'image', type: 'file', required: true, desc: 'Image file or direct image URL to edit.' }
    ],
    payloadTemplate: {
      image: ''
    }
  };
