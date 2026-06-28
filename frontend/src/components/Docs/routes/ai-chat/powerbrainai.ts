import type { DocTopic } from '../../types';

export const powerbrainaiRoute: DocTopic = {
    id: 'powerbrainai',
    title: 'PowerBrain AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/powerbrainai',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Asisten AI serbaguna untuk pertanyaan, ide, dan percakapan sehari-hari.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
