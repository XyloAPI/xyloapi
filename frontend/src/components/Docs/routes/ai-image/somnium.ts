import type { DocTopic } from '../../types';

export const somniumRoute: DocTopic = {
  id: 'somnium',
  title: 'Somnium AI',
  category: 'AI Image',
  method: 'POST',
  path: '/api/ai-image/somnium',
  pathTemplate: '/api/ai-image/:slug',
  description: 'Ciptakan pemandangan visual yang memukau, fantastis, dan surealis dengan Somnium AI.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'Teks prompt untuk membuat gambar.' }
  ],
  payloadTemplate: {
    prompt: ''
  }
};
