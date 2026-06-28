import type { DocTopic } from '../../types';

export const graniteRoute: DocTopic = {
    id: 'granite',
    title: 'Granite 4.0',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/granite',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Model cepat dan efisien untuk pemrograman, penalaran, dan percakapan umum.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
