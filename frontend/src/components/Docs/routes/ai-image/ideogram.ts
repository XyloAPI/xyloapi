import type { DocTopic } from '../../types';

export const ideogramRoute: DocTopic = {
  id: 'ideogram',
  title: 'Ideogram 4',
  category: 'AI Image',
  method: 'POST',
  path: '/api/ai-image/ideogram',
  pathTemplate: '/api/ai-image/:slug',
  description: 'Generate high-fidelity typographic designs and stylized images with Ideogram 4.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'The text prompt to generate an image for.' },
    { name: 'aspect_ratio', type: 'select', required: false, desc: 'Aspect ratio of the generated image.', options: ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'] }
  ],
  payloadTemplate: {
    prompt: '',
    aspect_ratio: '1:1'
  }
};
