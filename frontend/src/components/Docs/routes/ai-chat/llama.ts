import type { DocTopic } from '../../types';

export const llamaRoute: DocTopic = {
    id: 'llama',
    title: 'Llama AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/llama',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Model Llama AI mutakhir untuk pertanyaan, penerjemahan, pembuatan kode, dan analisis detail.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
