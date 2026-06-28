import type { DocTopic } from '../../types';

export const jeevesRoute: DocTopic = {
    id: 'jeeves',
    title: 'Jeeves AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/jeeves',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Asisten AI cepat dan ramah untuk pertanyaan umum dan percakapan sehari-hari.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
