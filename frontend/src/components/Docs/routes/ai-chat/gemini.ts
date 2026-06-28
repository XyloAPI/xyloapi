import type { DocTopic } from '../../types';

export const geminiRoute: DocTopic = {
    id: 'gemini',
    title: 'Google Gemini',
    category: 'AI Chat',
    method: 'GET',
    path: '/api/ai-chat/gemini',
    pathTemplate: '/api/ai-chat/:slug',
    description: 'Berinteraksilah dengan Google Gemini. Ajukan pertanyaan, buat konten, terjemahkan teks, atau mengobrol sesuka hati.',
    parameters: [
      { name: 'prompt', type: 'text', required: true, desc: 'Pesan atau pertanyaan yang ingin diajukan ke AI.' }
    ],
    payloadTemplate: {
      prompt: ''
    }
  };
