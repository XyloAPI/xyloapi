import type { DocTopic } from '../../types';

export const ernieimageRoute: DocTopic = {
  id: 'ernieimage',
  title: 'ERNIE Image Turbo',
  category: 'AI Image',
  method: 'POST',
  path: '/api/ai-image/ernieimage',
  pathTemplate: '/api/ai-image/:slug',
  description: 'Generate stunning Asian-centric and general-purpose artistic designs with ERNIE Image Turbo.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'The text prompt to generate an image for.' },
    { name: 'aspect_ratio', type: 'select', required: false, desc: 'Aspect ratio of the generated image.', options: ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'] }
  ],
  payloadTemplate: {
    prompt: '',
    aspect_ratio: '1:1'
  }
};
