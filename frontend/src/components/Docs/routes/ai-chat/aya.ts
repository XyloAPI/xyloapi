import type { DocTopic } from '../../types';

export const ayaRoute: DocTopic = {
    id: 'aya',
    title: 'Aya AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/aya',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Sebuah model multibahasa yang canggih untuk penalaran, penerjemahan, dan obrolan.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
