import type { DocTopic } from '../../types';

export const asyntRoute: DocTopic = {
    id: 'asynt',
    title: 'Asynt AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/asynt',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Asisten AI berbasis percakapan untuk pertanyaan dan informasi umum.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
