import type { DocTopic } from '../../types';

export const flux1Route: DocTopic = {
  id: 'flux1',
  title: 'Flux 1 Schnell',
  category: 'AI Image',
  method: 'POST',
  path: '/api/ai-image/flux1',
  pathTemplate: '/api/ai-image/:slug',
  description: 'Generate stunning images instantly with the high-speed Flux 1 Schnell model.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'The text prompt to generate an image for.' },
    { name: 'aspect_ratio', type: 'select', required: false, desc: 'Aspect ratio of the generated image.', options: ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3', '21:9'] }
  ],
  payloadTemplate: {
    prompt: '',
    aspect_ratio: '1:1'
  }
};
