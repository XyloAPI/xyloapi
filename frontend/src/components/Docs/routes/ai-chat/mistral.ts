import type { DocTopic } from '../../types';

export const mistralRoute: DocTopic = {
    id: 'mistral',
    title: 'Mistral AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/mistral',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Model yang andal untuk penalaran, pemrograman, penerjemahan, dan percakapan umum.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
