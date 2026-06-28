import type { DocTopic } from '../../types';

export const minimaxRoute: DocTopic = {
    id: 'minimax',
    title: 'MiniMax M3',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/minimax',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Model AI multimodal MiniMax untuk pertanyaan, penerjemahan, pembuatan kode, dan analisis.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
