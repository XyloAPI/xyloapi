import type { DocTopic } from '../../types';

export const sahabataiRoute: DocTopic = {
    id: 'sahabatai',
    title: 'Sahabat AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/sahabatai',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Asisten AI percakapan dalam Bahasa Indonesia dari Indosat Ooredoo Hutchison.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
