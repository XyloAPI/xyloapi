import type { DocTopic } from '../../types';

export const ideogramRoute: DocTopic = {
  id: 'ideogram',
  title: 'Ideogram 4',
  category: 'AI Image',
  method: 'POST',
  path: '/api/ai-image/ideogram',
  pathTemplate: '/api/ai-image/:slug',
  description: 'Buat desain tipografi berkualitas tinggi dan gambar bergaya dengan Ideogram 4.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'Teks prompt untuk membuat gambar.' },
    { name: 'aspect_ratio', type: 'select', required: false, desc: 'Rasio aspek gambar yang akan dibuat.', options: ['1:1', '16:9', '9:16', '4:3', '3:4', '3:2', '2:3'] }
  ],
  payloadTemplate: {
    prompt: '',
    aspect_ratio: '1:1'
  }
};
