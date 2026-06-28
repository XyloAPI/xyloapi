import type { DocTopic } from '../../types';

export const deepseekRoute: DocTopic = {
    id: 'deepseek',
    title: 'DeepSeek V4 Pro',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/deepseek',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Berinteraksilah dengan model AI DeepSeek V4 Pro yang canggih. Ajukan pertanyaan, terjemahkan teks, buat kode, atau analisis detail.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
