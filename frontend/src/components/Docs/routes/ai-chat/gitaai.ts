import type { DocTopic } from '../../types';

export const gitaaiRoute: DocTopic = {
    id: 'gitaai',
    title: 'Gita AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/gitaai',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Dapatkan bimbingan spiritual dan kebijaksanaan yang terinspirasi dari Bhagavad Gita.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
