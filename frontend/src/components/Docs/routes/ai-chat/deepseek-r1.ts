import type { DocTopic } from '../../types';

export const deepseek_r1Route: DocTopic = {
  id: 'deepseek-r1',
  title: 'DeepSeek R1',
  category: 'AI Chat',
  method: 'GET',
  path: '/api/ai-chat/deepseek-r1',
  pathTemplate: '/api/ai-chat/:slug',
  description: 'Berinteraksilah dengan model DeepSeek R1. Sebuah model yang sangat dioptimalkan untuk penalaran dan mampu menangani matematika, pemrograman, logika, serta pemikiran mendalam.',
  parameters: [
    { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
  ],
  payloadTemplate: {
    prompt: ''
  }
};
