import type { DocTopic } from '../../types';

export const qwenimageRoute: DocTopic = {
  id: 'qwenimage',
  title: 'Qwen Image',
  category: 'AI Image',
  method: 'POST',
  path: '/api/ai-image/qwenimage',
  pathTemplate: '/api/ai-image/:slug',
  description: 'Generate high-quality illustrations and descriptive images utilizing Qwen-VL architecture.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'The text prompt to generate an image for.' }
  ],
  payloadTemplate: {
    prompt: ''
  }
};
