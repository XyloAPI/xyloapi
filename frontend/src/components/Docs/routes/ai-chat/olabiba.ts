import type { DocTopic } from '../../types';

export const olabibaRoute: DocTopic = {
    id: 'olabiba',
    title: 'Olabiba AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/olabiba',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Asisten AI percakapan yang ramah dan mudah diajak bicara untuk berbagai topik.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
