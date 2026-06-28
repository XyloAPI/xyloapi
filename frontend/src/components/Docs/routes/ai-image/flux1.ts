import type { DocTopic } from '../../types';

export const flux1Route: DocTopic = {
  id: 'flux1',
  title: 'Flux 1 Schnell',
  category: 'AI Image',
  method: 'POST',
  path: '/api/ai-image/flux1',
  pathTemplate: '/api/ai-image/:slug',
  description: 'Hasilkan gambar menakjubkan dalam sekejap dengan model Flux 1 Schnell berkecepatan tinggi.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'Teks prompt untuk membuat gambar.' },
    { name: 'aspect_ratio', type: 'select', required: false, desc: 'Rasio aspek gambar yang akan dibuat.', options: ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3', '21:9'] }
  ],
  payloadTemplate: {
    prompt: '',
    aspect_ratio: '1:1'
  }
};
