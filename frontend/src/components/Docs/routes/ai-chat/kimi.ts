import type { DocTopic } from '../../types';

export const kimiRoute: DocTopic = {
    id: 'kimi',
    title: 'Kimi 2.6',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/kimi',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Model AI Kimi-K2.6 yang canggih untuk pertanyaan, penerjemahan, pemrograman, dan analisis.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
