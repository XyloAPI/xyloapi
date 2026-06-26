import type { DocTopic } from '../../types';

export const somniumRoute: DocTopic = {
  id: 'somnium',
  title: 'Somnium AI',
  category: 'AI Image',
  method: 'POST',
  path: '/api/ai-image/somnium',
  pathTemplate: '/api/ai-image/:slug',
  description: 'Generate dreamy, fantastical, and surreal visual scenes with Somnium AI.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'The text prompt to generate an image for.' }
  ],
  payloadTemplate: {
    prompt: ''
  }
};
