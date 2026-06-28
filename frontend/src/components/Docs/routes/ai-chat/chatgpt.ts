import type { DocTopic } from '../../types';

export const chatgptRoute: DocTopic = {
    id: 'chatgpt',
    title: 'ChatGPT',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/chatgpt',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Berinteraksilah dengan ChatGPT. Ajukan pertanyaan, buat kode, terjemahkan teks, atau mengobrol sesuka hati.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
