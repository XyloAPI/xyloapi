import type { DocTopic } from '../../types';

export const qwenimageRoute: DocTopic = {
  id: 'qwenimage',
  title: 'Qwen Image',
  category: 'AI Image',
  method: 'POST',
  path: '/api/ai-image/qwenimage',
  pathTemplate: '/api/ai-image/:slug',
  description: 'Buat ilustrasi dan gambar deskriptif berkualitas tinggi dengan memanfaatkan arsitektur Qwen-VL.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'Teks prompt untuk membuat gambar.' }
  ],
  payloadTemplate: {
    prompt: ''
  }
};
