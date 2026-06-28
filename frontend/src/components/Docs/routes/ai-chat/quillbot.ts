import type { DocTopic } from '../../types';

export const quillbotRoute: DocTopic = {
    id: 'quillbot',
    title: 'QuillBot AI',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/quillbot',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Buat draf tulisan, brainstorm ide, dan dapatkan bantuan menulis dari QuillBot AI.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
