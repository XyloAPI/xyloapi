import type { DocTopic } from '../../types';

export const deepseek_flashRoute: DocTopic = {
    id: 'deepseek-flash',
    title: 'DeepSeek V4 Flash',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/deepseek-flash',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Berinteraksilah dengan model AI DeepSeek V4 Flash. Model yang cepat dan efisien untuk pemrograman, penerjemahan, dan pertanyaan umum.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
