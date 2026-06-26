import type { DocTopic } from '../../types';

export const fluxRoute: DocTopic = {
  id: 'flux',
  title: 'Flux AI',
  category: 'AI Image',
  method: 'POST',
  path: '/api/ai-image/flux',
  pathTemplate: '/api/ai-image/:slug',
  description: 'Generate state-of-the-art images using the Flux AI model. Configure custom dimensions and steps for high-fidelity rendering.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'The text prompt to generate an image for.' },
    { name: 'aspect_ratio', type: 'select', required: false, desc: 'Aspect ratio of the generated image.', options: ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3', '21:9'] }
  ],
  payloadTemplate: {
    prompt: '',
    aspect_ratio: '1:1'
  }
};
