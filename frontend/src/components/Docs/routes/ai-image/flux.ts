import type { DocTopic } from '../../types';

export const fluxRoute: DocTopic = {
  id: 'flux',
  title: 'Flux AI',
  category: 'AI Image',
  method: 'POST',
  path: '/api/ai-image/flux',
  pathTemplate: '/api/ai-image/:slug',
  description: 'Buat gambar berkualitas tinggi menggunakan model Flux AI.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'Teks prompt untuk membuat gambar.' },
    { name: 'aspect_ratio', type: 'select', required: false, desc: 'Rasio aspek gambar yang akan dibuat.', options: ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3', '21:9'] }
  ],
  payloadTemplate: {
    prompt: '',
    aspect_ratio: '1:1'
  }
};
