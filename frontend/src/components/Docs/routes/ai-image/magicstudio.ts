import type { DocTopic } from '../../types';

export const magicstudioRoute: DocTopic = {
  id: 'magicstudio',
  title: 'Magic Studio',
  category: 'AI Image',
  method: 'POST',
  path: '/api/ai-image/magicstudio',
  pathTemplate: '/api/ai-image/:slug',
  description: 'Generate artistic and photographic styles using Magic Studio AI image generation.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'The text prompt to generate an image for.' }
  ],
  payloadTemplate: {
    prompt: ''
  }
};
