import type { DocTopic } from '../../types';

export const mathgptRoute: DocTopic = {
    id: 'mathgpt',
    title: 'MathGPT',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/mathgpt',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Model AI khusus untuk menyelesaikan soal matematika dengan penjelasan langkah demi langkah.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Soal matematika atau pertanyaan yang ingin diselesaikan.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
