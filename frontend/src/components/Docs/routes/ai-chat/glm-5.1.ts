import type { DocTopic } from '../../types';

export const glm_5_1Route: DocTopic = {
    id: 'glm-5.1',
    title: 'GLM 5.1',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/glm',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Model AI canggih untuk penalaran mendalam, pemrograman, dan penerjemahan.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
