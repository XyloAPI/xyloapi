import type { DocTopic } from '../../types';

export const qwenRoute: DocTopic = {
    id: 'qwen',
    title: 'Qwen AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/qwen',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Model Qwen AI mutakhir untuk pertanyaan, bantuan, penerjemahan, dan obrolan santai.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
