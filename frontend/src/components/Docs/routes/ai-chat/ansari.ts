import type { DocTopic } from '../../types';

export const ansariRoute: DocTopic = {
    id: 'ansari',
    title: 'Ansari AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/ansari',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Asisten AI berbasis Islam untuk pertanyaan seputar Islam, Al-Quran, dan panduan sehari-hari.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
