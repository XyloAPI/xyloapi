import type { DocTopic } from '../../types';

export const magicstudioRoute: DocTopic = {
  id: 'magicstudio',
  title: 'Magic Studio',
  category: 'AI Image',
  method: 'POST',
  path: '/api/ai-image/magicstudio',
  pathTemplate: '/api/ai-image/:slug',
  description: 'Buat gaya artistik dan fotografi menggunakan fitur pembuatan gambar Magic Studio AI.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'Teks prompt untuk membuat gambar.' }
  ],
  payloadTemplate: {
    prompt: ''
  }
};
