import type { DocTopic } from '../../types';

export const zimageturboRoute: DocTopic = {
  id: 'zimageturbo',
  title: 'Z-Image Turbo',
  category: 'AI Image',
  method: 'POST',
  path: '/api/ai-image/zimageturbo',
  pathTemplate: '/api/ai-image/:slug',
  description: 'Generate high-definition imagery using Z-Image Turbo with fast reasoning and negative prompt capabilities.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'The text prompt to generate an image for.' },
    { name: 'negative_prompt', type: 'text', required: false, desc: 'Description of what to avoid in the generated image.' }
  ],
  payloadTemplate: {
    prompt: '',
    negative_prompt: ''
  }
};
